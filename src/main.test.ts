import { describe, it, expect } from 'vitest';
import { checkCollision } from './utils';

describe('checkCollision', () => {
  it('detects collision when objects overlap', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 5, y: 5, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(true);
  });

  it('detects no collision when objects do not overlap', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 20, y: 20, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(false);
  });

  it('detects collision when objects touch edges', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 10, y: 0, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(false);
  });

  it('detects collision when one object is inside another', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    const b = { x: 25, y: 25, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(true);
  });

  it('detects no collision when objects are adjacent vertically', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 0, y: 10, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(false);
  });

  it('detects no collision when objects are adjacent horizontally', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 10, y: 0, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(false);
  });

  it('detects collision for partial overlap horizontally', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 5, y: 0, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(true);
  });

  it('detects collision for partial overlap vertically', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 0, y: 5, width: 10, height: 10 };
    expect(checkCollision(a, b)).toBe(true);
  });
});
