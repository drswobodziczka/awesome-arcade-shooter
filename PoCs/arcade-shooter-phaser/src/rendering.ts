/**
 * @file rendering.ts
 * @description Canvas 2D rendering system for all game visuals.
 * Handles drawing player, enemies, bullets, HP bars, and game over screen.
 */

import { GameObject } from './utils';
import { Enemy, EnemyType, getEnemyProperties } from './enemies';

/**
 * Bullet game object with velocity properties.
 * Extends GameObject with directional movement.
 */
export interface Bullet extends GameObject {
  /** Vertical velocity in pixels per frame (negative = upward, positive = downward) */
  vy: number;
  /** Optional horizontal velocity for diagonal shots (e.g., YELLOW enemy triple-spread) */
  vx?: number;
}

/**
 * Canvas dimensions for rendering bounds.
 */
export interface RenderConfig {
  /** Canvas width in pixels */
  canvasWidth: number;
  /** Canvas height in pixels */
  canvasHeight: number;
}

/**
 * Draws a triangle shape on the canvas.
 * Used for player (points up) and enemies (point down).
 *
 * @param ctx - Canvas 2D rendering context
 * @param obj - Game object with position and dimensions
 * @param pointUp - true for upward-pointing triangle (player), false for downward (enemies)
 */
export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  obj: GameObject,
  pointUp: boolean
): void {
  ctx.beginPath();
  if (pointUp) {
    ctx.moveTo(obj.x + obj.width / 2, obj.y);
    ctx.lineTo(obj.x, obj.y + obj.height);
    ctx.lineTo(obj.x + obj.width, obj.y + obj.height);
  } else {
    ctx.moveTo(obj.x + obj.width / 2, obj.y + obj.height);
    ctx.lineTo(obj.x, obj.y);
    ctx.lineTo(obj.x + obj.width, obj.y);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Renders all bullets of a specific type (player or enemy).
 *
 * @param ctx - Canvas 2D rendering context
 * @param bullets - Array of bullets to render
 * @param color - CSS color string for bullet fill (green for player, orange for enemies)
 */
export function drawBullets(
  ctx: CanvasRenderingContext2D,
  bullets: Bullet[],
  color: string
): void {
  ctx.fillStyle = color;
  for (const bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

/**
 * Main rendering function that draws the entire game scene.
 *
 * Render order (back to front):
 * 1. Background (dark blue)
 * 2. Player (cyan triangle pointing up)
 * 3. Bullets (green for player, orange for enemies)
 * 4. Enemies (colored triangles pointing down, with HP bars for TANKs)
 *
 * @param ctx - Canvas 2D rendering context
 * @param player - Player game object
 * @param enemies - Array of all active enemies
 * @param bullets - Array of player bullets
 * @param enemyBullets - Array of enemy bullets
 * @param config - Canvas dimensions for clearing
 */
export function draw(
  ctx: CanvasRenderingContext2D,
  player: GameObject,
  enemies: Enemy[],
  bullets: Bullet[],
  enemyBullets: Bullet[],
  config: RenderConfig
): void {
  // Clear canvas
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

  // Draw player
  ctx.fillStyle = '#00d4ff';
  drawTriangle(ctx, player, true);

  // Draw bullets
  drawBullets(ctx, bullets, '#00ff00');
  drawBullets(ctx, enemyBullets, '#ff6b00');

  // Draw enemies
  for (const enemy of enemies) {
    const props = getEnemyProperties(enemy.type);
    ctx.fillStyle = props.color;
    drawTriangle(ctx, enemy, false);

    // Draw HP bar for TANK enemies
    if (enemy.type === EnemyType.TANK) {
      const barWidth = enemy.width;
      const barHeight = 4;
      const barX = enemy.x;
      const barY = enemy.y - 8;

      // Background
      ctx.fillStyle = '#333';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // HP bar
      const hpRatio = enemy.hp / enemy.maxHp;
      ctx.fillStyle = hpRatio > 0.5 ? '#2ecc71' : hpRatio > 0.25 ? '#f39c12' : '#e74c3c';
      ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }
  }
}

/**
 * Renders the game over overlay with final score and restart prompt.
 *
 * Layout:
 * - Semi-transparent black overlay
 * - "GAME OVER" in large red text
 * - Final score in white
 * - Restart instruction ("Press Enter to restart")
 *
 * @param ctx - Canvas 2D rendering context
 * @param score - Final score to display
 * @param config - Canvas dimensions for centering text
 */
export function drawGameOver(
  ctx: CanvasRenderingContext2D,
  score: number,
  config: RenderConfig
): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

  ctx.fillStyle = '#e94560';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', config.canvasWidth / 2, config.canvasHeight / 2 - 40);

  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, config.canvasWidth / 2, config.canvasHeight / 2 + 10);

  ctx.font = '18px Arial';
  ctx.fillText('Press Enter to restart', config.canvasWidth / 2, config.canvasHeight / 2 + 50);
}
