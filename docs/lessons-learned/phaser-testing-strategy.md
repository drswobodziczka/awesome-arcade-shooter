# Phaser Testing Strategy: UI vs Business Logic

## Overview

This document explains our testing approach for Phaser.js scenes, specifically why we defer Scene-level integration tests in favor of testing extracted business logic.

---

## The Problem: Scene Testing Complexity

### Why Phaser Scene Tests Are Hard

Phaser Scene tests require extensive setup infrastructure:

1. **Full Game Initialization**: Scenes don't exist in isolation - they need `Phaser.Game` instance
2. **Canvas/WebGL Context**: Even with mocks, Phaser expects browser APIs (HTMLCanvasElement, WebGLRenderingContext)
3. **Lifecycle Orchestration**: Must manually trigger `init()` → `create()` → `update()` lifecycle
4. **Input Simulation**: Keyboard/pointer events require complex mocking
5. **Registry Mocking**: Cross-scene data sharing needs Game registry setup

### Example Boilerplate (Why We Avoid This)

```typescript
// What a MenuScene test WOULD look like (100+ lines just for setup)
it('validates test mode requires enemies', () => {
  // Arrange: 30+ lines of Phaser.Game configuration
  const mockCanvas = document.createElement('canvas');
  const mockGame = new Phaser.Game({
    type: Phaser.CANVAS,
    width: 400,
    height: 850,
    canvas: mockCanvas,
    scene: [MenuScene],
    physics: { default: 'arcade' },
    // ... 20+ more config lines
  });

  // Wait for scene creation (async)
  await new Promise(resolve => setTimeout(resolve, 100));

  const scene = mockGame.scene.getScene('MenuScene') as MenuScene;

  // Mock internal state (brittle - depends on private properties)
  (scene as any).gameMode = 'test';
  (scene as any).selectedEnemies = new Set();

  // Act: Trigger startGame (requires accessing private method)
  (scene as any).startGame();

  // Assert: Check errorText (requires DOM query or internal state access)
  const errorText = (scene as any).errorText.text;
  expect(errorText).toContain('at least one enemy');

  // Cleanup
  mockGame.destroy(true);
});
```

**Cost/Benefit Analysis:**
- **Lines of test code**: ~150 per scene
- **Lines of logic tested**: ~10-15 (mostly framework calls)
- **Risk mitigated**: Low (UI bugs caught in manual testing)
- **Maintenance burden**: High (brittle, depends on Phaser internals)

---

## Our Solution: Extract & Test Business Logic

### Strategy

Instead of testing Scenes directly, we:
1. **Extract business logic** to pure functions (no Phaser dependencies)
2. **Test pure functions** with simple unit tests
3. **Keep UI logic thin** (Phaser calls only)
4. **Manual test UI** (visual/interactive validation)

### Example: MenuScene Validation

**Before (Untestable):**
```typescript
// MenuScene.ts
private startGame(): void {
  if (this.gameMode === 'test' && this.selectedEnemies.size === 0) {
    this.errorText?.setText('⚠️ Please select at least one enemy');
    return;
  }
  // ... rest of logic
}
```
❌ **Problem**: Can't test without full Scene initialization

**After (Testable):**
```typescript
// types.ts (pure function - no Phaser dependency)
export function validateTestModeConfig(
  mode: 'normal' | 'test',
  selectedEnemies: Set<EnemyType>
): string | null {
  if (mode === 'test' && selectedEnemies.size === 0) {
    return '⚠️ Please select at least one enemy for test mode';
  }
  return null;
}

// MenuScene.ts (thin UI layer)
private startGame(): void {
  const error = validateTestModeConfig(this.gameMode, this.selectedEnemies);
  if (error) {
    this.errorText?.setText(error);
    return;
  }
  // ... rest of logic
}
```

**Test (Simple - 6 lines):**
```typescript
// MenuScene.test.ts
it('validates test mode requires at least one enemy', () => {
  const error = validateTestModeConfig('test', new Set());
  expect(error).toBe('⚠️ Please select at least one enemy for test mode');
});
```

✅ **Benefits:**
- No Phaser dependencies
- Fast (milliseconds)
- Easy to maintain
- Tests all edge cases (normal mode, empty set, multiple enemies)

---

## Testing Guidelines by Component Type

### 1. Pure Business Logic → Unit Test (Target: 75%+ coverage)

