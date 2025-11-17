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

### 3. Claude Code GitHub Action (cc-action)

**(+) Strengths:**
- Robi review i reaguje na komenty
- (+!) Na początek nie ma za wiele uprawnień, ale można je rozszerzać w workflow (security-first approach)

**(-) Limitations:**
- Wykonuje się jako workflow CI gh actions == wolne

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
