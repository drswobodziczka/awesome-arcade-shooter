#!/bin/bash
# ToolCall Hook - Pre-Commit and Pre-PR validation
# This hook executes before tool calls (specifically Bash tool)

# ToolCall hook receives:
# $1 = tool name (e.g., "Bash", "Write", "Edit")
# $2 = tool parameters (JSON)

TOOL_NAME="$1"
TOOL_PARAMS="$2"

# Only process Bash tool calls
if [ "$TOOL_NAME" != "Bash" ]; then
  exit 0
fi

# Extract command from JSON parameters
# Expected format: {"command": "git commit -m '...'", ...}
COMMAND=$(echo "$TOOL_PARAMS" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"command"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')

# ============================================================================
# PRE-COMMIT VALIDATION
# ============================================================================
if echo "$COMMAND" | grep -qE "git[[:space:]]+commit"; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🚨 PRE-COMMIT VALIDATION"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Running checks..."
  echo ""

  # Check if tests pass
  echo "  [1/2] Running tests..."
  if npm test > /dev/null 2>&1; then
    echo "        ✅ Tests passed"
  else
    echo "        ❌ Tests FAILED"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ COMMIT BLOCKED: Tests are failing!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Fix failing tests before committing."
    echo "Rule: testing_guidelines.md:193 - Never commit failing tests"
    echo ""
    echo "Run 'npm test' to see details."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    exit 1
  fi

  # Check if build passes
  echo "  [2/2] Running build..."
  if npm run build > /dev/null 2>&1; then
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
    echo "Run 'npm run build' to see details."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    exit 1
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ ALL CHECKS PASSED"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📋 FINAL CHECKLIST (coding_guidelines.md:100-103):"
  echo ""
  echo "  □ Code works?"
  echo "  □ Is tested?"
  echo "  □ Can I delete any code?"
  echo "  □ Will future me understand this?"
  echo ""
  echo "Proceeding with commit..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
fi

# ============================================================================
# PRE-PR VALIDATION
# ============================================================================
if echo "$COMMAND" | grep -qE "gh[[:space:]]+pr[[:space:]]+create"; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🎯 PR STRUCTURE REMINDER"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Your PR description MUST include (pull_request_guidelines.md):"
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

  # Check tests
  echo "  [1/4] Checking tests..."
  if npm test > /dev/null 2>&1; then
    echo "        ✅ Tests pass"
  else
    echo "        ❌ Tests FAIL - Fix before creating PR!"
    exit 1
  fi

  # Check build
  echo "  [2/4] Checking build..."
  if npm run build > /dev/null 2>&1; then
    echo "        ✅ Build successful"
  else
    echo "        ❌ Build FAILS - Fix before creating PR!"
    exit 1
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
fi

# Allow the tool call to continue
exit 0
