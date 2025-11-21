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
