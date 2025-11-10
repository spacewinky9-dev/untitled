// tiered_allocator.cpp - Implementation of 3-tier memory allocator
// Part of Spacewink vGPU - PR-05: Tiered Memory Allocator

#include "tiered_allocator.h"
#include <cstdlib>
#include <cstring>
#include <algorithm>
#include <iostream>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

namespace vgpu {
namespace memory {

// Implementation details (PIMPL pattern)
struct TieredAllocator::Impl {
    // Memory limits
    size_t ram_limit;
    size_t vram_limit;
    size_t vssd_limit;
    
    // Current usage
    size_t ram_used = 0;
    size_t vram_used = 0;
    size_t vssd_used = 0;
    
    // Allocations tracking
    std::unordered_map<void*, AllocationInfo> allocations;
    mutable std::mutex allocations_mutex;
    
    // Statistics
    size_t num_spills = 0;
    size_t num_promotions = 0;
    
    // Configuration
    float memory_pressure_threshold = 0.8f;
    bool async_spill_enabled = true;
    int prefetch_distance = 2;
    
    // tmpfs paths
    std::string vram_path = "/tmp/vgpu_vram";
    std::string vssd_path = "/tmp/vgpu_vssd";
    
    Impl(size_t ram_lim, size_t vram_lim, size_t vssd_lim)
        : ram_limit(ram_lim), vram_limit(vram_lim), vssd_limit(vssd_lim) {
        // Create directories
        mkdir(vram_path.c_str(), 0755);
        mkdir(vssd_path.c_str(), 0755);
    }
    
