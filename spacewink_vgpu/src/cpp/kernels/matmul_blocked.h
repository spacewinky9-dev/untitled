#ifndef VGPU_KERNELS_MATMUL_BLOCKED_H
#define VGPU_KERNELS_MATMUL_BLOCKED_H

#include <cstddef>

namespace vgpu {
namespace kernels {

/**
 * Cache-aware blocked matrix multiplication (GEMM)
 * 
 * Implements a tiled/blocked algorithm that optimizes for cache hierarchy:
 * - Tiles sized to fit in L1, L2, L3 caches
 * - Minimizes cache misses and TLB pressure
 * - Enables effective vectorization
 * 
 * Complexity: O(M*N*K) with ~5-10x lower constant factor than naive
 * 
 * @param M Number of rows in A and C
 * @param N Number of columns in B and C
 * @param K Shared dimension (columns of A, rows of B)
 * @param A Input matrix A (M x K), row-major
 * @param B Input matrix B (K x N), row-major
 * @param C Output matrix C (M x N), row-major
 * @param MC Tile size for M dimension (rows of A in L2)
 * @param KC Tile size for K dimension (shared in L1)
 * @param NC Tile size for N dimension (cols of B in L3)
 */
void matmul_blocked(
    size_t M, size_t N, size_t K,
    const float* A, const float* B, float* C,
    size_t MC = 256, size_t KC = 128, size_t NC = 4096
);

/**
 * Get default tile sizes based on CPU cache hierarchy
 * 
 * @param MC Output: tile size for M dimension
 * @param KC Output: tile size for K dimension
 * @param NC Output: tile size for N dimension
 */
void get_default_tile_sizes(size_t& MC, size_t& KC, size_t& NC);

} // namespace kernels
} // namespace vgpu

#endif // VGPU_KERNELS_MATMUL_BLOCKED_H
