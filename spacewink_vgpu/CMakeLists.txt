cmake_minimum_required(VERSION 3.18)
project(spacewink_vgpu VERSION 1.0.0 LANGUAGES CXX)

# C++ Standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Build type
if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

# Compiler flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -O3 -march=native -fopenmp")
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g -O0")

# Options
option(BUILD_TESTS "Build test suite" ON)
option(BUILD_PYTHON_BINDINGS "Build Python bindings with pybind11" ON)
option(USE_OPENMP "Enable OpenMP parallelization" ON)
option(USE_AVX2 "Enable AVX2 vectorization" ON)
option(USE_FFTW "Use FFTW for FFT operations" OFF)
option(USE_LIBURING "Use liburing for async I/O" OFF)

# Find required packages
find_package(Threads REQUIRED)

# OpenBLAS or MKL for linear algebra
find_package(BLAS)
if(BLAS_FOUND)
  message(STATUS "Found BLAS: ${BLAS_LIBRARIES}")
else()
  message(WARNING "BLAS not found - some features may be unavailable")
endif()

# Eigen for template-based linear algebra
find_package(Eigen3 3.3)
if(Eigen3_FOUND)
  message(STATUS "Found Eigen3: ${EIGEN3_INCLUDE_DIR}")
endif()

# OpenMP
if(USE_OPENMP)
  find_package(OpenMP)
  if(OpenMP_CXX_FOUND)
    message(STATUS "OpenMP enabled")
  else()
    message(WARNING "OpenMP not found - parallel features disabled")
    set(USE_OPENMP OFF)
  endif()
endif()

# FFTW (optional)
if(USE_FFTW)
  find_package(FFTW3)
  if(FFTW3_FOUND)
    message(STATUS "Found FFTW3")
  else()
    message(WARNING "FFTW3 not found - using fallback FFT")
  endif()
endif()

# Python and pybind11 for bindings
if(BUILD_PYTHON_BINDINGS)
  find_package(Python3 COMPONENTS Interpreter Development)
  if(Python3_FOUND)
    message(STATUS "Found Python: ${Python3_VERSION}")
    
    # Try to find pybind11
    find_package(pybind11 CONFIG QUIET)
    if(pybind11_FOUND)
      message(STATUS "Found pybind11: ${pybind11_VERSION}")
    else()
      message(WARNING "pybind11 not found - Python bindings will not be built")
      set(BUILD_PYTHON_BINDINGS OFF)
    endif()
  else()
    message(WARNING "Python3 not found - Python bindings will not be built")
    set(BUILD_PYTHON_BINDINGS OFF)
  endif()
endif()

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/src/cpp)
if(Eigen3_FOUND)
  include_directories(${EIGEN3_INCLUDE_DIR})
endif()

# Source files (will be populated as we implement)
set(VGPU_SOURCES
  # Placeholder - sources will be added in future PRs
)

# Create a header-only target for now
add_library(vgpu_headers INTERFACE)
target_include_directories(vgpu_headers INTERFACE 
  ${CMAKE_CURRENT_SOURCE_DIR}/src/cpp
)

# Python bindings (if enabled)
if(BUILD_PYTHON_BINDINGS AND pybind11_FOUND)
  # Python module placeholder
  # pybind11_add_module(vgpu_bindings src/bindings/vgpu_bind.cpp)
  # target_link_libraries(vgpu_bindings PRIVATE vgpu_core)
  message(STATUS "Python bindings will be added in PR-02")
endif()

# Tests
if(BUILD_TESTS)
  enable_testing()
  message(STATUS "Tests enabled - will be added in PR-01")
  
  # Placeholder for test subdirectory
  # add_subdirectory(tests/unit/cpp)
endif()

# Installation
install(DIRECTORY src/cpp/
  DESTINATION include/vgpu
  FILES_MATCHING PATTERN "*.h" PATTERN "*.hpp"
)

# Print configuration summary
message(STATUS "")
message(STATUS "=== vGPU Configuration Summary ===")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ compiler: ${CMAKE_CXX_COMPILER}")
message(STATUS "C++ flags: ${CMAKE_CXX_FLAGS}")
message(STATUS "OpenMP: ${USE_OPENMP}")
message(STATUS "AVX2: ${USE_AVX2}")
message(STATUS "BLAS: ${BLAS_FOUND}")
message(STATUS "Eigen3: ${Eigen3_FOUND}")
message(STATUS "FFTW: ${USE_FFTW}")
message(STATUS "Python bindings: ${BUILD_PYTHON_BINDINGS}")
message(STATUS "Tests: ${BUILD_TESTS}")
message(STATUS "==================================")
message(STATUS "")
