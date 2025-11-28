# Claude Code Hooks

Automatic enforcement of project regulations during development.

## Hooks

**`session-start.sh`**
Displays mandatory guidelines at session start (CLAUDE.md, coding/testing guidelines).

**`tool-call.sh`**
Blocks `git commit` and `gh pr create` if tests or build fail.

---

See comments in each script for implementation details.
