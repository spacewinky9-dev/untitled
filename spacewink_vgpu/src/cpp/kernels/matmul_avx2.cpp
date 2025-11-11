#include "matmul_avx2.h"

#ifdef __AVX2__
#include <immintrin.h>
#endif

namespace vgpu {
namespace kernels {

bool has_avx2() {
#ifdef __AVX2__
    // Runtime check via cpuid
    #if defined(__GNUC__) || defined(__clang__)
    unsigned int eax, ebx, ecx, edx;
    __asm__ __volatile__(
        "cpuid"
        : "=a"(eax), "=b"(ebx), "=c"(ecx), "=d"(edx)
        : "a"(7), "c"(0)
    );
    return (ebx & (1 << 5)) != 0;  // Check AVX2 bit
    #else
    return true;  // Assume available if compiled with -mavx2
    #endif
#else
    return false;
#endif
}

void matmul_avx2_block(
    size_t M, size_t N, size_t K,
    const float* A, const float* B, float* C,
    size_t lda, size_t ldb, size_t ldc
) {
#ifdef __AVX2__
    // AVX2 processes 8 floats at a time
    const size_t simd_width = 8;
    
    for (size_t i = 0; i < M; ++i) {
        for (size_t j = 0; j < N; j += simd_width) {
            // Handle remainder if N not multiple of 8
            size_t jb = (j + simd_width <= N) ? simd_width : N - j;
            
            if (jb == simd_width) {
                // Vectorized path
                __m256 c_vec = _mm256_loadu_ps(&C[i * ldc + j]);
                
                for (size_t k = 0; k < K; ++k) {
                    __m256 a_vec = _mm256_broadcast_ss(&A[i * lda + k]);
                    __m256 b_vec = _mm256_loadu_ps(&B[k * ldb + j]);
                    c_vec = _mm256_fmadd_ps(a_vec, b_vec, c_vec);
                }
                
                _mm256_storeu_ps(&C[i * ldc + j], c_vec);
            } else {
                // Scalar fallback for remainder
                for (size_t jj = 0; jj < jb; ++jj) {
                    float sum = C[i * ldc + (j + jj)];
                    for (size_t k = 0; k < K; ++k) {
                        sum += A[i * lda + k] * B[k * ldb + (j + jj)];
                    }
                    C[i * ldc + (j + jj)] = sum;
                }
            }
        }
    }
#else
    // Pure scalar fallback if AVX2 not available at compile time
    for (size_t i = 0; i < M; ++i) {
        for (size_t j = 0; j < N; ++j) {
            float sum = C[i * ldc + j];
            for (size_t k = 0; k < K; ++k) {
                sum += A[i * lda + k] * B[k * ldb + j];
            }
            C[i * ldc + j] = sum;
        }
    }
#endif
}

} // namespace kernels
} // namespace vgpu
