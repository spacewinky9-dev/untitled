#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>
#include "../cpp/kernels/matmul_basic.h"

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

    m.attr("__version__") = "0.1.0";
}
