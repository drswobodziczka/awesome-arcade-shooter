/**
 * @file MainGameScene.ts
 * @description Main Phaser scene for the arcade shooter game.
 * Manages game state, entities, and core game loop using Phaser 3 framework.
 */

import Phaser from 'phaser';

/**
 * Main game scene class.
 * Handles game initialization, update loop, and rendering via Phaser.
 */
export class MainGameScene extends Phaser.Scene {
  /** Current game score (10 points per enemy killed) */
  private score: number = 0;
  /** DOM element for score display */
  private scoreText?: Phaser.GameObjects.Text;

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
  }

  /**
   * Phaser lifecycle: update game state.
   * Called every frame (~60 FPS) - handle input, movement, collisions.
   */
  update(): void {
    // Game logic will be migrated here in later steps
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
