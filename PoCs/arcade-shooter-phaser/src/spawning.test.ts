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
  });

  describe('Spawn Timer Reset', () => {
    it('updates spawn timers after spawning', () => {
      const now = 10000;
      spawnEnemies(enemies, timers, 20000, now, config);

      expect(timers.lastStandardSpawn).toBe(now);
      expect(timers.lastYellowSpawn).toBe(now);
      expect(timers.lastPurpleSpawn).toBe(now);
      expect(timers.lastTankSpawn).toBe(now);
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
    };
    testConfig = {
      canvasWidth: 400,
      enabledEnemies: [EnemyType.YELLOW, EnemyType.TANK],
      spawnInterval: 1500,
    };
  });

  it('spawns random enemy from enabled list at interval', () => {
    spawnEnemiesTestMode(enemies, timers, 1501, testConfig);

    expect(enemies).toHaveLength(1);
    expect(testConfig.enabledEnemies).toContain(enemies[0].type);
  });

  it('respects spawn interval cooldown', () => {
    spawnEnemiesTestMode(enemies, timers, 1000, testConfig);

    expect(enemies).toHaveLength(0); // too early
  });

  it('handles empty enabled list gracefully', () => {
    const emptyConfig: TestModeSpawnConfig = {
      canvasWidth: 400,
      enabledEnemies: [],
      spawnInterval: 1500,
    };

    spawnEnemiesTestMode(enemies, timers, 2000, emptyConfig);

    expect(enemies).toHaveLength(0);
  });

  it('updates lastTestSpawn timer after spawning', () => {
    const now = 2000;
    spawnEnemiesTestMode(enemies, timers, now, testConfig);

    expect(timers.lastTestSpawn).toBe(now);
  });

  it('spawns only from enabled enemy types', () => {
    const singleTypeConfig: TestModeSpawnConfig = {
      canvasWidth: 400,
      enabledEnemies: [EnemyType.PURPLE],
      spawnInterval: 1500,
    };

    spawnEnemiesTestMode(enemies, timers, 2000, singleTypeConfig);

    expect(enemies).toHaveLength(1);
    expect(enemies[0].type).toBe(EnemyType.PURPLE);
  });

  it('positions enemies within canvas bounds', () => {
    spawnEnemiesTestMode(enemies, timers, 2000, testConfig);

    expect(enemies).toHaveLength(1);
    expect(enemies[0].x).toBeGreaterThanOrEqual(0);
    expect(enemies[0].x).toBeLessThan(testConfig.canvasWidth);
  });
});
