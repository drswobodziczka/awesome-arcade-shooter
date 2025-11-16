// Game configuration
const CONFIG = {
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  PLAYER_SPEED: 5,
  PLAYER_SIZE: 30,
  BULLET_SPEED: 7,
  BULLET_SIZE: 5,
  ENEMY_SPEED: 2,
  ENEMY_SIZE: 30,
  ENEMY_SPAWN_INTERVAL: 1500,
  ENEMY_SHOOT_INTERVAL: 1000,
};

// Types
interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bullet extends GameObject {
  vx: number;
  vy: number;
}

interface Enemy extends GameObject {
  lastShot: number;
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

// Initialize game
function init() {
  game.ctx = game.canvas.getContext('2d');
  if (!game.ctx) throw new Error('Failed to get canvas context');

  // Keyboard events
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') game.keys.left = true;
    if (e.code === 'ArrowRight') game.keys.right = true;
    if (e.code === 'ArrowUp') game.keys.up = true;
    if (e.code === 'ArrowDown') game.keys.down = true;
    if (e.code === 'Space') {
      e.preventDefault();
      game.keys.space = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') game.keys.left = false;
    if (e.code === 'ArrowRight') game.keys.right = false;
    if (e.code === 'ArrowUp') game.keys.up = false;
    if (e.code === 'ArrowDown') game.keys.down = false;
    if (e.code === 'Space') game.keys.space = false;
  });

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
  if (game.keys.space && now - game.lastPlayerShot > 200) {
    game.bullets.push({
      x: game.player.x + game.player.width / 2 - CONFIG.BULLET_SIZE / 2,
      y: game.player.y,
      width: CONFIG.BULLET_SIZE,
      height: CONFIG.BULLET_SIZE * 2,
      vx: 0,
      vy: -CONFIG.BULLET_SPEED,
    });
    game.lastPlayerShot = now;
  }

  // Spawn enemies
  if (now - game.lastEnemySpawn > CONFIG.ENEMY_SPAWN_INTERVAL) {
    const x = Math.random() * (CONFIG.CANVAS_WIDTH - CONFIG.ENEMY_SIZE);
    game.enemies.push({
      x,
      y: -CONFIG.ENEMY_SIZE,
      width: CONFIG.ENEMY_SIZE,
      height: CONFIG.ENEMY_SIZE,
      lastShot: now,
    });
    game.lastEnemySpawn = now;
  }

  // Move bullets
  game.bullets = game.bullets.filter((bullet) => {
    bullet.y += bullet.vy;
    return bullet.y > -bullet.height;
  });

  // Move enemy bullets
  game.enemyBullets = game.enemyBullets.filter((bullet) => {
    bullet.y += bullet.vy;
    return bullet.y < CONFIG.CANVAS_HEIGHT;
  });

  // Move enemies and make them shoot
  game.enemies = game.enemies.filter((enemy) => {
    enemy.y += CONFIG.ENEMY_SPEED;

    // Enemy shooting
    if (now - enemy.lastShot > CONFIG.ENEMY_SHOOT_INTERVAL) {
      game.enemyBullets.push({
        x: enemy.x + enemy.width / 2 - CONFIG.BULLET_SIZE / 2,
        y: enemy.y + enemy.height,
        width: CONFIG.BULLET_SIZE,
        height: CONFIG.BULLET_SIZE * 2,
        vx: 0,
        vy: CONFIG.BULLET_SPEED * 0.7,
      });
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

  // Check player-enemy collisions
  for (const enemy of game.enemies) {
    if (checkCollision(game.player, enemy)) {
      game.gameOver = true;
    }
  }

  // Check player-enemyBullet collisions
  for (const bullet of game.enemyBullets) {
    if (checkCollision(game.player, bullet)) {
      game.gameOver = true;
    }
  }
}

// Draw everything
function draw() {
  if (!game.ctx) return;

  // Clear canvas
  game.ctx.fillStyle = '#16213e';
  game.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  // Draw player (triangle pointing up)
  game.ctx.fillStyle = '#00d4ff';
  game.ctx.beginPath();
  game.ctx.moveTo(game.player.x + game.player.width / 2, game.player.y);
  game.ctx.lineTo(game.player.x, game.player.y + game.player.height);
  game.ctx.lineTo(game.player.x + game.player.width, game.player.y + game.player.height);
  game.ctx.closePath();
  game.ctx.fill();

  // Draw player bullets
  game.ctx.fillStyle = '#00ff00';
  for (const bullet of game.bullets) {
    game.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

  // Draw enemies (triangle pointing down)
  game.ctx.fillStyle = '#e94560';
  for (const enemy of game.enemies) {
    game.ctx.beginPath();
    game.ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
    game.ctx.lineTo(enemy.x, enemy.y);
    game.ctx.lineTo(enemy.x + enemy.width, enemy.y);
    game.ctx.closePath();
    game.ctx.fill();
  }

  // Draw enemy bullets
  game.ctx.fillStyle = '#ff6b00';
  for (const bullet of game.enemyBullets) {
    game.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

// Draw game over screen
function drawGameOver() {
  if (!game.ctx) return;

  game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  game.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  game.ctx.fillStyle = '#e94560';
  game.ctx.font = '48px Arial';
  game.ctx.textAlign = 'center';
  game.ctx.fillText('GAME OVER', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 40);

  game.ctx.fillStyle = '#fff';
  game.ctx.font = '24px Arial';
  game.ctx.fillText(`Score: ${game.score}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 10);

  game.ctx.font = '18px Arial';
  game.ctx.fillText('Press F5 to restart', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 50);
}

// Collision detection
function checkCollision(a: GameObject, b: GameObject): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Update score display
function updateScore() {
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = `Score: ${game.score}`;
}

// Start game
init();
