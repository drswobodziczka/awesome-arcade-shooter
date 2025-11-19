/**
 * @file utils.ts
 * @description Core utility types and functions for game object management.
 * Provides base interfaces and collision detection using AABB algorithm.
 */

/**
 * Base interface for all game objects with rectangular bounds.
 * Used for collision detection and rendering.
 */
export interface GameObject {
  /** X position in canvas coordinates (pixels from left edge) */
  x: number;
  /** Y position in canvas coordinates (pixels from top edge) */
  y: number;
  /** Width of the object's bounding box in pixels */
  width: number;
  /** Height of the object's bounding box in pixels */
  height: number;
}

/**
 * Detects collision between two game objects using AABB (Axis-Aligned Bounding Box) algorithm.
 *
 * @param a - First game object
 * @param b - Second game object
 * @returns true if objects overlap, false otherwise
 *
 * @example
 * if (checkCollision(player, enemy)) {
 *   // Handle collision
 * }
 */
export function checkCollision(a: GameObject, b: GameObject): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
