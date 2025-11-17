# Claude Code Web - Evaluation Notes

## Strengths (+)

### 1. Excellent Sandbox Automation
CCWeb świetnie operuje na automacie w sandboxie:
- Robi commity, merges, rebases
- Rozwiązuje konflikty git
- Tworzy PR-y
- Używa webfetch i innych narzędzi autonomicznie

### 2. Superior Diff Handling
Duuuże lepsze wrażenie z diffów niż CC CLI
- Lepsze wyświetlanie zmian
- Łatwiejsza analiza konfliktów

### 3. Web & GitHub Integration
Blisko githuba i weba:
- Łatwy dostęp do WebFetch
- Integracja z GitHub workflows
- Web-first approach

### 4. Multi-Agent/Session UX
Odpalanie wielu agentów/sesji jest wygodniejsze niż w Warpie
- Lepszy UX dla równoległych tasków
- Łatwiejsze zarządzanie wieloma kontekstami

### 5. Browser-Based Workflow
Podoba się praca w CC Web w przeglądarce
- Dostępność z każdego urządzenia z przeglądarką
- Brak potrzeby instalacji lokalnej
- Łatwe przełączanie między projektami w różnych tabach

## Limitations & Issues (-)

### 1. No File Mentions / Slash Commands
Nie można mentionować plików, używać slash commands - przynajmniej nie bezpośrednio jak CC CLI
- Brak @ mentions dla plików
- Brak szybkich komend
- Inna interakcja niż w CLI

### 2. Conversation Continuation UI Issue
Kontynuacja konwersacji zasłania wątek :D
- UI problem z visibility
- Utrudnia śledzenie poprzednich wiadomości

### 3. No Multimodal in Continuations
Nie działa multimodalnie w kontynuacji konwersacji
- Nie można dodawać screenów w follow-ups
- Tylko w pierwszej wiadomości

### 4. No GitHub CLI Access
CCWeb nie ma dostępu do `gh` CLI.
- Nie może pobierać informacji o PR, issues, runs bezpośrednio z GitHub
- Musi polegać na linkach od użytkownika lub fetch przez API

### 5. No Direct Access to GitHub Actions Logs
CCWeb nie może automatycznie czytać errorów z failed builds.
- Brak możliwości analizy failed workflow runs
- Nie może automatycznie naprawić błędów wykrytych w CI/CD
- Słaba integracja z GitHub Actions
- Wymaga ręcznego kopiowania errorów lub manual intervention

**Impact:** Workflow "build failed" → użytkownik musi ręcznie podać logi lub opisać problem.

## Unknown / To Be Tested (?)

### 1. Mobile/Android Support
Nie wiadomo jak działa na Androidzie
- Brak informacji o rollout na mobile
- Potencjalnie użyteczne dla pracy w drodze
- Wymaga testów po udostępnieniu
