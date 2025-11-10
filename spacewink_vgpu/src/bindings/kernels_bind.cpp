#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>
#include "../cpp/kernels/matmul_basic.h"
#include "../cpp/kernels/matmul_blocked.h"
#include "../cpp/runtime/autotuner.h"

namespace py = pybind11;

// Python binding for matmul_basic
py::array_t<float> matmul_basic_py(
    py::array_t<float> A,
    py::array_t<float> B
) {
    // Get buffer info
    py::buffer_info buf_A = A.request();
    py::buffer_info buf_B = B.request();

    // Validate dimensions
    if (buf_A.ndim != 2) {
        throw std::runtime_error("A must be 2-dimensional");
    }
    if (buf_B.ndim != 2) {
        throw std::runtime_error("B must be 2-dimensional");
    }

    int M = buf_A.shape[0];
    int K = buf_A.shape[1];
    int K2 = buf_B.shape[0];
    int N = buf_B.shape[1];

    if (K != K2) {
        throw std::runtime_error("Matrix dimensions incompatible: A.shape[1] != B.shape[0]");
    }

    // Allocate output array
    py::array_t<float> C({M, N});
    py::buffer_info buf_C = C.request();

    // Get pointers
    float* ptr_A = static_cast<float*>(buf_A.ptr);
    float* ptr_B = static_cast<float*>(buf_B.ptr);
    float* ptr_C = static_cast<float*>(buf_C.ptr);

    // Call C++ kernel
    vgpu::kernels::matmul_basic_float32(ptr_A, ptr_B, ptr_C, M, N, K);

    return C;
}

// Python binding for strided matmul
py::array_t<float> matmul_basic_strided_py(
    py::array_t<float> A,
    py::array_t<float> B
) {
    py::buffer_info buf_A = A.request();
    py::buffer_info buf_B = B.request();

    if (buf_A.ndim != 2 || buf_B.ndim != 2) {
        throw std::runtime_error("Both matrices must be 2-dimensional");
    }

    int M = buf_A.shape[0];
    int K = buf_A.shape[1];
    int K2 = buf_B.shape[0];
    int N = buf_B.shape[1];

    if (K != K2) {
        throw std::runtime_error("Matrix dimensions incompatible");
    }

    // Get strides (in elements, not bytes)
    int lda = buf_A.strides[0] / sizeof(float);
    int ldb = buf_B.strides[0] / sizeof(float);

    // Allocate output
    py::array_t<float> C({M, N});
    py::buffer_info buf_C = C.request();
    int ldc = buf_C.strides[0] / sizeof(float);

    float* ptr_A = static_cast<float*>(buf_A.ptr);
    float* ptr_B = static_cast<float*>(buf_B.ptr);
    float* ptr_C = static_cast<float*>(buf_C.ptr);

    vgpu::kernels::matmul_basic_strided_float32(
        ptr_A, lda,
        ptr_B, ldb,
        ptr_C, ldc,
        M, N, K
    );

    return C;
}

// Python binding for blocked GEMM
py::array_t<float> matmul_blocked_py(
    py::array_t<float> A,
    py::array_t<float> B,
    size_t MC, size_t KC, size_t NC
) {
    py::buffer_info buf_A = A.request();
    py::buffer_info buf_B = B.request();

    if (buf_A.ndim != 2 || buf_B.ndim != 2) {
        throw std::runtime_error("Both matrices must be 2-dimensional");
    }

    size_t M = buf_A.shape[0];
    size_t K = buf_A.shape[1];
    size_t K2 = buf_B.shape[0];
    size_t N = buf_B.shape[1];

    if (K != K2) {
        throw std::runtime_error("Matrix dimensions incompatible");
    }

    // Allocate output
    py::array_t<float> C({static_cast<py::ssize_t>(M), static_cast<py::ssize_t>(N)});
    py::buffer_info buf_C = C.request();

    float* ptr_A = static_cast<float*>(buf_A.ptr);
    float* ptr_B = static_cast<float*>(buf_B.ptr);
    float* ptr_C = static_cast<float*>(buf_C.ptr);

    // Call blocked GEMM
    vgpu::kernels::matmul_blocked(M, N, K, ptr_A, ptr_B, ptr_C, MC, KC, NC);

    return C;
}

// Python binding for autotuner
py::dict tune_autotuner(bool force) {
    auto& tuner = vgpu::runtime::get_autotuner();
    auto config = tuner.tune(force);
    
    py::dict result;
    result["MC"] = config.MC;
    result["KC"] = config.KC;
    result["NC"] = config.NC;
    return result;
}

py::dict get_tuner_config() {
    auto& tuner = vgpu::runtime::get_autotuner();
    auto config = tuner.get_config();
    
    py::dict result;
    result["MC"] = config.MC;
    result["KC"] = config.KC;
    result["NC"] = config.NC;
    return result;
}

void reset_tuner_config() {
    auto& tuner = vgpu::runtime::get_autotuner();
    tuner.reset_config();
}

py::dict get_cache_sizes() {
    auto& tuner = vgpu::runtime::get_autotuner();
    size_t L1, L2, L3;
    tuner.get_cache_sizes(L1, L2, L3);
    
    py::dict result;
    result["L1"] = L1;
    result["L2"] = L2;
    result["L3"] = L3;
    return result;
}

PYBIND11_MODULE(_vgpu_kernels, m) {
    m.doc() = "vGPU native kernels - basic matrix operations";

    m.def("matmul_basic", &matmul_basic_py,
        py::arg("A"), py::arg("B"),
        "Basic matrix multiplication C = A @ B\n\n"
        "Parameters:\n"
        "  A: ndarray (M, K), float32\n"
        "  B: ndarray (K, N), float32\n"
        "Returns:\n"
        "  C: ndarray (M, N), float32\n"
    );

    m.def("matmul_basic_strided", &matmul_basic_strided_py,
        py::arg("A"), py::arg("B"),
        "Strided matrix multiplication (handles non-contiguous arrays)\n"
    );

    m.def("matmul_blocked", &matmul_blocked_py,
        py::arg("A"), py::arg("B"),
        py::arg("MC") = 256, py::arg("KC") = 128, py::arg("NC") = 4096,
        "Blocked/tiled matrix multiplication (cache-optimized)\n\n"
        "Parameters:\n"
        "  A: ndarray (M, K), float32\n"
        "  B: ndarray (K, N), float32\n"
        "  MC: Tile size for M dimension (default: 256)\n"
        "  KC: Tile size for K dimension (default: 128)\n"
        "  NC: Tile size for N dimension (default: 4096)\n"
        "Returns:\n"
        "  C: ndarray (M, N), float32\n"
    );

    m.def("tune", &tune_autotuner,
        py::arg("force") = false,
        "Run autotuner to find optimal tile sizes\n\n"
        "Parameters:\n"
        "  force: If True, rerun tuning even if cached config exists\n"
        "Returns:\n"
        "  dict with keys MC, KC, NC (tile sizes)\n"
    );

    m.def("get_tuner_config", &get_tuner_config,
        "Get current autotuner configuration\n\n"
        "Returns:\n"
        "  dict with keys MC, KC, NC\n"
    );

    m.def("reset_tuner_config", &reset_tuner_config,
        "Reset cached autotuner configuration\n"
    );

    m.def("get_cache_sizes", &get_cache_sizes,
        "Get CPU cache sizes detected by autotuner\n\n"
        "Returns:\n"
        "  dict with keys L1, L2, L3 (cache sizes in bytes)\n"
    );

    m.attr("__version__") = "0.2.0";
}
