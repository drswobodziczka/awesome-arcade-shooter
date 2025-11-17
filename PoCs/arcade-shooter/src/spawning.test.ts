import { describe, it, expect, beforeEach } from 'vitest';
import { spawnEnemies, SpawnTimers, SpawnConfig } from './spawning';
import { Enemy, EnemyType } from './enemies';

describe('Enemy Spawning', () => {
  let enemies: Enemy[];
  let timers: SpawnTimers;
  let config: SpawnConfig;

  beforeEach(() => {
    enemies = [];
    timers = {
      lastStandardSpawn: 0,
      lastYellowSpawn: 0,
      lastPurpleSpawn: 0,
      lastTankSpawn: 0,
    };
    config = {
      canvasWidth: 400,
      standardInterval: 1000,
      specialInterval: 4500,
    };
  });

  describe('STANDARD enemy spawning', () => {
    it('spawns STANDARD enemy after interval', () => {
      const gameTime = 0;
      const now = 1001; // Must be > interval (1000ms)

      spawnEnemies(enemies, timers, gameTime, now, config);

      expect(enemies).toHaveLength(1);
      expect(enemies[0].type).toBe(EnemyType.STANDARD);
      expect(timers.lastStandardSpawn).toBe(now);
    });

    it('does not spawn STANDARD before interval', () => {
      const gameTime = 0;
      timers.lastStandardSpawn = 500;
      const now = 1000; // Only 500ms elapsed

      spawnEnemies(enemies, timers, gameTime, now, config);

      expect(enemies).toHaveLength(0);
    });

    it('spawns STANDARD at top of screen', () => {
      spawnEnemies(enemies, timers, 0, 1001, config);

      expect(enemies[0].y).toBeLessThan(0); // Above screen
    });

    it('spawns STANDARD within canvas width', () => {
      spawnEnemies(enemies, timers, 0, 1001, config);

      expect(enemies[0].x).toBeGreaterThanOrEqual(0);
      expect(enemies[0].x + enemies[0].width).toBeLessThanOrEqual(config.canvasWidth);
    });
  });

  describe('YELLOW enemy spawning', () => {
    it('does not spawn YELLOW before unlock time', () => {
      const gameTime = 9999; // Before 10s
      const now = 5000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      const yellowEnemies = enemies.filter((e) => e.type === EnemyType.YELLOW);
      expect(yellowEnemies).toHaveLength(0);
    });

    it('spawns YELLOW after unlock time and interval', () => {
      const gameTime = 10000; // 10s
      const now = 5000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      const yellowEnemies = enemies.filter((e) => e.type === EnemyType.YELLOW);
      expect(yellowEnemies).toHaveLength(1);
      expect(timers.lastYellowSpawn).toBe(now);
    });

    it('does not spawn YELLOW before special interval', () => {
      const gameTime = 10000;
      timers.lastYellowSpawn = 2000;
      const now = 5000; // Only 3000ms elapsed, needs 4500ms

      spawnEnemies(enemies, timers, gameTime, now, config);

      const yellowEnemies = enemies.filter((e) => e.type === EnemyType.YELLOW);
      expect(yellowEnemies).toHaveLength(0);
    });
  });

  describe('PURPLE enemy spawning', () => {
    it('does not spawn PURPLE before unlock time', () => {
      const gameTime = 19999; // Before 20s
      const now = 5000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      const purpleEnemies = enemies.filter((e) => e.type === EnemyType.PURPLE);
      expect(purpleEnemies).toHaveLength(0);
    });

    it('spawns PURPLE after unlock time and interval', () => {
      const gameTime = 20000; // 20s
      const now = 5000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      const purpleEnemies = enemies.filter((e) => e.type === EnemyType.PURPLE);
      expect(purpleEnemies).toHaveLength(1);
      expect(timers.lastPurpleSpawn).toBe(now);
    });
  });

  describe('TANK enemy spawning', () => {
    it('does not spawn TANK before unlock time', () => {
      const gameTime = 19999; // Before 20s
      const now = 5000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      const tankEnemies = enemies.filter((e) => e.type === EnemyType.TANK);
      expect(tankEnemies).toHaveLength(0);
    });

    it('spawns TANK after unlock time and interval', () => {
      const gameTime = 20000; // 20s
      const now = 5000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      const tankEnemies = enemies.filter((e) => e.type === EnemyType.TANK);
      expect(tankEnemies).toHaveLength(1);
      expect(timers.lastTankSpawn).toBe(now);
    });

    it('spawns TANK with correct HP', () => {
      const gameTime = 20000;
      const now = 5000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      const tankEnemy = enemies.find((e) => e.type === EnemyType.TANK);
      expect(tankEnemy?.hp).toBe(5);
      expect(tankEnemy?.maxHp).toBe(5);
    });
  });

  describe('Multiple enemy type spawning', () => {
    it('spawns both STANDARD and special enemies when unlocked', () => {
      const gameTime = 20000; // All unlocked
      const now = 10000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      expect(enemies.length).toBeGreaterThan(1);
      expect(enemies.some((e) => e.type === EnemyType.STANDARD)).toBe(true);
    });

    it('updates all timers correctly after spawning', () => {
      const gameTime = 20000;
      const now = 10000;

      spawnEnemies(enemies, timers, gameTime, now, config);

      expect(timers.lastStandardSpawn).toBe(now);
      expect(timers.lastYellowSpawn).toBe(now);
      expect(timers.lastPurpleSpawn).toBe(now);
      expect(timers.lastTankSpawn).toBe(now);
    });
  });

  describe('Spawn rate differences', () => {
    it('STANDARD spawns faster than special enemies', () => {
      expect(config.standardInterval).toBeLessThan(config.specialInterval);
      expect(config.standardInterval).toBe(1000);
      expect(config.specialInterval).toBe(4500);
    });

    it('special enemies spawn approximately 4.5x slower than STANDARD', () => {
      const ratio = config.specialInterval / config.standardInterval;
      expect(ratio).toBe(4.5);
    });
  });
});
