#ifndef VGPU_MATMUL_BASIC_H
#define VGPU_MATMUL_BASIC_H

namespace vgpu {
namespace kernels {

/**
 * Basic matrix multiplication: C = A * B
 * 
 * Naive triple-loop implementation for correctness validation.
 * Not optimized - serves as baseline for future improvements.
 * 
 * @param A Input matrix A (M x K) in row-major order
 * @param B Input matrix B (K x N) in row-major order
 * @param C Output matrix C (M x N) in row-major order
 * @param M Number of rows in A and C
 * @param N Number of columns in B and C
 * @param K Number of columns in A / rows in B
 * 
 * Memory layout:
 *   A[i,k] is at A[i*K + k]
 *   B[k,j] is at B[k*N + j]
 *   C[i,j] is at C[i*N + j]
 * 
 * Complexity: O(M*N*K)
 * Memory: O(1) auxiliary space
 */
void matmul_basic_float32(
    const float* A,
    const float* B,
    float* C,
    int M,
    int N,
    int K
);

/**
 * Matrix multiplication with explicit leading dimensions
 * Allows for strided access patterns
 * 
 * @param A Input matrix A
 * @param lda Leading dimension of A (stride between rows)
 * @param B Input matrix B
 * @param ldb Leading dimension of B
 * @param C Output matrix C
 * @param ldc Leading dimension of C
 * @param M, N, K Matrix dimensions
 */
void matmul_basic_strided_float32(
    const float* A, int lda,
    const float* B, int ldb,
    float* C, int ldc,
    int M, int N, int K
);

} // namespace kernels
} // namespace vgpu

#endif // VGPU_MATMUL_BASIC_H
