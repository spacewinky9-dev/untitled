// memory_pool.h - Memory pool implementations for vVRAM and vSSD
// Part of Spacewink vGPU - PR-05: Tiered Memory Allocator

#ifndef VGPU_MEMORY_POOL_H
#define VGPU_MEMORY_POOL_H

#include <cstddef>
#include <memory>
#include <string>
#include <vector>

namespace vgpu {
namespace memory {

// Base class for memory pools
class MemoryPoolBase {
public:
    virtual ~MemoryPoolBase() = default;
    
    // Allocation
    virtual void* allocate(size_t size) = 0;
    virtual void deallocate(void* ptr, size_t size) = 0;
    
    // Statistics
    virtual size_t get_used_bytes() const = 0;
    virtual size_t get_total_bytes() const = 0;
    virtual size_t get_free_bytes() const = 0;
    
    // Configuration
    virtual void set_chunk_size(size_t size) = 0;
    virtual size_t get_chunk_size() const = 0;
};

// tmpfs-backed vVRAM pool
class VRAMPool : public MemoryPoolBase {
public:
    explicit VRAMPool(const std::string& base_path = "/tmp/vgpu_vram",
                     size_t initial_size = 0);  // 0 = auto-detect
    ~VRAMPool() override;
    
    void* allocate(size_t size) override;
    void deallocate(void* ptr, size_t size) override;
    
    size_t get_used_bytes() const override;
    size_t get_total_bytes() const override;
    size_t get_free_bytes() const override;
    
    void set_chunk_size(size_t size) override;
    size_t get_chunk_size() const override;
    
    // vVRAM-specific
    std::string get_base_path() const;
    bool is_tmpfs() const;  // Check if actually on tmpfs

private:
    struct Impl;
    std::unique_ptr<Impl> pimpl_;
    
    void create_backing_file(size_t size);
    void* map_file(const std::string& path, size_t size);
    void unmap_file(void* ptr, size_t size);
};

// Disk-backed vSSD pool
class VSSDPool : public MemoryPoolBase {
public:
    explicit VSSDPool(const std::string& base_path = "/tmp/vgpu_vssd",
                     size_t initial_size = 0);  // 0 = unlimited
    ~VSSDPool() override;
    
    void* allocate(size_t size) override;
    void deallocate(void* ptr, size_t size) override;
    
    size_t get_used_bytes() const override;
    size_t get_total_bytes() const override;
    size_t get_free_bytes() const override;
    
    void set_chunk_size(size_t size) override;
    size_t get_chunk_size() const override;
    
    // vSSD-specific
    std::string get_base_path() const;
    size_t get_disk_space_available() const;
    void set_max_disk_usage(size_t bytes);

private:
    struct Impl;
    std::unique_ptr<Impl> pimpl_;
    
    void create_backing_file(size_t size);
    void* map_file(const std::string& path, size_t size);
    void unmap_file(void* ptr, size_t size);
};

// Utility functions
bool create_directory_if_not_exists(const std::string& path);
bool is_on_tmpfs(const std::string& path);
size_t get_available_disk_space(const std::string& path);

} // namespace memory
} // namespace vgpu

#endif // VGPU_MEMORY_POOL_H
