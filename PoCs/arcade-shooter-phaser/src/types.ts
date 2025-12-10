/**
 * @file types.ts
 * @description Type definitions for Phaser game registry and shared types.
 */

import { EnemyType } from './enemies';

/**
 * Configuration for game speeds and intervals.
 */
export interface GameConfig {
  // Speed settings
  gameSpeed: number;
  playerSpeed: number;
  bulletSpeed: number;
  enemyBulletSpeedMult: number;

  // Shooting intervals (ms)
  playerShootInterval: number;
  enemyShootIntervals: {
    [EnemyType.STANDARD]: number;
    [EnemyType.YELLOW]: number;
    [EnemyType.PURPLE]: number;
    [EnemyType.TANK]: number;
    [EnemyType.TELEPORT]: number;
  };

  // Spawning intervals (ms)
  standardSpawnInterval: number;
  specialSpawnInterval: number;
  testSpawnInterval: number;
}

/**
 * Type-safe interface for game registry values.
 * Registry is used to pass data between scenes.
 */
export interface GameRegistry {
  /** Game mode: 'normal' for progressive spawning, 'test' for custom selection */
  gameMode: 'normal' | 'test';
  /** Enabled enemy types for test mode */
  enabledEnemies: EnemyType[];
  /** Final score when game ends */
  finalScore: number;
  /** Game configuration */
  config: GameConfig;
}

/**
 * Registry keys for type-safe access.
 */
export type GameRegistryKey = keyof GameRegistry;

/**
 * Returns default game configuration.
 */
export function getDefaultConfig(): GameConfig {
  return {
    gameSpeed: 0.8,
    playerSpeed: 5,
    bulletSpeed: 7,
    enemyBulletSpeedMult: 0.7,
    playerShootInterval: 200,
    enemyShootIntervals: {
      [EnemyType.STANDARD]: 1000,
      [EnemyType.YELLOW]: 1500,
      [EnemyType.PURPLE]: 0,
      [EnemyType.TANK]: 2000,
      [EnemyType.TELEPORT]: 1500,
    },
    standardSpawnInterval: 1000,
    specialSpawnInterval: 4500,
    testSpawnInterval: 1500,
  };
}

/**
 * Validates test mode configuration.
 * @param mode - The selected game mode
 * @param selectedEnemies - Set of selected enemy types
 * @returns Error message if validation fails, null if valid
 */
export function validateTestModeConfig(
  mode: 'normal' | 'test',
  selectedEnemies: Set<EnemyType>
): string | null {
  if (mode === 'test' && selectedEnemies.size === 0) {
    return '⚠️ Please select at least one enemy for test mode';
  }
  return null;
}
