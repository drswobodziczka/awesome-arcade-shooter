# Pull Request Guidelines (for Agent)

## BACKGROUND (optional)

Krótki, opcjonalny kontekst biznesowy / domenowy:

- **Co to za obszar gry / systemu?**
- **Dlaczego ten PR powstał teraz?** (issue, błąd, nowy feature)

Jeśli kontekst jest oczywisty z nazwy brancha / issue – sekcję można pominąć.

## WHAT & WHY?

Zwięzła lista, bez przegadania:

- **Co zostało zrobione / zmienione?** (wysoki poziom)
- **Dlaczego to było potrzebne?** (bugfix, UX, performance, refactor, przygotowanie pod kolejny krok)

Unikaj detali implementacyjnych – skup się na efekcie z perspektywy gracza / użytkownika / API.

## HOW?

Krótki opis podejścia technicznego:

- **Jakie główne decyzje techniczne zostały podjęte?**
- **Jakie moduły / pliki są kluczowe?**
- **Czy są ważne ograniczenia, trade‑offy, rzeczy do świadomości na przyszłość?**

Bez wchodzenia w poziom pojedynczych linii – od tego jest diff.

## TESTING

Prosty, konkretny przepis na sprawdzenie, że PR działa:

- **Manual:**
   - Kroki do uruchomienia gry / aplikacji.
   - Scenariusze do ręcznego przetestowania (np. „zestrzel kilku wrogów, zginij, wciśnij Enter i sprawdź, czy gra się restartuje”).

Celem jest to, żeby reviewer mógł natychmiastowo:

- zrozumieć intencję PR,
- zobaczyć główne decyzje,
- przetestowac, ze dziala

## AGENT WORKFLOW (PR CREATION)

 Zalecany minimalny workflow dla agenta przy wystawianiu PR w tym repo:

 - **1. Przygotuj zmianę**
   - Upewnij się, że kod jest skompilowany i testy lokalne przeszły.
   - Zadbaj o czysty diff (tylko pliki związane z zadaniem).

 - **2. Commit**
   - Nazwa brancha: krótka, opisowa, np. `fix/...` albo `feature/...`.
   - Commit message: jednozdaniowe podsumowanie efektu (angielski).

 - **3. Push & PR**
   - Wypchnij branch na GitHuba.
   - Utwórz PR za pomocą `gh pr create`:
     - **base**: gałąź wskazana w zadaniu (np. `main` lub dedykowany branch PoC).
     - **head**: aktualny branch z Twoją zmianą.
   - Opis PR napisz według sekcji z tego pliku: `BACKGROUND`, `WHAT & WHY?`, `HOW?`, `TESTING`.

 - **4. Po wystawieniu PR**
   - Nie zmieniaj bez potrzeby branchy bazowej i nazwy brancha.
   - Dalsze poprawki rób w tym samym branchu; opis PR aktualizuj tylko jeśli istotnie zmienia się zakres.
