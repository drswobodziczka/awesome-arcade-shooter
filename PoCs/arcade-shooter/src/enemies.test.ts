import { describe, it, expect } from 'vitest';
import {
  EnemyType,
  getEnemyProperties,
  createEnemy,
  updateEnemyMovement,
  isEnemyTypeUnlocked,
} from './enemies';

describe('Enemy Properties', () => {
  it('STANDARD enemy has correct properties', () => {
    const props = getEnemyProperties(EnemyType.STANDARD);
    expect(props.size).toBe(30);
    expect(props.hp).toBe(1);
    expect(props.canShoot).toBe(true);
    expect(props.color).toBe('#e94560');
  });

  it('YELLOW enemy is 2x larger and has correct properties', () => {
    const props = getEnemyProperties(EnemyType.YELLOW);
    expect(props.size).toBe(60); // 2x of standard
    expect(props.hp).toBe(1);
    expect(props.canShoot).toBe(true);
    expect(props.color).toBe('#ffd700');
  });

  it('PURPLE enemy is small, does not shoot, and tracks player', () => {
    const props = getEnemyProperties(EnemyType.PURPLE);
    expect(props.size).toBe(15); // small
    expect(props.hp).toBe(1);
    expect(props.canShoot).toBe(false);
    expect(props.color).toBe('#9b59b6');
  });

  it('TANK enemy has 5 HP and is largest', () => {
    const props = getEnemyProperties(EnemyType.TANK);
    expect(props.size).toBe(90); // 3x of standard
    expect(props.hp).toBe(5);
    expect(props.canShoot).toBe(true);
    expect(props.color).toBe('#2ecc71');
  });
});

describe('Enemy Creation', () => {
  it('creates enemy with correct type and position', () => {
    const enemy = createEnemy(EnemyType.STANDARD, 100, 200, 1000);
    expect(enemy.type).toBe(EnemyType.STANDARD);
    expect(enemy.x).toBe(100);
    expect(enemy.y).toBe(200);
    expect(enemy.hp).toBe(enemy.maxHp);
  });

  it('creates TANK enemy with 5 HP', () => {
    const enemy = createEnemy(EnemyType.TANK, 0, 0, 0);
    expect(enemy.hp).toBe(5);
    expect(enemy.maxHp).toBe(5);
  });

  it('initializes enemy with correct dimensions', () => {
    const enemy = createEnemy(EnemyType.YELLOW, 0, 0, 0);
    expect(enemy.width).toBe(60);
    expect(enemy.height).toBe(60);
  });
});

describe('Enemy Movement - YELLOW', () => {
  it('YELLOW enemy does not reverse when y > 50', () => {
    const enemy = createEnemy(EnemyType.YELLOW, 100, 100, 0);
    enemy.vy = 1.5;
    const originalVy = enemy.vy;

    // Simulate multiple updates
    for (let i = 0; i < 100; i++) {
      updateEnemyMovement(enemy, 200, 400, 30, 400);
      // If y > 50, enemy can reverse (but rarely due to 1% chance)
      // Main test: enemy should move down overall
    }

    expect(enemy.y).toBeGreaterThan(100); // Should have moved down overall
  });

  it('YELLOW enemy is forced downward when going above screen', () => {
    const enemy = createEnemy(EnemyType.YELLOW, 100, -10, 0);
    enemy.vy = -1.5; // moving upward

    updateEnemyMovement(enemy, 200, 400, 30, 400);

    expect(enemy.vy).toBeGreaterThan(0); // Should be forced downward
  });

  it('YELLOW enemy bounces horizontally at boundaries', () => {
    const enemy = createEnemy(EnemyType.YELLOW, 0, 100, 0);
    enemy.vx = -2;

    updateEnemyMovement(enemy, 200, 400, 30, 400);

    expect(enemy.vx).toBeGreaterThan(0); // Should have reversed
    expect(enemy.x).toBeGreaterThanOrEqual(0); // Should stay in bounds
  });
});

describe('Enemy Movement - PURPLE', () => {
  it('PURPLE enemy tracks player horizontally using player width', () => {
    const enemy = createEnemy(EnemyType.PURPLE, 100, 50, 0);
    const playerX = 200;
    const playerWidth = 30;
    const initialX = enemy.x;

    updateEnemyMovement(enemy, playerX, 400, playerWidth, 400);

    // Enemy should move toward player center (playerX + playerWidth/2)
    expect(enemy.x).toBeGreaterThan(initialX); // Moving right toward player
  });

  it('PURPLE enemy stays within canvas bounds', () => {
    const enemy = createEnemy(EnemyType.PURPLE, 0, 50, 0);

    updateEnemyMovement(enemy, -100, 400, 30, 400);

    expect(enemy.x).toBeGreaterThanOrEqual(0);
    expect(enemy.x).toBeLessThanOrEqual(400 - enemy.width);
  });

  it('PURPLE enemy moves down while tracking player', () => {
    const enemy = createEnemy(EnemyType.PURPLE, 100, 50, 0);
    const initialY = enemy.y;

    updateEnemyMovement(enemy, 200, 400, 30, 400);

    expect(enemy.y).toBeGreaterThan(initialY); // Should move down
  });
});

describe('Enemy Movement - STANDARD and TANK', () => {
  it('STANDARD enemy moves down and bounces horizontally', () => {
    const enemy = createEnemy(EnemyType.STANDARD, 0, 50, 0);
    enemy.vx = -1;
    const initialY = enemy.y;

    updateEnemyMovement(enemy, 200, 400, 30, 400);

    expect(enemy.y).toBeGreaterThan(initialY); // Moves down
    expect(enemy.vx).toBeGreaterThan(0); // Bounced at left edge
  });

  it('TANK enemy moves steadily down', () => {
    const enemy = createEnemy(EnemyType.TANK, 100, 50, 0);
    const initialY = enemy.y;

    updateEnemyMovement(enemy, 200, 400, 30, 400);

    expect(enemy.y).toBeGreaterThan(initialY);
  });
});

describe('Enemy Unlock Timings', () => {
  it('STANDARD is always unlocked', () => {
    expect(isEnemyTypeUnlocked(EnemyType.STANDARD, 0)).toBe(true);
    expect(isEnemyTypeUnlocked(EnemyType.STANDARD, 5000)).toBe(true);
  });

  it('YELLOW unlocks at 10 seconds', () => {
    expect(isEnemyTypeUnlocked(EnemyType.YELLOW, 9999)).toBe(false);
    expect(isEnemyTypeUnlocked(EnemyType.YELLOW, 10000)).toBe(true);
    expect(isEnemyTypeUnlocked(EnemyType.YELLOW, 15000)).toBe(true);
  });

  it('PURPLE unlocks at 20 seconds', () => {
    expect(isEnemyTypeUnlocked(EnemyType.PURPLE, 19999)).toBe(false);
    expect(isEnemyTypeUnlocked(EnemyType.PURPLE, 20000)).toBe(true);
    expect(isEnemyTypeUnlocked(EnemyType.PURPLE, 30000)).toBe(true);
  });

  it('TANK unlocks at 20 seconds', () => {
    expect(isEnemyTypeUnlocked(EnemyType.TANK, 19999)).toBe(false);
    expect(isEnemyTypeUnlocked(EnemyType.TANK, 20000)).toBe(true);
    expect(isEnemyTypeUnlocked(EnemyType.TANK, 30000)).toBe(true);
  });
});
