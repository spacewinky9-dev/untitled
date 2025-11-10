"""
Unit tests for blocked GEMM and autotuner

Tests cache-aware blocked matrix multiplication, AVX2 vectorization,
and autotuner functionality.
"""

import pytest
import numpy as np
from vgpu_runtime import (
    matmul, matmul_blocked, tune, get_tuner_config,
    reset_tuner_config, get_cache_sizes, benchmark_matmul
)

# Test correctness

def test_blocked_correctness_small():
    """Test blocked GEMM correctness on small matrices"""
    M, N, K = 10, 12, 8
    A = np.random.randn(M, K).astype(np.float32)
    B = np.random.randn(K, N).astype(np.float32)
    
    C_blocked = matmul_blocked(A, B)
    C_numpy = A @ B
    
    np.testing.assert_allclose(C_blocked, C_numpy, rtol=1e-5, atol=1e-6)

def test_blocked_correctness_medium():
    """Test blocked GEMM on medium-sized matrices"""
    M, N, K = 100, 150, 120
    A = np.random.randn(M, K).astype(np.float32)
    B = np.random.randn(K, N).astype(np.float32)
    
    C_blocked = matmul_blocked(A, B)
    C_numpy = A @ B
    
    np.testing.assert_allclose(C_blocked, C_numpy, rtol=1e-5, atol=1e-6)

@pytest.mark.slow
def test_blocked_correctness_large():
    """Test blocked GEMM on large matrices"""
    M, N, K = 512, 512, 512
    A = np.random.randn(M, K).astype(np.float32)
    B = np.random.randn(K, N).astype(np.float32)
    
    C_blocked = matmul_blocked(A, B)
    C_numpy = A @ B
    
    np.testing.assert_allclose(C_blocked, C_numpy, rtol=1e-4, atol=1e-5)

def test_blocked_vs_naive_performance():
    """Verify blocked GEMM is faster than naive"""
    size = 200
    A = np.random.randn(size, size).astype(np.float32)
    B = np.random.randn(size, size).astype(np.float32)
    
    import time
    
    # Blocked
    start = time.perf_counter()
    C1 = matmul_blocked(A, B)
    time_blocked = time.perf_counter() - start
    
    # Naive
    start = time.perf_counter()
    C2 = matmul(A, B)
    time_naive = time.perf_counter() - start
    
    speedup = time_naive / time_blocked
    print(f"\nSpeedup: {speedup:.2f}x (blocked vs naive)")
    
    # Should be at least 2x faster
    assert speedup >= 2.0, f"Expected speedup >= 2x, got {speedup:.2f}x"
    
    # Results should match
    np.testing.assert_allclose(C1, C2, rtol=1e-5, atol=1e-6)

# Test tile size configurations

def test_blocked_custom_tiles():
    """Test blocked GEMM with custom tile sizes"""
    M, N, K = 200, 200, 200
    A = np.random.randn(M, K).astype(np.float32)
    B = np.random.randn(K, N).astype(np.float32)
    
    # Try different tile configurations
    C1 = matmul_blocked(A, B, MC=128, KC=64, NC=2048)
    C2 = matmul_blocked(A, B, MC=256, KC=128, NC=4096)
    C_numpy = A @ B
    
    np.testing.assert_allclose(C1, C_numpy, rtol=1e-5, atol=1e-6)
    np.testing.assert_allclose(C2, C_numpy, rtol=1e-5, atol=1e-6)

# Test autotuner

def test_autotuner_cache_detection():
    """Test that autotuner detects cache sizes"""
    cache_sizes = get_cache_sizes()
    
    assert 'L1' in cache_sizes
    assert 'L2' in cache_sizes
    assert 'L3' in cache_sizes
    
    # Reasonable cache size ranges
    assert 16 * 1024 <= cache_sizes['L1'] <= 256 * 1024  # 16-256 KB
    assert 128 * 1024 <= cache_sizes['L2'] <= 4 * 1024 * 1024  # 128 KB - 4 MB
    assert 1 * 1024 * 1024 <= cache_sizes['L3'] <= 128 * 1024 * 1024  # 1-128 MB

def test_autotuner_config():
    """Test getting autotuner configuration"""
    config = get_tuner_config()
    
    assert 'MC' in config
    assert 'KC' in config
    assert 'NC' in config
    
    # Reasonable tile sizes
    assert 64 <= config['MC'] <= 1024
    assert 32 <= config['KC'] <= 512
    assert 1024 <= config['NC'] <= 16384

def test_tuner_reset():
    """Test resetting tuner configuration"""
    # Get initial config
    config1 = get_tuner_config()
    
    # Reset
    reset_tuner_config()
    
    # Should still be able to get config (uses defaults)
    config2 = get_tuner_config()
    
    assert 'MC' in config2
    assert 'KC' in config2
    assert 'NC' in config2

# Test edge cases

def test_edge_case_tall_matrix():
    """Test with tall matrix (M >> N)"""
    M, N, K = 500, 20, 100
    A = np.random.randn(M, K).astype(np.float32)
    B = np.random.randn(K, N).astype(np.float32)
    
    C_blocked = matmul_blocked(A, B)
    C_numpy = A @ B
    
    np.testing.assert_allclose(C_blocked, C_numpy, rtol=1e-5, atol=1e-6)

def test_edge_case_wide_matrix():
    """Test with wide matrix (N >> M)"""
    M, N, K = 20, 500, 100
    A = np.random.randn(M, K).astype(np.float32)
    B = np.random.randn(K, N).astype(np.float32)
    
    C_blocked = matmul_blocked(A, B)
    C_numpy = A @ B
    
    np.testing.assert_allclose(C_blocked, C_numpy, rtol=1e-5, atol=1e-6)

def test_edge_case_non_pow2():
    """Test with non-power-of-2 dimensions"""
    M, N, K = 127, 253, 179
    A = np.random.randn(M, K).astype(np.float32)
    B = np.random.randn(K, N).astype(np.float32)
    
    C_blocked = matmul_blocked(A, B)
    C_numpy = A @ B
    
    np.testing.assert_allclose(C_blocked, C_numpy, rtol=1e-5, atol=1e-6)

# Test benchmarking utilities

def test_benchmark_blocked():
    """Test benchmark utility for blocked GEMM"""
    result = benchmark_matmul(100, method='blocked', warmup=1, iterations=2)
    
    assert 'mean_time' in result
    assert 'std_time' in result
    assert 'gflops_mean' in result
    assert 'gflops_std' in result
    
    assert result['mean_time'] > 0
    assert result['gflops_mean'] > 0

def test_dimension_validation():
    """Test that dimension mismatches are caught"""
    A = np.random.randn(10, 20).astype(np.float32)
    B = np.random.randn(30, 40).astype(np.float32)
    
    with pytest.raises(ValueError, match="incompatible"):
        matmul_blocked(A, B)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
