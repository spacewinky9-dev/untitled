"""
vGPU Runtime API

High-level Python API for vGPU virtual GPU computing.
Provides device management, memory operations, and compute kernels.
"""

__version__ = "0.2.0"

import numpy as np

try:
    import _vgpu_kernels
    _KERNELS_AVAILABLE = True
except ImportError:
    _KERNELS_AVAILABLE = False


class Device:
    """Virtual GPU device"""
    
    def __init__(self, device_id=0):
        self.device_id = device_id
        self.name = f"vGPU-{device_id}"
        self.compute_capability = "1.0"
    
    def __repr__(self):
        return f"Device(id={self.device_id}, name='{self.name}')"


def get_device_count():
    """Get number of available virtual GPU devices"""
    return 1  # Single virtual device for now


def get_device(device_id=0):
    """Get device by ID"""
    if device_id != 0:
        raise ValueError(f"Invalid device ID: {device_id}")
    return Device(device_id)


def get_device_properties(device_id=0):
    """Get properties of a virtual GPU device"""
    if device_id != 0:
        raise ValueError(f"Invalid device ID: {device_id}")
    
    return {
        "name": f"vGPU-{device_id}",
        "compute_capability": "1.0",
        "total_memory": "System RAM",
        "multiprocessor_count": 1,
        "clock_rate": "N/A",
        "memory_clock_rate": "N/A",
    }


def matmul(A, B):
    """
    Matrix multiplication: C = A @ B
    
    Uses basic naive O(M*N*K) algorithm.
    For better performance, use matmul_blocked() with autotuned tile sizes.
    
    Parameters:
        A: ndarray (M, K), float32
        B: ndarray (K, N), float32
    
    Returns:
        C: ndarray (M, N), float32
    """
    if not _KERNELS_AVAILABLE:
        raise RuntimeError("vGPU kernels not available")
    
    A = np.asarray(A, dtype=np.float32)
    B = np.asarray(B, dtype=np.float32)
    
    if A.ndim != 2:
        raise ValueError(f"A must be 2-dimensional, got shape {A.shape}")
    if B.ndim != 2:
        raise ValueError(f"B must be 2-dimensional, got shape {B.shape}")
    if A.shape[1] != B.shape[0]:
        raise ValueError(
            f"Matrix dimensions incompatible: A.shape[1]={A.shape[1]} != B.shape[0]={B.shape[0]}"
        )
    
    return _vgpu_kernels.matmul_basic(A, B)


def matmul_blocked(A, B, MC=None, KC=None, NC=None):
    """
    Cache-optimized blocked matrix multiplication: C = A @ B
    
    Uses 3-level tiling for cache hierarchy (L1/L2/L3).
    Typically 5-10x faster than naive matmul().
    
    If tile sizes not provided, uses autotuner defaults or cached config.
    For first run, consider calling tune() first for optimal performance.
    
    Parameters:
        A: ndarray (M, K), float32
        B: ndarray (K, N), float32
        MC: Tile size for M dimension (default: from autotuner)
        KC: Tile size for K dimension (default: from autotuner)
        NC: Tile size for N dimension (default: from autotuner)
    
    Returns:
        C: ndarray (M, N), float32
    """
    if not _KERNELS_AVAILABLE:
        raise RuntimeError("vGPU kernels not available")
    
    A = np.asarray(A, dtype=np.float32)
    B = np.asarray(B, dtype=np.float32)
    
    if A.ndim != 2:
        raise ValueError(f"A must be 2-dimensional, got shape {A.shape}")
    if B.ndim != 2:
        raise ValueError(f"B must be 2-dimensional, got shape {B.shape}")
    if A.shape[1] != B.shape[0]:
        raise ValueError(
            f"Matrix dimensions incompatible: A.shape[1]={A.shape[1]} != B.shape[0]={B.shape[0]}"
        )
    
    # Get tile sizes from autotuner if not provided
    if MC is None or KC is None or NC is None:
        config = get_tuner_config()
        MC = MC or config['MC']
        KC = KC or config['KC']
        NC = NC or config['NC']
    
    return _vgpu_kernels.matmul_blocked(A, B, MC, KC, NC)


def tune(force=False):
    """
    Run autotuner to find optimal tile sizes for blocked GEMM
    
    Performs microbenchmarks and caches result to ~/.vgpu_tuner.json
    First run may take 30-60 seconds. Subsequent calls use cached config.
    
    Parameters:
        force: If True, rerun tuning even if cached config exists
    
    Returns:
        dict with keys MC, KC, NC (optimal tile sizes)
    """
    if not _KERNELS_AVAILABLE:
        raise RuntimeError("vGPU kernels not available")
    return _vgpu_kernels.tune(force)


def get_tuner_config():
    """
    Get current autotuner configuration
    
    Returns cached config if available, otherwise returns defaults
    based on typical cache hierarchy.
    
    Returns:
        dict with keys MC, KC, NC
    """
    if not _KERNELS_AVAILABLE:
        raise RuntimeError("vGPU kernels not available")
    return _vgpu_kernels.get_tuner_config()


def reset_tuner_config():
    """
    Reset cached autotuner configuration
    
    Forces retuning on next call to tune() or matmul_blocked().
    """
    if not _KERNELS_AVAILABLE:
        raise RuntimeError("vGPU kernels not available")
    _vgpu_kernels.reset_tuner_config()


def get_cache_sizes():
    """
    Get CPU cache sizes detected by autotuner
    
    Returns:
        dict with keys L1, L2, L3 (cache sizes in bytes)
    """
    if not _KERNELS_AVAILABLE:
        raise RuntimeError("vGPU kernels not available")
    return _vgpu_kernels.get_cache_sizes()


def benchmark_matmul(size, method='blocked', warmup=1, iterations=3):
    """
    Benchmark matrix multiplication performance
    
    Parameters:
        size: Matrix size (will test size x size matrices)
        method: 'basic' or 'blocked'
        warmup: Number of warmup iterations
        iterations: Number of timed iterations
    
    Returns:
        dict with keys: mean_time, std_time, gflops_mean, gflops_std
    """
    import time
    
    A = np.random.randn(size, size).astype(np.float32)
    B = np.random.randn(size, size).astype(np.float32)
    
    matmul_func = matmul if method == 'basic' else matmul_blocked
    
    # Warmup
    for _ in range(warmup):
        _ = matmul_func(A, B)
    
    # Timed runs
    times = []
    for _ in range(iterations):
        start = time.perf_counter()
        _ = matmul_func(A, B)
        end = time.perf_counter()
        times.append(end - start)
    
    mean_time = np.mean(times)
    std_time = np.std(times)
    flops = 2 * size**3  # 2*M*N*K FLOPs
    gflops_mean = flops / mean_time / 1e9
    gflops_std = flops * std_time / (mean_time ** 2) / 1e9
    
    return {
        'mean_time': mean_time,
        'std_time': std_time,
        'gflops_mean': gflops_mean,
        'gflops_std': gflops_std,
    }


__all__ = [
    'Device',
    'get_device_count',
    'get_device',
    'get_device_properties',
    'matmul',
    'matmul_blocked',
    'tune',
    'get_tuner_config',
    'reset_tuner_config',
    'get_cache_sizes',
    'benchmark_matmul',
]
