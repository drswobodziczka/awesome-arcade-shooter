# Plan Ekstrakcji Współdzielonego Rdzenia (Shared Core)

**Powiązany ADR:** [001-extract-shared-core.md](../ADR/001-extract-shared-core.md)
**Status:** Draft / Do Realizacji
**Data:** 2025-11-20

## Cel
Ujednolicenie logiki biznesowej między projektami `arcade-shooter` (Canvas API) i `arcade-shooter-phaser` (Phaser.js) poprzez wydzielenie kodu niezależnego od silnika renderującego.

## Analiza Wstępna
Analiza kodu wykazała ~70% pokrycia logiki, która jest "czysta" (framework-agnostic).
- **Części Wspólne:** Modele danych (Enemy, Bullet), logika kolizji (AABB), logika spawnowania fal, konfiguracja.
- **Części Specyficzne:** Pętla gry (Game Loop), Rendering (Canvas context vs Phaser Sprites), Input handling, Audio implementation.

---

## Harmonogram Realizacji (Atomic Steps)

### Faza 1: Fundament (Shared Core)
Cel: Stworzenie infrastruktury i przeniesienie plików bez łamania istniejących projektów.

1.  **Infrastruktura**
    - Utworzenie katalogu `PoCs/shared/src`.
    - Utworzenie pliku `PoCs/shared/package.json` (jeśli wymagany) lub konfiguracja aliasów w projektach podrzędnych.

2.  **Ekstrakcja Modułów**
    - **Config:** Utworzenie `shared/src/constants.ts` (przeniesienie stałych z `main.ts`).
    - **Utils:** Przeniesienie `utils.ts` (GameObject, Collisions).
    - **Types:** Utworzenie `shared/src/types.ts` (ewentualne wspólne interfejsy).
    - **Enemies:** Przeniesienie `enemies.ts`.
        - *Uwaga:* Należy uwzględnić typ `TELEPORT` (z wersji Canvas) jako nadzbiór funkcjonalności.
    - **Spawning:** Przeniesienie `spawning.ts`.

### Faza 2: Adaptacja (Refactoring)
Cel: Przepięcie obu projektów na nowy moduł `shared`.

1.  **Konfiguracja Builda**
    - Aktualizacja `tsconfig.json` w obu projektach, aby poprawnie rozwiązywały ścieżki do `../shared`.

2.  **Refactor: Canvas (Legacy)**
    - Zmiana importów w `arcade-shooter/src/main.ts` i `rendering.ts`.
    - Usunięcie lokalnych plików `utils.ts`, `enemies.ts`, `spawning.ts`.
    - Weryfikacja manualna (Test Play).

3.  **Refactor: Phaser (Target)**
    - Zmiana importów w `arcade-shooter-phaser/src/MainGameScene.ts`.
    - Usunięcie lokalnych plików.
    - Weryfikacja manualna (Test Play).

### Faza 3: Unifikacja Stanu (Przyszłość)
Cel: Centralizacja zarządzania stanem gry (GameState).

1.  Utworzenie klasy `GameState` w `shared`.
2.  Przeniesienie tablic `enemies`, `bullets` oraz licznika `score` do tej klasy.
3.  Implementacja wzorca Adapter/Observer w Phaserze (Widok reaguje na zmiany w Modelu).
