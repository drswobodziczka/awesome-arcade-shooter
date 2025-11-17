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

### 3. Single PR Per Session Limitation
(-) Jedna sesja może otworzyć tylko jeden PR, wyłącznie może to zrobić user klikając w button.
- Brak możliwości tworzenia wielu PR w jednej sesji
- Tylko user może utworzyć PR (przez UI button)
- Ogranicza workflow przy pracy nad wieloma feature'ami

### 4. Branch Management Issues
(-) CC Web pierdoli czasem branche i w jednej sesji robi ich kilka.
- Niejasne na jakim jesteśmy branchu w danym momencie
- Do którego brancha jest PR?
- Co się dzieje jak w sesji mamy kilka branchy i każda z PR - do którego przekieruje wówczas button "View PR"?

**Impact:** Chaos w zarządzaniu branchami, nieprzewidywalność UI, trudności w śledzeniu stanu pracy.

### 5. CLAUDE.MD Integration Issues
(-) Nie ma możliwości pracy z CLAUDE.MD - '#' nie dodaje do pamięci.
- Brak wsparcia dla slash command '#' do dodawania context z CLAUDE.MD
- Ogranicza możliwość konfiguracji project-specific instructions

### 6. No MCP and Tools Configuration
(-!) Brak konfiguracji MCP i narzędzi.
- Niemożność rozszerzenia capabilities przez MCP servers
- Brak dostępu do custom tools
- Ograniczona extensibility w porównaniu do desktop/CLI version

### 7. CLI Teleport (?)
(?) Teleport do CLI
- Niejasna funkcjonalność lub brak możliwości przełączenia się do CLI mid-session
