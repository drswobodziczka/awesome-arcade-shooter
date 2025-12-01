#!/bin/bash
# PrePR Hook - Validate tests, build, and PR structure before creating pull request
# This hook executes before Bash tool calls containing "gh pr create"

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

# Only process gh pr create commands
if ! echo "$COMMAND" | grep -qE "gh[[:space:]]+pr[[:space:]]+create"; then
  exit 0  # Not a PR creation command, allow execution
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

if ! command -v git &> /dev/null; then
  echo "❌ ERROR: git not found." >&2
  exit 2
fi

if ! git rev-parse --git-dir &> /dev/null; then
  echo "❌ ERROR: Not in a git repository." >&2
  exit 2
fi

# Verbose logging (to stderr for visibility)
echo "[HOOK] pre-pr.sh triggered" >&2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 PR STRUCTURE REMINDER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your PR description MUST include (see docs/agent/pull_request_guidelines.md):"
echo ""
echo "  ## BACKGROUND (optional if obvious)"
echo "  - What area of game/system?"
echo "  - Why this PR now?"
echo ""
echo "  ## WHAT & WHY?"
echo "  - What was done/changed? (high level)"
echo "  - Why was it needed? (bugfix, UX, performance, refactor)"
echo ""
echo "  ## HOW?"
echo "  - Main technical decisions?"
echo "  - Key modules/files?"
echo "  - Important trade-offs/limitations?"
echo ""
echo "  ## TESTING"
echo "  - Manual testing steps"
echo "  - Scenarios to verify"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Pre-PR Checklist:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check tests (with timeout and output capture)
echo "  [1/4] Checking tests..."
TEST_OUTPUT=$(timeout 300 npm test 2>&1) || TEST_EXIT=$?

if [ "${TEST_EXIT:-0}" -eq 0 ]; then
  echo "        ✅ Tests pass"
else
  echo "        ❌ Tests FAIL - Fix before creating PR!"
  echo ""
  echo "Output (last 50 lines):"
  echo "$TEST_OUTPUT" | tail -50
  echo ""
  exit 2  # Exit code 2 = blocking error
fi

# Check build (with timeout and output capture)
echo "  [2/4] Checking build..."
BUILD_OUTPUT=$(timeout 300 npm run build 2>&1) || BUILD_EXIT=$?

if [ "${BUILD_EXIT:-0}" -eq 0 ]; then
  echo "        ✅ Build successful"
else
  echo "        ❌ Build FAILS - Fix before creating PR!"
  echo ""
  echo "Output (last 50 lines):"
  echo "$BUILD_OUTPUT" | tail -50
  echo ""
  exit 2  # Exit code 2 = blocking error
fi

# Check branch name
echo "  [3/4] Checking branch name..."
BRANCH=$(git branch --show-current)
if echo "$BRANCH" | grep -qE "^(fix|feature|claude)/"; then
  echo "        ✅ Branch name: $BRANCH"
else
  echo "        ⚠️  Branch name should start with fix/ or feature/ or claude/"
  echo "        Current: $BRANCH"
fi

# Check for uncommitted changes
echo "  [4/4] Checking for uncommitted changes..."
if git diff --quiet && git diff --cached --quiet; then
  echo "        ✅ No uncommitted changes"
else
  echo "        ⚠️  You have uncommitted changes - commit them first"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Ready to create PR!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
