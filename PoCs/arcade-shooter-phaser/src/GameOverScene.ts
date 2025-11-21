/**
 * @file GameOverScene.ts
 * @description Game over scene displaying final score and restart options.
 */

import Phaser from 'phaser';
import type { GameRegistry } from './types';

/**
 * Game over scene shown when player dies.
 * Displays final score and allows returning to menu.
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    // Get final score from registry (set by MainGameScene) - type-safe
    // Use ?? instead of || to handle score=0 correctly
    const finalScore = (this.game.registry.get('finalScore') as GameRegistry['finalScore']) ?? 0;

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Dark overlay
    this.add.rectangle(
      centerX,
      centerY,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    );

    // Game over text
    this.add.text(centerX, centerY - 80, 'GAME OVER', {
      fontSize: '64px',
      color: '#e94560',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Final score
    this.add.text(centerX, centerY, `Final Score: ${finalScore}`, {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Return to menu button
    const menuBtn = this.add.text(centerX, centerY + 80, 'RETURN TO MENU', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      backgroundColor: '#e94560',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.returnToMenu())
      .on('pointerover', () => menuBtn.setScale(1.1))
      .on('pointerout', () => menuBtn.setScale(1));

    // Hint
    this.add.text(centerX, centerY + 140, 'Press ENTER to return to menu', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Enable Enter key (once auto-removes after first trigger)
    this.input.keyboard?.once('keydown-ENTER', () => this.returnToMenu());
  }

  /**
   * Phaser lifecycle: cleanup when scene shuts down.
   * Note: Using once() for keyboard listener - auto-removes on first trigger.
   * Phaser handles cleanup on scene transition for unused once() listeners.
   */
  shutdown(): void {
    // No manual cleanup needed for once() listeners
  }

  /**
   * Returns to menu scene.
   */
  private returnToMenu(): void {
    this.scene.start('MenuScene');
  }
}
