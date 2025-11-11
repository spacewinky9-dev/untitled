#ifndef VGPU_KERNELS_MATMUL_AVX2_H
#define VGPU_KERNELS_MATMUL_AVX2_H

#include <cstddef>

namespace vgpu {
namespace kernels {

/**
 * Check if CPU supports AVX2 instructions
 * 
 * @return true if AVX2 is available, false otherwise
 */
bool has_avx2();

/**
 * AVX2-accelerated micro-kernel for blocked matrix multiplication
 * 
 * Computes C += A * B for small blocks using SIMD instructions
 * Requires: M, N, K >= 8 for efficient vectorization
 * 
 * @param M Number of rows in A and C (block size)
 * @param N Number of columns in B and C (block size)
 * @param K Shared dimension (block size)
 * @param A Input matrix A (M x K), row-major
 * @param B Input matrix B (K x N), row-major
 * @param C Output matrix C (M x N), row-major (accumulates)
 * @param lda Leading dimension of A (stride)
 * @param ldb Leading dimension of B (stride)
 * @param ldc Leading dimension of C (stride)
 */
void matmul_avx2_block(
    size_t M, size_t N, size_t K,
    const float* A, const float* B, float* C,
    size_t lda, size_t ldb, size_t ldc
);

} // namespace kernels
} // namespace vgpu

#endif // VGPU_KERNELS_MATMUL_AVX2_H
