# ADR 001: Ekstrakcja Współdzielonego Rdzenia (Shared Core)

**Data:** 2025-11-20
**Status:** Zaakceptowany

## Kontekst
W repozytorium rozwijane są równolegle dwa Proof of Concept (PoC):
1.  `arcade-shooter` (Native Canvas API)
2.  `arcade-shooter-phaser` (Phaser.js)

Oba projekty realizują tę samą logikę gry (zachowanie wrogów, fale, fizyka kolizji), co doprowadziło do duplikacji kodu (~70% logiki jest identyczne). Utrzymywanie dwóch kopii tych samych algorytmów zwiększa ryzyko błędów i rozbieżności funkcjonalnych (np. brak typu wroga `TELEPORT` w wersji Phaser).

## Decyzja
Decydujemy się na **wydzielenie wspólnej logiki biznesowej** do osobnego modułu (katalog `PoCs/shared`).

Moduł ten będzie zawierał kod "czysty" (framework-agnostic), niezależny od warstwy renderingu, audio czy inputu.
Elementy podlegające ekstrakcji:
*   Logika matematyczna i kolizje (`utils`).
*   Definicje i logika zachowań wrogów (`enemies`).
*   System spawnowania fal (`spawning`).
*   Stałe konfiguracyjne (`constants`).

## Konsekwencje

### Pozytywne
*   **Single Source of Truth:** Zmiana w zachowaniu wroga (np. prędkość) aplikuje się automatycznie do obu wersji gry.
*   **Testowalność:** Logika biznesowa odseparowana od widoku jest łatwiejsza do otestowania jednostkowego (Unit Tests).
*   **Szybsza Migracja:** Ułatwia docelowe przeniesienie całej gry na Phaser, mając pewność, że core gameplay jest zachowany.

### Negatywne / Ryzyka
*   Konieczność konfiguracji narzędzi budujących (TypeScript/Vite), aby obsługiwały importy spoza katalogu głównego projektu (`../shared`).
*   Wprowadzenie zależności między projektami (zmiana w shared może zepsuć jeden z PoC, jeśli nie będzie kompatybilna wstecznie).

## Szczegóły Implementacyjne
Szczegółowy harmonogram i zakres zmian znajduje się w dokumencie:
👉 [Plan Ekstrakcji Shared Core](../plans/001-shared-core-extraction-plan.md)
