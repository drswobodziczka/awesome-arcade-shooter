/**
 * @file main.ts
 * @description Phaser game initialization and configuration.
 * Entry point for the arcade shooter - sets up Phaser instance with MainGameScene.
 */

import Phaser from 'phaser';
import { MainGameScene } from './MainGameScene';

/**
 * Phaser game configuration.
 * Defines canvas size, physics engine, and scenes.
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  width: 600,
  height: 900,
  parent: 'gameContainer', // HTML container ID
  backgroundColor: '#16213e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // No gravity for top-down shooter
      debug: false,
    },
  },
  scene: [MainGameScene],
};

/**
 * Initialize Phaser game instance.
 * Creates game on page load.
 */
const game = new Phaser.Game(config);

// Export for testing purposes
export { game, config };
