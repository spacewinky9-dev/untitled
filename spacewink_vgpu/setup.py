#!/usr/bin/env python3
"""
Setup script for Spacewink vGPU

Installs the Python package and optionally builds C++ extensions.
"""

import os
import sys
from pathlib import Path
from setuptools import setup, find_packages, Extension
from setuptools.command.build_ext import build_ext

# Read version from version file
VERSION = "1.0.0-dev"

# Read long description from README
readme_path = Path(__file__).parent / "README.md"
if readme_path.exists():
    with open(readme_path, "r", encoding="utf-8") as f:
        long_description = f.read()
else:
    long_description = "Spacewink vGPU - Virtual GPU Computing System"

# Read requirements
requirements_path = Path(__file__).parent / "requirements.txt"
install_requires = []
if requirements_path.exists():
    with open(requirements_path, "r") as f:
        install_requires = [line.strip() for line in f if line.strip() and not line.startswith("#")]
else:
    install_requires = [
        "numpy>=1.21.0",
        "scipy>=1.7.0",
    ]

# Optional dependencies
extras_require = {
    "dev": [
        "pytest>=6.2.0",
        "pytest-cov>=2.12.0",
        "black>=21.0",
        "flake8>=3.9.0",
        "pylint>=2.9.0",
    ],
    "full": [
        "pybind11>=2.9.0",
        "sympy>=1.9",
        "opt-einsum>=3.3.0",
    ],
    "ml": [
        "torch>=1.10.0",
        "tensorflow>=2.6.0",
    ],
}

class CMakeExtension(Extension):
    """Extension that uses CMake to build"""
    def __init__(self, name, sourcedir=''):
        Extension.__init__(self, name, sources=[])
        self.sourcedir = os.path.abspath(sourcedir)

class CMakeBuild(build_ext):
    """Build extension using CMake"""
    def build_extension(self, ext):
        if not isinstance(ext, CMakeExtension):
            return super().build_extension(ext)
        
        import subprocess
        import shutil
        
        # Check if cmake is available
        if shutil.which('cmake') is None:
            print("WARNING: CMake not found - C++ extensions will not be built")
            return
        
        extdir = os.path.abspath(os.path.dirname(self.get_ext_fullpath(ext.name)))
        
        cmake_args = [
            f'-DCMAKE_LIBRARY_OUTPUT_DIRECTORY={extdir}',
            f'-DPYTHON_EXECUTABLE={sys.executable}',
            f'-DCMAKE_BUILD_TYPE=Release',
        ]
        
        build_args = ['--config', 'Release']
        
        # Build directory
        if not os.path.exists(self.build_temp):
            os.makedirs(self.build_temp)
        
        # Run CMake configure
        subprocess.check_call(
            ['cmake', ext.sourcedir] + cmake_args,
            cwd=self.build_temp
        )
        
        # Run CMake build
        subprocess.check_call(
            ['cmake', '--build', '.'] + build_args,
            cwd=self.build_temp
        )

# Package setup
setup(
    name="spacewink-vgpu",
    version=VERSION,
    author="Spacewink Development Team",
    author_email="dev@spacewink.dev",
    description="Virtual GPU Computing System with Advanced Algorithms",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/spacewinky9-dev/untitled",
    project_urls={
        "Bug Tracker": "https://github.com/spacewinky9-dev/untitled/issues",
        "Documentation": "https://github.com/spacewinky9-dev/untitled/tree/main/spacewink_vgpu",
        "Source Code": "https://github.com/spacewinky9-dev/untitled",
    },
    packages=find_packages(where="src/py"),
    package_dir={"": "src/py"},
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "Topic :: Scientific/Engineering",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: C++",
        "Operating System :: POSIX :: Linux",
    ],
    python_requires=">=3.8",
    install_requires=install_requires,
    extras_require=extras_require,
    ext_modules=[CMakeExtension('_vgpu_kernels', sourcedir='.')],
    cmdclass={"build_ext": CMakeBuild},
    entry_points={
        "console_scripts": [
            "vgpu-cli=vgpu_runtime:main",  # Will be implemented in future PRs
        ],
    },
    include_package_data=True,
    zip_safe=False,
    keywords=[
        "gpu", "vgpu", "virtual-gpu", "high-performance-computing",
        "tensor-networks", "spectral-methods", "fast-multipole-method",
        "scientific-computing", "numerical-algorithms"
    ],
)
