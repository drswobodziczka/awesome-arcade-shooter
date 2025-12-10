import { describe, it, expect } from 'vitest';
import {
  EnemyType,
  getEnemyProperties,
  createEnemy,
  updateEnemyMovement,
  isEnemyTypeUnlocked,
} from './enemies';

// Teleport enemy constants (mirrored from enemies.ts for testing)
const TELEPORT_COOLDOWN_MS = 1000;
const TELEPORT_DISTANCE_MIN = 100;
const TELEPORT_DISTANCE_MAX = 150;

describe('Enemy Properties', () => {
  it('STANDARD enemy has size 30 and 1 HP', () => {
    const props = getEnemyProperties(EnemyType.STANDARD);
    expect(props.size).toBe(30);
    expect(props.hp).toBe(1);
  });

  it('YELLOW enemy is 2x larger (60px)', () => {
    const props = getEnemyProperties(EnemyType.YELLOW);
    expect(props.size).toBe(60);
  });

  it('PURPLE enemy is small (15px) and does not shoot', () => {
    const props = getEnemyProperties(EnemyType.PURPLE);
    expect(props.size).toBe(15);
    expect(props.canShoot).toBe(false);
  });

  it('TANK enemy has 5 HP', () => {
    const props = getEnemyProperties(EnemyType.TANK);
    expect(props.hp).toBe(5);
  });
});

describe('Enemy Movement - Boundary Fixes', () => {
  it('YELLOW enemy is forced downward when going above screen (y < 0)', () => {
    const enemy = createEnemy(EnemyType.YELLOW, 100, -10, 0);
    enemy.vy = -1.5; // moving upward

    updateEnemyMovement(enemy, 200, 400, 30, 400, 850, 1.0, Date.now());

    expect(enemy.vy).toBeGreaterThan(0); // Should be forced downward
  });

  it('PURPLE enemy tracks player using dynamic playerWidth', () => {
    const enemy = createEnemy(EnemyType.PURPLE, 100, 50, 0);
    const playerX = 200;
    const playerWidth = 50; // Different from hardcoded 30
    const initialX = enemy.x;

    updateEnemyMovement(enemy, playerX, 400, playerWidth, 400, 850, 1.0, Date.now());

    // Enemy should move toward playerX + playerWidth/2 = 225
    expect(enemy.x).toBeGreaterThan(initialX);
  });
});

describe('Enemy Unlock Timings', () => {
  it('YELLOW unlocks at 10 seconds', () => {
    expect(isEnemyTypeUnlocked(EnemyType.YELLOW, 9999)).toBe(false);
    expect(isEnemyTypeUnlocked(EnemyType.YELLOW, 10000)).toBe(true);
  });

  it('PURPLE and TANK unlock at 20 seconds', () => {
    expect(isEnemyTypeUnlocked(EnemyType.PURPLE, 19999)).toBe(false);
    expect(isEnemyTypeUnlocked(EnemyType.PURPLE, 20000)).toBe(true);
    expect(isEnemyTypeUnlocked(EnemyType.TANK, 19999)).toBe(false);
    expect(isEnemyTypeUnlocked(EnemyType.TANK, 20000)).toBe(true);
  });

  it('TELEPORT unlocks at 30 seconds', () => {
    expect(isEnemyTypeUnlocked(EnemyType.TELEPORT, 29999)).toBe(false);
    expect(isEnemyTypeUnlocked(EnemyType.TELEPORT, 30000)).toBe(true);
  });
});

describe('Enemy Creation', () => {
  it('creates TANK enemy with 5 HP initialized correctly', () => {
    const enemy = createEnemy(EnemyType.TANK, 0, 0, 0);
    expect(enemy.hp).toBe(5);
    expect(enemy.maxHp).toBe(5);
  });

  it('creates TELEPORT enemy with lastTeleport initialized', () => {
    const now = Date.now();
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 100, now);
    expect(enemy.lastTeleport).toBe(now);
    expect(enemy.hp).toBe(1);
  });
});

describe('TELEPORT Enemy Movement', () => {
  it('moves down slowly between teleports with gameSpeed applied', () => {
    const now = Date.now();
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 100, now);
    const initialY = enemy.y;

    // Move without teleporting (cooldown not met)
    updateEnemyMovement(enemy, 200, 400, 30, 400, 850, 1.0, now);

    expect(enemy.y).toBeGreaterThan(initialY); // Should move down
    expect(enemy.y).toBeLessThan(initialY + 1); // But very slowly (0.3 speed)
  });

  it('teleports after TELEPORT_COOLDOWN_MS', () => {
    const now = Date.now();
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 100, now);
    const initialY = enemy.y;

    // Simulate TELEPORT_COOLDOWN_MS passing
    const futureTime = now + TELEPORT_COOLDOWN_MS;
    updateEnemyMovement(enemy, 200, 400, 30, 400, 850, 1.0, futureTime);

    // Should teleport down between TELEPORT_DISTANCE_MIN and TELEPORT_DISTANCE_MAX
    expect(enemy.y).toBeGreaterThan(initialY + TELEPORT_DISTANCE_MIN - 10); // Allow small margin
  });

  it('does not teleport off-screen (boundary check)', () => {
    const now = Date.now();
    const canvasHeight = 850;
    const enemy = createEnemy(EnemyType.TELEPORT, 100, canvasHeight - 100, now);

    // Try to teleport from near bottom
    const futureTime = now + TELEPORT_COOLDOWN_MS;
    updateEnemyMovement(enemy, 200, 400, 30, 400, canvasHeight, 1.0, futureTime);

    // Should not teleport below canvasHeight - enemy.height
    expect(enemy.y).toBeLessThanOrEqual(canvasHeight - enemy.height);
  });

  it('applies gameSpeed multiplier to slow movement', () => {
    const now = Date.now();
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 100, now);
    const initialY = enemy.y;

    // Move with 0.5x game speed
    updateEnemyMovement(enemy, 200, 400, 30, 400, 850, 0.5, now);

    const moveWithSpeed = enemy.y - initialY;
    expect(moveWithSpeed).toBeCloseTo(0.15, 1); // 0.3 * 0.5 = 0.15
  });

  it('randomizes X position on teleport', () => {
    const now = Date.now();
    const canvasWidth = 400;
    const positions: number[] = [];

    // Create multiple enemies and teleport them to gather X positions
    for (let i = 0; i < 20; i++) {
      const enemy = createEnemy(EnemyType.TELEPORT, 100, 100, now);
      updateEnemyMovement(enemy, 200, 400, 30, canvasWidth, 850, 1.0, now + TELEPORT_COOLDOWN_MS);
      positions.push(enemy.x);
    }

    // With 20 samples, should have significant variation (expect most to be unique within canvasWidth)
    // All positions should be within valid bounds
    const inBounds = positions.every(x => x >= 0 && x <= canvasWidth - 25); // 25 = TELEPORT size
    expect(inBounds).toBe(true);

    // Should have good spread of positions across canvas
    const minPos = Math.min(...positions);
    const maxPos = Math.max(...positions);
    expect(maxPos - minPos).toBeGreaterThan(100); // At least 100px spread
  });
});

