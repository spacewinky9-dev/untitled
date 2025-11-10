// threadpool.cpp - Work-stealing thread pool implementation
// Part of Spacewink vGPU - PR-04

#include "threadpool.h"
#include "numa_utils.h"
#include <algorithm>
#include <chrono>
#include <random>

namespace vgpu {
namespace runtime {

// Thread-local index
thread_local int ThreadPool::thread_index_ = -1;

// WorkQueue implementation

WorkQueue::WorkQueue() = default;
WorkQueue::~WorkQueue() = default;

void WorkQueue::push(Task task) {
    std::lock_guard<std::mutex> lock(mutex_);
    deque_.push_back(std::move(task));
}

bool WorkQueue::pop(Task& task) {
    std::lock_guard<std::mutex> lock(mutex_);
    if (deque_.empty()) {
        return false;
    }
    task = std::move(deque_.back());
    deque_.pop_back();
    return true;
}

bool WorkQueue::steal(Task& task) {
    std::lock_guard<std::mutex> lock(mutex_);
    if (deque_.empty()) {
        return false;
    }
    task = std::move(deque_.front());
    deque_.pop_front();
    return true;
}

size_t WorkQueue::size() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return deque_.size();
}

bool WorkQueue::empty() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return deque_.empty();
}

// ThreadPool implementation

ThreadPool::ThreadPool(int num_threads)
    : num_threads_(num_threads > 0 ? num_threads : std::thread::hardware_concurrency())
{
    // Create work queues
    for (int i = 0; i < num_threads_; ++i) {
        queues_.emplace_back(std::make_unique<WorkQueue>());
    }
    
    // Spawn worker threads
    for (int i = 0; i < num_threads_; ++i) {
        threads_.emplace_back(&ThreadPool::worker_thread, this, i);
    }
}

ThreadPool::~ThreadPool() {
    // Signal stop
    stop_.store(true);
    wait_cv_.notify_all();
    
    // Wait for all threads to finish
    for (auto& thread : threads_) {
        if (thread.joinable()) {
            thread.join();
        }
    }
}

void ThreadPool::worker_thread(int thread_id) {
    // Set thread-local index
    thread_index_ = thread_id;
    
    // Try to set NUMA-aware affinity
    NumaUtils numa;
    if (numa.is_available()) {
        int node_id = thread_id % numa.num_nodes();
        numa.set_thread_affinity(node_id, thread_id);
    }
    
    Task task;
    std::random_device rd;
    std::mt19937 gen(rd());
    
    while (true) {
        bool got_task = false;
        
        // Try to get task
        if (get_task(thread_id, task)) {
            got_task = true;
        }
        
        if (got_task) {
            active_threads_++;
            try {
                task();
            } catch (...) {
                // Task threw exception - just continue
            }
            active_threads_--;
            pending_count_--;
            
            // Notify anyone waiting
            if (pending_count_.load() == 0) {
                wait_cv_.notify_all();
            }
        } else {
            // No task found - check if we should exit
            if (stop_.load()) {
                break;
            }
            
            // Wait with exponential backoff
            std::unique_lock<std::mutex> lock(wait_mutex_);
            wait_cv_.wait_for(lock, std::chrono::microseconds(100), [this] {
                return stop_.load() || pending_count_.load() > 0;
            });
        }
    }
}

bool ThreadPool::get_task(int thread_id, Task& task) {
    // Try own queue first
    if (queues_[thread_id]->pop(task)) {
        return true;
    }
    
    // Try stealing from others
    return try_steal(thread_id, task);
}

bool ThreadPool::try_steal(int thief_id, Task& task) {
    // Try stealing from a random other thread
    const int num_attempts = num_threads_ * 2;
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, num_threads_ - 1);
    
    for (int attempt = 0; attempt < num_attempts; ++attempt) {
        int victim_id = dis(gen);
        if (victim_id == thief_id) {
            continue;
        }
        
        if (queues_[victim_id]->steal(task)) {
            return true;
        }
    }
    
    return false;
}

void ThreadPool::wait_all() {
    std::unique_lock<std::mutex> lock(wait_mutex_);
    wait_cv_.wait(lock, [this] {
        return pending_count_.load() == 0;
    });
}

bool ThreadPool::set_affinity(int thread_id, int cpu_id) {
    if (thread_id < 0 || thread_id >= num_threads_) {
        return false;
    }
    
    NumaUtils numa;
    if (!numa.is_available()) {
        return false;
    }
    
    // This is a simplified version - real implementation would
    // need to call pthread_setaffinity_np on the actual thread handle
    return true;
}

size_t ThreadPool::pending_tasks() const {
    return static_cast<size_t>(pending_count_.load());
}

} // namespace runtime
} // namespace vgpu
