// numa_utils.h - NUMA topology detection and affinity utilities
// Part of Spacewink vGPU - PR-04

#ifndef VGPU_RUNTIME_NUMA_UTILS_H
#define VGPU_RUNTIME_NUMA_UTILS_H

#include <string>
#include <vector>

namespace vgpu {
namespace runtime {

// CPU cache information
struct CacheInfo {
    int level;           // 1, 2, or 3
    size_t size_bytes;   // Cache size in bytes
    int line_size;       // Cache line size in bytes
    std::string type;    // "Data", "Instruction", or "Unified"
};

// NUMA node information
struct NumaNode {
    int node_id;
    std::vector<int> cpu_ids;
    size_t memory_bytes;
    std::vector<CacheInfo> caches;
};

// NUMA utilities class
class NumaUtils {
public:
    NumaUtils();
    ~NumaUtils() = default;
    
    // Check if NUMA is available on this system
    bool is_available() const { return available_; }
    
    // Get number of NUMA nodes
    int num_nodes() const { return static_cast<int>(nodes_.size()); }
    
    // Get NUMA node information
    const NumaNode* get_node(int node_id) const;
    
    // Get all nodes
    const std::vector<NumaNode>& get_nodes() const { return nodes_; }
    
    // Get total number of CPUs
    int num_cpus() const { return num_cpus_; }
    
    // Get node ID for a given CPU
    int get_node_for_cpu(int cpu_id) const;
    
    // Set thread affinity to a specific node
    bool set_thread_affinity(int node_id, int thread_id);
    
    // Set thread affinity to a specific CPU
    bool set_cpu_affinity(int cpu_id);
    
    // Allocate memory on specific NUMA node
    void* alloc_on_node(size_t size, int node_id);
    
    // Free NUMA-allocated memory
    void free_numa(void* ptr, size_t size);
    
    // Get cache information for a CPU
    std::vector<CacheInfo> get_cache_info(int cpu_id) const;
    
private:
    void detect_topology();
    void parse_node_info(int node_id);
    CacheInfo parse_cache_info(const std::string& path);
    
    bool available_;
    int num_cpus_;
    std::vector<NumaNode> nodes_;
};

} // namespace runtime
} // namespace vgpu

#endif // VGPU_RUNTIME_NUMA_UTILS_H
