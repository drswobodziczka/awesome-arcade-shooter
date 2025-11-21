/**
 * @file main.ts
 * @description Phaser game initialization and configuration.
 * Entry point for the arcade shooter - sets up Phaser instance with MainGameScene.
 */

// Global error handler for debugging on screen
window.onerror = (msg, url, lineNo, columnNo, error) => {
  const errorContainer = document.createElement('div');
  errorContainer.style.position = 'fixed';
  errorContainer.style.top = '0';
  errorContainer.style.left = '0';
  errorContainer.style.width = '100%';
  errorContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
  errorContainer.style.color = 'white';
  errorContainer.style.padding = '20px';
  errorContainer.style.zIndex = '10000';
  errorContainer.style.fontFamily = 'monospace';
  errorContainer.style.whiteSpace = 'pre-wrap';
  errorContainer.innerText = `RUNTIME ERROR:\n${msg}\nLine: ${lineNo}\nURL: ${url}\nStack: ${error?.stack || 'N/A'}`;
  document.body.appendChild(errorContainer);
  console.error('CAUGHT ERROR:', error);
  return false;
};

import Phaser from 'phaser';
import { MenuScene } from './MenuScene';
import { MainGameScene } from './MainGameScene';
import { GameOverScene } from './GameOverScene';

/**
 * Phaser game configuration.
 * Defines canvas size, physics engine, and scenes.
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  width: 550,
  height: 850,
  parent: 'gameContainer', // HTML container ID
  backgroundColor: '#16213e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // No gravity for top-down shooter
      debug: false,
    },
  },
  scene: [MenuScene, MainGameScene, GameOverScene], // MenuScene starts first
};

/**
 * Initialize Phaser game instance.
 * Single instance created on page load - uses multi-scene architecture.
 * MenuScene → MainGameScene → GameOverScene → MenuScene (loop)
 */
const game = new Phaser.Game(config);

// Export for testing purposes
export { game, config };
