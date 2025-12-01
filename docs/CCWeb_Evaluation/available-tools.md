# Available Tools in Claude Code Web Environment

This document lists all development tools available in the Claude Code on the web VM environment.

## Tool Versions (as of 2025-12-01)

```
   _____ _                 _        _____           _
  / ____| |               | |      / ____|         | |
 | |    | | __ _ _   _  __| | ___  | |     ___   __| | ___
 | |    | |/ _` | | | |/ _` |/ _ \ | |    / _ \ / _` |/ _ \
 | |____| | (_| | |_| | (_| |  __/ | |___| (_) | (_| |  __/
  \_____|_|\__,_|\__,_|\__,_|\___|  \_____\___/ \__,_|\___|

      Development Environment Tool Versions
      =====================================

=================== Python ===================
✅ python3: Python 3.11.14
✅ python: Python 3.11.14
✅ pip: pip 24.0 from /usr/lib/python3/dist-packages/pip (python 3.11)
✅ poetry: Poetry (version 2.2.1)
✅ uv: uv 0.8.17
✅ black: black, 25.11.0 (compiled: yes)
✅ mypy: mypy 1.18.2 (compiled: yes)
✅ pytest: pytest 9.0.1
✅ ruff: ruff 0.14.6

=================== NodeJS ===================
✅ node: v22.21.1
✅ nvm: available
✅ npm: 10.9.4
✅ yarn: 1.22.22
✅ pnpm: 10.23.0
✅ eslint: v9.39.1
✅ prettier: 3.6.2
✅ chromedriver: ChromeDriver 142.0.7444.175

=================== Java ===================
✅ java: openjdk version "21.0.8" 2025-07-15
✅ maven: Apache Maven 3.9.11
✅ gradle: Gradle 8.14.3

=================== Go ===================
✅ go: go version go1.24.7 linux/amd64

=================== Rust ===================
✅ rustc: rustc 1.91.1 (ed61e7d7e 2025-11-07)
✅ cargo: cargo 1.91.1 (ea2d97820 2025-10-10)

=================== C/C++ Compilers ===================
✅ clang: Ubuntu clang version 18.1.3 (1ubuntu1)
✅ gcc: gcc (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0
✅ cmake: cmake version 3.28.3
✅ ninja: 1.11.1
✅ conan: Conan version 2.22.2

=================== Other Utilities ===================
✅ awk: mawk 1.3.4 20240123
✅ curl: curl 8.5.0 (x86_64-pc-linux-gnu)
✅ git: git version 2.43.0
✅ grep: grep (GNU grep) 3.11
✅ gzip: gzip 1.12
✅ jq: jq-1.7
✅ make: GNU Make 4.3
✅ rg: ripgrep 14.1.0
✅ sed: sed (GNU sed) 4.9
✅ tar: tar (GNU tar) 1.35
✅ tmux: tmux 3.4
✅ yq: yq 0.0.0
✅ vim: VIM - Vi IMproved 9.1 (2024 Jan 02)
✅ nano:  GNU nano, version 7.2

=================== Databases ===================
✅ psql: PostgreSQL client (version 16)
✅ redis-cli: Redis CLI (version 7.0.15)

✅ All tool validations passed
```

## Summary by Category

### Python Ecosystem
- Python 3.11.14
- Package managers: pip, poetry, uv
- Linting/formatting: black, mypy, ruff
- Testing: pytest

### JavaScript/TypeScript Ecosystem
- Node.js v22.21.1
- Package managers: npm, yarn, pnpm
- Version manager: nvm
- Linting/formatting: eslint, prettier
- Testing: chromedriver

### Compiled Languages
- **Java**: OpenJDK 21 (maven, gradle)
- **Go**: 1.24.7
- **Rust**: 1.91.1 (rustc, cargo)
- **C/C++**: clang 18, gcc 13, cmake, ninja, conan

### System Utilities
- Version control: git 2.43.0
- Text processing: awk, sed, grep, ripgrep
- Compression: gzip, tar
- JSON/YAML: jq, yq
- Terminal: tmux 3.4
- Editors: vim 9.1, nano 7.2

### Databases
- PostgreSQL 16 (client + server)
- Redis 7.0.15 (client + server)

## Notes

- All tools are pre-installed in the VM environment
- Databases (PostgreSQL, Redis) require manual startup
- Environment is based on Ubuntu 24.04
- All package managers and build tools are ready to use
