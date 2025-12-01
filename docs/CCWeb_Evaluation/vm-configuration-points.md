# Claude Code Web VM - Configuration Points

This document describes the configuration structure in the Claude Code on the web VM environment.

## Home Directory Structure (`~/`)

```
drwx------ 1 claude ubuntu 4096 Dec  1 20:56 .
drwxr-xr-x 1 root   root   4096 Dec  1 20:52 ..
-rw-r--r-- 1 claude ubuntu 3403 Nov 21 17:38 .bashrc
drwxr-xr-x 3 claude ubuntu   26 Nov 21 17:38 .bun
drwxr-xr-x 7 claude ubuntu  121 Nov 21 17:37 .cache
drwxr-xr-x 3 claude ubuntu   37 Nov 21 17:30 .cargo
drwxr-xr-x 8 root   root   4096 Nov 28 10:27 .claude
-rw------- 1 root   root    961 Dec  1 20:56 .claude.json
-rw------- 1 root   root    961 Dec  1 20:56 .claude.json.backup
drwxr-xr-x 4 root   root   4096 Nov 28 10:30 .conan2
drwxr-xr-x 1 claude ubuntu 4096 Nov 28 10:30 .config
-rw-r--r-- 1 claude ubuntu  226 Nov 21 17:15 .gitconfig
drwxr-xr-x 1 claude ubuntu 4096 Nov 21 17:31 .gradle
drwx------ 3 claude ubuntu   40 Nov 21 17:27 .launchpadlib
drwxr-xr-x 5 claude ubuntu   74 Nov 21 17:33 .local
drwxr-xr-x 1 claude ubuntu 4096 Nov 21 17:37 .npm
-rw-r--r-- 1 claude ubuntu  187 Nov 21 17:30 .profile
drwxr-xr-x 6 claude ubuntu  115 Nov 21 17:30 .rustup
drwx------ 2 claude ubuntu    3 Nov 21 17:26 .ssh
-rw-r--r-- 1 claude ubuntu  209 Nov 21 17:31 .wget-hsts
-rw-r--r-- 1 claude ubuntu   26 Nov 21 17:30 .zshrc
```

### Key Directories

#### Runtime Language Environments
- `.bun/` - Bun JavaScript runtime
- `.cargo/` - Rust package manager cache
- `.rustup/` - Rust toolchain manager
- `.gradle/` - Gradle build cache
- `.npm/` - npm package cache
- `.conan2/` - Conan C++ package manager

#### Configuration & Cache
- `.config/` - Application configurations
- `.cache/` - General cache directory
- `.local/` - User-local data

#### Shell Configuration
- `.bashrc` - Bash shell configuration
- `.profile` - Login shell profile
- `.zshrc` - Zsh shell configuration

#### Version Control
- `.gitconfig` - Git global configuration
- `.ssh/` - SSH keys directory (empty in VM)

#### Claude Code Specific
- `.claude/` - Claude Code configuration directory (detailed below)
- `.claude.json` - Claude Code session metadata
- `.claude.json.backup` - Backup of session metadata

## Claude Code Directory (`~/.claude/`)

```
drwxr-xr-x 8 root   root   4096 Nov 28 10:27 .
drwx------ 1 claude ubuntu 4096 Dec  1 20:56 ..
drwx------ 3 root   root   4096 Nov 28 10:27 projects
drwxr-xr-x 9 root   root   4096 Dec  1 20:56 session-env
-rw------- 1 root   root    442 Nov 28 10:27 settings.json
drwxr-xr-x 2 root   root   4096 Dec  1 20:52 shell-snapshots
drwxr-xr-x 3 root   root   4096 Nov 28 10:27 skills
drwxr-xr-x 2 root   root   4096 Nov 28 10:27 statsig
-rwxr-xr-x 1 root   root   1754 Nov 28 10:27 stop-hook-git-check.sh
drwx------ 2 root   root   4096 Dec  1 20:52 todos
```

### Claude Code Directories

#### `projects/`
- Stores project-specific metadata
- Session history and context

#### `session-env/`
- Current session environment
- Temporary session data

#### `shell-snapshots/`
- Snapshots of bash command history
- Format: `snapshot-bash-{timestamp}-{id}.sh`

#### `skills/`
- Installed Skills (Claude Code extensions)
- User-created custom Skills

#### `statsig/`
- Feature flags and telemetry data
- A/B testing configuration

#### `todos/`
- TodoWrite task lists from sessions
- Format: `{uuid}-agent-{uuid}.json`

### Claude Code Files

#### `settings.json`
Global Claude Code settings (user-level configuration):
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/stop-hook-git-check.sh"
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": ["Skill"]
  }
}
```

#### `stop-hook-git-check.sh`
Custom hook script that runs on session stop:
- Checks for uncommitted changes
- Checks for untracked files
- Checks for unpushed commits
- Returns exit code 2 if any issues found

## Configuration Hierarchy

Claude Code reads configuration from multiple locations in this priority order:

1. **Enterprise managed policies** (if applicable)
2. **Command-line arguments**
3. **Project settings** (`.claude/settings.local.json` - not committed)
4. **Project settings** (`.claude/settings.json` - version controlled)
5. **User settings** (`~/.claude/settings.json` - global)
6. **Legacy file** (`~/.claude.json` - session metadata)

## Session Metadata (`.claude.json`)

```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "cachedStatsigGates": {
    "tengu_disable_bypass_permissions_mode": false,
    "tengu_tool_pear": false,
    "tengu_web_tasks": true
  },
  "firstStartTime": "2025-11-28T10:27:40.371Z",
  "userID": "857a43cedc8bcabf4941168fa0b2dff40035727e482d1a4eecee7175ca3dbab1",
  "sonnet45MigrationComplete": true,
  "projects": {
    "/home/user/awesome-arcade-shooter": {
      "allowedTools": [],
      "mcpContextUris": [],
      "mcpServers": {},
      "enabledMcpjsonServers": [],
      "disabledMcpjsonServers": [],
      "hasTrustDialogAccepted": false,
      "projectOnboardingSeenCount": 0,
      "hasClaudeMdExternalIncludesApproved": false,
      "hasClaudeMdExternalIncludesWarningShown": false,
      "exampleFiles": [
        "MainGameScene.ts",
        "main.ts",
        "enemies.ts",
        "rendering.ts",
        "spawning.ts"
      ],
      "exampleFilesGeneratedAt": 1764325662108
    }
  }
}
```

## Configuration Points Summary

### User-Level (Global)
- `~/.claude/settings.json` - Global Claude Code settings
- `~/.claude/commands/` - Personal slash commands (if created)
- `~/.claude/stop-hook-git-check.sh` - Custom hooks

### Project-Level (Version Controlled)
- `.claude/settings.json` - Project permissions, sandbox, hooks
- `.claude/commands/` - Project-specific slash commands
- `CLAUDE.md` - Project instructions (if exists)

### Project-Level (Local, Not Committed)
- `.claude/settings.local.json` - Personal overrides (if created)

### Session Runtime
- `~/.claude/session-env/` - Current session data
- `~/.claude/shell-snapshots/` - Command history
- `~/.claude/todos/` - Active task lists
- `~/.claude.json` - Session metadata

## Notes

- VM runs as user `claude` (uid 1000) but Claude Code operates as `root`
- SSH directory exists but is empty (no keys in VM)
- All language runtimes pre-configured with standard paths
- Database servers (PostgreSQL, Redis) not auto-started
