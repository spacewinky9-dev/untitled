// task.h - Task abstraction with Future support
// Part of Spacewink vGPU - PR-04

#ifndef VGPU_RUNTIME_TASK_H
#define VGPU_RUNTIME_TASK_H

#include <functional>
#include <memory>
#include <stdexcept>

namespace vgpu {
namespace runtime {

// Simple future implementation (simplified from std::future)
template<typename T>
class Future {
public:
    Future() : shared_state_(std::make_shared<SharedState>()) {}
    
    // Get result (blocks until available)
    T get() {
        std::unique_lock<std::mutex> lock(shared_state_->mutex);
        shared_state_->cv.wait(lock, [this] { 
            return shared_state_->ready || shared_state_->has_exception; 
        });
        
        if (shared_state_->has_exception) {
            std::rethrow_exception(shared_state_->exception);
        }
        
        return std::move(shared_state_->value);
    }
    
    // Check if result is ready
    bool is_ready() const {
        std::lock_guard<std::mutex> lock(shared_state_->mutex);
        return shared_state_->ready;
    }
    
    // Wait for result to be ready
    void wait() const {
        std::unique_lock<std::mutex> lock(shared_state_->mutex);
        shared_state_->cv.wait(lock, [this] { 
            return shared_state_->ready || shared_state_->has_exception; 
        });
    }
    
private:
    friend class Promise<T>;
    
    struct SharedState {
        std::mutex mutex;
        std::condition_variable cv;
        T value;
        std::exception_ptr exception;
        bool ready = false;
        bool has_exception = false;
    };
    
    std::shared_ptr<SharedState> shared_state_;
};

// Specialization for void
template<>
class Future<void> {
public:
    Future() : shared_state_(std::make_shared<SharedState>()) {}
    
    void get() {
        std::unique_lock<std::mutex> lock(shared_state_->mutex);
        shared_state_->cv.wait(lock, [this] { 
            return shared_state_->ready || shared_state_->has_exception; 
        });
        
        if (shared_state_->has_exception) {
            std::rethrow_exception(shared_state_->exception);
        }
    }
    
    bool is_ready() const {
        std::lock_guard<std::mutex> lock(shared_state_->mutex);
        return shared_state_->ready;
    }
    
    void wait() const {
        std::unique_lock<std::mutex> lock(shared_state_->mutex);
        shared_state_->cv.wait(lock, [this] { 
            return shared_state_->ready || shared_state_->has_exception; 
        });
    }
    
private:
    friend class Promise<void>;
    
    struct SharedState {
        std::mutex mutex;
        std::condition_variable cv;
        std::exception_ptr exception;
        bool ready = false;
        bool has_exception = false;
    };
    
    std::shared_ptr<SharedState> shared_state_;
};

// Promise to set future value
template<typename T>
class Promise {
public:
    Promise() : future_(std::make_unique<Future<T>>()) {}
    
    Future<T> get_future() {
        return *future_;
    }
    
    void set_value(T value) {
        auto state = future_->shared_state_;
        std::lock_guard<std::mutex> lock(state->mutex);
        state->value = std::move(value);
        state->ready = true;
        state->cv.notify_all();
    }
    
    void set_exception(std::exception_ptr exception) {
        auto state = future_->shared_state_;
        std::lock_guard<std::mutex> lock(state->mutex);
        state->exception = exception;
        state->has_exception = true;
        state->cv.notify_all();
    }
    
private:
    std::unique_ptr<Future<T>> future_;
};

// Specialization for void
template<>
class Promise<void> {
public:
    Promise() : future_(std::make_unique<Future<void>>()) {}
    
    Future<void> get_future() {
        return *future_;
    }
    
    void set_value() {
        auto state = future_->shared_state_;
        std::lock_guard<std::mutex> lock(state->mutex);
        state->ready = true;
        state->cv.notify_all();
    }
    
    void set_exception(std::exception_ptr exception) {
        auto state = future_->shared_state_;
        std::lock_guard<std::mutex> lock(state->mutex);
        state->exception = exception;
        state->has_exception = true;
        state->cv.notify_all();
    }
    
private:
    std::unique_ptr<Future<void>> future_;
};

} // namespace runtime
} // namespace vgpu

#endif // VGPU_RUNTIME_TASK_H
