import { GameObject, checkCollision } from './utils';
import { Enemy, EnemyType, updateEnemyMovement, getEnemyProperties } from './enemies';
import { spawnEnemies, SpawnTimers } from './spawning';
import { Bullet, draw as renderGame, drawGameOver as renderGameOver } from './rendering';

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
  spawnTimers: {
    lastStandardSpawn: 0,
    lastYellowSpawn: 0,
    lastPurpleSpawn: 0,
    lastTankSpawn: 0,
  } as SpawnTimers,
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
    renderGameOver(game.ctx!, game.score, {
      canvasWidth: CONFIG.CANVAS_WIDTH,
      canvasHeight: CONFIG.CANVAS_HEIGHT,
    });
    return;
  }

  update();
  render();
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

  // Spawn enemies
  spawnEnemies(game.enemies, game.spawnTimers, gameTime, now, {
    canvasWidth: CONFIG.CANVAS_WIDTH,
    standardInterval: CONFIG.STANDARD_ENEMY_SPAWN_INTERVAL,
    specialInterval: CONFIG.SPECIAL_ENEMY_SPAWN_INTERVAL,
  });

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

// Render game
function render() {
  renderGame(
    game.ctx!,
    game.player,
    game.enemies,
    game.bullets,
    game.enemyBullets,
    {
      canvasWidth: CONFIG.CANVAS_WIDTH,
      canvasHeight: CONFIG.CANVAS_HEIGHT,
    }
  );
}

// Update score display
function updateScore() {
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = `Score: ${game.score}`;
}

// Start game
init();