**Examples:**
- `validateTestModeConfig()` - validation rules
- `checkCollision()` - AABB collision detection
- `calculateSpawnInterval()` - difficulty curve
- `updateEnemyMovement()` - enemy AI

**Test Approach:** Direct unit tests with AAA pattern

### 2. Phaser Scenes (MenuScene, GameOverScene) → Manual Test (<50% coverage OK)

**Examples:**
- UI creation (`this.add.text()`, `this.add.container()`)
- Event handlers (`on('pointerdown')`)
- Scene transitions (`this.scene.start()`)

**Test Approach:**
- Extract business logic → unit test
- Manual checklist for UI (see below)
- Defer Scene integration tests unless bugs emerge

### 3. Game Logic Scenes (MainGameScene) → Test Core Systems (50-75% coverage)

**Examples:**
- Scoring system (unit testable if extracted)
- Collision detection (already tested - `main.test.ts`)
- Spawn management (already tested - `spawning.test.ts`)

**Test Approach:** Test individual systems, defer full Scene lifecycle tests

---

## Manual Testing Checklist

Since we defer Scene UI tests, use this checklist for manual validation:

### MenuScene
- [ ] Title and subtitle display correctly
- [ ] Normal mode selected by default (green bullet)
- [ ] Click "Normal Mode" → indicator updates
- [ ] Click "Test Mode" → enemy selection appears
- [ ] Enemy checkboxes toggle on click (☐ ↔ ☑)
- [ ] "START GAME" with no enemies in test mode → shows error text
- [ ] "START GAME" with valid config → transitions to MainGameScene
- [ ] ENTER key triggers start (same validation as button)
- [ ] No console errors on scene shutdown

### GameOverScene
- [ ] Final score displays correctly from registry
- [ ] "PLAY AGAIN" button transitions to MenuScene
- [ ] ENTER key transitions to MenuScene
- [ ] No memory leaks (keyboard listener cleanup)

---

## When to Reconsider Scene Tests

Add Scene integration tests if:
1. **Regression bugs emerge** in UI logic (e.g., scene transitions broken)
2. **Refactoring needs safety net** (e.g., major Scene restructure)
3. **Test infrastructure improves** (e.g., Phaser test utilities released)

---

## Test Infrastructure Status

### What We Have
- ✅ **test-setup.ts**: Canvas/WebGL/AudioContext mocking (99 lines)
- ✅ **46 passing tests**: Core game logic (enemies, spawning, collision)
- ✅ **Vitest configured**: Fast, TypeScript-native test runner

### What We Defer
- ❌ **Scene lifecycle tests**: Too complex for current value
- ❌ **Input simulation tests**: Brittle mocking required
- ❌ **Registry integration tests**: Covered by type-safety

---

## Alignment with Project Guidelines

Per `testing_guidelines.md`:

**Coverage Targets:**
- **75%+**: Core game logic ✅ (collision, enemies, spawning)
- **50-75%**: Utilities, helpers ✅ (validation extracted)
- **<50%**: **Acceptable for rendering, UI initialization** ✅ (Scenes)

**What NOT to Test (line 57-62):**
- Framework internals (Phaser Scene lifecycle) ✅
- Simple getters/setters without logic ✅

**Our approach follows guidelines:**
1. Test pure logic aggressively (75%+ coverage)
2. Accept lower coverage for UI (<50%)
3. Extract business logic to make it testable

---

## Summary

**Decision:** Defer Phaser Scene integration tests

**Reasoning:**
1. **Cost/benefit**: 100+ lines of setup to test 10 lines of framework calls
2. **Guidelines compliance**: <50% coverage acceptable for UI (testing_guidelines.md:115)
3. **Risk mitigation**: Core logic tested (46 tests), UI validated manually
4. **Maintainability**: Pure function tests are fast, simple, and reliable

**Action Items:**
- ✅ Extract validation logic → `validateTestModeConfig()`
- ✅ Unit test pure functions → `MenuScene.test.ts`
- ✅ Manual testing checklist for UI
- ⏸️ Scene integration tests deferred until needed

**Quote from testing guidelines:**
> "DON'T Test: Framework internals (Vite, browser APIs)" (line 59)
> "<50%: Acceptable for rendering, UI initialization" (line 115)

Our strategy aligns with project philosophy: **"Start simple, iterate"** (CLAUDE.md)
