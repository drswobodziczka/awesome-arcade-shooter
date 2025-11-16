# Claude Code Web - Evaluation Notes

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
