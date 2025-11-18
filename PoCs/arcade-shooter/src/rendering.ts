import { GameObject } from './utils';
import { Enemy, EnemyType, getEnemyProperties } from './enemies';

export interface Bullet extends GameObject {
  vy: number;
  vx?: number;
}

export interface RenderConfig {
  canvasWidth: number;
  canvasHeight: number;
}

// Draw triangle shape
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

// Draw bullets
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

// Draw main game scene
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

    // Special rendering for TELEPORT enemy
    if (enemy.type === EnemyType.TELEPORT) {
      // Cycle through colors based on time
      const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff00aa', '#00ff88'];
      const colorIndex = Math.floor(Date.now() / 300) % colors.length;
      ctx.fillStyle = colors[colorIndex];

      // Draw circle
      ctx.beginPath();
      const centerX = enemy.x + enemy.width / 2;
      const centerY = enemy.y + enemy.height / 2;
      const radius = enemy.width / 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      console.log('Rendering TELEPORT at:', enemy.x, enemy.y, 'radius:', radius, 'color:', colors[colorIndex]);
    } else {
      // Normal triangle rendering for other enemies
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
}

// Draw game over screen
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
