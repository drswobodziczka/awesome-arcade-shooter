# Claude Code Hooks

Automatic enforcement of project regulations during development.

## Hooks

**`session-start.sh`**
Displays mandatory guidelines at session start (CLAUDE.md, coding/testing guidelines).

**`pre-commit.sh`**
Blocks `git commit` if tests or build fail.

**`pre-pr.sh`**
Blocks `gh pr create` if tests or build fail. Displays PR structure requirements.

---

See comments in each script for implementation details.
