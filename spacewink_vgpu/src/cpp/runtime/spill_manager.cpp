// spill_manager.cpp - Implementation of async spill/prefetch manager
// Part of Spacewink vGPU - PR-05: Tiered Memory Allocator

#include "spill_manager.h"
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <atomic>
#include <chrono>
#include <cstring>
#include <iostream>

namespace vgpu {
namespace memory {

struct SpillManager::Impl {
    // Worker threads
    std::vector<std::thread> workers;
    std::atomic<bool> shutdown_requested{false};
    
    // Job queue
    std::priority_queue<SpillJob, std::vector<SpillJob>,
                       std::function<bool(const SpillJob&, const SpillJob&)>> job_queue;
    std::mutex queue_mutex;
    std::condition_variable queue_cv;
    std::atomic<size_t> pending_jobs{0};
    
    // Configuration
    bool use_io_uring;
    size_t batch_size = 4;
    size_t max_queue_depth = 64;
    int num_workers;
    
    // Statistics
    mutable std::mutex stats_mutex;
    SpillStats stats{};
    
    // Job comparator (higher priority first)
    static bool compare_jobs(const SpillJob& a, const SpillJob& b) {
        return a.priority < b.priority;  // Lower value = lower priority
    }
    
    Impl(bool use_uring, int workers) 
        : use_io_uring(use_uring), num_workers(workers),
          job_queue(compare_jobs) {}
};

SpillManager::SpillManager(bool use_io_uring, int num_workers)
    : pimpl_(std::make_unique<Impl>(use_io_uring, num_workers)) {
    
    // Start worker threads
    for (int i = 0; i < num_workers; ++i) {
        pimpl_->workers.emplace_back(&SpillManager::worker_thread_func, this, i);
    }
}

SpillManager::~SpillManager() {
    shutdown();
}

void SpillManager::submit_spill(void* src, void* dst, size_t size,
                                std::function<void(bool)> callback,
                                int priority) {
    SpillJob job{src, dst, size, SpillOperation::SPILL, callback, priority};
    
    {
        std::lock_guard<std::mutex> lock(pimpl_->queue_mutex);
        if (pimpl_->job_queue.size() >= pimpl_->max_queue_depth) {
            // Queue full, process synchronously
            process_job(job);
            return;
        }
        pimpl_->job_queue.push(job);
        pimpl_->pending_jobs++;
    }
    pimpl_->queue_cv.notify_one();
}

void SpillManager::submit_prefetch(void* src, void* dst, size_t size,
                                  std::function<void(bool)> callback,
                                  int priority) {
    SpillJob job{src, dst, size, SpillOperation::PREFETCH, callback, priority};
    
    {
        std::lock_guard<std::mutex> lock(pimpl_->queue_mutex);
        if (pimpl_->job_queue.size() >= pimpl_->max_queue_depth) {
            process_job(job);
            return;
        }
        pimpl_->job_queue.push(job);
        pimpl_->pending_jobs++;
    }
    pimpl_->queue_cv.notify_one();
}

void SpillManager::submit_batch(const std::vector<SpillJob>& jobs) {
    {
        std::lock_guard<std::mutex> lock(pimpl_->queue_mutex);
        for (const auto& job : jobs) {
            pimpl_->job_queue.push(job);
            pimpl_->pending_jobs++;
        }
    }
    pimpl_->queue_cv.notify_all();
}

void SpillManager::wait_all() {
    while (pimpl_->pending_jobs > 0) {
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
}

void SpillManager::cancel_pending() {
    std::lock_guard<std::mutex> lock(pimpl_->queue_mutex);
    size_t canceled = pimpl_->job_queue.size();
    while (!pimpl_->job_queue.empty()) {
        pimpl_->job_queue.pop();
    }
    pimpl_->pending_jobs -= canceled;
}

void SpillManager::shutdown() {
    if (!pimpl_->shutdown_requested.exchange(true)) {
        wait_all();
        pimpl_->queue_cv.notify_all();
        for (auto& worker : pimpl_->workers) {
            if (worker.joinable()) {
                worker.join();
            }
        }
    }
}

void SpillManager::set_batch_size(size_t size) {
    pimpl_->batch_size = size;
}

void SpillManager::set_max_queue_depth(size_t depth) {
    pimpl_->max_queue_depth = depth;
}

void SpillManager::enable_io_uring(bool enable) {
    pimpl_->use_io_uring = enable;
}

SpillStats SpillManager::get_stats() const {
    std::lock_guard<std::mutex> lock(pimpl_->stats_mutex);
    return pimpl_->stats;
}

size_t SpillManager::get_pending_count() const {
    return pimpl_->pending_jobs.load();
}

bool SpillManager::is_idle() const {
    return pimpl_->pending_jobs == 0;
}

void SpillManager::reset_stats() {
    std::lock_guard<std::mutex> lock(pimpl_->stats_mutex);
    pimpl_->stats = SpillStats{};
}

void SpillManager::worker_thread_func(int worker_id) {
    while (!pimpl_->shutdown_requested) {
        SpillJob job{};
        
        {
            std::unique_lock<std::mutex> lock(pimpl_->queue_mutex);
            pimpl_->queue_cv.wait(lock, [this] {
                return !pimpl_->job_queue.empty() || pimpl_->shutdown_requested;
            });
            
            if (pimpl_->shutdown_requested && pimpl_->job_queue.empty()) {
                break;
            }
            
            if (!pimpl_->job_queue.empty()) {
                job = pimpl_->job_queue.top();
                pimpl_->job_queue.pop();
            } else {
                continue;
            }
        }
        
        // Process job outside lock
        process_job(job);
        pimpl_->pending_jobs--;
    }
}

void SpillManager::process_job(const SpillJob& job) {
    auto start = std::chrono::steady_clock::now();
    
    bool success = false;
    
    // Try io_uring if enabled
    if (pimpl_->use_io_uring) {
        success = try_io_uring_submit(job);
    }
    
    // Fallback to synchronous copy
    if (!success) {
        fallback_sync_copy(job);
        success = true;
    }
    
    auto end = std::chrono::steady_clock::now();
    double elapsed_ms = std::chrono::duration<double, std::milli>(end - start).count();
    
    // Update statistics
    {
        std::lock_guard<std::mutex> lock(pimpl_->stats_mutex);
        if (job.operation == SpillOperation::SPILL) {
            pimpl_->stats.total_spills++;
            pimpl_->stats.bytes_spilled += job.size;
            pimpl_->stats.avg_spill_time_ms = 
                (pimpl_->stats.avg_spill_time_ms * (pimpl_->stats.total_spills - 1) + elapsed_ms) /
                pimpl_->stats.total_spills;
        } else {
            pimpl_->stats.total_prefetches++;
            pimpl_->stats.bytes_prefetched += job.size;
            pimpl_->stats.avg_prefetch_time_ms = 
                (pimpl_->stats.avg_prefetch_time_ms * (pimpl_->stats.total_prefetches - 1) + elapsed_ms) /
                pimpl_->stats.total_prefetches;
        }
    }
    
    // Execute callback
    if (job.callback) {
        job.callback(success);
    }
}

bool SpillManager::try_io_uring_submit(const SpillJob& job) {
    // TODO: Implement io_uring path when available
    // For now, return false to use fallback
    return false;
}

void SpillManager::fallback_sync_copy(const SpillJob& job) {
    // Simple memcpy for now
    // In production, this would use optimized copy methods
    std::memcpy(job.dst_ptr, job.src_ptr, job.size);
}

} // namespace memory
} // namespace vgpu
