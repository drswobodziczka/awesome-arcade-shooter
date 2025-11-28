# Claude Code Hooks - Project Regulation Enforcement

This directory contains Claude Code hooks that enforce project regulations and guidelines automatically.

## 🎯 Purpose

These hooks were created to ensure Claude Code agents consistently follow project guidelines defined in:
- `CLAUDE.md` - Critical rules for agent behavior
- `docs/agent/coding_guidelines.md` - TypeScript, Canvas, and SOLID principles
- `docs/agent/testing_guidelines.md` - Vitest testing standards
- `docs/agent/pull_request_guidelines.md` - PR structure requirements

## 📁 Hooks Overview

### `session-start.sh` ⭐ **CRITICAL**

**When:** Executes at the beginning of each Claude Code session

**Purpose:**
- Loads all project regulations into context
- Displays critical rules reminder
- Shows project tech stack info

**What it does:**
- Reminds agent to be concise (CLAUDE.md Rule #1)
- Enforces coding guidelines adherence (Rule #2)
- Enforces testing guidelines adherence (Rule #3)
- Displays project configuration (TypeScript, Vite, Vitest, Canvas)

---

### `tool-call.sh` ⭐ **CRITICAL**

**When:** Executes before tool calls (specifically before Bash tool execution)

**Purpose:** Enforce quality gates before commits and pull requests

**Why ToolCall, not UserPromptSubmit:**
- Agent autonomously calls `Bash` tool with `git commit` or `gh pr create`
- UserPromptSubmit only triggers on direct user prompts, not tool calls
- ToolCall hook intercepts actual tool execution, catching all commits/PRs

#### Pre-Commit Validation

**Triggers on:** Bash tool call containing `git commit` command

**Checks:**
1. **Tests pass** - Runs `npm test`
   - ❌ BLOCKS commit if tests fail
   - Rule: `testing_guidelines.md:193` - Never commit failing tests

2. **Build succeeds** - Runs `npm run build`
   - ❌ BLOCKS commit if build fails

3. **Final checklist** - Displays reminder from `coding_guidelines.md:100-103`:
   - Code works?
   - Is tested?
   - Can I delete any code?
   - Will future me understand this?

#### Pre-PR Validation

**Triggers on:** Bash tool call containing `gh pr create` command

**Checks:**
1. **Tests pass** - `npm test`
   - ❌ BLOCKS PR if tests fail

2. **Build succeeds** - `npm run build`
   - ❌ BLOCKS PR if build fails

3. **Branch name** - Should start with `fix/`, `feature/`, or `claude/`
   - ⚠️  Warning if non-standard

4. **Uncommitted changes** - Checks git status
   - ⚠️  Warning if uncommitted changes exist

5. **PR Structure Reminder** - Displays required sections:
   - `BACKGROUND` (optional)
   - `WHAT & WHY?` (required)
   - `HOW?` (required)
   - `TESTING` (required)

---

## 🔧 How Hooks Work

Claude Code hooks are shell scripts that execute at specific points:

1. **SessionStart** - Beginning of session
   - Script: `session-start.sh`
   - Output: Shown to agent in context

2. **ToolCall** - Before tool execution
   - Script: `tool-call.sh`
   - Input: Tool name and parameters (JSON)
   - Can block execution with `exit 1`

## ⚙️ Setup Requirements

**For pre-commit and pre-PR hooks to work, dependencies must be installed:**

```bash
npm run install:arcade-shooter
```

This installs Vitest and other dependencies required for running tests.

**Without installed dependencies:**
- Pre-commit hook will BLOCK commits (as designed)
- Pre-PR hook will BLOCK PR creation (as designed)
- Error message: "vitest: not found"

This is intentional behavior - commits/PRs should only happen when tests can run and pass.

## 🚀 Testing Hooks

### Test SessionStart Hook
```bash
./.claude/hooks/session-start.sh
```

### Test Pre-Commit Hook
```bash
./.claude/hooks/tool-call.sh "Bash" '{"command": "git commit -m \"test\""}'
```

### Test Pre-PR Hook
```bash
./.claude/hooks/tool-call.sh "Bash" '{"command": "gh pr create --title \"Test\""}'
```

## 📊 Regulation Groups

Hooks enforce regulations grouped by context:

| Group | Context | Hook | Priority |
|-------|---------|------|----------|
| **A** | Session Start | `session-start.sh` | ⭐⭐⭐ Critical |
| **E** | Pre-Commit | `tool-call.sh` | ⭐⭐⭐ Critical |
| **F** | Pre-PR | `tool-call.sh` | ⭐⭐ High |

### Future Enhancements (Not Yet Implemented)

| Group | Context | Proposed Hook | Priority |
|-------|---------|---------------|----------|
| **B** | Pre-Coding | Write/Edit tool hook | ⭐⭐ High |
| **C** | During Coding | Write/Edit tool hook | ⭐⭐ High |
| **D** | Pre-Test-Write | Write *.test.ts hook | ⭐ Nice to have |

## 🔒 Enforcement Levels

**BLOCK (exit 1):**
- Failing tests before commit
- Failing build before commit
- Failing tests before PR
- Failing build before PR

**WARN (exit 0):**
- Non-standard branch names
- Uncommitted changes before PR
- Missing PR structure sections (reminder only)

## 📚 References

- Claude Code Hooks Documentation: https://docs.claude.com/claude-code/hooks
- Project Guidelines: `/docs/agent/`
- Critical Rules: `/CLAUDE.md`

## 🛠️ Maintenance

When updating project regulations:

1. Update the source documents (`CLAUDE.md`, `docs/agent/*.md`)
2. Review hooks to ensure they reflect new rules
3. Test hooks with sample scenarios
4. Document changes in this README

---

**Created:** 2025-11-21
**Last Updated:** 2025-11-21
**Maintainer:** Project team
