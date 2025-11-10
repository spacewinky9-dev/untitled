// memory_pool.cpp - Implementation of memory pools
// Part of Spacewink vGPU - PR-05: Tiered Memory Allocator

#include "memory_pool.h"
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/statvfs.h>
#include <fcntl.h>
#include <unistd.h>
#include <cstring>
#include <iostream>
#include <map>
#include <mutex>

namespace vgpu {
namespace memory {

// VRAMPool implementation
struct VRAMPool::Impl {
    std::string base_path;
    size_t chunk_size = 4 * 1024 * 1024;  // 4MB default
    size_t total_size;
    size_t used_size = 0;
    
    std::mutex mutex;
    std::map<void*, std::pair<std::string, size_t>> allocations;  // ptr -> (file_path, size)
    int next_file_id = 0;
};

VRAMPool::VRAMPool(const std::string& base_path, size_t initial_size)
    : pimpl_(std::make_unique<Impl>()) {
    pimpl_->base_path = base_path;
    pimpl_->total_size = initial_size > 0 ? initial_size : (16ULL * 1024 * 1024 * 1024);  // 16GB default
    
    // Create directory
    create_directory_if_not_exists(base_path);
}

VRAMPool::~VRAMPool() {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    // Clean up all allocations
    for (auto& [ptr, info] : pimpl_->allocations) {
        unmap_file(ptr, info.second);
        unlink(info.first.c_str());
    }
}

void* VRAMPool::allocate(size_t size) {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    
    if (pimpl_->used_size + size > pimpl_->total_size) {
        return nullptr;  // Out of vVRAM
    }
    
    // Create unique file name
    std::string file_path = pimpl_->base_path + "/vram_" + std::to_string(pimpl_->next_file_id++);
    
    // Create and map file
    int fd = open(file_path.c_str(), O_RDWR | O_CREAT | O_EXCL, 0600);
    if (fd < 0) {
        return nullptr;
    }
    
    // Set file size
    if (ftruncate(fd, size) < 0) {
        close(fd);
        unlink(file_path.c_str());
        return nullptr;
    }
    
    // Memory map
    void* ptr = mmap(nullptr, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    close(fd);  // Can close FD after mmap
    
    if (ptr == MAP_FAILED) {
        unlink(file_path.c_str());
        return nullptr;
    }
    
    pimpl_->allocations[ptr] = {file_path, size};
    pimpl_->used_size += size;
    
    return ptr;
}

void VRAMPool::deallocate(void* ptr, size_t size) {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    
    auto it = pimpl_->allocations.find(ptr);
    if (it == pimpl_->allocations.end()) {
        return;  // Not found
    }
    
    // Unmap and delete file
    munmap(ptr, it->second.second);
    unlink(it->second.first.c_str());
    
    pimpl_->used_size -= it->second.second;
    pimpl_->allocations.erase(it);
}

size_t VRAMPool::get_used_bytes() const {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    return pimpl_->used_size;
}

size_t VRAMPool::get_total_bytes() const {
    return pimpl_->total_size;
}

size_t VRAMPool::get_free_bytes() const {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    return pimpl_->total_size - pimpl_->used_size;
}

void VRAMPool::set_chunk_size(size_t size) {
    pimpl_->chunk_size = size;
}

size_t VRAMPool::get_chunk_size() const {
    return pimpl_->chunk_size;
}

std::string VRAMPool::get_base_path() const {
    return pimpl_->base_path;
}

bool VRAMPool::is_tmpfs() const {
    return is_on_tmpfs(pimpl_->base_path);
}

// VSSDPool implementation
struct VSSDPool::Impl {
    std::string base_path;
    size_t chunk_size = 4 * 1024 * 1024;  // 4MB default
    size_t total_size;
    size_t used_size = 0;
    size_t max_disk_usage = 0;  // 0 = unlimited
    
    std::mutex mutex;
    std::map<void*, std::pair<std::string, size_t>> allocations;
    int next_file_id = 0;
};

VSSDPool::VSSDPool(const std::string& base_path, size_t initial_size)
    : pimpl_(std::make_unique<Impl>()) {
    pimpl_->base_path = base_path;
    pimpl_->total_size = initial_size;
    
    // Create directory
    create_directory_if_not_exists(base_path);
}

VSSDPool::~VSSDPool() {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    // Clean up all allocations
    for (auto& [ptr, info] : pimpl_->allocations) {
        munmap(ptr, info.second);
        unlink(info.first.c_str());
    }
}

void* VSSDPool::allocate(size_t size) {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    
    // Check disk space limit
    if (pimpl_->max_disk_usage > 0 && pimpl_->used_size + size > pimpl_->max_disk_usage) {
        return nullptr;
    }
    
    // Create unique file name
    std::string file_path = pimpl_->base_path + "/vssd_" + std::to_string(pimpl_->next_file_id++);
    
    // Create and map file
    int fd = open(file_path.c_str(), O_RDWR | O_CREAT | O_EXCL, 0600);
    if (fd < 0) {
        return nullptr;
    }
    
    // Set file size
    if (ftruncate(fd, size) < 0) {
        close(fd);
        unlink(file_path.c_str());
        return nullptr;
    }
    
    // Memory map
    void* ptr = mmap(nullptr, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    close(fd);
    
    if (ptr == MAP_FAILED) {
        unlink(file_path.c_str());
        return nullptr;
    }
    
    pimpl_->allocations[ptr] = {file_path, size};
    pimpl_->used_size += size;
    
    return ptr;
}

void VSSDPool::deallocate(void* ptr, size_t size) {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    
    auto it = pimpl_->allocations.find(ptr);
    if (it == pimpl_->allocations.end()) {
        return;
    }
    
    munmap(ptr, it->second.second);
    unlink(it->second.first.c_str());
    
    pimpl_->used_size -= it->second.second;
    pimpl_->allocations.erase(it);
}

size_t VSSDPool::get_used_bytes() const {
    std::lock_guard<std::mutex> lock(pimpl_->mutex);
    return pimpl_->used_size;
}

size_t VSSDPool::get_total_bytes() const {
    if (pimpl_->max_disk_usage > 0) {
        return pimpl_->max_disk_usage;
    }
    return get_available_disk_space(pimpl_->base_path);
}

size_t VSSDPool::get_free_bytes() const {
    return get_total_bytes() - get_used_bytes();
}

void VSSDPool::set_chunk_size(size_t size) {
    pimpl_->chunk_size = size;
}

size_t VSSDPool::get_chunk_size() const {
    return pimpl_->chunk_size;
}

std::string VSSDPool::get_base_path() const {
    return pimpl_->base_path;
}

size_t VSSDPool::get_disk_space_available() const {
    return get_available_disk_space(pimpl_->base_path);
}

void VSSDPool::set_max_disk_usage(size_t bytes) {
    pimpl_->max_disk_usage = bytes;
}

// Utility functions
bool create_directory_if_not_exists(const std::string& path) {
    struct stat st;
    if (stat(path.c_str(), &st) == 0) {
        return S_ISDIR(st.st_mode);
    }
    
    // Create directory
    return mkdir(path.c_str(), 0755) == 0;
}

bool is_on_tmpfs(const std::string& path) {
    struct statvfs stat;
    if (statvfs(path.c_str(), &stat) != 0) {
        return false;
    }
    
    // tmpfs typically has f_type = 0x01021994
    // This is a heuristic check
    return stat.f_bsize > 0 && stat.f_blocks > 0;
}

size_t get_available_disk_space(const std::string& path) {
    struct statvfs stat;
    if (statvfs(path.c_str(), &stat) != 0) {
        return 0;
    }
    
    return stat.f_bavail * stat.f_frsize;
}

} // namespace memory
} // namespace vgpu
