/**
 * @file main.ts
 * @description Main game loop and state management.
 * Entry point for the arcade shooter - handles initialization, input, update, and render cycles.
 * Uses requestAnimationFrame for 60 FPS game loop.
 */

import { GameObject, checkCollision } from './utils';
import { Enemy, EnemyType, updateEnemyMovement, getEnemyProperties } from './enemies';
import { spawnEnemies, spawnEnemiesTestMode, SpawnTimers } from './spawning';
import { Bullet, draw as renderGame, drawGameOver as renderGameOver } from './rendering';

/**
 * Global game configuration constants.
 * Defines canvas size, player properties, and spawn rates.
 */
const CONFIG = {
  /** Canvas width in pixels */
  CANVAS_WIDTH: 400,
  /** Canvas height in pixels */
  CANVAS_HEIGHT: 600,
  /** Player movement speed in pixels per frame */
  PLAYER_SPEED: 5,
  /** Player triangle size (width and height) in pixels */
  PLAYER_SIZE: 30,
  /** Minimum time between player shots in milliseconds */
  PLAYER_SHOOT_INTERVAL: 200,
  /** Player bullet speed in pixels per frame (negative = upward) */
  BULLET_SPEED: 7,
  /** Bullet width in pixels */
  BULLET_SIZE: 5,
  /** STANDARD enemy spawn interval in milliseconds */
  STANDARD_ENEMY_SPAWN_INTERVAL: 1000,
  /** Special enemy (YELLOW/PURPLE/TANK) spawn interval in milliseconds */
  SPECIAL_ENEMY_SPAWN_INTERVAL: 4500, // ~4.5x slower for special types
  /** Test mode spawn interval in milliseconds */
  TEST_MODE_SPAWN_INTERVAL: 1500,
  /** Multiplier for enemy bullet speed (0.7 = 70% of player bullet speed) */
  ENEMY_BULLET_SPEED_MULT: 0.7,
};

/**
 * Global game state object.
 * Contains all mutable game state including entities, timers, and input.
 */
const game = {
  /** Canvas DOM element reference */
  canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
  /** 2D rendering context (null until init) */
  ctx: null as CanvasRenderingContext2D | null,
  /** Current score (10 points per enemy killed) */
  score: 0,
  /** Game over flag - when true, game loop stops and overlay shows */
  gameOver: false,
  /** Game start timestamp in milliseconds (for calculating gameTime) */
  gameStartTime: 0,
  /** Game mode: 'normal' for progressive spawning, 'test' for custom enemy selection */
  gameMode: 'normal' as 'normal' | 'test',
  /** Test mode configuration: which enemy types to spawn */
  testConfig: {
    enabledEnemies: [EnemyType.STANDARD] as EnemyType[],
  },
  /** Game started flag - false until start button is clicked */
  started: false,
  /** Player object (spawns at bottom-center) */
  player: {
    x: CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2,
    y: CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER_SIZE - 20,
    width: CONFIG.PLAYER_SIZE,
    height: CONFIG.PLAYER_SIZE,
  },
  /** Array of active player bullets */
  bullets: [] as Bullet[],
  /** Array of active enemies */
  enemies: [] as Enemy[],
  /** Array of active enemy bullets */
  enemyBullets: [] as Bullet[],
  /** Keyboard input state (true = key currently pressed) */
  keys: {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
  },
  /** Enemy spawn timers (last spawn timestamp for each type) */
  spawnTimers: {
    lastStandardSpawn: 0,
    lastYellowSpawn: 0,
    lastPurpleSpawn: 0,
    lastTankSpawn: 0,
  } as SpawnTimers,
  /** Last player shot timestamp for fire rate limiting */
  lastPlayerShot: 0,
};

/**
 * Maps keyboard codes to game.keys state properties.
 *
 * @param code - Keyboard event code (e.g., "ArrowLeft", "Space")
 * @param pressed - true on keydown, false on keyup
 */
