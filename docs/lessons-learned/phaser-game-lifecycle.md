# Lesson Learned: Phaser Game Lifecycle Management

## Problem

Po restarcie gry występowały trzy powiązane błędy:
1. Duplikacja canvasów na stronie (problemy wizualne)
2. Panel testowy pokazywał się PO starcie gry zamiast PRZED
3. Przy kolejnych restartach gracz tracił kontrolę nad postacią

## Root Cause

**Niewłaściwe zarządzanie cyklem życia instancji Phaser.Game:**

- Każde kliknięcie "Start Game" tworzyło NOWĄ instancję `Phaser.Game` bez niszczenia starej
- Phaser automatycznie dodaje nowy `<canvas>` do DOM przy każdej instancji
- Restart przez `scene.restart()` resetował tylko scenę, nie całą grę
- Stare instancje pozostawały w pamięci i nasłuchiwały inputu → konflikt kontrolek

## Solution

### 1. Niszczenie starej instancji przed utworzeniem nowej (main.ts)

```typescript
// Przed utworzeniem nowej gry
if (game) {
  game.destroy(true); // true = usuń canvas z DOM
  game = null;
}
game = new Phaser.Game(config);
```

### 2. Pełny reset zamiast restart sceny (MainGameScene.ts)

```typescript
// ŹLE - resetuje tylko scenę, nie niszczy gry
this.scene.restart();

// DOBRZE - niszczy całą instancję
this.game.destroy(true, false);
// Pokaż panel testowy ponownie
document.getElementById('testPanel')?.classList.remove('hidden');
```

## Key Takeaways: Phaser & Game Development

### Phaser-specific:

1. **`game.destroy(removeCanvas, noReturn)`** - kluczowa metoda czyszczenia
   - `removeCanvas: true` → usuwa `<canvas>` z DOM
   - `noReturn: false` → pozwala wrócić do normalnego flow

2. **`scene.restart()` ≠ pełny reset** - resetuje tylko stan sceny, nie niszczy game instance

3. **Jedna instancja Phaser.Game = jeden canvas** - zawsze niszczyć przed utworzeniem nowej

### Game Development Principles:

1. **Explicit state management** - gry mają złożony cykl życia (init → play → pause → game over → restart)
   - Każdy stan wymaga explicite cleanup/initialization

2. **Memory leaks w grach są niewidoczne** - stare instancje nasłuchują inputu w tle
   - Objawy: dziwne zachowanie kontrolek, performance issues, memory leaks

3. **Test restart flow early** - większość bugów ujawnia się dopiero przy wielokrotnym restarcie

4. **DOM + Game Engine = dwa światy** - synchronizuj stan UI (test panel) z cyklem życia gry
   - Phaser zarządza canvasem, ale reszta UI to zwykły DOM → trzeba ręcznie synchronizować

## Prevention Pattern

```typescript
// Pattern: zawsze cleanup → reset UI → create new
if (existingGame) existingGame.destroy(true);
resetUItoInitialState();
newGame = createGame();
```
