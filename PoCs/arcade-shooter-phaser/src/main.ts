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
import { MainGameScene } from './MainGameScene';
import { EnemyType, getEnemyProperties } from './enemies';

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
 * Game will not start automatically - waits for start button click.
 */
let game: Phaser.Game | null = null;

/**
 * Displays an inline error message in the test panel.
 *
 * @param message - Error message to display
 */
function showTestPanelError(message: string) {
  const testPanel = document.getElementById('testPanel')!;
  const errorDiv = document.createElement('div');
  errorDiv.className = 'test-panel-error';
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

  // Dynamically generate enemy checkboxes from EnemyType enum
  Object.values(EnemyType).forEach((enemyType, index) => {
    const props = getEnemyProperties(enemyType);

    // Generate friendly name and description
    let name = '';
    let description = '';
    switch (enemyType) {
      case EnemyType.STANDARD:
        name = 'Standard';
        description = 'Basic enemy';
        break;
      case EnemyType.YELLOW:
        name = 'Yellow';
        description = 'Triple-shot';
        break;
      case EnemyType.PURPLE:
        name = 'Purple';
        description = 'Fast tracker';
        break;
      case EnemyType.TANK:
        name = 'Tank';
        description = '5 HP heavy';
        break;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'enemy-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `enemy-${enemyType.toLowerCase()}`;
    checkbox.value = enemyType;
    checkbox.checked = index === 0; // Check first enemy by default

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = `${name} (${description})`;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    enemySelection.appendChild(wrapper);
  });

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
    // Clear ALL previous error messages
    document.querySelectorAll('.test-panel-error').forEach(e => e.remove());

    // Get selected mode
    const selectedMode = document.querySelector<HTMLInputElement>('input[name="gameMode"]:checked')!.value as 'normal' | 'test';

    // If test mode, get selected enemies
    let enabledEnemies: EnemyType[] = [];
    if (selectedMode === 'test') {
      const checkedBoxes = Array.from(
        document.querySelectorAll<HTMLInputElement>('#enemySelection input[type="checkbox"]:checked')
      );

      if (checkedBoxes.length === 0) {
        showTestPanelError('Please select at least one enemy type for test mode!');
        return;
      }

      // Validate and map checkbox values to EnemyType enum
      for (const cb of checkedBoxes) {
        const value = cb.value;
        if (!Object.values(EnemyType).includes(value as EnemyType)) {
          showTestPanelError(`Invalid enemy type: ${value}`);
          return;
        }
        enabledEnemies.push(value as EnemyType);
      }
    }

    // Hide test panel
    const testPanel = document.getElementById('testPanel')!;
    testPanel.classList.add('hidden');

    // Update controls text
    const controlsEl = document.getElementById('controls');
    if (controlsEl) {
      controlsEl.style.opacity = '1';
      controlsEl.innerHTML = 'Arrow keys: Move | Space: Shoot';
    }

    // Initialize game with selected configuration
    game = new Phaser.Game(config);

    // Pass configuration to MainGameScene
    game.registry.set('gameMode', selectedMode);
    game.registry.set('enabledEnemies', enabledEnemies);

    // Enable canvas once Phaser is ready
    game.events.once('ready', () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.classList.remove('disabled');
      }
    });
  });
}

// Set up test panel on page load
setupTestPanel();

// Export for testing purposes
export { game, config };
