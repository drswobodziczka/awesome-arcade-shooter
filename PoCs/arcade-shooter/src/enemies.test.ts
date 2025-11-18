import { describe, it, expect } from 'vitest';
import {
  EnemyType,
  getEnemyProperties,
  createEnemy,
  updateEnemyMovement,
  isEnemyTypeUnlocked,
} from './enemies';

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

  it('TELEPORT enemy is slightly smaller than player (25px)', () => {
    const props = getEnemyProperties(EnemyType.TELEPORT);
    expect(props.size).toBe(25);
  });

  it('TELEPORT enemy has slow speed between teleports', () => {
    const props = getEnemyProperties(EnemyType.TELEPORT);
    expect(props.speed).toBe(0.3);
  });

  it('TELEPORT enemy can shoot with 1500ms interval', () => {
    const props = getEnemyProperties(EnemyType.TELEPORT);
    expect(props.canShoot).toBe(true);
    expect(props.shootInterval).toBe(1500);
  });
});

describe('Enemy Movement - Boundary Fixes', () => {
  it('YELLOW enemy is forced downward when going above screen (y < 0)', () => {
    const enemy = createEnemy(EnemyType.YELLOW, 100, -10, 0);
    enemy.vy = -1.5; // moving upward

    updateEnemyMovement(enemy, 200, 400, 30, 400, 600);

    expect(enemy.vy).toBeGreaterThan(0); // Should be forced downward
  });

  it('PURPLE enemy tracks player using dynamic playerWidth', () => {
    const enemy = createEnemy(EnemyType.PURPLE, 100, 50, 0);
    const playerX = 200;
    const playerWidth = 50; // Different from hardcoded 30
    const initialX = enemy.x;

    updateEnemyMovement(enemy, playerX, 400, playerWidth, 400, 600);

    // Enemy should move toward playerX + playerWidth/2 = 225
    expect(enemy.x).toBeGreaterThan(initialX);
  });
});

describe('TELEPORT Enemy Movement', () => {
  it('teleports after 1 second interval', () => {
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 50, 1000);
    const initialY = enemy.y;

    // Call with time 1000ms later (teleport should occur)
    updateEnemyMovement(enemy, 200, 400, 30, 400, 600, 2000);

    // Enemy should have teleported down by 100-150px
    expect(enemy.y).toBeGreaterThan(initialY + 90); // At least 100 - some margin
    expect(enemy.y).toBeLessThan(initialY + 160); // At most 150 + some margin
  });

  it('does not teleport if less than 1 second has passed', () => {
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 50, 1000);
    const initialY = enemy.y;
    const initialX = enemy.x;

    // Call with time 500ms later (no teleport should occur)
    updateEnemyMovement(enemy, 200, 400, 30, 400, 600, 1500);

    // Enemy should have only moved slowly down (0.3px)
    expect(enemy.y).toBe(initialY + 0.3);
    expect(enemy.x).toBe(initialX); // X should not change
  });

  it('does not teleport if it would go off-screen', () => {
    const canvasHeight = 600;
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 550, 1000); // Near bottom
    const initialY = enemy.y;

    // Teleport would put enemy at 550 + 100-150 = 650-700, which is off-screen
    updateEnemyMovement(enemy, 200, 400, 30, 400, canvasHeight, 2000);

    // Enemy should NOT have teleported (teleport distance would exceed bounds)
    // It should only have moved slowly down by 0.3px
    expect(enemy.y).toBe(initialY + 0.3);
  });

  it('teleports if new position is within canvas bounds', () => {
    const canvasHeight = 600;
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 400, 1000);
    const initialY = enemy.y;

    // Teleport would put enemy at 400 + 100-150 = 500-550, which is within bounds
    updateEnemyMovement(enemy, 200, 400, 30, 400, canvasHeight, 2000);

    // Enemy should have teleported
    expect(enemy.y).toBeGreaterThan(initialY + 90);
  });

  it('moves slowly downward between teleports', () => {
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 50, 1000);
    const initialY = enemy.y;

    // Call with same time (no teleport)
    updateEnemyMovement(enemy, 200, 400, 30, 400, 600, 1000);

    // Should move down by speed (0.3)
    expect(enemy.y).toBe(initialY + 0.3);
  });

  it('randomizes X position after teleport', () => {
    const canvasWidth = 400;
    const positions = new Set<number>();

    // Create multiple enemies and teleport them
    for (let i = 0; i < 10; i++) {
      const enemy = createEnemy(EnemyType.TELEPORT, 100, 50, 1000);
      updateEnemyMovement(enemy, 200, 400, 30, canvasWidth, 600, 2000);
      positions.add(Math.floor(enemy.x));
    }

    // Should have at least 3 different positions (very likely with randomization)
    expect(positions.size).toBeGreaterThan(2);
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
    const now = 5000;
    const enemy = createEnemy(EnemyType.TELEPORT, 100, 50, now);
    expect(enemy.lastTeleport).toBe(now);
    expect(enemy.hp).toBe(1);
    expect(enemy.maxHp).toBe(1);
  });
});

