#!/usr/bin/env python3
"""
Dependency checker for Spacewink vGPU

Validates that all required dependencies are available and reports versions.
"""

import sys
import subprocess
from pathlib import Path


def check_python_version():
    """Check Python version"""
    print("=== Python Version ===")
    version = sys.version_info
    print(f"Python {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        return False
    else:
        print("✅ Python version OK")
        return True


def check_python_package(package_name, import_name=None):
    """Check if a Python package is available"""
    if import_name is None:
        import_name = package_name
    
    try:
        module = __import__(import_name)
        version = getattr(module, '__version__', 'unknown')
        print(f"✅ {package_name}: {version}")
        return True
    except ImportError:
        print(f"❌ {package_name}: Not found")
        return False


def check_system_command(command, args=['--version']):
    """Check if a system command is available"""
    try:
        result = subprocess.run(
            [command] + args,
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            # Extract first line of output
            version_line = result.stdout.strip().split('\n')[0]
            print(f"✅ {command}: {version_line}")
            return True
        else:
            print(f"❌ {command}: Not working properly")
            return False
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print(f"❌ {command}: Not found")
        return False


def main():
    """Run all dependency checks"""
    print("=" * 60)
    print("Spacewink vGPU Dependency Checker")
    print("=" * 60)
    print()
    
    all_ok = True
    
    # Check Python
    all_ok &= check_python_version()
    print()
    
    # Check required Python packages
    print("=== Required Python Packages ===")
    all_ok &= check_python_package("numpy")
    all_ok &= check_python_package("scipy")
    print()
    
    # Check optional Python packages
    print("=== Optional Python Packages ===")
    check_python_package("pybind11")
    check_python_package("sympy")
    check_python_package("pytest")
    check_python_package("opt_einsum", "opt_einsum")
    print()
    
    # Check system tools
    print("=== Build Tools ===")
    all_ok &= check_system_command("cmake", ["--version"])
    all_ok &= check_system_command("g++", ["--version"])
    check_system_command("ninja", ["--version"])
    print()
    
    # Check libraries
    print("=== System Libraries ===")
    # These checks are informational
    check_system_command("pkg-config", ["--modversion", "openblas"])
    check_system_command("pkg-config", ["--modversion", "eigen3"])
    print()
    
    # Summary
    print("=" * 60)
    if all_ok:
        print("✅ All required dependencies are available!")
        print("You can proceed with building and testing.")
        return 0
    else:
        print("❌ Some required dependencies are missing.")
        print("Please install them before proceeding.")
        print()
        print("To install Python dependencies:")
        print("  pip install -r requirements.txt")
        print()
        print("To install system dependencies (Ubuntu/Debian):")
        print("  sudo apt-get install build-essential cmake libopenblas-dev libeigen3-dev python3-dev")
        return 1


if __name__ == "__main__":
    sys.exit(main())
