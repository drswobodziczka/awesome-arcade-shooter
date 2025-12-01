#!/bin/bash
# PrePR Hook - Validate tests, build, and PR structure before creating pull request
# This hook executes before Bash tool calls containing "gh pr create"

# Read JSON from stdin
INPUT=$(cat)

# Extract command from tool_input.command
COMMAND=$(echo "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/"command"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')

# Extract cwd (repo root) from JSON
CWD=$(echo "$INPUT" | grep -o '"cwd"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/"cwd"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')

# Only process gh pr create commands
if ! echo "$COMMAND" | grep -qE "gh[[:space:]]+pr[[:space:]]+create"; then
  exit 0  # Not a PR creation command, allow execution
fi

# Change to repo root if cwd provided
if [ -n "$CWD" ]; then
  cd "$CWD" || exit 2
fi

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
  exit 2  # Exit code 2 = blocking error
fi

# Check build
echo "  [2/4] Checking build..."
if npm run build > /dev/null 2>&1; then
  echo "        ✅ Build successful"
else
  echo "        ❌ Build FAILS - Fix before creating PR!"
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
