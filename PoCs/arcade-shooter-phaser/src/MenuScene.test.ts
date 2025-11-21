/**
 * @file MenuScene.test.ts
 * @description Unit tests for MenuScene validation logic.
 *
 * Note: Full Scene lifecycle tests are deferred due to complexity of
 * Phaser initialization in test environment. See lessons-learned/phaser-testing-strategy.md
 */

import { describe, it, expect } from 'vitest';
import { EnemyType } from './enemies';
import { validateTestModeConfig } from './types';

describe('MenuScene Validation', () => {
  describe('validateTestModeConfig', () => {
    it('returns null for normal mode regardless of enemy selection', () => {
      const emptySet = new Set<EnemyType>();
      const error = validateTestModeConfig('normal', emptySet);
      expect(error).toBeNull();
    });

    it('returns null for normal mode with enemies selected', () => {
      const enemies = new Set([EnemyType.STANDARD, EnemyType.YELLOW]);
      const error = validateTestModeConfig('normal', enemies);
      expect(error).toBeNull();
    });

    it('returns error for test mode with no enemies selected', () => {
      const emptySet = new Set<EnemyType>();
      const error = validateTestModeConfig('test', emptySet);
      expect(error).toBe('⚠️ Please select at least one enemy for test mode');
    });

    it('returns null for test mode with one enemy selected', () => {
      const enemies = new Set([EnemyType.STANDARD]);
      const error = validateTestModeConfig('test', enemies);
      expect(error).toBeNull();
    });

    it('returns null for test mode with multiple enemies selected', () => {
      const enemies = new Set([
        EnemyType.STANDARD,
        EnemyType.YELLOW,
        EnemyType.PURPLE,
        EnemyType.TANK,
      ]);
      const error = validateTestModeConfig('test', enemies);
      expect(error).toBeNull();
    });

    it('handles edge case with all enemy types selected', () => {
      const allEnemies = new Set(Object.values(EnemyType));
      const error = validateTestModeConfig('test', allEnemies);
      expect(error).toBeNull();
    });
  });
});
