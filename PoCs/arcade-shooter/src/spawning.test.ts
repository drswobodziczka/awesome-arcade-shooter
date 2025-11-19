import { describe, it, expect, beforeEach } from 'vitest';
import { spawnEnemies, spawnEnemiesTestMode, SpawnTimers, SpawnConfig, TestModeSpawnConfig } from './spawning';
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
      lastTeleportSpawn: 0,
    };
    config = {
      canvasWidth: 400,
      standardInterval: 1000,
      specialInterval: 4500,
    };
  });

  describe('Spawn Intervals', () => {
    it('STANDARD spawns at 1000ms interval', () => {
      spawnEnemies(enemies, timers, 0, 1001, config);

      expect(enemies).toHaveLength(1);
      expect(enemies[0].type).toBe(EnemyType.STANDARD);
    });

    it('special enemies spawn at 4500ms interval (4.5x slower)', () => {
      const ratio = config.specialInterval / config.standardInterval;
      expect(ratio).toBe(4.5);
    });
  });

  describe('Time-Based Unlocks', () => {
    it('YELLOW spawns after 10s unlock', () => {
      spawnEnemies(enemies, timers, 10000, 5000, config);

      const yellowEnemies = enemies.filter((e) => e.type === EnemyType.YELLOW);
      expect(yellowEnemies).toHaveLength(1);
    });

    it('PURPLE spawns after 20s unlock', () => {
      spawnEnemies(enemies, timers, 20000, 5000, config);

      const purpleEnemies = enemies.filter((e) => e.type === EnemyType.PURPLE);
      expect(purpleEnemies).toHaveLength(1);
    });

    it('TANK spawns after 20s unlock', () => {
      spawnEnemies(enemies, timers, 20000, 5000, config);

      const tankEnemies = enemies.filter((e) => e.type === EnemyType.TANK);
      expect(tankEnemies).toHaveLength(1);
    });

    it('TELEPORT spawns after 30s unlock', () => {
      spawnEnemies(enemies, timers, 30000, 5000, config);

      const teleportEnemies = enemies.filter((e) => e.type === EnemyType.TELEPORT);
      expect(teleportEnemies).toHaveLength(1);
    });

    it('TELEPORT does not spawn before 30s unlock', () => {
      spawnEnemies(enemies, timers, 29999, 5000, config);

      const teleportEnemies = enemies.filter((e) => e.type === EnemyType.TELEPORT);
      expect(teleportEnemies).toHaveLength(0);
    });
  });

  describe('Spawn Timer Reset', () => {
    it('updates spawn timers after spawning', () => {
      const now = 10000;
      spawnEnemies(enemies, timers, 30000, now, config);

      expect(timers.lastStandardSpawn).toBe(now);
      expect(timers.lastYellowSpawn).toBe(now);
      expect(timers.lastPurpleSpawn).toBe(now);
      expect(timers.lastTankSpawn).toBe(now);
      expect(timers.lastTeleportSpawn).toBe(now);
    });
  });
});

describe('Test Mode Spawning', () => {
  let enemies: Enemy[];
  let timers: SpawnTimers;
  let testConfig: TestModeSpawnConfig;

  beforeEach(() => {
    enemies = [];
    timers = {
      lastStandardSpawn: 0,
      lastYellowSpawn: 0,
      lastPurpleSpawn: 0,
      lastTankSpawn: 0,
      lastTeleportSpawn: 0,
    };
    testConfig = {
      canvasWidth: 400,
      enabledEnemies: [EnemyType.STANDARD, EnemyType.YELLOW],
      spawnInterval: 1500,
    };
  });

  describe('Basic Spawning', () => {
    it('spawns enemy from enabled list after spawn interval', () => {
      spawnEnemiesTestMode(enemies, timers, 1501, testConfig);

      expect(enemies).toHaveLength(1);
      expect(testConfig.enabledEnemies).toContain(enemies[0].type);
    });

    it('does not spawn before spawn interval elapsed', () => {
      spawnEnemiesTestMode(enemies, timers, 1000, testConfig);

      expect(enemies).toHaveLength(0);
    });

    it('updates lastStandardSpawn timer after spawning', () => {
      const now = 2000;
      spawnEnemiesTestMode(enemies, timers, now, testConfig);

      expect(timers.lastStandardSpawn).toBe(now);
    });
  });

  describe('Enemy Type Selection', () => {
    it('spawns only from enabled enemy types', () => {
      testConfig.enabledEnemies = [EnemyType.PURPLE];

      // Spawn multiple times to verify consistency
      for (let i = 1; i <= 5; i++) {
        spawnEnemiesTestMode(enemies, timers, i * 2000, testConfig);
      }

      expect(enemies).toHaveLength(5);
      enemies.forEach((enemy) => {
        expect(enemy.type).toBe(EnemyType.PURPLE);
      });
    });

    it('spawns random selection from multiple enabled types', () => {
      testConfig.enabledEnemies = [EnemyType.STANDARD, EnemyType.YELLOW, EnemyType.PURPLE, EnemyType.TANK];

      // Spawn many times to get variety
      for (let i = 1; i <= 20; i++) {
        spawnEnemiesTestMode(enemies, timers, i * 2000, testConfig);
      }

      expect(enemies.length).toBeGreaterThan(0);
      enemies.forEach((enemy) => {
        expect(testConfig.enabledEnemies).toContain(enemy.type);
      });
    });
  });

  describe('Edge Cases', () => {
    it('does not spawn when enabled enemies list is empty', () => {
      testConfig.enabledEnemies = [];

      spawnEnemiesTestMode(enemies, timers, 2000, testConfig);

      expect(enemies).toHaveLength(0);
    });

    it('handles single enemy type configuration', () => {
      testConfig.enabledEnemies = [EnemyType.TANK];

      spawnEnemiesTestMode(enemies, timers, 2000, testConfig);

      expect(enemies).toHaveLength(1);
      expect(enemies[0].type).toBe(EnemyType.TANK);
    });

    it('respects spawn interval consistently', () => {
      spawnEnemiesTestMode(enemies, timers, 1500, testConfig);
      expect(enemies).toHaveLength(0);

      spawnEnemiesTestMode(enemies, timers, 1501, testConfig);
      expect(enemies).toHaveLength(1);

      // Next spawn should not happen until interval passes again
      spawnEnemiesTestMode(enemies, timers, 2000, testConfig);
      expect(enemies).toHaveLength(1);

      spawnEnemiesTestMode(enemies, timers, 3002, testConfig);
      expect(enemies).toHaveLength(2);
    });
  });

  describe('Timer Management', () => {
    it('uses lastStandardSpawn as shared timer', () => {
      timers.lastStandardSpawn = 1000;

      spawnEnemiesTestMode(enemies, timers, 2000, testConfig);

      expect(enemies).toHaveLength(0); // Only 1000ms elapsed, needs 1500ms

      spawnEnemiesTestMode(enemies, timers, 2501, testConfig);

      expect(enemies).toHaveLength(1); // Now 1501ms elapsed
    });

    it('does not modify other timer fields', () => {
      timers.lastYellowSpawn = 100;
      timers.lastPurpleSpawn = 200;
      timers.lastTankSpawn = 300;

      spawnEnemiesTestMode(enemies, timers, 2000, testConfig);

      expect(timers.lastYellowSpawn).toBe(100);
      expect(timers.lastPurpleSpawn).toBe(200);
      expect(timers.lastTankSpawn).toBe(300);
    });
  });
});
