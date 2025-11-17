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
});

describe('Enemy Movement - Boundary Fixes', () => {
  it('YELLOW enemy is forced downward when going above screen (y < 0)', () => {
    const enemy = createEnemy(EnemyType.YELLOW, 100, -10, 0);
    enemy.vy = -1.5; // moving upward

    updateEnemyMovement(enemy, 200, 400, 30, 400);

    expect(enemy.vy).toBeGreaterThan(0); // Should be forced downward
  });

  it('PURPLE enemy tracks player using dynamic playerWidth', () => {
    const enemy = createEnemy(EnemyType.PURPLE, 100, 50, 0);
    const playerX = 200;
    const playerWidth = 50; // Different from hardcoded 30
    const initialX = enemy.x;

    updateEnemyMovement(enemy, playerX, 400, playerWidth, 400);

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
});

describe('Enemy Creation', () => {
  it('creates TANK enemy with 5 HP initialized correctly', () => {
    const enemy = createEnemy(EnemyType.TANK, 0, 0, 0);
    expect(enemy.hp).toBe(5);
    expect(enemy.maxHp).toBe(5);
  });
});

