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
