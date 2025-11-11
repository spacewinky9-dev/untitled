#include "matmul_blocked.h"
#include "matmul_avx2.h"
#include <algorithm>
#include <cstring>

namespace vgpu {
namespace kernels {

void get_default_tile_sizes(size_t& MC, size_t& KC, size_t& NC) {
    // Default conservative tile sizes that work well on most CPUs
    // These should be overridden by autotuner for optimal performance
    MC = 256;  // Rows of A to keep in L2 (256 * 128 * 4 bytes = 128 KB)
    KC = 128;  // Shared dimension in L1 (128 * 128 * 4 bytes = 64 KB)
    NC = 4096; // Cols of B in L3 (128 * 4096 * 4 bytes = 2 MB)
}

void matmul_blocked(
    size_t M, size_t N, size_t K,
    const float* A, const float* B, float* C,
    size_t MC, size_t KC, size_t NC
) {
    // Initialize C to zero
    std::memset(C, 0, M * N * sizeof(float));
    
    // Three-level blocking for cache hierarchy
    // Outer loop: iterate over panels of B (NC columns at a time)
    for (size_t j = 0; j < N; j += NC) {
        size_t jb = std::min(NC, N - j);
        
        // Middle loop: iterate over panels of A and B in K dimension
        for (size_t p = 0; p < K; p += KC) {
            size_t pb = std::min(KC, K - p);
            
            // Inner loop: iterate over panels of A (MC rows at a time)
            for (size_t i = 0; i < M; i += MC) {
                size_t ib = std::min(MC, M - i);
                
                // Micro-kernel: compute C[i:i+ib, j:j+jb] += A[i:i+ib, p:p+pb] * B[p:p+pb, j:j+jb]
                // This block is small enough to fit in cache
                
                // Check if AVX2 is available and dimensions are suitable
                if (has_avx2() && ib >= 8 && jb >= 8 && pb >= 8) {
                    // Use AVX2 vectorized micro-kernel
                    matmul_avx2_block(
                        ib, jb, pb,
                        A + i * K + p,  // A block pointer
                        B + p * N + j,  // B block pointer
                        C + i * N + j,  // C block pointer
                        K, N, N         // strides
                    );
                } else {
                    // Fallback to scalar micro-kernel
                    for (size_t ii = 0; ii < ib; ++ii) {
                        for (size_t kk = 0; kk < pb; ++kk) {
                            float a_val = A[(i + ii) * K + (p + kk)];
                            for (size_t jj = 0; jj < jb; ++jj) {
                                C[(i + ii) * N + (j + jj)] += 
                                    a_val * B[(p + kk) * N + (j + jj)];
                            }
                        }
                    }
                }
            }
        }
    }
}

} // namespace kernels
} // namespace vgpu
