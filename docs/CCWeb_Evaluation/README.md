# Claude Code Web - Evaluation Notes

## Strengths

### 1. Excellent Repository Context Awareness
(+) Świetnie odnajduje się w kontekście repozytorium
- Szybko rozumie strukturę projektu
- Efektywnie porusza się po codebase

### 2. GitHub Ecosystem Synergy
(+) Side-effect: pracując w ekosystemie GitHub + Web, praca w teamie **CC Web + CC GitHub Action + Developer** ma jeszcze większą wartość
- Integracja z [claude-code-action](https://github.com/anthropics/claude-code-action)
- Seamless workflow między web interface a GitHub Actions
- Współpraca CC Web + automated workflows zwiększa produktywność

### 3. Teleport to CLI Feature
(?) Możliwość przeniesienia sesji z Web do lokalnego CLI
- Transfer kontekstu i zmian z przeglądarki do lokalnego środowiska
- Wymaga dalszego przetestowania w praktyce

## Limitations & Issues

### 1. No GitHub CLI Access
CCWeb nie ma dostępu do `gh` CLI.
- Nie może pobierać informacji o PR, issues, runs bezpośrednio z GitHub
- Musi polegać na linkach od użytkownika lub fetch przez API

### 2. No Direct Access to GitHub Actions Logs
CCWeb nie może automatycznie czytać errorów z failed builds.
- Brak możliwości analizy failed workflow runs
- Nie może automatycznie naprawić błędów wykrytych w CI/CD
- Słaba integracja z GitHub Actions
- Wymaga ręcznego kopiowania errorów lub manual intervention

**Impact:** Workflow "build failed" → użytkownik musi ręcznie podać logi lub opisać problem.

### 3. No MCP Server Configuration
(-!) Brak możliwości konfiguracji MCP servers i dodatkowych narzędzi
- Wersja web nie wspiera MCP (Model Context Protocol)
- Brak możliwości rozszerzenia o custom tools/integrations
- Tylko CLI/Desktop mają pełne wsparcie MCP (200+ dostępnych serwerów)
- Ogranicza możliwości integracji z external data sources (GitHub API, databases, etc.)

**Impact:** Web version ma tylko wbudowane narzędzia; brak dostępu do ekosystemu MCP.
