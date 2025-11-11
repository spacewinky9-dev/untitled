// numa_utils.cpp - NUMA topology detection implementation
// Part of Spacewink vGPU - PR-04

#include "numa_utils.h"
#include <fstream>
#include <sstream>
#include <algorithm>
#include <cstdlib>
#include <unistd.h>

#ifdef __linux__
#include <pthread.h>
#include <sched.h>
#include <sys/syscall.h>
#endif

namespace vgpu {
namespace runtime {

NumaUtils::NumaUtils() : available_(false), num_cpus_(0) {
    detect_topology();
}

void NumaUtils::detect_topology() {
#ifdef __linux__
    // Try to detect NUMA nodes from /sys/devices/system/node
    std::ifstream online("/sys/devices/system/node/online");
    if (!online.is_open()) {
        // NUMA not available, create single node with all CPUs
        num_cpus_ = static_cast<int>(sysconf(_SC_NPROCESSORS_ONLN));
        NumaNode node;
        node.node_id = 0;
        node.memory_bytes = 0;
        for (int i = 0; i < num_cpus_; ++i) {
            node.cpu_ids.push_back(i);
        }
        nodes_.push_back(node);
        available_ = false;
        return;
    }
    
    // Parse node list (e.g., "0-1" or "0,2,4")
    std::string line;
    std::getline(online, line);
    online.close();
    
    std::vector<int> node_ids;
    std::istringstream iss(line);
    std::string token;
    while (std::getline(iss, token, ',')) {
        size_t dash_pos = token.find('-');
        if (dash_pos != std::string::npos) {
            int start = std::stoi(token.substr(0, dash_pos));
            int end = std::stoi(token.substr(dash_pos + 1));
            for (int i = start; i <= end; ++i) {
                node_ids.push_back(i);
            }
        } else {
            node_ids.push_back(std::stoi(token));
        }
    }
    
    // Parse each node
    for (int node_id : node_ids) {
        parse_node_info(node_id);
    }
    
    // Count total CPUs
    for (const auto& node : nodes_) {
        num_cpus_ += static_cast<int>(node.cpu_ids.size());
    }
    
    available_ = !nodes_.empty();
#else
    // Non-Linux: single node with all CPUs
    num_cpus_ = static_cast<int>(std::thread::hardware_concurrency());
    NumaNode node;
    node.node_id = 0;
    node.memory_bytes = 0;
    for (int i = 0; i < num_cpus_; ++i) {
        node.cpu_ids.push_back(i);
    }
    nodes_.push_back(node);
    available_ = false;
#endif
}

void NumaUtils::parse_node_info(int node_id) {
#ifdef __linux__
    NumaNode node;
    node.node_id = node_id;
    
    // Read CPU list
    std::string cpu_path = "/sys/devices/system/node/node" + 
                           std::to_string(node_id) + "/cpulist";
    std::ifstream cpulist(cpu_path);
    if (cpulist.is_open()) {
        std::string line;
        std::getline(cpulist, line);
        
        // Parse CPU list (e.g., "0-7" or "0,2,4,6")
        std::istringstream iss(line);
        std::string token;
        while (std::getline(iss, token, ',')) {
            size_t dash_pos = token.find('-');
            if (dash_pos != std::string::npos) {
                int start = std::stoi(token.substr(0, dash_pos));
                int end = std::stoi(token.substr(dash_pos + 1));
                for (int i = start; i <= end; ++i) {
                    node.cpu_ids.push_back(i);
                }
            } else {
                node.cpu_ids.push_back(std::stoi(token));
            }
        }
    }
    
    // Read memory info (approximate)
    std::string meminfo_path = "/sys/devices/system/node/node" + 
                               std::to_string(node_id) + "/meminfo";
    std::ifstream meminfo(meminfo_path);
    if (meminfo.is_open()) {
        std::string line;
        while (std::getline(meminfo, line)) {
            if (line.find("MemTotal:") != std::string::npos) {
                std::istringstream iss(line);
                std::string word;
                size_t mem_kb = 0;
                while (iss >> word) {
                    try {
                        mem_kb = std::stoull(word);
                        break;
                    } catch (...) {
                        continue;
                    }
                }
                node.memory_bytes = mem_kb * 1024;
                break;
            }
        }
    }
    
    nodes_.push_back(node);
#endif
}

CacheInfo NumaUtils::parse_cache_info(const std::string& path) {
    CacheInfo cache;
    cache.level = 0;
    cache.size_bytes = 0;
    cache.line_size = 0;
    cache.type = "Unknown";
    
#ifdef __linux__
    // Read cache level
    std::ifstream level_file(path + "/level");
    if (level_file.is_open()) {
        level_file >> cache.level;
    }
    
    // Read cache size
    std::ifstream size_file(path + "/size");
    if (size_file.is_open()) {
        std::string size_str;
        size_file >> size_str;
        // Parse size (e.g., "32K", "256K", "8M")
        size_t multiplier = 1;
        if (size_str.back() == 'K') {
            multiplier = 1024;
            size_str.pop_back();
        } else if (size_str.back() == 'M') {
            multiplier = 1024 * 1024;
            size_str.pop_back();
        }
        cache.size_bytes = std::stoull(size_str) * multiplier;
    }
    
    // Read cache line size
    std::ifstream line_file(path + "/coherency_line_size");
    if (line_file.is_open()) {
        line_file >> cache.line_size;
    }
    
    // Read cache type
    std::ifstream type_file(path + "/type");
    if (type_file.is_open()) {
        std::getline(type_file, cache.type);
    }
#endif
    
    return cache;
}

const NumaNode* NumaUtils::get_node(int node_id) const {
    for (const auto& node : nodes_) {
        if (node.node_id == node_id) {
            return &node;
        }
    }
    return nullptr;
}

int NumaUtils::get_node_for_cpu(int cpu_id) const {
    for (const auto& node : nodes_) {
        auto it = std::find(node.cpu_ids.begin(), node.cpu_ids.end(), cpu_id);
        if (it != node.cpu_ids.end()) {
            return node.node_id;
        }
    }
    return 0; // Default to node 0
}

bool NumaUtils::set_thread_affinity(int node_id, int thread_id) {
#ifdef __linux__
    const NumaNode* node = get_node(node_id);
    if (!node || node->cpu_ids.empty()) {
        return false;
    }
    
    // Pin to first CPU of the node
    int cpu_id = node->cpu_ids[thread_id % node->cpu_ids.size()];
    return set_cpu_affinity(cpu_id);
#else
    return false;
#endif
}

bool NumaUtils::set_cpu_affinity(int cpu_id) {
#ifdef __linux__
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(cpu_id, &cpuset);
    
    return pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset) == 0;
#else
    return false;
#endif
}

void* NumaUtils::alloc_on_node(size_t size, int node_id) {
    // Simplified: just use regular malloc
    // Real implementation would use numa_alloc_onnode from libnuma
    return std::malloc(size);
}

void NumaUtils::free_numa(void* ptr, size_t size) {
    std::free(ptr);
}

std::vector<CacheInfo> NumaUtils::get_cache_info(int cpu_id) const {
    std::vector<CacheInfo> caches;
    
#ifdef __linux__
    std::string base_path = "/sys/devices/system/cpu/cpu" + 
                            std::to_string(cpu_id) + "/cache";
    
    // Try indices 0-10 (should cover all cache levels)
    for (int idx = 0; idx < 10; ++idx) {
        std::string cache_path = base_path + "/index" + std::to_string(idx);
        std::ifstream test(cache_path + "/level");
        if (test.is_open()) {
            caches.push_back(parse_cache_info(cache_path));
        }
    }
#endif
    
    return caches;
}

} // namespace runtime
} // namespace vgpu
