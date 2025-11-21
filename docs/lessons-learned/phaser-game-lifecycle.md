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

## Solutions

### Solution 1: Hard Recreate (Initial Fix - Not Optimal)

**Niszczenie całej gry przy każdym restarcie:**

```typescript
// main.ts - przy każdym starcie
if (game) {
  game.destroy(true);
  game = null;
}
game = new Phaser.Game(config);

// MainGameScene.ts - przy game over
this.game.destroy(true, false);
showTestPanel();
```

**Problem z tym podejściem:**
- ❌ Performance overhead ~100-300ms przy każdym restarcie
- ❌ Re-inicjalizacja WebGL context, physics engine, audio context
- ❌ Re-generacja wszystkich assetów (audio buffers, textures)
- ❌ Utrata shared resources między restartami

### Solution 2: Multi-Scene Architecture (Optimal)

**Jedna instancja gry + przełączanie scen:**

```typescript
// main.ts - JEDNOKROTNA inicjalizacja
const game = new Phaser.Game({
  scene: [MenuScene, MainGameScene, GameOverScene]
});

// MenuScene → MainGameScene
this.scene.start('MainGameScene');

// MainGameScene → GameOverScene (przy game over)
this.game.registry.set('finalScore', this.score);
this.scene.start('GameOverScene');

// GameOverScene → MenuScene (restart)
this.scene.start('MenuScene');
```

**Zalety:**
- ✅ **Zero overhead** przy przełączaniu scen
- ✅ Shared resources (audio, textures, physics engine)
- ✅ Phaser zaprojektowany pod multi-scene
- ✅ `scene.start()` automatycznie czyści poprzednią scenę
- ✅ Lepsze separation of concerns (Menu/Game/GameOver)

## Key Takeaways

### Phaser Scene Lifecycle (kluczowe różnice):

| Metoda | Scope | Canvas | Resources | Use Case |
|--------|-------|--------|-----------|----------|
| `scene.restart()` | Resetuje scenę | ❌ Zostaje | ✅ Shared | Quick retry w tej samej scenie |
| `scene.start('Other')` | Zmienia scenę | ❌ Zostaje | ✅ Shared | **Navigation między stanami** |
| `game.destroy()` | Niszczy całą grę | ✅ Usuwa | ❌ Lost | Wyjście z gry (rare) |

### Architectural Patterns:

**❌ Anti-pattern (Hard Recreate):**
```typescript
gameOver → game.destroy() → new Phaser.Game()
// Performance hit przy każdym restarcie
```

**✅ Best Practice (Multi-Scene):**
```typescript
Menu → Game → GameOver → Menu (loop via scene.start())
// Zero overhead, jedna instancja żyje przez cały czas
```

### Game Development Principles:

1. **Design for state transitions** - gry to automaty stanów (FSM)
   - Każdy stan = osobna scena
   - Transitions = `scene.start()`

2. **Shared resources optimization** - audio/textures/physics raz inicjalizowane
   - `preload()` w pierwszej scenie ładuje assety dla wszystkich scen
   - `game.registry` = global state między scenami

3. **Test the loop** - testuj pełny cykl: Menu → Game → GameOver → Menu → Game
   - Memory leaks ujawniają się po 5-10 cyklach
   - Performance degradation = znak problemu

4. **Separate UI from game logic**
   - MenuScene = konfiguracja
   - MainGameScene = gameplay
   - GameOverScene = results
   - NIE mieszaj DOM + Phaser (albo jedno, albo drugie)
