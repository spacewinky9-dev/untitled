# Operator Instructions for Spacewink vGPU

**Version:** 1.0.0  
**Last Updated:** 2025-11-10

---

## Overview

This guide is for human operators overseeing the autonomous development of the Spacewink vGPU project. The agent will generate code, tests, and documentation, but certain actions require human review and approval.

---

## Quick Start for Operators

### 1. Review Project Status

```bash
# Check current status
cat spacewink_vgpu/status.md

# View JSON summary
cat spacewink_vgpu/status_summary.json

# Check what's been created
tree spacewink_vgpu/ -L 2
```

### 2. Review Safety Compliance

```bash
# Read safety guidelines
cat spacewink_vgpu/SAFETY.md

# Verify branch isolation
git branch

# Check no system files modified
git status
git diff HEAD
```

### 3. Current State (PR-00)

**Status:** Initial setup complete  
**Branch:** autogen/staging  
**Files Created:** 10 management documents  
**Next:** PR-01 (CI scaffolding)

---

## Your Responsibilities

### Review & Approve

**Before Each PR Merge:**

1. **Read PR Metadata**
   ```bash
   cat spacewink_vgpu/prs/pr-<NN>-*.md
   ```

2. **Check Test Results**
   ```bash
   cat spacewink_vgpu/artifacts/pr-<NN>/test_results.json
   cat spacewink_vgpu/artifacts/pr-<NN>/build_log.txt
   ```

3. **Review Code Changes**
   ```bash
   git diff autogen/staging..autogen/pr-<NN>-name
   ```

4. **Run Tests Locally** (optional but recommended)
   ```bash
   cd spacewink_vgpu
   pytest tests/unit/ -v
   ```

5. **Approve Merge** (if acceptable)
   ```bash
   git checkout autogen/staging
   git merge --no-ff autogen/pr-<NN>-name
   git push origin autogen/staging
   ```

### Privileged Operations

**NEVER run scripts with sudo without review!**

**Process:**

1. **Agent generates script** (e.g., `packaging/install.sh`)
2. **You review the script**
   ```bash
   cat packaging/install.sh
   ```
3. **Check what it modifies**
   - Does it modify `/etc/`?
   - Does it install services?
   - Does it modify system files?
4. **If acceptable, run with sudo**
   ```bash
   sudo bash packaging/install.sh
   ```
5. **Verify installation**
   ```bash
   vgpu-cli status
   vgpu-cli test-basic
   ```

### Security Checks

**After Each PR:**

- [ ] No privilege escalation in code
- [ ] Cryptography tests use synthetic keys only
- [ ] No unauthorized network access
- [ ] All changes in git history
- [ ] Tests pass
- [ ] Artifacts generated

---

## PR Review Checklist

Use this checklist for each PR:

### Documentation
- [ ] PR metadata file exists (`prs/pr-<NN>.md`)
- [ ] Changes documented in status.md
- [ ] Design note created (if applicable)
- [ ] README updated (if API changed)

### Code Quality
- [ ] Code follows style guidelines
- [ ] No obvious bugs
- [ ] Error handling present
- [ ] No hardcoded secrets

### Testing
- [ ] Unit tests added for new code
- [ ] Integration tests updated
- [ ] All tests pass
- [ ] Performance benchmarks run (if applicable)

### Safety
- [ ] No privileged operations without review
- [ ] No external network calls without approval
- [ ] Branch isolation maintained
- [ ] Reproducibility artifacts present

### Artifacts
- [ ] Build logs saved
- [ ] Test results saved
- [ ] Performance data saved
- [ ] Reproducibility bundle created (if applicable)

---

## Commands Reference

### Status & Monitoring

```bash
# Quick status check
cat spacewink_vgpu/status.md | head -50

# PR tracker
cat spacewink_vgpu/status.md | grep "PR-"

# View artifacts
ls -la spacewink_vgpu/artifacts/

# Check JSON status
jq . spacewink_vgpu/status_summary.json
```

### Git Operations

```bash
# List branches
git branch -a

# Show changes
git log --oneline --graph autogen/staging

# Compare branches
git diff autogen/staging..autogen/pr-01-ci

# Merge PR (after review)
git checkout autogen/staging
git merge --no-ff autogen/pr-01-ci -m "Merge PR-01: CI scaffolding"
git push origin autogen/staging
```

### Testing

```bash
# Run unit tests
cd spacewink_vgpu
pytest tests/unit/ -v

# Run integration tests
pytest tests/integration/ -v

# Run full validation
./scripts/run_full_validation.sh

# Check build
cmake --build build
```

### Cleanup

```bash
# Remove old artifacts
rm -rf spacewink_vgpu/artifacts/pr-old-*/

# Clean build
rm -rf spacewink_vgpu/build/
```

---

## Decision Tree

### Should I Approve This PR?

