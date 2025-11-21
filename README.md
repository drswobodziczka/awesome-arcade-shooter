# Awesome Arcade Shooter

Classic arcade-style shooter game built with modern web technologies.

## Development

**Principles:**
- Start simple, iterate
- Test early and often
- Keep code modular

## Code Review with Claude

This project uses [Claude Code GitHub Action](https://github.com/anthropics/claude-code-action) for automated code reviews.

### Automated PR Reviews

Two workflows are configured:

**1. Automatic Review** (`.github/workflows/claude-code-review.yml`)
- Triggers: PR opened/synchronized
- Reviews code quality, bugs, performance, security, test coverage
- Posts feedback as PR comments

**2. On-Demand Assistant** (`.github/workflows/claude.yml`)
- Triggers: `@claude` mentions in issues/PRs
- Interactive help with questions, fixes, implementations
- Responds to specific requests

### Local Code Reviews (MCP)

You can also review code locally during Claude Code sessions:

**Setup:**
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

**Authenticate:**
```bash
claude
```
Then run `/mcp` → Authenticate → follow browser login

**Usage:**
```
> review PR #123
> check this issue for security problems
> show my assigned PRs
```

Reviews happen in your terminal - no commits/pushes.

---

## Key Findings: Claude Code + GitHub Integration

### Authentication Methods (2025)

**OAuth Token (Recommended):**
- ✅ Uses Claude Code Pro/Max subscription
- ✅ No additional API costs
- Setup: `/install-github-app` in Claude Code CLI
- Secret: `CLAUDE_CODE_OAUTH_TOKEN`

**API Key (Legacy):**
- Requires console.anthropic.com API key
- Pay-as-you-go pricing
- Secret: `ANTHROPIC_API_KEY`

### Features

From [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action):
- **Intelligent activation** - @claude mentions, issue assignments
- **Code review** - Analyzes PRs and suggests improvements
- **Implementation** - Fixes, refactoring, features
- **Progress tracking** - Visual checkboxes in comments
- **Multi-cloud** - Anthropic API, AWS Bedrock, Google Vertex AI

4.1k⭐ | MIT License | TypeScript
Collection of arcade game projects.

## Projects

### Arcade Plane Shooter
Classic 2D plane shooter game in `PoCs/arcade-shooter/`

[📖 Documentation](./PoCs/arcade-shooter/README.md) | [🎮 Play Online](https://drswobodziczka.github.io/awesome-arcade-shooter/)

## Development

### Running a project

From root directory:
```bash
npm run dev                    # Run arcade-shooter (default)
npm run arcade-shooter:dev     # Run arcade-shooter explicitly
```

From project directory:
```bash
cd PoCs/arcade-shooter
npm install
npm run dev
```

### Building for production

From root:
```bash
npm run build                  # Build arcade-shooter
npm run arcade-shooter:build   # Build arcade-shooter explicitly
```

From project:
```bash
cd PoCs/arcade-shooter
npm run build
```

### Running tests

From root:
```bash
npm test                       # Test arcade-shooter
npm run arcade-shooter:test    # Test arcade-shooter explicitly
```

From project:
```bash
cd PoCs/arcade-shooter
npm test
```

## Repository Structure

```
awesome-arcade-shooter/
├── PoCs/
│   └── arcade-shooter/       # Classic plane shooter game
│       ├── src/
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── .github/
│   └── workflows/
│       ├── build-and-test.yml    # CI for all projects
│       └── deploy-pages.yml       # Deploy to GitHub Pages
└── package.json              # Root scripts for all projects
```

## Adding New Projects

1. Create project directory in `PoCs/`
2. Add project scripts to root `package.json`
3. Update workflows if needed

## Deployment

Arcade Shooter automatically deploys to GitHub Pages on push to main:
- 🎮 **Live demo**: https://drswobodziczka.github.io/awesome-arcade-shooter/
- Workflow: `.github/workflows/deploy-pages.yml`
