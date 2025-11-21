#!/bin/bash
# SessionStart Hook - Load project regulations
# This hook executes at the beginning of each Claude Code session

cat << 'EOF'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SESSION START - PROJECT REGULATIONS LOADED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Guidelines loaded into context:
  ✓ CLAUDE.md (Critical Rules)
  ✓ docs/agent/coding_guidelines.md
  ✓ docs/agent/testing_guidelines.md
  ✓ docs/agent/pull_request_guidelines.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  CRITICAL RULES - MUST FOLLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🔴 RULE #1: BE CONCISE
     → Action over explanation
     → Show code/commands, skip essays
     → Respect token budget

  🔴 RULE #2: FOLLOW CODING GUIDELINES
     → docs/agent/coding_guidelines.md
     → TypeScript strict mode, NO `any`
     → KISS, DRY, YAGNI, SOLID
     → Canvas performance rules

  🔴 RULE #3: FOLLOW TESTING GUIDELINES
     → docs/agent/testing_guidelines.md
     → AAA Pattern, co-located .test.ts files
     → Coverage: 75%+ core logic
     → Never commit failing tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 PROJECT INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Project:        Arcade Shooter Game
  Language:       TypeScript 5.9.3
  Renderer:       HTML5 Canvas
  Build Tool:     Vite 7.2.2
  Test Framework: Vitest 4.0.9
  Coverage Goal:  75%+ for core game logic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Ready to code! Remember: Think first, code second.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
