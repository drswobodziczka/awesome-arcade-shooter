# Claude Code Web - Evaluation Notes

## Strengths (+)

### 1. Excellent Repository Context Awareness

(+) Świetnie odnajduje się w kontekście repozytorium

- Szybko rozumie strukturę projektu
- Efektywnie porusza się po codebase

### 2. GitHub Ecosystem Synergy

(+) Side-effect: pracując w ekosystemie GitHub + Web, praca w teamie **CC Web + CC GitHub Action + Developer** ma jeszcze większą wartość

- Integracja z [claude-code-action](https://github.com/anthropics/claude-code-action)
- Seamless workflow między web interface a GitHub Actions
- Współpraca CC Web + automated workflows zwiększa produktywność

### 3. Excellent Sandbox Automation

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

### 5. Concurrent Multi-Branch Development

(+) Wielu agentów może pracować jednocześnie na wielu branchach, co lokalnie, nawet przy wielu agentach, byłoby niemożliwe

- Każda sesja CC Web działa w izolowanym sandboxie z własnym checkout
- Możliwość równoległego developmentu na różnych feature branches
- Lokalnie: single working directory = tylko jeden branch na raz
- CC Web: multiple sandboxes = wiele branchy jednocześnie
- Drastycznie przyspiesza workflow przy pracy nad wieloma feature'ami równolegle
- Eliminuje konieczność git stash/checkout/merge dance przy przełączaniu kontekstu

### 6. Browser-Based Workflow

Podoba się praca w CC Web w przeglądarce

- Dostępność z każdego urządzenia z przeglądarką
- Brak potrzeby instalacji lokalnej
- Łatwe przełączanie między projektami w różnych tabach

### 6. Vibe Coding with PR/Issue-Driven Development

(+) Vibe coding pull requestami, issuesami, projektem i iteracjami zwiększa czas o trochę, ale generalnie daje większą kontrolę jakości i zgodności ze specyfikacją, utrzymuje HITL, oraz umożliwia CC Action na robienie review

- Lepszą kontrolę nad jakością kodu poprzez PR reviews
- Większą zgodność z wymaganiami i specyfikacją
- Utrzymanie Human In The Loop - użytkownik ma przegląd każdego kroku
- Umożliwia automatyczne review przez CC Action w GitHub Actions
- Trade-off: nieco więcej czasu, ale wyższa pewność poprawności

### 9. Claude Code Action + CC Web Synergy

(+) gh action / gh cc app robi dokładnie i kompleksowe code review

(+) Agenci świetnie współpracują, szkoda tylko że jeszcze ja muszę im przeklejać informacje :D

- CC GitHub Action dostarcza precyzyjne i kompleksowe code reviews
- Agenci CC Web i CC Action doskonale się uzupełniają
- Friction point: Ręczne kopiowanie informacji między narzędziami zmniejsza efektywność
- Feature request: Jeśli CC Web mogło by czytać GitHub, mogło by automatycznie naprawiać wszystkie błędy zgłaszane przez CC gh action

### 10. Full Agent Automation: Speed vs Control Trade-off

(±) Workflow na totalnym automacie (pośredniczenie między agentami → tworzenie wymagań → requesty → review → CC Web fixes) jest mega szybki i działa, ale powoduje stres i niepewność.

**Plusy:**
- Prędkość jest bardzo wysoka
- Workflow faktycznie działa
- Automatyzacja całego cyklu development → review → fix

**Minusy:**
- Brak poczucia kontroli nad procesem
- Nie do końca rozumiem jak budowane jest rozwiązanie
- Stres i niepewność wynikające z braku transparentności procesu
- **Potrzeba zwolnienia** - może trzeba będzie świadomie spowolnić workflow dla lepszego zrozumienia

**Impact:** Trade-off między prędkością a zrozumieniem/kontrolą. Szybkie iteracje kosztem cognitive clarity.

### 11. GitHub Issues Context Reading

(+) CC Web potrafi czytać treść GitHub Issues przez WebFetch, gdy jest osadzony w sandboxie w kontekście tego samego projektu.

- Umożliwia automatyczne pobieranie treści issues
- Agent może samodzielnie analizować zgłoszenia
- Ułatwia workflow: issue → analiza → implementacja
- Częściowo rozwiązuje problem z punktu 9 (Feature request o czytaniu GitHub)

### 12. Predefined Hooks Support

(+) CC Web ma wbudowaną obsługę predefined hooks - np. stop-hook-git-check.sh automatycznie wymusza commit zmian przed zatrzymaniem sesji.

- Automatyczne governance i best practices
- Uniemożliwia wyjście sesji z niezacommitowanymi zmianami
- Elegancka automatyzacja bez konieczności konfiguracji - działa out-of-the-box
- Zwiększa dyscyplinę developmentową
- Potencjalnie pochodzi z sandbox environment - ciekawe czy to feature CC Web czy infrastruktury

### 13. Auto Context Compaction

(+) CC Web automatycznie robi kompaktowanie kontekstu gdy się zbliża do limitu.

- Inteligentne zarządzanie kontekstem bez manual intervention
- Umożliwia długie, iteracyjne sesje bez utraty pracy
- Graceful degradation zamiast sudden context loss
- Transparentne dla użytkownika - sesja po prostu trwa

## Limitations & Issues (-)

### 1. (!) CRITICAL: Brak dostępu do własnych workflow / slash commands & No File Mentions

Nie można mentionować plików, używać slash commands lub osobistych workflow w CC Web.

- Brak @ mentions dla plików
- Brak szybkich komend
- Brak możliwości stosowania własnych promptów zdefiniowanych lokalnie
- Wymusza kopiowanie promptów bezpośrednio do konwersacji lub wklejanie do repo
- Brak możliwości automatyzacji czy integracji z własnymi narzędziami
- Drastycznie zmniejsza produktywność przy pracy z recurring patterns/workflows
- **Frustrujące ograniczenie** - kto używa workflow w CLI, będzie znacznie mniej produktywny w Web

### 2. Conversation Continuation UI Issue

Kontynuacja konwersacji zasłania wątek :D

- UI problem z visibility
- Utrudnia śledzenie poprzednich wiadomości

### 3. No GitHub CLI Access

CCWeb nie ma dostępu do `gh` CLI.

- Nie może pobierać informacji o PR, issues, runs bezpośrednio z GitHub
- Musi polegać na linkach od użytkownika lub fetch przez API

### 4. No Direct Access to GitHub Actions Logs

CCWeb nie może automatycznie czytać errorów z failed builds.

- Brak możliwości analizy failed workflow runs
- Nie może automatycznie naprawić błędów wykrytych w CI/CD
- Słaba integracja z GitHub Actions
- Wymaga ręcznego kopiowania errorów lub manual intervention

**Impact:** Workflow "build failed" → użytkownik musi ręcznie podać logi lub opisać problem.

### 5. CRITICAL: wolno startujace sesje, zawieszajace sie sesje, sesje konczace sie bledem

### 6. Single PR Per Session Limitation

(-) Jedna sesja może otworzyć tylko jeden PR, wyłącznie może to zrobić user klikając w button.

- Brak możliwości tworzenia wielu PR w jednej sesji
- Tylko user może utworzyć PR (przez UI button)
- Ogranicza workflow przy pracy nad wieloma feature'ami

### 7. Branch Management Issues

(-) CC Web pierdoli czasem branche i w jednej sesji robi ich kilka.

- Niejasne na jakim jesteśmy branchu w danym momencie
- Do którego brancha jest PR?
- Co się dzieje jak w sesji mamy kilka branchy i każda z PR - do którego przekieruje wówczas button "View PR"?

**Impact:** Chaos w zarządzaniu branchami, nieprzewidywalność UI, trudności w śledzeniu stanu pracy.

### 8. CLAUDE.MD Integration Issues

(-) Nie ma możliwości pracy z CLAUDE.MD - '#' nie dodaje do pamięci.

- Brak wsparcia dla slash command '#' do dodawania context z CLAUDE.MD
- Ogranicza możliwość konfiguracji project-specific instructions

### 9. No MCP and Tools Configuration

(-!) Brak konfiguracji MCP i narzędzi.

- Niemożność rozszerzenia capabilities przez MCP servers
- Brak dostępu do custom tools
- Ograniczona extensibility w porównaniu do desktop/CLI version

### 10. Session Freezing Issues

(-) Sesja się czasem zacina -- claude miał mieli retry connection i nic.

- Sesja przestaje odpowiadać
- Próby retry connection nie pomagają
- Wymaga restart sesji

### 11. False Rate Limit Messages

(-) Durny i nieprawdziwy komunikat o rate limit.

- Wyświetlają się błędne komunikaty o przekroczeniu limitu
- Wprowadza w błąd użytkownika
- Nie odzwierciedla rzeczywistego stanu

### 12. Session Stop Delay

(-) Jak się niechcący zacznie sesję to by zatrzymać trzeba czekać z 10 sekund.

- Długi czas oczekiwania na zatrzymanie sesji
- Brak natychmiastowego cancel
- Frustrujące przy przypadkowym starcie

### 13. No Conversation History Navigation

(-) Nie ma opcji back in time w konwersacji.

- Brak możliwości cofnięcia się do wcześniejszego stanu rozmowy
- Nie można wrócić do poprzednich punktów w konwersacji
- Brak undo/rollback functionality

### 14. Model & Repository Selection Not Persisted

(-) Zawsze zostaje model i repo ostatniego wyboru. Wolałbym żeby interfejs pamiętał wybory między konwersacjami i oknami CC Web

- Brak zapamiętywania preferencji modelu między sesjami
- Brak zapamiętywania wybranego repo między oknami
- Wymaga ręcznego resetowania wyboru za każdym razem
- Uciążliwe przy pracy z wieloma projektami/modelami

### 15. Cannot Test Running Instances During Active Development

(-) W trybie aktywnego rozwijania gałęzi nie możemy odpalić serwera, otworzyć przeglądarki i pozwolić agentowi samodzielnie testować aplikację.

- Agent nie ma możliwości interaktywnego testowania w przeglądarce
- Niemożność spawania i obserwacji działającej instancji aplikacji
- Ogranicza feedback loop podczas development - agent nie widzi wyników swoich zmian w runtime
- Wymaga ręcznego testowania przez użytkownika lub instrukcji user-provided o błędach/wynikach
- Utrudnia debugging i iteracyjne poprawianie kodu

### 16. No Bash Mode

(-) Brak bash mode `!` jak w CC CLI.

- Nie można szybko przełączyć się w tryb bash-only
- Brak możliwości wykonywania czystych sekwencji poleceń shell bez interpretacji przez LLM
- Wymaga zawsze pełnego kontekstu agenta nawet dla prostych operacji terminalowych
- Zmniejsza efektywność przy prostych operacjach systemowych

## Unknown / To Be Tested (?)

### 1. Mobile/Android Support

Nie wiadomo jak działa na Androidzie

- Brak informacji o rollout na mobile
- Potencjalnie użyteczne dla pracy w drodze
- Wymaga testów po udostępnieniu

### 2. Database Support in Sandbox

(?) Można sobie odpalać bazy danych w sandboxie CC Web - ciekawe jakie są use case'y?

- Lokalne testowanie bez setup na maszynie developerskiej
- Izolacja - każda sesja ma czystą instancję
- Potencjalne automatyczne cleanup przy zamknięciu sesji
- Czy jest wsparcie dla migracji i seedingu danych?
- Performance implications w sandboxie
- Data persistence - co się dzieje z danymi po sesji?
- Czy można to używać do dev work czy tylko testowania?

### 3. CLI Teleport (?)

(?) Teleport do CLI

- Niejasna funkcjonalność lub brak możliwości przełączenia się do CLI mid-session