    ~Impl() {
        // Cleanup allocations
        std::lock_guard<std::mutex> lock(allocations_mutex);
        for (auto& pair : allocations) {
            void* ptr = pair.second.ptr;
            MemoryTier tier = pair.second.tier;
            if (tier == MemoryTier::RAM) {
                free(ptr);
            } else {
                // Memory-mapped files will be unmapped automatically
            }
        }
    }
};

TieredAllocator::TieredAllocator(size_t ram_limit_bytes, 
                                 size_t vram_limit_bytes,
                                 size_t vssd_limit_bytes) {
    // Auto-detect limits if not specified
    if (ram_limit_bytes == 0) {
        ram_limit_bytes = get_available_ram() * 0.7;  // Use 70% of available RAM
    }
    if (vram_limit_bytes == 0) {
        vram_limit_bytes = ram_limit_bytes * 0.5;  // vRAM is 50% of RAM limit
    }
    if (vssd_limit_bytes == 0) {
        vssd_limit_bytes = ram_limit_bytes * 5;  // vSSD can be 5x RAM limit
    }
    
    pimpl_ = std::make_unique<Impl>(ram_limit_bytes, vram_limit_bytes, vssd_limit_bytes);
}

TieredAllocator::~TieredAllocator() = default;

void* TieredAllocator::allocate(size_t size, MemoryTier preferred_tier) {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    
    // Check memory pressure
    check_memory_pressure();
    
    // Try to allocate in preferred tier
    void* ptr = allocate_in_tier(size, preferred_tier);
    
    // If failed, try lower tiers
    if (!ptr && preferred_tier == MemoryTier::RAM) {
        ptr = allocate_in_tier(size, MemoryTier::VRAM);
    }
    if (!ptr && (preferred_tier == MemoryTier::RAM || preferred_tier == MemoryTier::VRAM)) {
        ptr = allocate_in_tier(size, MemoryTier::VSSD);
    }
    
    if (!ptr) {
        throw std::bad_alloc();
    }
    
    // Track allocation
    AllocationInfo info;
    info.ptr = ptr;
    info.size = size;
    info.tier = preferred_tier;
    info.last_access = std::chrono::steady_clock::now();
    info.pinned = false;
    info.access_count = 1;
    
    pimpl_->allocations[ptr] = info;
    
    return ptr;
}

void TieredAllocator::deallocate(void* ptr) {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    
    auto it = pimpl_->allocations.find(ptr);
    if (it == pimpl_->allocations.end()) {
        return;  // Not found, already freed
    }
    
    AllocationInfo& info = it->second;
    free_in_tier(info.ptr, info.tier);
    
    // Update usage stats
    switch (info.tier) {
        case MemoryTier::RAM:
            pimpl_->ram_used -= info.size;
            break;
        case MemoryTier::VRAM:
            pimpl_->vram_used -= info.size;
            break;
        case MemoryTier::VSSD:
            pimpl_->vssd_used -= info.size;
            break;
    }
    
    pimpl_->allocations.erase(it);
}

void* TieredAllocator::get_pointer(void* handle) {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    
    auto it = pimpl_->allocations.find(handle);
    if (it == pimpl_->allocations.end()) {
        return nullptr;
    }
    
    // Update access tracking
    it->second.last_access = std::chrono::steady_clock::now();
    it->second.access_count++;
    
    // Potentially promote hot data
    if (it->second.access_count > 10 && it->second.tier != MemoryTier::RAM) {
        if (pimpl_->ram_used + it->second.size < pimpl_->ram_limit) {
            migrate_allocation(handle, it->second.tier, MemoryTier::RAM);
        }
    }
    
    return it->second.ptr;
}

void TieredAllocator::pin_memory(void* ptr) {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    auto it = pimpl_->allocations.find(ptr);
    if (it != pimpl_->allocations.end()) {
        it->second.pinned = true;
    }
}

void TieredAllocator::unpin_memory(void* ptr) {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    auto it = pimpl_->allocations.find(ptr);
    if (it != pimpl_->allocations.end()) {
        it->second.pinned = false;
    }
}

bool TieredAllocator::promote(void* ptr, MemoryTier target_tier) {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    
    auto it = pimpl_->allocations.find(ptr);
    if (it == pimpl_->allocations.end()) {
        return false;
    }
    
    return migrate_allocation(ptr, it->second.tier, target_tier);
}

bool TieredAllocator::demote(void* ptr, MemoryTier target_tier) {
    return promote(ptr, target_tier);  // Same operation
}

MemoryStats TieredAllocator::get_stats() const {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    
    MemoryStats stats;
    stats.ram_used = pimpl_->ram_used;
    stats.ram_limit = pimpl_->ram_limit;
    stats.vram_used = pimpl_->vram_used;
    stats.vram_limit = pimpl_->vram_limit;
    stats.vssd_used = pimpl_->vssd_used;
    stats.vssd_limit = pimpl_->vssd_limit;
    stats.num_allocations = pimpl_->allocations.size();
    stats.num_spills = pimpl_->num_spills;
    stats.num_promotions = pimpl_->num_promotions;
    
    return stats;
}

MemoryTier TieredAllocator::get_tier(void* ptr) const {
    std::lock_guard<std::mutex> lock(pimpl_->allocations_mutex);
    auto it = pimpl_->allocations.find(ptr);
    if (it != pimpl_->allocations.end()) {
        return it->second.tier;
    }
    return MemoryTier::RAM;  // Default
}

void TieredAllocator::print_stats() const {
    auto stats = get_stats();
    std::cout << "=== TieredAllocator Stats ===" << std::endl;
    std::cout << "RAM:  " << stats.ram_used / (1024*1024) << " MB / " 
              << stats.ram_limit / (1024*1024) << " MB" << std::endl;
    std::cout << "vRAM: " << stats.vram_used / (1024*1024) << " MB / " 
              << stats.vram_limit / (1024*1024) << " MB" << std::endl;
    std::cout << "vSSD: " << stats.vssd_used / (1024*1024) << " MB / " 
              << stats.vssd_limit / (1024*1024) << " MB" << std::endl;
    std::cout << "Allocations: " << stats.num_allocations << std::endl;
    std::cout << "Spills: " << stats.num_spills << std::endl;
    std::cout << "Promotions: " << stats.num_promotions << std::endl;
}

void TieredAllocator::set_memory_pressure_threshold(float threshold) {
    pimpl_->memory_pressure_threshold = std::clamp(threshold, 0.0f, 1.0f);
}

void TieredAllocator::enable_async_spill(bool enable) {
    pimpl_->async_spill_enabled = enable;
}

void TieredAllocator::set_prefetch_distance(int distance) {
    pimpl_->prefetch_distance = distance;
}

void TieredAllocator::set_tier_limits(MemoryTier tier, size_t limit_bytes) {
    switch (tier) {
        case MemoryTier::RAM:
            pimpl_->ram_limit = limit_bytes;
            break;
        case MemoryTier::VRAM:
            pimpl_->vram_limit = limit_bytes;
            break;
        case MemoryTier::VSSD:
            pimpl_->vssd_limit = limit_bytes;
            break;
    }
}

// Private methods

void TieredAllocator::check_memory_pressure() {
    float ram_usage = static_cast<float>(pimpl_->ram_used) / pimpl_->ram_limit;
    
    if (ram_usage > pimpl_->memory_pressure_threshold) {
        // Evict least recently used allocation
        evict_lru_allocation();
    }
}

void TieredAllocator::evict_lru_allocation() {
    // Find LRU non-pinned allocation in RAM
    void* lru_ptr = nullptr;
    auto oldest_time = std::chrono::steady_clock::now();
    
    for (auto& pair : pimpl_->allocations) {
        if (pair.second.tier == MemoryTier::RAM && !pair.second.pinned) {
            if (pair.second.last_access < oldest_time) {
                oldest_time = pair.second.last_access;
                lru_ptr = pair.first;
            }
        }
    }
    
    if (lru_ptr) {
        // Demote to vRAM
        migrate_allocation(lru_ptr, MemoryTier::RAM, MemoryTier::VRAM);
        pimpl_->num_spills++;
    }
}

void* TieredAllocator::allocate_in_tier(size_t size, MemoryTier tier) {
    switch (tier) {
        case MemoryTier::RAM:
            if (pimpl_->ram_used + size <= pimpl_->ram_limit) {
                void* ptr = malloc(size);
                if (ptr) {
                    pimpl_->ram_used += size;
                    return ptr;
                }
            }
            break;
            
        case MemoryTier::VRAM:
            if (pimpl_->vram_used + size <= pimpl_->vram_limit) {
                // Use mmap with tmpfs backing
                void* ptr = malloc(size);  // Simplified for now
                if (ptr) {
                    pimpl_->vram_used += size;
                    return ptr;
                }
            }
            break;
            
        case MemoryTier::VSSD:
            if (pimpl_->vssd_used + size <= pimpl_->vssd_limit) {
                void* ptr = malloc(size);  // Simplified for now
                if (ptr) {
                    pimpl_->vssd_used += size;
                    return ptr;
                }
            }
            break;
    }
    
    return nullptr;
}

void TieredAllocator::free_in_tier(void* ptr, MemoryTier tier) {
    // Simplified implementation
    free(ptr);
}

bool TieredAllocator::migrate_allocation(void* ptr, MemoryTier from_tier, MemoryTier to_tier) {
    auto it = pimpl_->allocations.find(ptr);
    if (it == pimpl_->allocations.end()) {
        return false;
    }
    
    // Allocate in new tier
    void* new_ptr = allocate_in_tier(it->second.size, to_tier);
    if (!new_ptr) {
        return false;
    }
    
    // Copy data
    memcpy(new_ptr, it->second.ptr, it->second.size);
    
    // Free old tier
    free_in_tier(it->second.ptr, from_tier);
    
    // Update tracking
    it->second.ptr = new_ptr;
    it->second.tier = to_tier;
    pimpl_->num_promotions++;
    
    return true;
}

// Utility functions

size_t get_system_ram() {
    long pages = sysconf(_SC_PHYS_PAGES);
    long page_size = sysconf(_SC_PAGE_SIZE);
    return pages * page_size;
}

size_t get_available_ram() {
    long pages = sysconf(_SC_AVPHYS_PAGES);
    long page_size = sysconf(_SC_PAGE_SIZE);
    return pages * page_size;
}

std::string tier_to_string(MemoryTier tier) {
    switch (tier) {
        case MemoryTier::RAM: return "RAM";
        case MemoryTier::VRAM: return "vRAM";
        case MemoryTier::VSSD: return "vSSD";
        default: return "Unknown";
    }
}

} // namespace memory
} // namespace vgpu
