# test_threadpool.py - Test suite for work-stealing threadpool
# Part of Spacewink vGPU - PR-04

import pytest
import numpy as np
import time
from vgpu_runtime import ThreadPool, get_num_threads, get_numa_topology

def test_threadpool_creation():
    """Test thread pool creation with default and custom thread counts."""
    # Default (hardware concurrency)
    pool = ThreadPool()
    assert pool.num_threads() > 0
    
    # Custom thread count
    pool = ThreadPool(num_threads=4)
    assert pool.num_threads() == 4

def test_simple_task_submission():
    """Test submitting and executing simple tasks."""
    pool = ThreadPool(num_threads=2)
    
    result = [0]
    def task():
        result[0] = 42
    
    future = pool.submit(task)
    future.get()
    
    assert result[0] == 42

def test_multiple_tasks():
    """Test submitting multiple tasks concurrently."""
    pool = ThreadPool(num_threads=4)
    
    results = [0] * 10
    futures = []
    
    for i in range(10):
        def task(idx=i):
            results[idx] = idx * 2
        futures.append(pool.submit(task))
    
    # Wait for all
    for f in futures:
        f.get()
    
    expected = [i * 2 for i in range(10)]
    assert results == expected

def test_task_with_return_value():
    """Test tasks that return values."""
    pool = ThreadPool(num_threads=2)
    
    def compute(x):
        return x * x
    
    futures = [pool.submit(compute, i) for i in range(10)]
    results = [f.get() for f in futures]
    
    expected = [i * i for i in range(10)]
    assert results == expected

def test_load_balancing():
    """Test that work is distributed across threads."""
    num_threads = 4
    pool = ThreadPool(num_threads=num_threads)
    
    # Submit many tasks
    num_tasks = 100
    def task(x):
        time.sleep(0.001)  # Small delay
        return x
    
    start = time.time()
    futures = [pool.submit(task, i) for i in range(num_tasks)]
    results = [f.get() for f in futures]
    elapsed = time.time() - start
    
    # Should be faster than sequential
    # Sequential would take ~0.1s, parallel should be much less
    assert elapsed < 0.05  # Should finish in < 50ms with load balancing
    assert len(results) == num_tasks

def test_exception_handling():
    """Test that exceptions in tasks are properly propagated."""
    pool = ThreadPool(num_threads=2)
    
    def failing_task():
        raise ValueError("Task failed!")
    
    future = pool.submit(failing_task)
    
    with pytest.raises(ValueError, match="Task failed!"):
        future.get()

def test_wait_all():
    """Test wait_all() method."""
    pool = ThreadPool(num_threads=4)
    
    counter = [0]
    lock = __import__('threading').Lock()
    
    def increment():
        time.sleep(0.01)
        with lock:
            counter[0] += 1
    
    # Submit 20 tasks
    for _ in range(20):
        pool.submit(increment)
    
    # Wait for all
    pool.wait_all()
    
    assert counter[0] == 20

def test_nested_parallelism():
    """Test submitting tasks from within tasks."""
    pool = ThreadPool(num_threads=4)
    
    def outer_task(x):
        def inner_task(y):
            return y * 2
        
        future = pool.submit(inner_task, x)
        return future.get()
    
    futures = [pool.submit(outer_task, i) for i in range(10)]
    results = [f.get() for f in futures]
    
    expected = [i * 2 for i in range(10)]
    assert results == expected

@pytest.mark.slow
def test_parallel_matrix_multiply():
    """Test parallel matrix multiplication using threadpool."""
    try:
        from vgpu_runtime import matmul_blocked_parallel
        
        size = 500
        A = np.random.randn(size, size).astype(np.float32)
        B = np.random.randn(size, size).astype(np.float32)
        
        # Parallel
        start = time.time()
        C_parallel = matmul_blocked_parallel(A, B)
        parallel_time = time.time() - start
        
        # Reference
        C_ref = np.matmul(A, B)
        
        # Check correctness
        np.testing.assert_allclose(C_parallel, C_ref, rtol=1e-4, atol=1e-4)
        
        # Should be reasonably fast
        assert parallel_time < 2.0  # < 2 seconds for 500x500
        
    except ImportError:
        pytest.skip("matmul_blocked_parallel not yet implemented")

def test_scaling_efficiency():
    """Test parallel scaling efficiency."""
    def cpu_intensive_task(n):
        # Compute sum of squares
        result = 0
        for i in range(n):
            result += i * i
        return result
    
    n = 1000000
    num_tasks = 16
    
    # Single-threaded
    pool1 = ThreadPool(num_threads=1)
    start = time.time()
    futures = [pool1.submit(cpu_intensive_task, n) for _ in range(num_tasks)]
    [f.get() for f in futures]
    time_1thread = time.time() - start
    
    # Multi-threaded
    pool4 = ThreadPool(num_threads=4)
    start = time.time()
    futures = [pool4.submit(cpu_intensive_task, n) for _ in range(num_tasks)]
    [f.get() for f in futures]
    time_4threads = time.time() - start
    
    # Calculate speedup
    speedup = time_1thread / time_4threads
    
    # Should get at least 2.5x speedup with 4 threads (>60% efficiency)
    assert speedup > 2.5, f"Speedup only {speedup:.2f}x, expected >2.5x"

def test_numa_topology_detection():
    """Test NUMA topology detection."""
    topology = get_numa_topology()
    
    assert 'num_nodes' in topology
    assert 'num_cpus' in topology
    assert topology['num_nodes'] > 0
    assert topology['num_cpus'] > 0
    
    if 'nodes' in topology:
        for node in topology['nodes']:
            assert 'node_id' in node
            assert 'cpu_ids' in node
            assert len(node['cpu_ids']) > 0

def test_get_num_threads():
    """Test getting number of threads."""
    num = get_num_threads()
    assert num > 0
    assert isinstance(num, int)

def test_context_manager():
    """Test ThreadPool as context manager."""
    results = []
    
    with ThreadPool(num_threads=2) as pool:
        def task(x):
            results.append(x * 2)
        
        futures = [pool.submit(task, i) for i in range(5)]
        for f in futures:
            f.get()
    
    # Pool should be closed after context
    assert len(results) == 5

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