```
Does PR metadata exist and look complete?
├─ NO → Ask agent to complete documentation
└─ YES
    ↓
    Do all tests pass?
    ├─ NO → Ask agent to fix failing tests
    └─ YES
        ↓
        Does code follow safety guidelines?
        ├─ NO → Reject, ask for corrections
        └─ YES
            ↓
            Are artifacts present and complete?
            ├─ NO → Ask agent to generate artifacts
            └─ YES
                ↓
                Does it require privileged operations?
                ├─ YES → Review scripts carefully
                │        ├─ Script looks safe? → Approve
                │        └─ Script concerning? → Reject
                └─ NO → Approve and merge
```

---

## Common Scenarios

### Scenario 1: Agent Requests Privileged Operation

**Agent says:** "Need sudo to install systemd service"

**Your actions:**
1. Check what service it wants to install
2. Review the service file
3. Verify it's safe (no network access, no root shell, etc.)
4. If OK, create the service file manually or run provided script
5. Tell agent "Operation completed"

### Scenario 2: Tests Fail

**Agent says:** "Tests failing in PR-03"

**Your actions:**
1. Review test output in artifacts
2. Check if failure is expected (e.g., missing hardware feature)
3. If real bug: Ask agent to fix
4. If expected: Adjust test requirements or skip test

### Scenario 3: Performance Target Not Met

**Agent says:** "GEMM only achieves 400 GFLOPS, target was 500"

**Your actions:**
1. Check if hardware supports target
2. Review performance data
3. Decide: adjust target, try different algorithm, or accept as-is
4. Document decision in status.md

### Scenario 4: Want to Continue Work

**You need to resume after break**

**Your actions:**
1. Check status.md for current state
2. Use continuation prompt template from README.md
3. Fill in current values
4. Paste to agent with "continue" command

---

## Troubleshooting

### Agent Stuck or Confused

```bash
# Check what it's doing
cat spacewink_vgpu/status.md

# Check for errors
tail -100 spacewink_vgpu/artifacts/pr-*/build_log.txt

# Provide clear instruction
# Tell agent: "Start PR-XX from scratch" or "Fix issue in file Y"
```

### Build Failures

```bash
# Check dependencies
cmake --version
python3 --version
gcc --version

# Install missing deps
sudo apt-get install -y <missing-package>

# Clean build
rm -rf spacewink_vgpu/build
cd spacewink_vgpu && cmake -B build && cmake --build build
```

### Tests Won't Pass

```bash
# Run with verbose output
pytest tests/unit/test_failing.py -vv

# Check environment
python3 -c "import numpy; print(numpy.__version__)"

# Skip flaky test temporarily
pytest tests/unit/ -v -k "not test_flaky"
```

---

## Release Process

### When All PRs Complete

1. **Final Validation**
   ```bash
   ./scripts/run_full_validation.sh
   ```

2. **Review Release Notes**
   ```bash
   cat spacewink_vgpu/RELEASE_NOTES.md
   ```

3. **Create Release Tag**
   ```bash
   git checkout autogen/staging
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

4. **Merge to Main**
   ```bash
   git checkout main
   git merge --no-ff autogen/staging -m "Merge release 1.0.0"
   git push origin main
   ```

5. **Build Release Package**
   ```bash
   cd spacewink_vgpu/packaging
   ./build_release.sh v1.0.0
   ```

6. **Sign and Publish**
   ```bash
   gpg --detach-sign vgpu_frontier_v1.0.0.tar.gz
   # Upload to releases
   ```

---

## Safety Incidents

### If Agent Violates Safety Rules

1. **STOP** - Interrupt agent immediately
2. **ASSESS** - What rule was violated?
3. **ROLLBACK** - Use git to undo changes
   ```bash
   git checkout autogen/staging
   git reset --hard <last-good-commit>
   ```
4. **DOCUMENT** - Record incident
5. **CORRECT** - Give agent clear instructions
6. **VERIFY** - Check it won't happen again

---

## Communication with Agent

### Good Commands

✅ "Review PR-03 and tell me what changed"  
✅ "Fix the failing test in test_gemm.py"  
✅ "Continue with next PR"  
✅ "Create design note for FMM algorithm"  
✅ "Generate performance comparison chart"

### Unclear Commands

❌ "Make it faster" (too vague)  
❌ "Fix everything" (not specific)  
❌ "Do the needful" (unclear)

### Better Versions

✅ "Optimize GEMM kernel in matmul_blocked.cpp to meet 500 GFLOPS target"  
✅ "Fix compilation error in threadpool.cpp line 42"  
✅ "Increase test coverage for memory allocator to >85%"

---

## Getting Help

### Documentation

- README.md - Project overview
- roadmap.md - Development plan
- requirements.md - Technical specs
- prd.md - PR specifications
- SAFETY.md - Safety rules

### Support

- Check existing documentation first
- Review PR metadata and artifacts
- Look at git history for context
- Create issue if truly stuck

---

## Operator Checklist (Daily)

- [ ] Check status.md for updates
- [ ] Review any new PR metadata
- [ ] Check artifacts for completeness
- [ ] Verify no safety violations
- [ ] Approve/merge completed PRs
- [ ] Monitor system resources
- [ ] Backup important artifacts

---

**Remember:** You have final authority. If something seems wrong, stop and investigate. Safety first!

---

**Document History**
- 2025-11-10: Initial operator guide created
