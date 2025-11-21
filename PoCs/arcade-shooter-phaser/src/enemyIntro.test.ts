/**
 * @file enemyIntro.test.ts
 * @description Tests for enemy introduction modal system.
 */

import { describe, it, expect, vi } from 'vitest';

// Mock Phaser before importing enemyIntro
vi.mock('phaser', () => ({
  default: class MockPhaser {
    static Game = class MockGame {
      constructor() {}
      destroy() {}
    };
    static Scene = class MockScene {};
  },
}));

import { isFirstEncounter, markAsEncountered } from './enemyIntro';
import { EnemyType } from './enemies';

describe('isFirstEncounter', () => {
  it('returns true when enemy type not in set', () => {
    const encountered = new Set<EnemyType>();
    expect(isFirstEncounter(EnemyType.STANDARD, encountered)).toBe(true);
  });

  it('returns false when enemy type already in set', () => {
    const encountered = new Set([EnemyType.STANDARD]);
    expect(isFirstEncounter(EnemyType.STANDARD, encountered)).toBe(false);
  });

  it('returns true for different enemy type not in set', () => {
    const encountered = new Set([EnemyType.STANDARD]);
    expect(isFirstEncounter(EnemyType.YELLOW, encountered)).toBe(true);
  });

  it('handles multiple enemy types in set', () => {
    const encountered = new Set([EnemyType.STANDARD, EnemyType.YELLOW, EnemyType.PURPLE]);
    expect(isFirstEncounter(EnemyType.TANK, encountered)).toBe(true);
    expect(isFirstEncounter(EnemyType.YELLOW, encountered)).toBe(false);
  });

  it('handles empty set', () => {
    const encountered = new Set<EnemyType>();
    expect(isFirstEncounter(EnemyType.TANK, encountered)).toBe(true);
  });
});

describe('markAsEncountered', () => {
  it('adds enemy type to empty set', () => {
    const encountered = new Set<EnemyType>();
    markAsEncountered(EnemyType.YELLOW, encountered);
    expect(encountered.has(EnemyType.YELLOW)).toBe(true);
    expect(encountered.size).toBe(1);
  });

  it('adds enemy type to existing set', () => {
    const encountered = new Set([EnemyType.STANDARD]);
    markAsEncountered(EnemyType.YELLOW, encountered);
    expect(encountered.has(EnemyType.YELLOW)).toBe(true);
    expect(encountered.has(EnemyType.STANDARD)).toBe(true);
    expect(encountered.size).toBe(2);
  });

  it('does not duplicate enemy type if already present', () => {
    const encountered = new Set([EnemyType.STANDARD]);
    markAsEncountered(EnemyType.STANDARD, encountered);
    expect(encountered.size).toBe(1);
    expect(encountered.has(EnemyType.STANDARD)).toBe(true);
  });

  it('mutates the original set', () => {
    const encountered = new Set<EnemyType>();
    markAsEncountered(EnemyType.PURPLE, encountered);
    markAsEncountered(EnemyType.TANK, encountered);
    expect(encountered.has(EnemyType.PURPLE)).toBe(true);
    expect(encountered.has(EnemyType.TANK)).toBe(true);
    expect(encountered.size).toBe(2);
  });

  it('handles all enemy types', () => {
    const encountered = new Set<EnemyType>();
    markAsEncountered(EnemyType.STANDARD, encountered);
    markAsEncountered(EnemyType.YELLOW, encountered);
    markAsEncountered(EnemyType.PURPLE, encountered);
    markAsEncountered(EnemyType.TANK, encountered);
    expect(encountered.size).toBe(4);
    expect(encountered.has(EnemyType.STANDARD)).toBe(true);
    expect(encountered.has(EnemyType.YELLOW)).toBe(true);
    expect(encountered.has(EnemyType.PURPLE)).toBe(true);
    expect(encountered.has(EnemyType.TANK)).toBe(true);
  });
});
