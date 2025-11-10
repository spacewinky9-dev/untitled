# vGPU Safety & Security Guidelines

**Project:** Spacewink vGPU  
**Version:** 1.0.0  
**Last Updated:** 2025-11-10

---

## Overview

This document defines mandatory safety and security rules for the Spacewink vGPU project. All developers, automated agents, and contributors MUST follow these guidelines without exception.

---

## 1. Privilege Escalation (CRITICAL)

### Rules

**NEVER:**
- Grant the agent/process root privileges automatically
- Modify system directories without operator approval
- Install packages with sudo from automation
- Modify `/etc/`, `/usr/`, `/opt/` without review
- Create systemd services without operator verification

**ALWAYS:**
- Generate scripts for privileged operations
- Let operator review scripts before execution
- Document why privileges are needed
- Provide rollback procedures
- Test in unprivileged mode first

### Example: Correct Approach

```bash
# Generate script for operator
cat > packaging/install.sh << 'EOF'
#!/bin/bash
# Installation script - requires sudo
# Review this script before running!

set -e

echo "Installing vGPU to /opt/vgpu..."
cp -r build/bin /opt/vgpu/bin
cp -r build/lib /opt/vgpu/lib

echo "Creating symlinks..."
ln -sf /opt/vgpu/bin/vgpu-cli /usr/local/bin/vgpu-cli

echo "Installing systemd service..."
cp packaging/systemd/vgpu.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable vgpu.service
systemctl start vgpu.service

echo "Installation complete!"
EOF

chmod +x packaging/install.sh

# Tell operator to review and run
echo "Operator: Please review packaging/install.sh and run with sudo"
```

---

## 2. Cryptography Safety (CRITICAL)

### Rules

**ONLY USE:**
- Synthetic, locally-generated test keys
- Well-known weak keys for testing (e.g., "password123")
- Self-created key material
- Public test vectors from standards documents

**NEVER:**
- Attempt to crack, factor, or break third-party keys
- Brute-force real cryptographic systems
- Attack external cryptographic services
- Use cryptography benchmarks on production systems
- Store or transmit real cryptographic keys

### Example: Correct Approach

```python
# Generate synthetic test keys
def generate_test_keypair():
    """Generate synthetic RSA keypair for testing ONLY"""
    # This is for LOCAL TESTING ONLY
    # DO NOT use in production
    # DO NOT attempt to break real keys
    
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization
    
    # Generate test key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048  # Standard test size
    )
    
    return private_key

# Benchmark encryption with TEST KEY
def benchmark_rsa():
    key = generate_test_keypair()
    # ... benchmark operations on OUR key only
    # This demonstrates performance, not security breaking
```

### Example: PROHIBITED

```python
# NEVER DO THIS
def crack_external_key(public_key_pem):
    """ILLEGAL AND UNETHICAL - DO NOT IMPLEMENT"""
    # This type of code is STRICTLY FORBIDDEN
    pass

# NEVER DO THIS
def connect_to_external_crypto_service():
    """PROHIBITED - No attacks on external systems"""
    pass
```

---

## 3. Network Safety

### Rules

**WITHOUT --allow-network FLAG:**
- No HTTP/HTTPS requests to external domains
- No socket connections to external hosts
- No DNS queries beyond local
- No package downloads from internet

**WITH --allow-network FLAG:**
- Only documented, approved external calls
- No attacks or unauthorized access attempts
- Log all external connections
- Timeout on all network operations

**ALWAYS:**
- Work with local data primarily
- Cache dependencies locally
- Use vendored libraries when possible
- Test network code with mocks

### Example: Correct Approach

```python
def fetch_data(url, allow_network=False):
    if not allow_network:
        raise PermissionError(
            "Network access not allowed. "
            "Use --allow-network flag if needed."
        )
    
    # Log the access
    log.info(f"Network request to {url} (authorized)")
    
    # Implement with timeout
    response = requests.get(url, timeout=10)
    return response.text
```

---

## 4. Change Auditing

### Rules

**BEFORE MODIFYING FILES:**
- Create `prechange_checksums.sha256` with hashes
- Document what will be changed and why
- Create backup copies if needed

