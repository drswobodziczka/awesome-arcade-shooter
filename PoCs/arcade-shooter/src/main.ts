import { GameObject, checkCollision } from './utils';
import {
  Enemy,
  EnemyType,
  createEnemy,
  updateEnemyMovement,
  getEnemyProperties,
  isEnemyTypeUnlocked,
} from './enemies';

// Game configuration
const CONFIG = {
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  PLAYER_SPEED: 5,
  PLAYER_SIZE: 30,
  PLAYER_SHOOT_INTERVAL: 200,
  BULLET_SPEED: 7,
  BULLET_SIZE: 5,
  STANDARD_ENEMY_SPAWN_INTERVAL: 1500,
  SPECIAL_ENEMY_SPAWN_INTERVAL: 7500, // 5x slower for special types
  ENEMY_BULLET_SPEED_MULT: 0.7,
};

// Types

interface Bullet extends GameObject {
  vy: number;
  vx?: number; // for diagonal shots
}

// Game state
const game = {
  canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
  ctx: null as CanvasRenderingContext2D | null,
  score: 0,
  gameOver: false,
  gameStartTime: 0,
  player: {
    x: CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2,
    y: CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER_SIZE - 20,
    width: CONFIG.PLAYER_SIZE,
    height: CONFIG.PLAYER_SIZE,
  },
  bullets: [] as Bullet[],
  enemies: [] as Enemy[],
  enemyBullets: [] as Bullet[],
  keys: {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
  },
  lastStandardSpawn: 0,
  lastYellowSpawn: 0,
  lastPurpleSpawn: 0,
  lastTankSpawn: 0,
  lastPlayerShot: 0,
};

// Keyboard handler
function handleKey(code: string, pressed: boolean) {
  if (code === 'ArrowLeft') game.keys.left = pressed;
  else if (code === 'ArrowRight') game.keys.right = pressed;
  else if (code === 'ArrowUp') game.keys.up = pressed;
  else if (code === 'ArrowDown') game.keys.down = pressed;
  else if (code === 'Space') game.keys.space = pressed;
}

// Initialize game
function init() {
  game.ctx = game.canvas.getContext('2d');
  if (!game.ctx) throw new Error('Failed to get canvas context');

  game.gameStartTime = Date.now();

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') e.preventDefault();
    if (e.code === 'Enter' && game.gameOver) {
      e.preventDefault();
      location.reload();
    }
    handleKey(e.code, true);
  });

  window.addEventListener('keyup', (e) => handleKey(e.code, false));

  gameLoop();
}

