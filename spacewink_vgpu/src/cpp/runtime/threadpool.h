// threadpool.h - Work-stealing thread pool with NUMA awareness
// Part of Spacewink vGPU - PR-04

#ifndef VGPU_RUNTIME_THREADPOOL_H
#define VGPU_RUNTIME_THREADPOOL_H

#include <atomic>
#include <condition_variable>
#include <deque>
#include <functional>
#include <future>
#include <memory>
#include <mutex>
#include <thread>
#include <vector>

namespace vgpu {
namespace runtime {

// Task with priority
enum class TaskPriority {
    LOW = 0,
    NORMAL = 1,
    HIGH = 2
};

// Task wrapper
struct Task {
    std::function<void()> func;
    TaskPriority priority;
    
    Task() : priority(TaskPriority::NORMAL) {}
    Task(std::function<void()> f, TaskPriority p = TaskPriority::NORMAL)
        : func(std::move(f)), priority(p) {}
    
    void operator()() const {
        if (func) func();
    }
};

// Per-thread work queue with lock-free bottom
class WorkQueue {
public:
    WorkQueue();
    ~WorkQueue();
    
    // Push task to bottom (owner thread only)
    void push(Task task);
    
    // Pop task from bottom (owner thread only)
    bool pop(Task& task);
    
    // Steal task from top (other threads)
    bool steal(Task& task);
    
    size_t size() const;
    bool empty() const;
    
private:
    mutable std::mutex mutex_;
    std::deque<Task> deque_;
};

// Work-stealing thread pool
class ThreadPool {
public:
    // Create thread pool with specified number of threads
    // If num_threads == 0, uses hardware concurrency
    explicit ThreadPool(int num_threads = 0);
    
    // Destructor waits for all tasks to complete
    ~ThreadPool();
    
    // No copy/move
    ThreadPool(const ThreadPool&) = delete;
    ThreadPool& operator=(const ThreadPool&) = delete;
    
    // Submit task and get future
    template<typename F, typename... Args>
    auto submit(F&& f, Args&&... args) 
        -> std::future<typename std::result_of<F(Args...)>::type>;
    
    // Submit task with priority
    template<typename F, typename... Args>
    auto submit_priority(TaskPriority priority, F&& f, Args&&... args)
        -> std::future<typename std::result_of<F(Args...)>::type>;
    
    // Wait for all submitted tasks to complete
    void wait_all();
    
    // Get number of worker threads
    int num_threads() const { return num_threads_; }
    
    // Set thread affinity (thread_id to cpu_id)
    bool set_affinity(int thread_id, int cpu_id);
    
    // Get current pending tasks across all queues
    size_t pending_tasks() const;
    
private:
    // Worker thread function
    void worker_thread(int thread_id);
    
    // Try to get task for thread_id
    bool get_task(int thread_id, Task& task);
    
    // Try to steal task from another queue
    bool try_steal(int thief_id, Task& task);
    
    int num_threads_;
    std::vector<std::thread> threads_;
    std::vector<std::unique_ptr<WorkQueue>> queues_;
    
    std::atomic<bool> stop_{false};
    std::atomic<int> active_threads_{0};
    std::atomic<int> pending_count_{0};
    
    mutable std::mutex wait_mutex_;
    std::condition_variable wait_cv_;
    
    // Thread-local index (which queue to push to)
    static thread_local int thread_index_;
};

// Template implementations

template<typename F, typename... Args>
auto ThreadPool::submit(F&& f, Args&&... args)
    -> std::future<typename std::result_of<F(Args...)>::type>
{
    return submit_priority(TaskPriority::NORMAL, 
                          std::forward<F>(f), 
                          std::forward<Args>(args)...);
}

template<typename F, typename... Args>
auto ThreadPool::submit_priority(TaskPriority priority, F&& f, Args&&... args)
    -> std::future<typename std::result_of<F(Args...)>::type>
{
    using return_type = typename std::result_of<F(Args...)>::type;
    
    auto task_ptr = std::make_shared<std::packaged_task<return_type()>>(
        std::bind(std::forward<F>(f), std::forward<Args>(args)...)
    );
    
    std::future<return_type> result = task_ptr->get_future();
    
    Task task([task_ptr]() { (*task_ptr)(); }, priority);
    
    // Get thread-local queue index or use round-robin
    int queue_idx = (thread_index_ >= 0 && thread_index_ < num_threads_) 
                    ? thread_index_ 
                    : (pending_count_.fetch_add(1) % num_threads_);
    
    queues_[queue_idx]->push(std::move(task));
    pending_count_++;
    wait_cv_.notify_one();
    
    return result;
}

} // namespace runtime
} // namespace vgpu

#endif // VGPU_RUNTIME_THREADPOOL_H
