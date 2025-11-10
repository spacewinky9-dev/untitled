#ifndef VGPU_RUNTIME_AUTOTUNER_H
#define VGPU_RUNTIME_AUTOTUNER_H

#include <cstddef>
#include <string>

namespace vgpu {
namespace runtime {

/**
 * Configuration for blocked GEMM tile sizes
 */
struct TunerConfig {
    size_t MC;  // Tile size for M dimension (rows of A)
    size_t KC;  // Tile size for K dimension (shared)
    size_t NC;  // Tile size for N dimension (cols of B)
    
    TunerConfig() : MC(256), KC(128), NC(4096) {}
    TunerConfig(size_t mc, size_t kc, size_t nc) : MC(mc), KC(kc), NC(nc) {}
};

/**
 * Autotuner for selecting optimal tile sizes based on CPU cache hierarchy
 * and empirical microbenchmarks
 */
class Autotuner {
public:
    Autotuner();
    
    /**
     * Run autotuning to find optimal tile sizes
     * Performs microbenchmarks and caches results
     * 
     * @param force If true, rerun tuning even if cached config exists
     * @return Optimal tile configuration
     */
    TunerConfig tune(bool force = false);
    
    /**
     * Get current configuration (from cache or default)
     * 
     * @return Current tile configuration
     */
    TunerConfig get_config() const;
    
    /**
     * Reset cached configuration (force retuning on next call)
     */
    void reset_config();
    
    /**
     * Get cache sizes detected from CPU
     * 
     * @param L1 Output: L1 data cache size in bytes
     * @param L2 Output: L2 cache size in bytes
     * @param L3 Output: L3 cache size in bytes
     */
    void get_cache_sizes(size_t& L1, size_t& L2, size_t& L3) const;
    
private:
    TunerConfig cached_config_;
    bool has_cached_config_;
    
    std::string get_config_path() const;
    bool load_config_from_file();
    void save_config_to_file(const TunerConfig& config);
    
    void detect_cache_sizes(size_t& L1, size_t& L2, size_t& L3) const;
    TunerConfig run_microbenchmarks();
    double benchmark_tile_config(const TunerConfig& config, size_t test_size);
};

/**
 * Get global autotuner instance (singleton)
 */
Autotuner& get_autotuner();

} // namespace runtime
} // namespace vgpu

#endif // VGPU_RUNTIME_AUTOTUNER_H
