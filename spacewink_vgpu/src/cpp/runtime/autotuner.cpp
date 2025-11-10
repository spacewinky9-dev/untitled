#include "autotuner.h"
#include "../kernels/matmul_blocked.h"
#include <algorithm>
#include <chrono>
#include <cmath>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <sstream>
#include <vector>

#ifdef __linux__
#include <unistd.h>
#endif

namespace vgpu {
namespace runtime {

Autotuner::Autotuner() : has_cached_config_(false) {
    // Try to load cached config from disk
    has_cached_config_ = load_config_from_file();
}

TunerConfig Autotuner::tune(bool force) {
    if (has_cached_config_ && !force) {
        return cached_config_;
    }
    
    // Run microbenchmarks to find optimal tile sizes
    TunerConfig optimal = run_microbenchmarks();
    
    // Cache the result
    cached_config_ = optimal;
    has_cached_config_ = true;
    save_config_to_file(optimal);
    
    return optimal;
}

TunerConfig Autotuner::get_config() const {
    if (has_cached_config_) {
        return cached_config_;
    }
    
    // Return default based on typical cache sizes
    TunerConfig default_config;
    kernels::get_default_tile_sizes(default_config.MC, default_config.KC, default_config.NC);
    return default_config;
}

void Autotuner::reset_config() {
    has_cached_config_ = false;
    // Delete config file
    std::string path = get_config_path();
    std::remove(path.c_str());
}

void Autotuner::get_cache_sizes(size_t& L1, size_t& L2, size_t& L3) const {
    detect_cache_sizes(L1, L2, L3);
}

std::string Autotuner::get_config_path() const {
    const char* home = std::getenv("HOME");
    if (home) {
        return std::string(home) + "/.vgpu_tuner.json";
    }
    return ".vgpu_tuner.json";
}

bool Autotuner::load_config_from_file() {
    std::string path = get_config_path();
    std::ifstream file(path);
    if (!file.is_open()) {
        return false;
    }
    
    // Simple JSON parsing (just extract numbers)
    std::string line;
    size_t mc = 0, kc = 0, nc = 0;
    while (std::getline(file, line)) {
        if (line.find("\"MC\"") != std::string::npos) {
            size_t pos = line.find(":");
            if (pos != std::string::npos) {
                mc = std::stoul(line.substr(pos + 1));
            }
        } else if (line.find("\"KC\"") != std::string::npos) {
            size_t pos = line.find(":");
            if (pos != std::string::npos) {
                kc = std::stoul(line.substr(pos + 1));
            }
        } else if (line.find("\"NC\"") != std::string::npos) {
            size_t pos = line.find(":");
            if (pos != std::string::npos) {
                nc = std::stoul(line.substr(pos + 1));
            }
        }
    }
    
    if (mc > 0 && kc > 0 && nc > 0) {
        cached_config_ = TunerConfig(mc, kc, nc);
        return true;
    }
    
    return false;
}

void Autotuner::save_config_to_file(const TunerConfig& config) {
    std::string path = get_config_path();
    std::ofstream file(path);
    if (!file.is_open()) {
        std::cerr << "Warning: Could not save tuner config to " << path << std::endl;
        return;
    }
    
    file << "{\n";
    file << "  \"MC\": " << config.MC << ",\n";
    file << "  \"KC\": " << config.KC << ",\n";
    file << "  \"NC\": " << config.NC << "\n";
    file << "}\n";
}

void Autotuner::detect_cache_sizes(size_t& L1, size_t& L2, size_t& L3) const {
#ifdef __linux__
    // Try to get cache sizes from sysconf
    long l1 = sysconf(_SC_LEVEL1_DCACHE_SIZE);
    long l2 = sysconf(_SC_LEVEL2_CACHE_SIZE);
    long l3 = sysconf(_SC_LEVEL3_CACHE_SIZE);
    
    L1 = (l1 > 0) ? static_cast<size_t>(l1) : 32768;      // 32 KB default
    L2 = (l2 > 0) ? static_cast<size_t>(l2) : 262144;     // 256 KB default
    L3 = (l3 > 0) ? static_cast<size_t>(l3) : 8388608;    // 8 MB default
#else
    // Default conservative values
    L1 = 32768;      // 32 KB
    L2 = 262144;     // 256 KB
    L3 = 8388608;    // 8 MB
#endif
}

TunerConfig Autotuner::run_microbenchmarks() {
    std::cout << "Running autotuner microbenchmarks..." << std::endl;
    
    // Detect cache sizes
    size_t L1, L2, L3;
    detect_cache_sizes(L1, L2, L3);
    
    std::cout << "Detected cache sizes: L1=" << L1/1024 << "KB, L2=" 
              << L2/1024 << "KB, L3=" << L3/1024 << "KB" << std::endl;
    
    // Generate candidate tile sizes based on cache hierarchy
    std::vector<TunerConfig> candidates;
    
    // MC: fit in L2 (with room for KC elements of A)
    std::vector<size_t> mc_sizes = {128, 192, 256, 384, 512};
    
    // KC: fit in L1
    std::vector<size_t> kc_sizes = {64, 96, 128, 192, 256};
    
    // NC: fit in L3
    std::vector<size_t> nc_sizes = {2048, 4096, 8192};
    
    for (size_t mc : mc_sizes) {
        for (size_t kc : kc_sizes) {
            for (size_t nc : nc_sizes) {
                // Check if configuration respects cache hierarchy
                size_t a_block_size = mc * kc * sizeof(float);
                size_t b_block_size = kc * nc * sizeof(float);
                
                if (a_block_size < L2 && kc * kc * sizeof(float) < L1 && b_block_size < L3) {
                    candidates.push_back(TunerConfig(mc, kc, nc));
                }
            }
        }
    }
    
    if (candidates.empty()) {
        std::cout << "No valid candidates, using defaults" << std::endl;
        TunerConfig default_config;
        kernels::get_default_tile_sizes(default_config.MC, default_config.KC, default_config.NC);
        return default_config;
    }
    
    // Benchmark each candidate on test problem
    const size_t test_size = 512;  // Medium-sized test
    double best_gflops = 0.0;
    TunerConfig best_config = candidates[0];
    
    std::cout << "Testing " << candidates.size() << " tile configurations..." << std::endl;
    
    for (const auto& config : candidates) {
        double gflops = benchmark_tile_config(config, test_size);
        if (gflops > best_gflops) {
            best_gflops = gflops;
            best_config = config;
        }
    }
    
    std::cout << "Best config: MC=" << best_config.MC << ", KC=" << best_config.KC 
              << ", NC=" << best_config.NC << " (" << best_gflops << " GFLOPS)" << std::endl;
    
    return best_config;
}

double Autotuner::benchmark_tile_config(const TunerConfig& config, size_t test_size) {
    // Allocate test matrices
    std::vector<float> A(test_size * test_size);
    std::vector<float> B(test_size * test_size);
    std::vector<float> C(test_size * test_size);
    
    // Initialize with random values
    for (size_t i = 0; i < test_size * test_size; ++i) {
        A[i] = static_cast<float>(rand()) / RAND_MAX;
        B[i] = static_cast<float>(rand()) / RAND_MAX;
    }
    
    // Warm-up run
    kernels::matmul_blocked(test_size, test_size, test_size,
                           A.data(), B.data(), C.data(),
                           config.MC, config.KC, config.NC);
    
    // Timed run
    auto start = std::chrono::high_resolution_clock::now();
    kernels::matmul_blocked(test_size, test_size, test_size,
                           A.data(), B.data(), C.data(),
                           config.MC, config.KC, config.NC);
    auto end = std::chrono::high_resolution_clock::now();
    
    double elapsed = std::chrono::duration<double>(end - start).count();
    double flops = 2.0 * test_size * test_size * test_size;  // 2*M*N*K FLOPs
    double gflops = flops / elapsed / 1e9;
    
    return gflops;
}

Autotuner& get_autotuner() {
    static Autotuner instance;
    return instance;
}

} // namespace runtime
} // namespace vgpu