**WHEN MAKING CHANGES:**
- Work only in designated branches (autogen/*)
- Never modify main branch directly
- Commit changes with descriptive messages
- Update changelog in status.md

**AFTER CHANGES:**
- Verify checksums of unchanged files
- Run tests to verify correctness
- Create artifacts showing changes
- Generate diffs for review

### Example: Correct Workflow

```bash
# Before making changes
find . -type f -exec sha256sum {} \; > prechange_checksums.sha256

# Make changes on feature branch
git checkout -b autogen/pr-01-ci

# ... make changes ...

# Verify we only changed what we intended
sha256sum -c prechange_checksums.sha256 2>&1 | grep FAILED

# Commit with good message
git add .
git commit -m "feat(ci): Add GitHub Actions workflow

- Implemented CI pipeline with build, test, lint jobs
- Added dependency checking
- Created automated test runner
- Artifacts: artifacts/pr-01/ci_config.yml

Closes: PR-01"

# Update changelog
echo "2025-11-10: PR-01 completed - CI pipeline added" >> status.md
```

---

## 5. Branch Isolation

### Rules

**PERMITTED BRANCHES:**
- `autogen/staging` - Main development branch
- `autogen/pr-XX-name` - Feature branches
- Local testing branches

**PROHIBITED:**
- Direct commits to `main`
- Direct commits to `master`
- Force pushes to protected branches
- Modifying other people's feature branches

**WORKFLOW:**
1. Branch from `autogen/staging`
2. Develop in feature branch
3. Test thoroughly
4. Create PR metadata
5. Request operator review
6. Operator merges to staging
7. Eventually staging → main (release)

---

## 6. File System Safety

### Rules

**ALLOWED LOCATIONS:**
- Repository working directory
- `/tmp/` for temporary files
- User home directory `~/.vgpu/` for config
- Build directories within repo

**PROHIBITED WITHOUT APPROVAL:**
- `/etc/` - System configuration
- `/usr/` - System binaries
- `/opt/` - Optional packages (needs operator approval)
- `/var/` - Variable data
- `/root/` - Root home directory
- Other users' home directories

### Example: Safe Temporary Files

```python
import tempfile
import os

# Use /tmp for temporary files
with tempfile.TemporaryDirectory(prefix='vgpu_') as tmpdir:
    temp_file = os.path.join(tmpdir, 'data.bin')
    # ... work with temp_file ...
    # Automatically cleaned up
```

---

## 7. Data Handling

### Rules

**NEVER:**
- Exfiltrate source code to external services
- Send sensitive data to third parties
- Log passwords or keys
- Store credentials in source code
- Commit secrets to git

**ALWAYS:**
- Use environment variables for secrets
- Redact sensitive info in logs
- Sanitize user inputs
- Validate file paths
- Check file sizes before operations

### Example: Safe Data Handling

```python
import os
from pathlib import Path

def safe_read_file(filepath):
    """Safely read a file with validation"""
    
    # Validate path is within allowed directory
    filepath = Path(filepath).resolve()
    allowed_dir = Path('/home/runner/work/untitled/untitled/spacewink_vgpu').resolve()
    
    if allowed_dir not in filepath.parents and filepath != allowed_dir:
        raise ValueError(f"Path {filepath} outside allowed directory")
    
    # Check file size
    if filepath.stat().st_size > 100 * 1024 * 1024:  # 100 MB
        raise ValueError(f"File too large: {filepath}")
    
    # Safe to read
    with open(filepath, 'r') as f:
        return f.read()
```

---

## 8. Testing Safety

### Rules

**TEST DATA:**
- Use synthetic datasets only
- Generate data programmatically
- Use small datasets for unit tests
- Use well-known test vectors

**TEST EXECUTION:**
- Isolate tests from production
- Use mocks for external services
- Clean up test artifacts
- Time-limit test execution

**STRESS TESTING:**
- Limit resource usage
- Monitor system resources
- Provide kill switches
- Run in controlled environments

### Example: Safe Test Data

```python
import numpy as np

def generate_test_data(size=1000):
    """Generate synthetic test data"""
    np.random.seed(42)  # Reproducible
    return np.random.randn(size, size).astype(np.float32)

def test_matmul():
    """Test with synthetic data"""
    A = generate_test_data(100)
    B = generate_test_data(100)
    
    result = vgpu.matmul(A, B)
    expected = A @ B
    
    np.testing.assert_allclose(result, expected, rtol=1e-6)
```

---

## 9. Error Handling

### Rules

**ON ERRORS:**
- Log error details
- Clean up partial changes
- Don't continue blindly
- Ask operator for guidance

**DON'T:**
- Suppress errors silently
- Retry indefinitely
- Modify more things trying to fix
- Escalate privileges to "fix" errors

### Example: Safe Error Handling

```python
def safe_operation():
    checkpoint = create_checkpoint()
    
    try:
        # Attempt operation
        risky_function()
    except Exception as e:
        # Log error
        log.error(f"Operation failed: {e}")
        
        # Rollback changes
        restore_checkpoint(checkpoint)
        
        # Report to operator
        report_error_to_operator(
            error=e,
            checkpoint=checkpoint,
            suggested_action="Review error log and retry manually"
        )
        
        # Don't continue
        raise
```

---

## 10. Reproducibility

### Rules

**ENSURE:**
- Deterministic execution with seeds
- Environment capture
- Input/output hashing
- Version pinning

**PROVIDE:**
- Reproducibility bundles
- Environment snapshots
- Exact dependency versions
- Build instructions

### Example: Reproducible Test

```python
def reproducible_benchmark():
    """Benchmark that produces consistent results"""
    
    # Set seeds
    np.random.seed(12345)
    random.seed(12345)
    
    # Capture environment
    env = {
        'cpu': platform.processor(),
        'cores': os.cpu_count(),
        'python': sys.version,
        'numpy': np.__version__,
    }
    
    # Run benchmark
    start = time.time()
    result = compute_function()
    elapsed = time.time() - start
    
    # Hash result
    result_hash = hashlib.sha256(result.tobytes()).hexdigest()
    
    # Create bundle
    bundle = {
        'timestamp': datetime.now().isoformat(),
        'environment': env,
        'elapsed_sec': elapsed,
        'result_sha256': result_hash,
    }
    
    return bundle
```

---

## 11. Incident Response

### If Safety Violation Detected

1. **STOP** - Halt all operations immediately
2. **ASSESS** - Determine scope and impact
3. **CONTAIN** - Prevent further violation
4. **REPORT** - Notify operator with details
5. **REMEDIATE** - Fix issue with operator approval
6. **DOCUMENT** - Record incident for review

### Example: Incident Report

```json
{
  "incident_id": "2025-11-10-001",
  "timestamp": "2025-11-10T10:52:00Z",
  "severity": "MEDIUM",
  "type": "privilege_escalation_attempt",
  "description": "Code attempted to write to /etc/ without approval",
  "action_taken": "Operation blocked, no changes made",
  "files_affected": [],
  "operator_action_required": "Review code in src/installer.py line 42",
  "remediation": "Modified code to generate install.sh for operator review"
}
```

---

## 12. Compliance Checklist

Before each PR merge, verify:

- [ ] No privilege escalation code
- [ ] Cryptography uses synthetic keys only
- [ ] No unauthorized network access
- [ ] All changes audited in git
- [ ] Work in approved branches only
- [ ] No modifications to protected directories
- [ ] No secrets in code or logs
- [ ] Tests use synthetic data
- [ ] Errors handled safely
- [ ] Reproducibility artifacts created

---

## 13. Operator Responsibilities

### Operator Must

1. **Review** all generated scripts before running with sudo
2. **Verify** changes match PR description
3. **Test** in safe environment before production
4. **Approve** merges explicitly
5. **Monitor** for safety violations

### Operator Should Not

1. Run untrusted code with sudo
2. Skip review of privileged operations
3. Ignore safety warnings
4. Merge without testing
5. Disable safety checks

---

## 14. Contact

For safety concerns or violations:

- Create issue in repository
- Email: security@spacewink.dev (if applicable)
- Halt automation until resolved

---

**This document is MANDATORY. Non-compliance is not acceptable.**

**Document History**
- 2025-11-10: Initial safety guidelines created
