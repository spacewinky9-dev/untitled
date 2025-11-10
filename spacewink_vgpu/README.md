# Spacewink vGPU - Virtual GPU Computing System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Version](https://img.shields.io/badge/version-1.0.0--dev-orange)]()

**High-performance virtual GPU system for CPU-only Linux environments**

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Continuation Prompt Template](#continuation-prompt-template)
- [License](#license)

---

## Overview

Spacewink vGPU is a production-ready, software-based virtual GPU system that provides high-performance computing capabilities on standard Linux hardware without requiring physical GPU acceleration. It implements:

- **Native high-performance kernels** (C++17 with AVX2/AVX-512)
- **Multi-tiered memory management** (RAM → vVRAM → vSSD)
- **Advanced algorithms** (FMM, FFT, tensor contractions)
- **CUDA-like API compatibility** via `libvgpu.so`
- **Intelligent workload management** with auto-scaling
- **Production packaging** (systemd integration, health checks)

### What vGPU Is

- A CPU-based compute accelerator for ML, simulation, and scientific computing
- A development platform for GPU algorithms without GPU hardware
- A memory-efficient system for larger-than-RAM datasets
- A learning tool for understanding GPU concepts

### What vGPU Is NOT

- A replacement for physical GPUs (performance is lower)
- A hardware emulator or virtualization layer
- Suitable for real-time rendering or latency-critical applications

---

## Quick Start

### Installation (from package)

```bash
# Download latest release
wget https://github.com/spacewinky9-dev/vgpu/releases/download/v1.0.0/vgpu_frontier_1.0.0.deb

# Install (requires sudo)
sudo dpkg -i vgpu_frontier_1.0.0.deb

# Verify installation
vgpu-cli status
vgpu-cli test-basic
```

### First Program

```python
import vgpu_runtime as vgpu
import numpy as np

# Initialize device
device = vgpu.Device(0)

# Allocate arrays
A = np.random.randn(1024, 1024).astype(np.float32)
B = np.random.randn(1024, 1024).astype(np.float32)

# Compute on vGPU
C = device.matmul(A, B)

print(f"Result shape: {C.shape}")
print(f"Computation time: {device.last_kernel_time():.3f} ms")
```

### Run Tests

```bash
# Unit tests
pytest tests/unit/ -v

# Integration tests
pytest tests/integration/ -v

# Performance benchmarks
python scripts/run_benchmarks.py
```

---

## Features

### Core Algorithms

- **Matrix Operations**: Blocked GEMM with cache optimization, Strassen's algorithm
- **Fast Multipole Method (FMM)**: O(N) complexity for N-body problems
- **FFT Engine**: Multi-dimensional FFT with plan caching
- **Tensor Contractions**: Path-optimized einsum with streaming support

### Memory Management

- **Tiered Allocator**: RAM → tmpfs (vVRAM) → SSD (vSSD)
- **Automatic Spilling**: Transparent out-of-core computation
- **Zero-Copy Buffers**: Efficient data interchange
- **Memory Pooling**: Reduced allocation overhead

### Parallelism

- **Work-Stealing Threadpool**: Dynamic load balancing
- **NUMA Awareness**: Optimal memory placement
- **Task DAG**: Complex workflow orchestration
- **Async Execution**: Non-blocking operations

### Device API

```c
// C API (CUDA-like)
vgpuMalloc(void** ptr, size_t size);
vgpuMemcpy(void* dst, const void* src, size_t size, vgpuMemcpyKind kind);
vgpuLaunchKernel(vgpuKernel_t kernel, dim3 grid, dim3 block, void** args);
vgpuDeviceSynchronize();
```

```python
# Python API
device = vgpu.Device(0)
buffer = device.malloc(size)
device.memcpy(buffer, host_data)
kernel.launch(grid=(32, 32), block=(16, 16), args=[buffer])
device.synchronize()
```

### Workload Management

- **Job Classification**: Automatic workload detection
- **Policy Profiles**: Performance, Balanced, Memory Saver, Power Saver
- **Auto-Scaling**: Dynamic resource adjustment
- **Fault Tolerance**: Checkpointing for long computations

---

## System Requirements

### Minimum

- **OS**: Ubuntu 20.04+ or equivalent Linux
- **CPU**: 4 cores, 2.0 GHz (x86_64 with SSE4.2)
- **RAM**: 8 GB
- **Storage**: 20 GB

### Recommended

- **CPU**: 16+ cores, 3.0+ GHz (AVX2 support)
- **RAM**: 32 GB
- **Storage**: 100 GB SSD

### Optimal

- **CPU**: 32+ cores with NUMA, 3.5+ GHz (AVX-512)
- **RAM**: 64+ GB
- **Storage**: 500 GB NVMe SSD

### Dependencies

```bash
# Required
gcc >= 9.0
cmake >= 3.18
python >= 3.8
numpy >= 1.21.0
pybind11 >= 2.9.0
OpenBLAS or Intel MKL

# Optional
FFTW3 >= 3.3.8
liburing >= 2.0
perf, PAPI
PyTorch >= 1.10.0
```

See [requirements.md](requirements.md) for complete details.

---

## Installation

### From Source

```bash
# Clone repository
git clone https://github.com/spacewinky9-dev/untitled.git
cd untitled/spacewink_vgpu

# Install dependencies
sudo apt-get update
sudo apt-get install -y build-essential cmake python3-dev python3-pip
sudo apt-get install -y libopenblas-dev libfftw3-dev

# Install Python dependencies
pip3 install -r requirements.txt

# Build
mkdir build && cd build
cmake ..
make -j$(nproc)

# Install (requires sudo for system-wide)
sudo make install

# Or install locally
cmake -DCMAKE_INSTALL_PREFIX=$HOME/.local ..
make -j$(nproc) install
```

### From Package

See [Quick Start](#quick-start) above.

### Verify Installation

```bash
# Check version
vgpu-cli --version

# Run healthcheck
vgpu-cli healthcheck

# Test basic operations
vgpu-cli test-basic
```

---

## Usage

### Python API

```python
import vgpu_runtime as vgpu
import numpy as np

# Device management
device = vgpu.Device(0)
props = device.properties()
print(f"Device: {props.name}")
print(f"Cores: {props.multiProcessorCount}")
print(f"Memory: {props.totalGlobalMem / 1e9:.1f} GB")

# Memory operations
host_array = np.random.randn(1000, 1000).astype(np.float32)
device_buffer = device.malloc(host_array.nbytes)
device.memcpy_host_to_device(device_buffer, host_array)

# Computation
result = device.matmul(host_array, host_array.T)

# Synchronize
device.synchronize()

# Free memory
device.free(device_buffer)
```

### C++ API

```cpp
#include <vgpu/runtime.h>

int main() {
    vgpuInit();
    
    float *d_A, *d_B, *d_C;
    size_t size = 1024 * 1024 * sizeof(float);
    
    vgpuMalloc((void**)&d_A, size);
    vgpuMalloc((void**)&d_B, size);
    vgpuMalloc((void**)&d_C, size);
    
    // ... prepare data ...
    
    vgpuMemcpy(d_A, h_A, size, vgpuMemcpyHostToDevice);
    vgpuMemcpy(d_B, h_B, size, vgpuMemcpyHostToDevice);
    
    // Launch kernel
    dim3 grid(32, 32);
    dim3 block(16, 16);
    void* args[] = {&d_A, &d_B, &d_C, &N};
    vgpuLaunchKernel(matmul_kernel, grid, block, args);
    
    vgpuDeviceSynchronize();
    
    vgpuMemcpy(h_C, d_C, size, vgpuMemcpyDeviceToHost);
    
    vgpuFree(d_A);
    vgpuFree(d_B);
    vgpuFree(d_C);
    
    return 0;
}
```

### Policy Configuration

```python
# Set resource policy
device.set_policy(vgpu.Policy.PERFORMANCE)   # Max throughput
device.set_policy(vgpu.Policy.BALANCED)      # Balanced
device.set_policy(vgpu.Policy.MEMORY_SAVER)  # Minimize memory
device.set_policy(vgpu.Policy.POWER_SAVER)   # Minimize power
```

### Workload Classification

```python
# Manual classification
device.classify_workload(vgpu.WorkloadType.ML_TRAINING)

# Automatic classification (default)
device.classify_workload(vgpu.WorkloadType.AUTO)
```

---

## Development

### Project Structure

```
spacewink_vgpu/
├── src/
│   ├── py/                    # Python API and utilities
│   │   ├── vgpu_runtime.py    # Main runtime
│   │   └── tensor_ops.py      # Tensor operations
│   ├── cpp/                   # C++ implementation
│   │   ├── kernels/           # Compute kernels
│   │   │   ├── matmul_basic.cpp
│   │   │   ├── matmul_blocked.cpp
│   │   │   └── matmul_avx.cpp
│   │   ├── runtime/           # Runtime system
│   │   │   ├── threadpool.cpp
│   │   │   └── scheduler.cpp
│   │   └── engines/           # Algorithm engines
│   │       ├── fmm/           # Fast Multipole Method
│   │       └── fft/           # FFT engine
│   └── bindings/              # pybind11 bindings
├── tests/
│   ├── unit/                  # Unit tests
│   └── integration/           # Integration tests
├── artifacts/                 # Test artifacts
├── scripts/                   # Automation scripts
├── packaging/                 # Distribution packages
│   ├── deb/                   # Debian package
│   └── rpm/                   # RPM package
├── docs/                      # Documentation
│   └── design/                # Design notes
└── prs/                       # PR metadata
```

### Branching Policy

- **main**: Stable releases only
- **autogen/staging**: Development staging branch
- **autogen/pr-XX-name**: Feature branches for PRs

**Rules:**
1. All development happens in feature branches
2. PRs must be reviewed before merging
3. All tests must pass before merge
4. Operator approval required for staging → main

### Building

```bash
# Configure
cmake -B build -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build build -j$(nproc)

# Run tests
cd build && ctest -j$(nproc)

# Install locally
cmake --install build --prefix $HOME/.local
```

### Autotuning

First run will automatically tune for your hardware:

```bash
# Manual tuning
vgpu-tune --full

# Quick tune
vgpu-tune --quick

# View current config
cat ~/.vgpu_tuner.json
```

---

## Testing

### Unit Tests

```bash
# All unit tests
pytest tests/unit/ -v

# Specific module
pytest tests/unit/test_matmul.py -v

# With coverage
pytest tests/unit/ --cov=vgpu_runtime --cov-report=html
```

### Integration Tests

```bash
# All integration tests
pytest tests/integration/ -v

# Specific workflow
pytest tests/integration/test_ml_training.py -v
```

### Performance Tests

```bash
# Full benchmark suite
python scripts/run_benchmarks.py --full

# Quick smoke test
python scripts/run_benchmarks.py --quick

# Specific benchmark
python scripts/benchmark_gemm.py --sizes 1024,2048,4096
```

### Validation

```bash
# Complete validation suite
./scripts/run_full_validation.sh

# This runs:
# - Linting
# - Unit tests
# - Integration tests
# - Performance tests
# - Reproducibility tests
# - Security checks
```

---

## Documentation

### Available Documentation

- [roadmap.md](roadmap.md) - Development roadmap and milestones
- [requirements.md](requirements.md) - System and feature requirements
- [status.md](status.md) - Current project status
- [prd.md](prd.md) - Product requirements with PR breakdown
- [docs/design/](docs/design/) - Design notes for each PR

### Generating API Docs

```bash
# Python docs (Sphinx)
cd docs && make html

# C++ docs (Doxygen)
doxygen Doxyfile

# View docs
firefox docs/_build/html/index.html
```

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Before Contributing

1. Read the documentation
2. Check existing issues and PRs
3. Discuss major changes in an issue first

### Development Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run validation suite
6. Submit a pull request

### Code Style

- **C++**: Google C++ Style Guide (adapted)
- **Python**: PEP 8
- **Formatting**: Use `clang-format` and `black`

```bash
# Format C++ code
clang-format -i src/cpp/**/*.cpp src/cpp/**/*.h

# Format Python code
black src/py/ tests/
```

### Commit Messages

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

---

## Continuation Prompt Template

**For agents resuming work on this project, use this template:**

```
=== VGPU CONTINUATION PROMPT ===

CONTEXT:
Project: Spacewink vGPU - Virtual GPU Computing System
Repository: /home/runner/work/untitled/untitled/spacewink_vgpu
Purpose: Production-ready CPU-based virtual GPU with CUDA-like API

CURRENT STATE:
Branch: [INSERT: current branch name from `git branch --show-current`]
Last PR Completed: [INSERT: from status.md PR tracker]
Phase: [INSERT: from status.md global status]

ARTIFACTS AVAILABLE:
[INSERT: list from `ls artifacts/pr-*/`]

STATUS SUMMARY:
[INSERT: excerpt from status.md showing:
  - Current PR status (TODO/IN_PROGRESS/DONE)
  - Recent changes from changelog
  - Blockers if any
]

NEXT PR:
Number: [INSERT: next TODO PR from prd.md]
Title: [INSERT: PR title from prd.md]
Objective: [INSERT: PR objective from prd.md]

FILES TO MODIFY:
[INSERT: "Files/Modules Affected" from prd.md for next PR]

TESTS REQUIRED:
[INSERT: "Tests to Add" from prd.md for next PR]

ACCEPTANCE CRITERIA:
[INSERT: Acceptance criteria list from prd.md]

OPERATOR FLAGS:
--allow-network: [YES/NO]
--use-gpu-passthrough: [YES/NO]
--force-install: [YES/NO]
--privileged-ops: [YES/NO - requires manual sudo approval]

ENVIRONMENT:
CPU: [INSERT: from `lscpu | grep "Model name"`]
Cores: [INSERT: from `nproc`]
RAM: [INSERT: from `free -h | grep Mem`]
Kernel: [INSERT: from `uname -r`]
Disk: [INSERT: from `df -h /home`]

COMMAND TO RESUME:
Type: "continue"

BEHAVIOR ON "continue":
1. Load status.md and roadmap.md to understand current state
2. Pick next PR marked TODO from PR tracker
3. Create branch autogen/pr-<NN>-<short-name>
4. Create design note in docs/design/pr-<NN>.md
5. Implement changes following prd.md specifications
6. Run unit tests and integration tests
7. Produce artifacts in artifacts/pr-<NN>/
8. Update status.md with changelog entry
9. Create prs/pr-<NN>.md with PR metadata and set status REVIEW_READY
10. Generate review_summary.md for operator
11. Stop and wait for operator signoff to merge

SAFETY REMINDERS:
- Work only in autogen/* branches, never modify main directly
- Create prechange_checksums.sha256 before modifying existing files
- Never escalate privileges automatically (scripts for operator review)
- Use synthetic keys only for crypto tests
- All changes must be auditable with git history
- Keep artifacts and reproducibility bundles

FAILURE HANDLING:
- If tests fail: Debug, fix, re-run
- If performance targets not met: Try alternative algorithms, adjust expectations
- If blocked: Create issue for operator with current state and suggested actions
- If unsure: Stop and ask operator for guidance

DOCUMENTATION:
- README.md: This file (project overview, quickstart)
- roadmap.md: Development phases and milestones
- requirements.md: Technical requirements and targets
- status.md: Current state, PR tracker, changelog
- prd.md: Detailed PR specifications (PR-01 through PR-12)
- docs/design/: Per-PR design notes

TESTING COMMANDS:
- Unit: pytest tests/unit/ -v
- Integration: pytest tests/integration/ -v
- Build: cmake --build build -j$(nproc)
- Full validation: ./scripts/run_full_validation.sh

For detailed PR specifications, see prd.md
For current status, see status.md
For roadmap, see roadmap.md

=== END CONTINUATION PROMPT ===
```

### How to Use This Template

1. **Starting a session**: Fill in the bracketed fields with current values
2. **Type "continue"**: Agent loads state and proceeds with next PR
3. **Review work**: Check `prs/pr-<NN>.md` for what was done
4. **Approve merge**: Operator reviews and approves merge to staging
5. **Iterate**: Repeat for next PR

### Example Filled Template

```
=== VGPU CONTINUATION PROMPT ===

CONTEXT:
Project: Spacewink vGPU - Virtual GPU Computing System
Repository: /home/runner/work/untitled/untitled/spacewink_vgpu

CURRENT STATE:
Branch: autogen/staging
Last PR Completed: PR-00
Phase: Discovery

NEXT PR:
Number: PR-01
Title: Repo Audit & CI Scaffolding
Objective: Establish baseline repository state, implement CI/CD pipeline

[... etc ...]
```

---

## Operator Instructions

### Approving PRs

1. Review `prs/pr-<NN>.md` for PR description and test results
2. Check `artifacts/pr-<NN>/` for build logs and test outputs
3. Examine code changes with `git diff`
4. Run tests locally if desired
5. Approve merge if acceptable

```bash
# Review PR
cat prs/pr-01.md
ls artifacts/pr-01/

# Check changes
git diff autogen/staging..autogen/pr-01-ci

# Merge (if approved)
git checkout autogen/staging
git merge --no-ff autogen/pr-01-ci
git push origin autogen/staging
```

### Running Privileged Operations

Some operations require sudo. The agent will create scripts for you to review:

```bash
# Review generated script
cat packaging/install.sh

# If acceptable, run with sudo
sudo bash packaging/install.sh

# Check installation
vgpu-cli status
```

### Monitoring Progress

```bash
# Check status
cat status.md

# View changelog
tail -50 status.md

# List artifacts
find artifacts/ -type f

# Check test results
cat artifacts/pr-*/test_results.json
```

---

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

## Support

- **Issues**: https://github.com/spacewinky9-dev/untitled/issues
- **Documentation**: See docs/ directory
- **Email**: support@spacewink.dev (if applicable)

---

## Acknowledgments

- OpenBLAS project for linear algebra routines
- FFTW for FFT algorithms
- pybind11 for Python bindings
- The open-source community

---

**Project Status:** Development (v1.0.0-dev)  
**Last Updated:** 2025-11-10  
**Maintainer:** Spacewink Development Team
