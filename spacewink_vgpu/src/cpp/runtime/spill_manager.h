// spill_manager.h - Async spill/prefetch manager for tiered memory
// Part of Spacewink vGPU - PR-05: Tiered Memory Allocator
// Handles asynchronous I/O operations between memory tiers

#ifndef VGPU_SPILL_MANAGER_H
#define VGPU_SPILL_MANAGER_H

#include <cstddef>
#include <memory>
#include <functional>
#include <vector>
#include <string>

namespace vgpu {
namespace memory {

enum class SpillOperation {
    SPILL,      // Move data from faster to slower tier
    PREFETCH    // Move data from slower to faster tier
};

struct SpillJob {
    void* src_ptr;
    void* dst_ptr;
    size_t size;
    SpillOperation operation;
    std::function<void(bool)> callback;  // Called on completion
    int priority;  // Higher priority executed first
};

struct SpillStats {
    size_t total_spills;
    size_t total_prefetches;
    size_t bytes_spilled;
    size_t bytes_prefetched;
    double avg_spill_time_ms;
    double avg_prefetch_time_ms;
};

class SpillManager {
public:
    // Constructor
    explicit SpillManager(bool use_io_uring = true, int num_workers = 2);
    ~SpillManager();

    // Job submission
    void submit_spill(void* src, void* dst, size_t size, 
                     std::function<void(bool)> callback = nullptr,
                     int priority = 0);
    void submit_prefetch(void* src, void* dst, size_t size,
                        std::function<void(bool)> callback = nullptr,
                        int priority = 10);
    
    // Batch operations
    void submit_batch(const std::vector<SpillJob>& jobs);
    
    // Control
    void wait_all();           // Wait for all pending operations
    void cancel_pending();     // Cancel queued (not started) operations
    void shutdown();           // Stop workers and wait
    
    // Configuration
    void set_batch_size(size_t size);
    void set_max_queue_depth(size_t depth);
    void enable_io_uring(bool enable);
    
    // Statistics
    SpillStats get_stats() const;
    size_t get_pending_count() const;
    bool is_idle() const;
    void reset_stats();

private:
    struct Impl;
    std::unique_ptr<Impl> pimpl_;
    
    // Internal methods
    void worker_thread_func(int worker_id);
    void process_job(const SpillJob& job);
    bool try_io_uring_submit(const SpillJob& job);
    void fallback_sync_copy(const SpillJob& job);
};

} // namespace memory
} // namespace vgpu

#endif // VGPU_SPILL_MANAGER_H
