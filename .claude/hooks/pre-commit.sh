#!/bin/bash
# PreCommit Hook - Validate tests and build before git commit
# This hook executes before Bash tool calls containing "git commit"

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Read JSON from stdin
INPUT=$(cat)

# Parse JSON with jq if available, fallback to regex
if command -v jq &> /dev/null; then
  COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
  CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
else
  # Fallback to regex (fragile with escaped quotes)
  COMMAND=$(echo "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/"command"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
  CWD=$(echo "$INPUT" | grep -o '"cwd"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/"cwd"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
fi

# Only process git commit commands
if ! echo "$COMMAND" | grep -qE "git[[:space:]]+commit"; then
  exit 0  # Not a commit command, allow execution
fi

# Change to repo root if cwd provided
if [ -n "$CWD" ]; then
  if ! cd "$CWD" 2>/dev/null; then
    echo "❌ ERROR: Failed to change directory to: $CWD" >&2
    exit 2
  fi
fi

# Prerequisite checks
if ! command -v npm &> /dev/null; then
  echo "❌ ERROR: npm not found. Install Node.js and npm." >&2
  exit 2
fi

if ! git rev-parse --git-dir &> /dev/null; then
  echo "❌ ERROR: Not in a git repository." >&2
  exit 2
fi

# Verbose logging (to stderr for visibility)
echo "[HOOK] pre-commit.sh triggered" >&2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚨 PRE-COMMIT VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Running checks..."
echo ""

# Check if tests pass (with timeout and output capture)
echo "  [1/2] Running tests..."
TEST_OUTPUT=$(timeout 300 npm test 2>&1) || TEST_EXIT=$?

if [ "${TEST_EXIT:-0}" -eq 0 ]; then
  echo "        ✅ Tests passed"
else
  echo "        ❌ Tests FAILED"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ COMMIT BLOCKED: Tests are failing!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Fix failing tests before committing."
  echo "Rule: See 'Red Flags' section in docs/agent/testing_guidelines.md"
  echo ""
  echo "Output (last 50 lines):"
  echo "$TEST_OUTPUT" | tail -50
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  exit 2  # Exit code 2 = blocking error
fi

# Check if build passes (with timeout and output capture)
echo "  [2/2] Running build..."
BUILD_OUTPUT=$(timeout 300 npm run build 2>&1) || BUILD_EXIT=$?

if [ "${BUILD_EXIT:-0}" -eq 0 ]; then
  echo "        ✅ Build successful"
else
  echo "        ❌ Build FAILED"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ COMMIT BLOCKED: Build is failing!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Fix build errors before committing."
  echo ""
  echo "Output (last 50 lines):"
  echo "$BUILD_OUTPUT" | tail -50
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  exit 2  # Exit code 2 = blocking error
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL CHECKS PASSED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 FINAL CHECKLIST (see 'Summary Checklist > Before committing' in docs/agent/coding_guidelines.md):"
echo ""
echo "  □ Code works?"
echo "  □ Is tested?"
echo "  □ Can I delete any code?"
echo "  □ Will future me understand this?"
echo ""
echo "Proceeding with commit..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
