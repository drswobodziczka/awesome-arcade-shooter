# Sandbox and Git Operations - Configuration Guide

**Date:** 2025-12-11
**Context:** Issue #80 - Investigating why git branch creation fails in sandboxed mode

## Problem

Git branch creation (`git branch feature/name`) failed with:
```
fatal: cannot lock ref 'refs/heads/feature/name': Unable to create '.git/refs/heads/feature.lock': Operation not permitted
```

Despite having `"Bash(git:*)"` in allow permissions.

## Root Cause

Claude Code sandbox has **hardcoded filesystem rules** that block writes to `.git/`:

```json
"write": {
  "denyWithinAllow": [
    "./.git",
    "package-lock.json",
    "pnpm-lock.yaml",
    "./node_modules"
  ]
}
```

These are **OS-level enforced** and cannot be overridden in `settings.json`.

## Understanding `denyWithinAllow`

**Semantics:**
- `allowOnly` = directories where writes ARE permitted
- `denyWithinAllow` = **exceptions within allowed dirs** where writes are BLOCKED

Example: "Allow writes to current directory, BUT deny in `.git/`, `node_modules`, etc."

## Solution

Add git to `excludedCommands` in `.claude/settings.json`:

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["git"],  // Run git outside sandbox
    "allowUnsandboxedCommands": false
  }
}
```

## Security Model After Change

```
┌─────────────────────────────────────┐
│ Git commands (excluded from sandbox)│ ← Can write to .git/
├─────────────────────────────────────┤
│ Permissions: deny dangerous git ops │ ← git push --force = BLOCKED
├─────────────────────────────────────┤
│ Edit/Write tools (sandboxed)        │ ← denyWithinAllow = BLOCKED
├─────────────────────────────────────┤
│ Permissions: Edit(./.git/**) deny   │ ← Additional layer
└─────────────────────────────────────┘
```

### ✅ What WORKS:
- `git branch`, `git commit`, `git checkout` = run outside sandbox = can write to `.git/`
- Permissions rules still active: `deny: ["Bash(git push --force:*)"]` blocks dangerous operations

### ❌ What REMAINS BLOCKED:
- `Edit(./.git/**)` = denied by permissions
- `Write(/path/to/.git/...)` = blocked by sandbox denyWithinAllow
- Other bash commands (e.g., `echo foo > .git/refs/heads/bar`) = blocked by sandbox

## Key Insights

1. **`denyWithinAllow` is hardcoded** - cannot be overridden in project settings
2. **Git needs `.git/` access** - must run outside sandbox
3. **Permissions layer still protects** - dangerous git ops remain blocked
4. **This is documented behavior** - git operations should be excluded from sandbox
5. **Session restart required** - `excludedCommands` changes need session reload

## References

- [Claude Code Sandboxing Documentation](https://code.claude.com/docs/en/sandboxing.md)
- [Claude Code Settings Documentation](https://code.claude.com/docs/en/settings.md)
- [Claude Code IAM and Permissions](https://code.claude.com/docs/en/iam.md)

## Follow-up

After session restart, verify:
1. `git branch feature/name` succeeds
2. `Edit(./.git/config)` still fails (permissions deny)
3. `echo foo > .git/test` still fails (sandbox blocks)
4. `git push --force` still fails (permissions deny)
