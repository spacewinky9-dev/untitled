"""
vGPU Runtime - High-level Python API

Provides user-friendly interface to vGPU kernels and runtime services.
"""

__version__ = "0.1.0"

import numpy as np

try:
    from _vgpu_kernels import matmul_basic, matmul_basic_strided
    _KERNELS_AVAILABLE = True
except ImportError:
    _KERNELS_AVAILABLE = False
    matmul_basic = None
    matmul_basic_strided = None


class Device:
    """
    vGPU Device abstraction
    
    Represents a virtual GPU device for computation.
    In this early implementation, it's a simple wrapper.
    Future PRs will add memory management, scheduling, etc.
    """
    
    def __init__(self, device_id=0):
        self.device_id = device_id
        self.name = f"vgpu{device_id}"
        
    def __repr__(self):
        return f"<vGPU Device {self.device_id}: {self.name}>"


def matmul(A, B, device=None):
    """
    High-level matrix multiplication: C = A @ B
    
    Parameters:
    -----------
    A : array_like, shape (M, K)
        First input matrix
    B : array_like, shape (K, N)
        Second input matrix
    device : Device, optional
        vGPU device to use (currently ignored)
        
    Returns:
    --------
    C : ndarray, shape (M, N)
        Result matrix
        
    Examples:
    ---------
    >>> import numpy as np
    >>> from vgpu_runtime import matmul
    >>> A = np.random.randn(100, 200).astype(np.float32)
    >>> B = np.random.randn(200, 150).astype(np.float32)
    >>> C = matmul(A, B)
    >>> C.shape
    (100, 150)
    """
    
    if not _KERNELS_AVAILABLE:
        raise RuntimeError(
            "vGPU kernels not available. "
            "Please build the C++ extension module."
        )
    
    # Convert to numpy arrays if needed
    A = np.asarray(A, dtype=np.float32)
    B = np.asarray(B, dtype=np.float32)
    
    # Validate shapes
    if A.ndim != 2:
        raise ValueError(f"A must be 2D, got shape {A.shape}")
    if B.ndim != 2:
        raise ValueError(f"B must be 2D, got shape {B.shape}")
    
    if A.shape[1] != B.shape[0]:
        raise ValueError(
            f"Matrix dimensions incompatible: "
            f"A is {A.shape}, B is {B.shape}"
        )
    
    # Ensure contiguous arrays for basic kernel
    if not A.flags['C_CONTIGUOUS']:
        A = np.ascontiguousarray(A)
    if not B.flags['C_CONTIGUOUS']:
        B = np.ascontiguousarray(B)
    
    # Call native kernel
    return matmul_basic(A, B)


def get_device(device_id=0):
    """
    Get a vGPU device handle
    
    Parameters:
    -----------
    device_id : int, default=0
        Device ID (currently only 0 is supported)
        
    Returns:
    --------
    device : Device
        Device handle
    """
    return Device(device_id)


def get_device_count():
    """
    Get number of available vGPU devices
    
    Returns:
    --------
    count : int
        Number of devices (currently always 1)
    """
    return 1


def get_device_properties(device_id=0):
    """
    Get properties of a vGPU device
    
    Parameters:
    -----------
    device_id : int, default=0
        Device ID
        
    Returns:
    --------
    properties : dict
        Device properties
    """
    return {
        'device_id': device_id,
        'name': f'vgpu{device_id}',
        'compute_capability': '1.0',
        'total_memory': None,  # Will be implemented in PR-05
        'multiprocessor_count': 1,
        'version': __version__,
    }


# Module-level API
__all__ = [
    'matmul',
    'Device',
    'get_device',
    'get_device_count',
    'get_device_properties',
    '__version__',
]
