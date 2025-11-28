#!/bin/bash
# PreCommit Hook - Validate tests and build before git commit
# This hook executes before Bash tool calls containing "git commit"

# Read JSON from stdin
INPUT=$(cat)

# Extract command from tool_input.command
COMMAND=$(echo "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/"command"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')

# Only process git commit commands
if ! echo "$COMMAND" | grep -qE "git[[:space:]]+commit"; then
  exit 0  # Not a commit command, allow execution
fi

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
  exit 2  # Exit code 2 = blocking error
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
  exit 2  # Exit code 2 = blocking error
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

exit 0
