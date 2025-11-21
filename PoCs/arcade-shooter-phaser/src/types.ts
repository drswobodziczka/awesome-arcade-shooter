/**
 * @file types.ts
 * @description Type definitions for Phaser game registry and shared types.
 */

import { EnemyType } from './enemies';

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
}

/**
 * Registry keys for type-safe access.
 */
export type GameRegistryKey = keyof GameRegistry;
