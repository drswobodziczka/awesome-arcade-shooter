/**
 * @file MainGameScene.ts
 * @description Main Phaser scene for the arcade shooter game.
 * Manages game state, entities, and core game loop using Phaser 3 framework.
 */

import Phaser from 'phaser';

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

    // Setup keyboard input
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Create bullets group
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 50,
    });
  }

  /**
   * Phaser lifecycle: update game state.
   * Called every frame (~60 FPS) - handle input, movement, collisions.
   */
  update(): void {
    if (!this.player || !this.cursors || !this.bullets) return;

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
    const now = Date.now();
    if (this.cursors.space.isDown && now - this.lastPlayerShot > CONFIG.SHOOT_INTERVAL) {
      this.shootBullet();
      this.lastPlayerShot = now;
    }

    // Update bullets (move upward, destroy if off-screen)
    this.bullets.children.entries.forEach((bullet) => {
      const rect = bullet as Phaser.GameObjects.Rectangle;
      rect.y -= CONFIG.BULLET_SPEED * CONFIG.GAME_SPEED;
      if (rect.y < -rect.height) {
        rect.destroy();
      }
    });
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
}