function handleKey(code: string, pressed: boolean) {
  if (code === 'ArrowLeft') game.keys.left = pressed;
  else if (code === 'ArrowRight') game.keys.right = pressed;
  else if (code === 'ArrowUp') game.keys.up = pressed;
  else if (code === 'ArrowDown') game.keys.down = pressed;
  else if (code === 'Space') game.keys.space = pressed;
}

/**
 * Initializes the game on page load.
 * Sets up canvas context, registers keyboard listeners, and UI event handlers.
 */
function init() {
  game.ctx = game.canvas.getContext('2d');
  if (!game.ctx) throw new Error('Failed to get canvas context');

  // Set up keyboard listeners
  window.addEventListener('keydown', (e) => {
    if (!game.started) return; // Ignore input until game starts
    if (e.code === 'Space') e.preventDefault();
    if (e.code === 'Enter' && game.gameOver) {
      e.preventDefault();
      location.reload();
    }
    handleKey(e.code, true);
  });

  window.addEventListener('keyup', (e) => {
    if (!game.started) return;
    handleKey(e.code, false);
  });

  // Set up test panel UI handlers
  setupTestPanel();
}

/**
 * Displays an inline error message in the test panel.
 *
 * @param message - Error message to display
 */
function showTestPanelError(message: string) {
  const testPanel = document.getElementById('testPanel')!;
  const errorDiv = document.createElement('div');
  errorDiv.id = 'testPanelError';
  errorDiv.style.cssText = 'color: #ff6b6b; margin-top: 10px; font-size: 14px; font-weight: bold;';
  errorDiv.textContent = message;
  testPanel.appendChild(errorDiv);
}

/**
 * Sets up the test panel event handlers for mode selection and enemy checkboxes.
 */
function setupTestPanel() {
  const modeRadios = document.querySelectorAll<HTMLInputElement>('input[name="gameMode"]');
  const enemySelection = document.getElementById('enemySelection')!;
  const startButton = document.getElementById('startButton')!;

  // Show/hide enemy selection based on mode
  modeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'test') {
        enemySelection.classList.remove('hidden');
      } else {
        enemySelection.classList.add('hidden');
      }
    });
  });

  // Start button handler
  startButton.addEventListener('click', () => {
    // Clear any previous error messages
    const existingError = document.getElementById('testPanelError');
    if (existingError) existingError.remove();

    // Get selected mode
    const selectedMode = document.querySelector<HTMLInputElement>('input[name="gameMode"]:checked')!.value as 'normal' | 'test';
    game.gameMode = selectedMode;

    // If test mode, get selected enemies
    if (selectedMode === 'test') {
      const checkedBoxes = Array.from(
        document.querySelectorAll<HTMLInputElement>('#enemySelection input[type="checkbox"]:checked')
      );

      if (checkedBoxes.length === 0) {
        showTestPanelError('Please select at least one enemy type for test mode!');
        return;
      }

      // Validate and map checkbox values to EnemyType enum
      const checkedEnemies: EnemyType[] = [];
      for (const cb of checkedBoxes) {
        const value = cb.value;
        if (!Object.values(EnemyType).includes(value as EnemyType)) {
          showTestPanelError(`Invalid enemy type: ${value}`);
          return;
        }
        checkedEnemies.push(value as EnemyType);
      }

      game.testConfig.enabledEnemies = checkedEnemies;
    }

    // Hide test panel and start game
    const testPanel = document.getElementById('testPanel')!;
    testPanel.classList.add('hidden');

    startGame();
  });
}

/**
 * Starts the game after configuration is complete.
 */
function startGame() {
  game.started = true;
  game.gameStartTime = Date.now();

  // Enable canvas and update controls text
  game.canvas.classList.remove('disabled');
  const controlsEl = document.getElementById('controls');
  if (controlsEl) {
    controlsEl.style.opacity = '1';
    controlsEl.innerHTML = 'Arrow keys: Move | Space: Shoot';
  }

  // Reset spawn timers
  game.spawnTimers.lastStandardSpawn = 0;
  game.spawnTimers.lastYellowSpawn = 0;
  game.spawnTimers.lastPurpleSpawn = 0;
  game.spawnTimers.lastTankSpawn = 0;

  gameLoop();
}