// Main game loop
function gameLoop() {
  if (game.gameOver) {
    drawGameOver();
    return;
  }

  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Create bullet centered on object
function createBullet(obj: GameObject, speed: number): Bullet {
  return {
    x: obj.x + obj.width / 2 - CONFIG.BULLET_SIZE / 2,
    y: obj.y,
    width: CONFIG.BULLET_SIZE,
    height: CONFIG.BULLET_SIZE * 2,
    vy: speed,
  };
}

// Update game state
function update() {
  const now = Date.now();

  // Move player
  if (game.keys.left && game.player.x > 0) {
    game.player.x -= CONFIG.PLAYER_SPEED;
  }
  if (game.keys.right && game.player.x < CONFIG.CANVAS_WIDTH - game.player.width) {
    game.player.x += CONFIG.PLAYER_SPEED;
  }
  if (game.keys.up && game.player.y > 0) {
    game.player.y -= CONFIG.PLAYER_SPEED;
  }
  if (game.keys.down && game.player.y < CONFIG.CANVAS_HEIGHT - game.player.height) {
    game.player.y += CONFIG.PLAYER_SPEED;
  }

  // Player shooting
  if (game.keys.space && now - game.lastPlayerShot > CONFIG.PLAYER_SHOOT_INTERVAL) {
    game.bullets.push(createBullet(game.player, -CONFIG.BULLET_SPEED));
    game.lastPlayerShot = now;
  }

  // Calculate game time
  const gameTime = now - game.gameStartTime;

  // Spawn standard enemies
  if (now - game.lastStandardSpawn > CONFIG.STANDARD_ENEMY_SPAWN_INTERVAL) {
    const props = getEnemyProperties(EnemyType.STANDARD);
    const x = Math.random() * (CONFIG.CANVAS_WIDTH - props.size);
    game.enemies.push(createEnemy(EnemyType.STANDARD, x, -props.size, now));
    game.lastStandardSpawn = now;
  }

  // Spawn YELLOW enemies (after 30s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.YELLOW, gameTime) &&
    now - game.lastYellowSpawn > CONFIG.SPECIAL_ENEMY_SPAWN_INTERVAL
  ) {
    const props = getEnemyProperties(EnemyType.YELLOW);
    const x = Math.random() * (CONFIG.CANVAS_WIDTH - props.size);
    game.enemies.push(createEnemy(EnemyType.YELLOW, x, -props.size, now));
    game.lastYellowSpawn = now;
  }

  // Spawn PURPLE enemies (after 60s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.PURPLE, gameTime) &&
    now - game.lastPurpleSpawn > CONFIG.SPECIAL_ENEMY_SPAWN_INTERVAL
  ) {
    const props = getEnemyProperties(EnemyType.PURPLE);
    const x = Math.random() * (CONFIG.CANVAS_WIDTH - props.size);
    game.enemies.push(createEnemy(EnemyType.PURPLE, x, -props.size, now));
    game.lastPurpleSpawn = now;
  }

  // Spawn TANK enemies (after 120s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.TANK, gameTime) &&
    now - game.lastTankSpawn > CONFIG.SPECIAL_ENEMY_SPAWN_INTERVAL
  ) {
    const props = getEnemyProperties(EnemyType.TANK);
    const x = Math.random() * (CONFIG.CANVAS_WIDTH - props.size);
    game.enemies.push(createEnemy(EnemyType.TANK, x, -props.size, now));
    game.lastTankSpawn = now;
  }

  // Update bullets
  const updateBullets = (bullets: Bullet[], inBounds: (b: Bullet) => boolean) => {
    return bullets.filter((bullet) => {
      bullet.y += bullet.vy;
      if (bullet.vx !== undefined) {
        bullet.x += bullet.vx; // diagonal movement
      }
      return inBounds(bullet);
    });
  };

  game.bullets = updateBullets(game.bullets, (b) => b.y > -b.height);
  game.enemyBullets = updateBullets(
    game.enemyBullets,
    (b) => b.y < CONFIG.CANVAS_HEIGHT && b.x > -b.width && b.x < CONFIG.CANVAS_WIDTH
  );

  // Move enemies and make them shoot
  game.enemies = game.enemies.filter((enemy) => {
    // Update movement based on enemy type
    updateEnemyMovement(enemy, game.player.x, game.player.y, CONFIG.CANVAS_WIDTH);

    // Enemy shooting
    const props = getEnemyProperties(enemy.type);
    if (props.canShoot && now - enemy.lastShot > props.shootInterval) {
      if (enemy.type === EnemyType.YELLOW) {
        // Yellow enemies shoot two diagonal bullets
        const centerX = enemy.x + enemy.width / 2;
        const bottomY = enemy.y + enemy.height;
        const bulletSpeed = CONFIG.BULLET_SPEED * CONFIG.ENEMY_BULLET_SPEED_MULT;

        // Left diagonal bullet
        const leftBullet = createBullet(enemy, bulletSpeed);
        leftBullet.y = bottomY;
        leftBullet.x = centerX - CONFIG.BULLET_SIZE / 2 - 10;
        leftBullet.vx = -2;
        game.enemyBullets.push(leftBullet);

        // Right diagonal bullet
        const rightBullet = createBullet(enemy, bulletSpeed);
        rightBullet.y = bottomY;
        rightBullet.x = centerX - CONFIG.BULLET_SIZE / 2 + 10;
        rightBullet.vx = 2;
        game.enemyBullets.push(rightBullet);
      } else {
        // Standard straight bullet
        const bullet = createBullet(enemy, CONFIG.BULLET_SPEED * CONFIG.ENEMY_BULLET_SPEED_MULT);
        bullet.y = enemy.y + enemy.height;
        game.enemyBullets.push(bullet);
      }
      enemy.lastShot = now;
    }

    return enemy.y < CONFIG.CANVAS_HEIGHT && enemy.y > -enemy.height;
  });

  // Check bullet-enemy collisions
  game.bullets = game.bullets.filter((bullet) => {
    for (let i = 0; i < game.enemies.length; i++) {
      if (checkCollision(bullet, game.enemies[i])) {
        const enemy = game.enemies[i];
        enemy.hp -= 1;

        // Remove enemy if HP depleted
        if (enemy.hp <= 0) {
          game.enemies.splice(i, 1);
          game.score += 10;
          updateScore();
        }
        return false; // bullet is consumed
      }
    }
    return true;
  });

  // Check player collisions
  for (const enemy of game.enemies) {
    if (checkCollision(game.player, enemy)) {
      game.gameOver = true;
      return;
    }
  }

  for (const bullet of game.enemyBullets) {
    if (checkCollision(game.player, bullet)) {
      game.gameOver = true;
      return;
    }
  }
}

// Draw triangle
function drawTriangle(ctx: CanvasRenderingContext2D, obj: GameObject, pointUp: boolean) {
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
function drawBullets(ctx: CanvasRenderingContext2D, bullets: Bullet[], color: string) {
  ctx.fillStyle = color;
  for (const bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

// Draw everything
function draw() {
  const ctx = game.ctx!;

  // Clear canvas
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  // Draw player
  ctx.fillStyle = '#00d4ff';
  drawTriangle(ctx, game.player, true);

  // Draw bullets
  drawBullets(ctx, game.bullets, '#00ff00');
  drawBullets(ctx, game.enemyBullets, '#ff6b00');

  // Draw enemies
  for (const enemy of game.enemies) {
    const props = getEnemyProperties(enemy.type);
    ctx.fillStyle = props.color;
    drawTriangle(ctx, enemy, false);

    // Draw HP bar for TANK enemies
    if (enemy.type === EnemyType.TANK && enemy.hp < enemy.maxHp) {
      const barWidth = enemy.width;
      const barHeight = 4;
      const barX = enemy.x;
      const barY = enemy.y - 8;

      // Background
      ctx.fillStyle = '#333';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // HP bar
      ctx.fillStyle = '#ff0000';
      const hpRatio = enemy.hp / enemy.maxHp;
      ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }
  }
}

// Draw game over screen
function drawGameOver() {
  const ctx = game.ctx!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  ctx.fillStyle = '#e94560';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 40);

  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${game.score}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 10);

  ctx.font = '18px Arial';
  ctx.fillText('Press Enter to restart', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 50);
}

// Update score display
function updateScore() {
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = `Score: ${game.score}`;
}

// Start game
init();
