#!/bin/bash
# Enforce Project Guidelines Hook - SessionStart event
# Displays mandatory project regulations at the beginning of each session

cat << 'EOF'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SESSION START - MUST READ PROJECT REGULATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 MANDATORY: Read these guidelines files before coding:
  → CLAUDE.md
  → docs/agent/coding_guidelines.md
  → docs/agent/testing_guidelines.md
  → docs/agent/pull_request_guidelines.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  CRITICAL RULES - MUST FOLLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🔴 RULE #1: BE CONCISE
     Source: CLAUDE.md
     → Action over explanation
     → Show code/commands, skip essays
     → Respect token budget

  🔴 RULE #2: FOLLOW CODING GUIDELINES
     Source: docs/agent/coding_guidelines.md
     → READ THE FILE for all rules

  🔴 RULE #3: FOLLOW TESTING GUIDELINES
     Source: docs/agent/testing_guidelines.md
     → READ THE FILE for all rules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 PROJECT INFO - Check these files for up-to-date details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  → package.json (dependencies, scripts)
  → PoCs/arcade-shooter/package.json (project-specific config)
  → README.md (project overview)
  → CLAUDE.md (development principles)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Ready to code! Remember: Read guidelines first, then code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