/**
 * Main game loop using requestAnimationFrame for 60 FPS.
 * Exits to game over screen when game.gameOver is true.
 * Otherwise calls update() and render() each frame.
 */
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

/**
 * Factory function to create a bullet centered on a game object.
 *
 * @param obj - The object firing the bullet (player or enemy)
 * @param speed - Vertical velocity (negative for upward, positive for downward)
 * @returns Bullet positioned at obj's horizontal center
 */
function createBullet(obj: GameObject, speed: number): Bullet {
  return {
    x: obj.x + obj.width / 2 - CONFIG.BULLET_SIZE / 2,
    y: obj.y,
    width: CONFIG.BULLET_SIZE,
    height: CONFIG.BULLET_SIZE * 2,
    vy: speed,
  };
}

/**
 * Main game state update function called every frame.
 * Handles player movement, shooting, enemy spawning, bullet movement,
 * enemy AI, collision detection, and game over conditions.
 */
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

  // Spawn enemies based on game mode
  if (game.gameMode === 'normal') {
    spawnEnemies(game.enemies, game.spawnTimers, gameTime, now, {
      canvasWidth: CONFIG.CANVAS_WIDTH,
      standardInterval: CONFIG.STANDARD_ENEMY_SPAWN_INTERVAL,
      specialInterval: CONFIG.SPECIAL_ENEMY_SPAWN_INTERVAL,
    });
  } else {
    // Test mode: spawn random enemies from enabled list
    spawnEnemiesTestMode(game.enemies, game.spawnTimers, now, {
      canvasWidth: CONFIG.CANVAS_WIDTH,
      enabledEnemies: game.testConfig.enabledEnemies,
      spawnInterval: CONFIG.TEST_MODE_SPAWN_INTERVAL,
    });
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

  game.bullets = updateBullets(
    game.bullets,
    (b) => b.y > -b.height && b.x > -b.width && b.x < CONFIG.CANVAS_WIDTH
  );
  game.enemyBullets = updateBullets(
    game.enemyBullets,
    (b) => b.y < CONFIG.CANVAS_HEIGHT && b.x > -b.width && b.x < CONFIG.CANVAS_WIDTH
  );

  // Move enemies and make them shoot
  game.enemies = game.enemies.filter((enemy) => {
    // Update movement based on enemy type
    updateEnemyMovement(enemy, game.player.x, game.player.y, game.player.width, CONFIG.CANVAS_WIDTH);

    // Enemy shooting
    const props = getEnemyProperties(enemy.type);
    if (props.canShoot && now - enemy.lastShot > props.shootInterval) {
      if (enemy.type === EnemyType.YELLOW) {
        // Yellow enemies shoot three bullets: left diagonal, center straight, right diagonal
        const centerX = enemy.x + enemy.width / 2;
        const bottomY = enemy.y + enemy.height;
        const bulletSpeed = CONFIG.BULLET_SPEED * CONFIG.ENEMY_BULLET_SPEED_MULT;

        // Left diagonal bullet
        const leftBullet = createBullet(enemy, bulletSpeed);
        leftBullet.y = bottomY;
        leftBullet.x = centerX - CONFIG.BULLET_SIZE / 2 - 15;
        leftBullet.vx = -2;
        game.enemyBullets.push(leftBullet);

        // Center straight bullet
        const centerBullet = createBullet(enemy, bulletSpeed);
        centerBullet.y = bottomY;
        game.enemyBullets.push(centerBullet);

        // Right diagonal bullet
        const rightBullet = createBullet(enemy, bulletSpeed);
        rightBullet.y = bottomY;
        rightBullet.x = centerX - CONFIG.BULLET_SIZE / 2 + 15;
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
          const points = getEnemyProperties(enemy.type).points;
          game.enemies.splice(i, 1);
          game.score += points;
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

/**
 * Calls the rendering module to draw the current frame.
 * Wrapper around renderGame() from rendering.ts.
 */
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

/**
 * Updates the DOM score display element.
 * Called whenever an enemy is destroyed.
 */
function updateScore() {
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = `Score: ${game.score}`;
}

// Start game
init();
