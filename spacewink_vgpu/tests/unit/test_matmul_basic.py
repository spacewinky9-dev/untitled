"""
Unit tests for basic matrix multiplication kernel

Tests correctness, edge cases, and performance baseline.
"""

import pytest
import numpy as np
import time
import json
import os

# Try to import vgpu runtime
try:
    import sys
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src/py'))
    from vgpu_runtime import matmul, get_device, get_device_properties
    VGPU_AVAILABLE = True
except ImportError as e:
    VGPU_AVAILABLE = False
    pytest.skip(f"vGPU runtime not available: {e}", allow_module_level=True)


class TestMatMulCorrectness:
    """Test correctness of matrix multiplication"""
    
    def test_correctness_small(self):
        """Test small 10x10 matrices"""
        np.random.seed(42)
        A = np.random.randn(10, 10).astype(np.float32)
        B = np.random.randn(10, 10).astype(np.float32)
        
        C_numpy = A @ B
        C_vgpu = matmul(A, B)
        
        np.testing.assert_allclose(C_vgpu, C_numpy, rtol=1e-5, atol=1e-6)
    
    def test_correctness_medium(self):
        """Test medium 100x200x150 matrices"""
        np.random.seed(123)
        A = np.random.randn(100, 200).astype(np.float32)
        B = np.random.randn(200, 150).astype(np.float32)
        
        C_numpy = A @ B
        C_vgpu = matmul(A, B)
        
        np.testing.assert_allclose(C_vgpu, C_numpy, rtol=1e-5, atol=1e-6)
    
    @pytest.mark.slow
    def test_correctness_large(self):
        """Test large 1000x500x800 matrices"""
        np.random.seed(456)
        A = np.random.randn(1000, 500).astype(np.float32)
        B = np.random.randn(500, 800).astype(np.float32)
        
        C_numpy = A @ B
        C_vgpu = matmul(A, B)
        
        np.testing.assert_allclose(C_vgpu, C_numpy, rtol=1e-5, atol=1e-6)
    
    def test_edge_case_square(self):
        """Test square matrices"""
        np.random.seed(789)
        A = np.random.randn(50, 50).astype(np.float32)
        B = np.random.randn(50, 50).astype(np.float32)
        
        C_numpy = A @ B
        C_vgpu = matmul(A, B)
        
        np.testing.assert_allclose(C_vgpu, C_numpy, rtol=1e-5, atol=1e-6)
    
    def test_edge_case_tall(self):
        """Test tall matrices (M >> N)"""
        np.random.seed(321)
        A = np.random.randn(500, 50).astype(np.float32)
        B = np.random.randn(50, 20).astype(np.float32)
        
        C_numpy = A @ B
        C_vgpu = matmul(A, B)
        
        np.testing.assert_allclose(C_vgpu, C_numpy, rtol=1e-5, atol=1e-6)
    
    def test_edge_case_wide(self):
        """Test wide matrices (N >> M)"""
        np.random.seed(654)
        A = np.random.randn(20, 50).astype(np.float32)
        B = np.random.randn(50, 500).astype(np.float32)
        
        C_numpy = A @ B
        C_vgpu = matmul(A, B)
        
        np.testing.assert_allclose(C_vgpu, C_numpy, rtol=1e-5, atol=1e-6)
    
    def test_type_float32(self):
        """Test explicit float32 handling"""
        A = np.array([[1.0, 2.0], [3.0, 4.0]], dtype=np.float32)
        B = np.array([[5.0, 6.0], [7.0, 8.0]], dtype=np.float32)
        
        C_numpy = A @ B
        C_vgpu = matmul(A, B)
        
        assert C_vgpu.dtype == np.float32
        np.testing.assert_allclose(C_vgpu, C_numpy, rtol=1e-5, atol=1e-6)


class TestMatMulPerformance:
    """Performance benchmarking tests"""
    
    @pytest.mark.slow
    def test_benchmark_baseline(self):
        """Record baseline performance metrics"""
        sizes = [
            (100, 100, 100),
            (500, 500, 500),
            (1000, 1000, 1000),
        ]
        
        results = []
        
        for M, N, K in sizes:
            np.random.seed(42)
            A = np.random.randn(M, K).astype(np.float32)
            B = np.random.randn(K, N).astype(np.float32)
            
            # Warmup
            _ = matmul(A, B)
            
            # Timed run
            start = time.perf_counter()
            C = matmul(A, B)
            end = time.perf_counter()
            
            elapsed = end - start
            operations = 2.0 * M * N * K  # multiply-add counts as 2 ops
            gflops = (operations / elapsed) / 1e9
            
            result = {
                'M': M, 'N': N, 'K': K,
                'time_seconds': elapsed,
                'gflops': gflops,
            }
            results.append(result)
            
            print(f"\nSize ({M}, {N}, {K}): {elapsed:.4f}s, {gflops:.2f} GFLOPS")
        
        # Save to artifacts
        artifact_dir = os.path.join(
            os.path.dirname(__file__),
            '../../artifacts/pr-02'
        )
        os.makedirs(artifact_dir, exist_ok=True)
        
        artifact_path = os.path.join(artifact_dir, 'matmul_benchmark_baseline.json')
        with open(artifact_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n✅ Baseline metrics saved to: {artifact_path}")


class TestMatMulEdgeCases:
    """Test error handling and edge cases"""
    
    def test_dimension_mismatch(self):
        """Test error on dimension mismatch"""
        A = np.random.randn(10, 20).astype(np.float32)
        B = np.random.randn(30, 40).astype(np.float32)
        
        with pytest.raises(ValueError):
            matmul(A, B)
    
    def test_wrong_ndim_A(self):
        """Test error on wrong number of dimensions for A"""
        A = np.random.randn(10).astype(np.float32)
        B = np.random.randn(10, 20).astype(np.float32)
        
        with pytest.raises(ValueError):
            matmul(A, B)
    
    def test_wrong_ndim_B(self):
        """Test error on wrong number of dimensions for B"""
        A = np.random.randn(10, 20).astype(np.float32)
        B = np.random.randn(20).astype(np.float32)
        
        with pytest.raises(ValueError):
            matmul(A, B)


class TestDeviceAPI:
    """Test device management API"""
    
    def test_get_device(self):
        """Test getting device handle"""
        device = get_device(0)
        assert device is not None
        assert device.device_id == 0
    
    def test_get_device_properties(self):
        """Test getting device properties"""
        props = get_device_properties(0)
        assert 'device_id' in props
        assert 'name' in props
        assert 'version' in props


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
