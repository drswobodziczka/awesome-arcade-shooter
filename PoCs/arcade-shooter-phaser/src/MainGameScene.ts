/**
 * @file MainGameScene.ts
 * @description Main Phaser scene for the arcade shooter game.
 * Manages game state, entities, and core game loop using Phaser 3 framework.
 */

import Phaser from 'phaser';
import { Enemy, EnemyType, updateEnemyMovement, getEnemyProperties, createEnemy } from './enemies';
import { spawnEnemies, SpawnTimers } from './spawning';

/**
 * Game configuration constants.
 */
const CONFIG = {
  PLAYER_SPEED: 5,
  PLAYER_SIZE: 30,
  GAME_SPEED: 0.5,
  SHOOT_INTERVAL: 200,
  BULLET_SPEED: 7,
  BULLET_SIZE: 5,
  ENEMY_BULLET_SPEED_MULT: 0.7,
  STANDARD_ENEMY_SPAWN_INTERVAL: 1000,
  SPECIAL_ENEMY_SPAWN_INTERVAL: 4500,
};

/**
 * Main game scene class.
 * Handles game initialization, update loop, and rendering via Phaser.
 */
export class MainGameScene extends Phaser.Scene {
  /** Current game score (10 points per enemy killed) */
  private score: number = 0;
  /** DOM element for score display */
  private scoreText?: Phaser.GameObjects.Text;
  /** Player sprite */
  private player?: Phaser.GameObjects.Triangle;
  /** Keyboard cursor keys */
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  /** Last player shot timestamp */
  private lastPlayerShot: number = 0;
  /** Player bullets group */
  private bullets?: Phaser.Physics.Arcade.Group;
  /** Enemy game objects with visual sprites */
  private enemies: Array<Enemy & { sprite: Phaser.GameObjects.Triangle }> = [];
  /** Enemy bullets group */
  private enemyBullets: Phaser.GameObjects.Rectangle[] = [];
  /** Enemy spawn timers */
  private spawnTimers: SpawnTimers = {
    lastStandardSpawn: 0,
    lastYellowSpawn: 0,
    lastPurpleSpawn: 0,
    lastTankSpawn: 0,
  };
  /** Game start timestamp */
  private gameStartTime: number = 0;
  /** Game over flag */
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'MainGameScene' });
  }

  /**
   * Phaser lifecycle: preload assets.
   * Called before create() - load sprites, audio, etc.
   */
  preload(): void {
    // Assets will be loaded here in later steps
  }

  /**
   * Phaser lifecycle: initialize scene.
   * Called after preload() - create game objects.
   */
  create(): void {
    // Initialize game start time
    this.gameStartTime = Date.now();

    // Background color
    this.cameras.main.setBackgroundColor('#16213e');

    // Score text (top-left corner)
    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '24px',
      color: '#e94560',
      fontFamily: 'Arial',
    });

    // Controls hint (bottom-center)
    this.add.text(
      this.scale.width / 2,
      this.scale.height - 20,
      'Arrow keys: Move | Space: Shoot',
      {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial',
      }
    ).setOrigin(0.5, 1);

    // Create player (cyan triangle pointing up)
    const playerX = this.scale.width / 2;
    const playerY = this.scale.height - CONFIG.PLAYER_SIZE - 20;
    this.player = this.add.triangle(
      playerX,
      playerY,
      0, 0,                              // top point
      -CONFIG.PLAYER_SIZE/2, CONFIG.PLAYER_SIZE,  // bottom-left
      CONFIG.PLAYER_SIZE/2, CONFIG.PLAYER_SIZE,   // bottom-right
      0x00d4ff                           // cyan color
    );

    // Enable physics on player
    this.physics.add.existing(this.player);

    // Setup keyboard input
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Create bullets group
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 50,
    });

    // Setup collisions (will be implemented as enemies are created)
  }

  /**
   * Phaser lifecycle: update game state.
   * Called every frame (~60 FPS) - handle input, movement, collisions.
   */
  update(): void {
    if (!this.player || !this.cursors || !this.bullets) return;

    // Handle game over
    if (this.gameOver) {
      this.showGameOver();
      return;
    }

    const now = Date.now();
    const gameTime = now - this.gameStartTime;

    // Player movement
    const playerSpeed = CONFIG.PLAYER_SPEED * CONFIG.GAME_SPEED;

    if (this.cursors.left.isDown && this.player.x > CONFIG.PLAYER_SIZE / 2) {
      this.player.x -= playerSpeed;
    }
    if (this.cursors.right.isDown && this.player.x < this.scale.width - CONFIG.PLAYER_SIZE / 2) {
      this.player.x += playerSpeed;
    }
    if (this.cursors.up.isDown && this.player.y > CONFIG.PLAYER_SIZE) {
      this.player.y -= playerSpeed;
    }
    if (this.cursors.down.isDown && this.player.y < this.scale.height - CONFIG.PLAYER_SIZE) {
      this.player.y += playerSpeed;
    }

    // Player shooting
    if (this.cursors.space.isDown && now - this.lastPlayerShot > CONFIG.SHOOT_INTERVAL) {
      this.shootBullet();
      this.lastPlayerShot = now;
    }

    // Spawn enemies
    const tempEnemies: Enemy[] = this.enemies;
    spawnEnemies(tempEnemies, this.spawnTimers, gameTime, now, {
      canvasWidth: this.scale.width,
      standardInterval: CONFIG.STANDARD_ENEMY_SPAWN_INTERVAL,
      specialInterval: CONFIG.SPECIAL_ENEMY_SPAWN_INTERVAL,
    });

    // Create sprites for newly spawned enemies
    for (let i = this.enemies.length; i < tempEnemies.length; i++) {
      const enemy = tempEnemies[i];
      const props = getEnemyProperties(enemy.type);
      const sprite = this.add.triangle(
        enemy.x,
        enemy.y,
        0, enemy.height,                    // bottom point
        -enemy.width/2, 0,                  // top-left
        enemy.width/2, 0,                   // top-right
        parseInt(props.color.replace('#', ''), 16)
      );
      this.enemies.push({ ...enemy, sprite });
    }

    // Update enemy movement and shooting
    this.enemies = this.enemies.filter((enemy) => {
      // Update movement
      updateEnemyMovement(
        enemy,
        this.player!.x,
        this.player!.y,
        CONFIG.PLAYER_SIZE,
        this.scale.width,
        CONFIG.GAME_SPEED
      );

      // Update sprite position
      enemy.sprite.setPosition(enemy.x, enemy.y);

      // Enemy shooting
      const props = getEnemyProperties(enemy.type);
      if (props.canShoot && now - enemy.lastShot > props.shootInterval) {
        this.shootEnemyBullet(enemy);
        enemy.lastShot = now;
      }

      // Remove off-screen enemies
      if (enemy.y > this.scale.height + enemy.height) {
        enemy.sprite.destroy();
        return false;
      }
      return true;
    });

    // Update player bullets (move upward, destroy if off-screen)
    this.bullets.children.entries.forEach((bullet) => {
      const rect = bullet as Phaser.GameObjects.Rectangle;
      rect.y -= CONFIG.BULLET_SPEED * CONFIG.GAME_SPEED;
      if (rect.y < -rect.height) {
        rect.destroy();
      }
    });

    // Update enemy bullets (move downward, destroy if off-screen)
    this.enemyBullets = this.enemyBullets.filter((bullet) => {
      bullet.y += bullet.getData('vy');
      const vx = bullet.getData('vx');
      if (vx !== undefined) {
        bullet.x += vx;
      }

      const inBounds = bullet.y < this.scale.height + bullet.height &&
                       bullet.x > -bullet.width &&
                       bullet.x < this.scale.width + bullet.width;

      if (!inBounds) {
        bullet.destroy();
      }
      return inBounds;
    });

    // Check collisions: bullets vs enemies
    this.bullets.children.entries.forEach((bulletObj) => {
      const bullet = bulletObj as Phaser.GameObjects.Rectangle;
      if (!bullet.active) return;

      for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        if (this.checkOverlap(bullet, enemy.sprite)) {
          // Damage enemy
          enemy.hp -= 1;

          // Destroy bullet
          bullet.destroy();

          // Remove enemy if HP depleted
          if (enemy.hp <= 0) {
            const points = getEnemyProperties(enemy.type).points;
            this.score += points;
            this.updateScore(this.score);
            enemy.sprite.destroy();
            this.enemies.splice(i, 1);
          }
          break;
        }
      }
    });

    // Check collisions: player vs enemies
    for (const enemy of this.enemies) {
      if (this.checkOverlap(this.player, enemy.sprite)) {
        this.gameOver = true;
        return;
      }
    }

    // Check collisions: player vs enemy bullets
    for (const bullet of this.enemyBullets) {
      if (this.checkOverlap(this.player, bullet)) {
        this.gameOver = true;
        return;
      }
    }
  }

  /**
   * Creates and fires a bullet from player position.
   */
  private shootBullet(): void {
    if (!this.player) return;

    const bullet = this.add.rectangle(
      this.player.x,
      this.player.y - CONFIG.PLAYER_SIZE / 2,
      CONFIG.BULLET_SIZE,
      CONFIG.BULLET_SIZE * 2,
      0x00ff00 // green
    );
    this.bullets?.add(bullet);
  }

  /**
   * Creates enemy bullet(s) based on enemy type.
   * YELLOW enemies shoot triple-spread, others shoot straight down.
   */
  private shootEnemyBullet(enemy: Enemy): void {
    const bulletSpeed = CONFIG.BULLET_SPEED * CONFIG.ENEMY_BULLET_SPEED_MULT * CONFIG.GAME_SPEED;

    if (enemy.type === EnemyType.YELLOW) {
      // Triple-spread shot
      const centerX = enemy.x;
      const bottomY = enemy.y + enemy.height;

      // Left diagonal
      const leftBullet = this.add.rectangle(
        centerX - 15,
        bottomY,
        CONFIG.BULLET_SIZE,
        CONFIG.BULLET_SIZE * 2,
        0xff6b00 // orange
      );
      leftBullet.setData('vy', bulletSpeed);
      leftBullet.setData('vx', -2 * CONFIG.GAME_SPEED);
      this.enemyBullets.push(leftBullet);

      // Center straight
      const centerBullet = this.add.rectangle(
        centerX,
        bottomY,
        CONFIG.BULLET_SIZE,
        CONFIG.BULLET_SIZE * 2,
        0xff6b00
      );
      centerBullet.setData('vy', bulletSpeed);
      this.enemyBullets.push(centerBullet);

      // Right diagonal
      const rightBullet = this.add.rectangle(
        centerX + 15,
        bottomY,
        CONFIG.BULLET_SIZE,
        CONFIG.BULLET_SIZE * 2,
        0xff6b00
      );
      rightBullet.setData('vy', bulletSpeed);
      rightBullet.setData('vx', 2 * CONFIG.GAME_SPEED);
      this.enemyBullets.push(rightBullet);
    } else {
      // Standard straight shot
      const bullet = this.add.rectangle(
        enemy.x,
        enemy.y + enemy.height,
        CONFIG.BULLET_SIZE,
        CONFIG.BULLET_SIZE * 2,
        0xff6b00
      );
      bullet.setData('vy', bulletSpeed);
      this.enemyBullets.push(bullet);
    }
  }

  /**
   * Updates the score display.
   * @param points - Score value to display
   */
  updateScore(points: number): void {
    this.score = points;
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`);
    }
  }

  /**
   * Gets current score value.
   * @returns Current game score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Simple AABB collision detection between two game objects.
   * @param a - First game object
   * @param b - Second game object
   * @returns true if objects overlap
   */
  private checkOverlap(a: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject): boolean {
    const boundsA = (a as any).getBounds ? (a as any).getBounds() : { x: (a as any).x, y: (a as any).y, width: 30, height: 30 };
    const boundsB = (b as any).getBounds ? (b as any).getBounds() : { x: (b as any).x, y: (b as any).y, width: 30, height: 30 };

    return boundsA.x < boundsB.x + boundsB.width &&
           boundsA.x + boundsA.width > boundsB.x &&
           boundsA.y < boundsB.y + boundsB.height &&
           boundsA.y + boundsA.height > boundsB.y;
  }

  /**
   * Displays game over screen with final score.
   */
  private showGameOver(): void {
    // Darken screen
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    );

    // Game over text
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 40,
      'GAME OVER',
      {
        fontSize: '48px',
        color: '#e94560',
        fontFamily: 'Arial',
      }
    ).setOrigin(0.5);

    // Final score
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 10,
      `Score: ${this.score}`,
      {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Arial',
      }
    ).setOrigin(0.5);

    // Restart hint
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      'Press Enter to restart',
      {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Arial',
      }
    ).setOrigin(0.5);

    // Handle restart
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.restart();
    });
  }
}
