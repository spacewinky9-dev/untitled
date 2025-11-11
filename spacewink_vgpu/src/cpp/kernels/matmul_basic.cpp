#include "matmul_basic.h"
#include <cstring> // for memset

namespace vgpu {
namespace kernels {

void matmul_basic_float32(
    const float* A,
    const float* B,
    float* C,
    int M,
    int N,
    int K
) {
    // Input validation
    if (M <= 0 || N <= 0 || K <= 0) {
        return;
    }
    if (!A || !B || !C) {
        return;
    }

    // Initialize C to zero
    std::memset(C, 0, sizeof(float) * M * N);

    // Naive triple loop: C[i,j] = sum_k A[i,k] * B[k,j]
    for (int i = 0; i < M; ++i) {
        for (int j = 0; j < N; ++j) {
            float sum = 0.0f;
            for (int k = 0; k < K; ++k) {
                sum += A[i * K + k] * B[k * N + j];
            }
            C[i * N + j] = sum;
        }
    }
}

void matmul_basic_strided_float32(
    const float* A, int lda,
    const float* B, int ldb,
    float* C, int ldc,
    int M, int N, int K
) {
    // Input validation
    if (M <= 0 || N <= 0 || K <= 0) {
        return;
    }
    if (!A || !B || !C) {
        return;
    }
    if (lda < K || ldb < N || ldc < N) {
        return;
    }

    // Initialize C to zero
    for (int i = 0; i < M; ++i) {
        std::memset(C + i * ldc, 0, sizeof(float) * N);
    }

    // Triple loop with custom strides
    for (int i = 0; i < M; ++i) {
        for (int j = 0; j < N; ++j) {
            float sum = 0.0f;
            for (int k = 0; k < K; ++k) {
                sum += A[i * lda + k] * B[k * ldb + j];
            }
            C[i * ldc + j] = sum;
        }
    }
}

} // namespace kernels
} // namespace vgpu
