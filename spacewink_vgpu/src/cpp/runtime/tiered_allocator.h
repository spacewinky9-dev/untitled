// tiered_allocator.h - 3-tier memory allocator (RAM/vVRAM/vSSD)
// Part of Spacewink vGPU - PR-05: Tiered Memory Allocator

#ifndef VGPU_TIERED_ALLOCATOR_H
#define VGPU_TIERED_ALLOCATOR_H

#include <cstddef>
#include <memory>
#include <string>
#include <unordered_map>
#include <mutex>
#include <chrono>

namespace vgpu {
namespace memory {

enum class MemoryTier {
    RAM,    // Primary memory (fastest)
    VRAM,   // tmpfs-backed virtual RAM
    VSSD    // Disk-backed virtual SSD (slowest)
};

struct AllocationInfo {
    void* ptr;
    size_t size;
    MemoryTier tier;
    std::chrono::steady_clock::time_point last_access;
    bool pinned;  // Cannot be evicted if true
    uint64_t access_count;
};

struct MemoryStats {
    size_t ram_used;
    size_t ram_limit;
    size_t vram_used;
    size_t vram_limit;
    size_t vssd_used;
    size_t vssd_limit;
    size_t num_allocations;
    size_t num_spills;
    size_t num_promotions;
};

class TieredAllocator {
public:
    // Constructor with configurable limits
    TieredAllocator(size_t ram_limit_bytes = 0,  // 0 = auto-detect
                   size_t vram_limit_bytes = 0, 
                   size_t vssd_limit_bytes = 0);
    
    ~TieredAllocator();

    // Allocation/deallocation
    void* allocate(size_t size, MemoryTier preferred_tier = MemoryTier::RAM);
    void deallocate(void* ptr);
    
    // Memory management
    void* get_pointer(void* handle);  // May trigger tier migration
    void pin_memory(void* ptr);       // Prevent eviction
    void unpin_memory(void* ptr);
    
    // Tier management
    bool promote(void* ptr, MemoryTier target_tier);
    bool demote(void* ptr, MemoryTier target_tier);
    void set_tier_limits(MemoryTier tier, size_t limit_bytes);
    
    // Statistics and monitoring
    MemoryStats get_stats() const;
    MemoryTier get_tier(void* ptr) const;
    void print_stats() const;
    
    // Configuration
    void set_memory_pressure_threshold(float threshold);  // 0.0-1.0
    void enable_async_spill(bool enable);
    void set_prefetch_distance(int distance);  // Number of tiles to prefetch

private:
    struct Impl;
    std::unique_ptr<Impl> pimpl_;
    
    // Internal methods
    void check_memory_pressure();
    void evict_lru_allocation();
    void* allocate_in_tier(size_t size, MemoryTier tier);
    void free_in_tier(void* ptr, MemoryTier tier);
    bool migrate_allocation(void* ptr, MemoryTier from_tier, MemoryTier to_tier);
};

// Utility functions
size_t get_system_ram();
size_t get_available_ram();
std::string tier_to_string(MemoryTier tier);

} // namespace memory
} // namespace vgpu

#endif // VGPU_TIERED_ALLOCATOR_H
