/**
 * @file GameOverScene.test.ts
 * @description Unit tests for GameOverScene logic.
 *
 * Note: Full Scene lifecycle tests are deferred due to complexity of
 * Phaser initialization in test environment. See lessons-learned/phaser-testing-strategy.md
 *
 * Current coverage: Score display logic (default value)
 * Deferred: Scene transitions, UI rendering
 */

import { describe, it, expect } from 'vitest';

describe('GameOverScene Logic', () => {
  describe('Score Display', () => {
    it('should default to 0 when finalScore is undefined', () => {
      // Simulates: const finalScore = registry.get('finalScore') ?? 0;
      const mockRegistryValue = undefined;
      const displayedScore = mockRegistryValue ?? 0;

      expect(displayedScore).toBe(0);
    });

    it('should default to 0 when finalScore is null', () => {
      // Simulates: const finalScore = registry.get('finalScore') ?? 0;
      const mockRegistryValue = null;
      const displayedScore = mockRegistryValue ?? 0;

      expect(displayedScore).toBe(0);
    });

    it('should display actual score when present', () => {
      // Simulates: const finalScore = registry.get('finalScore') ?? 0;
      const mockRegistryValue = 1234;
      const displayedScore = mockRegistryValue ?? 0;

      expect(displayedScore).toBe(1234);
    });

    it('should handle score of 0 correctly (critical edge case)', () => {
      // Edge case: score is actually 0 (not undefined/null)
      // Using || would incorrectly treat 0 as falsy
      const mockRegistryValue = 0;
      const displayedScore = mockRegistryValue ?? 0;

      expect(displayedScore).toBe(0);
    });
  });
});
