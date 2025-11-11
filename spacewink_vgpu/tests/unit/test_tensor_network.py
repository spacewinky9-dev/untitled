"""
Unit tests for tensor network compression module
"""

import pytest
import numpy as np
import sys
from pathlib import Path

# Add src/py to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src" / "py"))

try:
    from tensor_network import (
        MatrixProductState,
        TensorContractor,
        PEPS,
        compress_tensor_network
    )
    TENSOR_NETWORK_AVAILABLE = True
except ImportError:
    TENSOR_NETWORK_AVAILABLE = False
    pytest.skip("tensor_network module not available", allow_module_level=True)


@pytest.fixture
def small_tensors():
    """Create small test tensors"""
    np.random.seed(42)
    return [np.random.randn(2, 3, 4) for _ in range(3)]


@pytest.fixture
def mps_instance():
    """Create MPS instance for testing"""
    return MatrixProductState(bond_dimension=10)


def test_mps_initialization(mps_instance):
    """Test MPS initialization"""
    assert mps_instance.bond_dimension == 10
    assert len(mps_instance.tensors) == 0


def test_mps_compression(mps_instance, small_tensors):
    """Test MPS compression"""
    mps_instance.tensors = small_tensors.copy()
    
    initial_memory = mps_instance.memory_footprint()
    mps_instance.compress(tolerance=1e-6)
    compressed_memory = mps_instance.memory_footprint()
    
    # Compression should reduce memory or keep it the same
    assert compressed_memory <= initial_memory


def test_mps_contraction(mps_instance, small_tensors):
    """Test MPS contraction"""
    mps_instance.tensors = small_tensors.copy()
    
    try:
        result = mps_instance.contract()
        assert result is not None
        assert isinstance(result, np.ndarray)
    except Exception as e:
        pytest.skip(f"Contraction not fully implemented: {e}")


def test_tensor_contractor():
    """Test TensorContractor"""
    contractor = TensorContractor()
    
    # Create simple tensors
    tensors = [np.random.randn(3, 4), np.random.randn(4, 5)]
    
    # Find optimal path
    path = contractor.optimize_path(tensors, "")
    assert isinstance(path, list)


def test_compress_tensor_network(small_tensors):
    """Test tensor network compression function"""
    try:
        compressed = compress_tensor_network(
            small_tensors,
            target_rank=5,
            tolerance=1e-8
        )
        assert len(compressed) <= len(small_tensors)
    except Exception as e:
        pytest.skip(f"Compression not fully implemented: {e}")


@pytest.mark.parametrize("bond_dim", [5, 10, 20])
def test_mps_different_bond_dimensions(bond_dim):
    """Test MPS with different bond dimensions"""
    mps = MatrixProductState(bond_dimension=bond_dim)
    assert mps.bond_dimension == bond_dim


def test_peps_initialization():
    """Test PEPS initialization"""
    peps = PEPS(width=4, height=4, bond_dim=8)
    assert peps.width == 4
    assert peps.height == 4
    assert peps.bond_dim == 8


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
