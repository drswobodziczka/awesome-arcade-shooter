/**
 * @file spawning.ts
 * @description Enemy spawning system with time-based intervals and progressive unlocking.
 * Manages spawn timers and coordinates enemy creation across multiple types.
 */

import { Enemy, EnemyType, createEnemy, getEnemyProperties, isEnemyTypeUnlocked } from './enemies';

/**
 * Tracks the last spawn timestamp for each enemy type.
 * Used to enforce spawn interval cooldowns.
 */
export interface SpawnTimers {
  /** Last time a STANDARD enemy spawned (ms timestamp) */
  lastStandardSpawn: number;
  /** Last time a YELLOW enemy spawned (ms timestamp) */
  lastYellowSpawn: number;
  /** Last time a PURPLE enemy spawned (ms timestamp) */
  lastPurpleSpawn: number;
  /** Last time a TANK enemy spawned (ms timestamp) */
  lastTankSpawn: number;
  lastTeleportSpawn: number;
}

/**
 * Configuration for spawn system behavior.
 */
export interface SpawnConfig {
  /** Canvas width in pixels for random X positioning */
  canvasWidth: number;
  /** Spawn interval for STANDARD enemies in milliseconds */
  standardInterval: number;
  /** Spawn interval for special enemies (YELLOW/PURPLE/TANK) in milliseconds */
  specialInterval: number;
}

/**
 * Main spawning function that handles all enemy type spawns.
 * Checks unlock conditions, spawn intervals, and adds new enemies to the game.
 *
 * Spawn rates:
 * - STANDARD: Every 1000ms (1 second)
 * - Special types: Every 4500ms (~4.5 seconds)
 *
 * Enemies spawn at random X position, above screen (Y = -size).
 * Mutates the enemies array and timers object.
 *
 * @param enemies - Game's enemy array (mutated by pushing new enemies)
 * @param timers - Spawn timer state (mutated when enemies spawn)
 * @param gameTime - Milliseconds since game start (for unlock checks)
 * @param now - Current timestamp in milliseconds
 * @param config - Spawn configuration with intervals and canvas dimensions
 */
export function spawnEnemies(
  enemies: Enemy[],
  timers: SpawnTimers,
  gameTime: number,
  now: number,
  config: SpawnConfig
): void {
  // Spawn standard enemies
  if (now - timers.lastStandardSpawn > config.standardInterval) {
    const props = getEnemyProperties(EnemyType.STANDARD);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.STANDARD, x, -props.size, now));
    timers.lastStandardSpawn = now;
  }

  // Spawn YELLOW enemies (after 30s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.YELLOW, gameTime) &&
    now - timers.lastYellowSpawn > config.specialInterval
  ) {
    const props = getEnemyProperties(EnemyType.YELLOW);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.YELLOW, x, -props.size, now));
    timers.lastYellowSpawn = now;
  }

  // Spawn PURPLE enemies (after 60s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.PURPLE, gameTime) &&
    now - timers.lastPurpleSpawn > config.specialInterval
  ) {
    const props = getEnemyProperties(EnemyType.PURPLE);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.PURPLE, x, -props.size, now));
    timers.lastPurpleSpawn = now;
  }

  // Spawn TANK enemies (after 120s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.TANK, gameTime) &&
    now - timers.lastTankSpawn > config.specialInterval
  ) {
    const props = getEnemyProperties(EnemyType.TANK);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.TANK, x, -props.size, now));
    timers.lastTankSpawn = now;
  }

  // Spawn TELEPORT enemies (after 30s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.TELEPORT, gameTime) &&
    now - timers.lastTeleportSpawn > config.specialInterval
  ) {
    const props = getEnemyProperties(EnemyType.TELEPORT);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.TELEPORT, x, -props.size, now));
    timers.lastTeleportSpawn = now;
  }
}
