import { GameObject, checkCollision } from './utils';

// Game configuration
const CONFIG = {
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  PLAYER_SPEED: 5,
  PLAYER_SIZE: 30,
  PLAYER_SHOOT_INTERVAL: 200,
  BULLET_SPEED: 7,
  BULLET_SIZE: 5,
  ENEMY_SPEED: 2,
  ENEMY_HORIZONTAL_SPEED: 2,
  ENEMY_SIZE: 30,
  ENEMY_SPAWN_INTERVAL: 1500,
  ENEMY_SHOOT_INTERVAL: 1000,
  ENEMY_BULLET_SPEED_MULT: 0.7,
};

// Types

interface Bullet extends GameObject {
  vy: number;
}

interface Enemy extends GameObject {
  lastShot: number;
  vx: number; // horizontal velocity
}

// Game state
const game = {
  canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
  ctx: null as CanvasRenderingContext2D | null,
  score: 0,
  gameOver: false,
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
  lastEnemySpawn: 0,
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

  // Spawn enemies
  if (now - game.lastEnemySpawn > CONFIG.ENEMY_SPAWN_INTERVAL) {
    const x = Math.random() * (CONFIG.CANVAS_WIDTH - CONFIG.ENEMY_SIZE);
    const vx = (Math.random() - 0.5) * 2 * CONFIG.ENEMY_HORIZONTAL_SPEED;
    game.enemies.push({
      x,
      y: -CONFIG.ENEMY_SIZE,
      width: CONFIG.ENEMY_SIZE,
      height: CONFIG.ENEMY_SIZE,
      lastShot: now,
      vx,
    });
    game.lastEnemySpawn = now;
  }

  // Update bullets
  const updateBullets = (bullets: Bullet[], inBounds: (b: Bullet) => boolean) => {
    return bullets.filter((bullet) => {
      bullet.y += bullet.vy;
      return inBounds(bullet);
    });
  };

  game.bullets = updateBullets(game.bullets, (b) => b.y > -b.height);
  game.enemyBullets = updateBullets(game.enemyBullets, (b) => b.y < CONFIG.CANVAS_HEIGHT);

  // Move enemies and make them shoot
  game.enemies = game.enemies.filter((enemy) => {
    enemy.y += CONFIG.ENEMY_SPEED;
    enemy.x += enemy.vx;

    // Bounce off walls
    if (enemy.x <= 0 || enemy.x >= CONFIG.CANVAS_WIDTH - enemy.width) {
      enemy.vx = -enemy.vx;
      enemy.x = Math.max(0, Math.min(enemy.x, CONFIG.CANVAS_WIDTH - enemy.width));
    }

    // Enemy shooting
    if (now - enemy.lastShot > CONFIG.ENEMY_SHOOT_INTERVAL) {
      const bullet = createBullet(enemy, CONFIG.BULLET_SPEED * CONFIG.ENEMY_BULLET_SPEED_MULT);
      bullet.y = enemy.y + enemy.height;
      game.enemyBullets.push(bullet);
      enemy.lastShot = now;
    }

    return enemy.y < CONFIG.CANVAS_HEIGHT;
  });

  // Check bullet-enemy collisions
  game.bullets = game.bullets.filter((bullet) => {
    for (let i = 0; i < game.enemies.length; i++) {
      if (checkCollision(bullet, game.enemies[i])) {
        game.enemies.splice(i, 1);
        game.score += 10;
        updateScore();
        return false;
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
  ctx.fillStyle = '#e94560';
  for (const enemy of game.enemies) {
    drawTriangle(ctx, enemy, false);
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
