/**
 * @file MenuScene.ts
 * @description Menu scene for game configuration and start.
 * Replaces DOM-based test panel with in-game UI.
 */

import Phaser from 'phaser';
import { EnemyType, getEnemyProperties } from './enemies';
import type { GameRegistry } from './types';
import { validateTestModeConfig } from './types';

/**
 * Menu scene for configuring game mode and starting the game.
 * Displays game title, mode selection, and enemy selection for test mode.
 */
export class MenuScene extends Phaser.Scene {
  /** Selected game mode */
  private gameMode: 'normal' | 'test' = 'normal';
  /** Selected enemies for test mode */
  private selectedEnemies: Set<EnemyType> = new Set([EnemyType.STANDARD]);
  /** UI text objects for mode indicators */
  private modeTexts: Map<string, Phaser.GameObjects.Text> = new Map();
  /** UI text objects for enemy checkboxes */
  private enemyTexts: Map<EnemyType, Phaser.GameObjects.Text> = new Map();
  /** Enemy selection container (shown only in test mode) */
  private enemySelectionContainer?: Phaser.GameObjects.Container;
  /** Error text for validation feedback */
  private errorText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const centerX = this.scale.width / 2;
    let y = 80;

    // Title
    this.add.text(centerX, y, 'ARCADE SHOOTER', {
      fontSize: '48px',
      color: '#e94560',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    y += 80;

    // Subtitle
    this.add.text(centerX, y, 'Configure Your Game', {
      fontSize: '20px',
      color: '#00d4ff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    y += 60;

    // Mode selection header
    this.add.text(centerX, y, 'Game Mode:', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    y += 40;

    // Normal mode option
    const normalText = this.add.text(centerX, y, '● Normal Mode (progressive spawning)', {
      fontSize: '18px',
      color: '#00ff00',
      fontFamily: 'Arial',
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectMode('normal'));

    this.modeTexts.set('normal', normalText);
    y += 35;

    // Test mode option
    const testText = this.add.text(centerX, y, '○ Test Mode (spawn selected enemies)', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'Arial',
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectMode('test'));

    this.modeTexts.set('test', testText);
    y += 60;

    // Enemy selection (for test mode)
    this.createEnemySelection(centerX, y);

    // Error text (hidden by default)
    this.errorText = this.add.text(centerX, this.scale.height - 150, '', {
      fontSize: '16px',
      color: '#ff6b6b',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Start button
    const startBtn = this.add.text(centerX, this.scale.height - 100, 'START GAME', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      backgroundColor: '#e94560',
      padding: { x: 30, y: 15 },
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => startBtn.setScale(1.1))
      .on('pointerout', () => startBtn.setScale(1));

    // Controls hint
    this.add.text(centerX, this.scale.height - 40, 'Arrow keys: Move | Space: Shoot', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Enable Enter key to start (once auto-removes after first trigger)
    this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
  }

  /**
   * Creates enemy selection UI (checkboxes for test mode).
   */
  private createEnemySelection(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Header
    const header = this.add.text(0, 0, 'Select Enemies:', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(header);

    let offsetY = 35;

    // Enemy checkboxes
    Object.values(EnemyType).forEach((enemyType) => {
      const props = getEnemyProperties(enemyType);
      const isChecked = this.selectedEnemies.has(enemyType);

      const checkbox = this.add.text(
        0,
        offsetY,
        `${isChecked ? '☑' : '☐'} ${props.name} (${props.description})`,
        {
          fontSize: '16px',
          color: isChecked ? '#00ff00' : '#888888',
          fontFamily: 'Arial',
        }
      ).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.toggleEnemy(enemyType));

      this.enemyTexts.set(enemyType, checkbox);
      container.add(checkbox);
      offsetY += 30;
    });

    container.setVisible(this.gameMode === 'test');
    this.enemySelectionContainer = container;
  }

  /**
   * Updates a mode indicator's visual state.
   * @param modeKey - The mode identifier ('normal' or 'test')
   * @param label - The full label text for the mode
   * @param isSelected - Whether this mode is currently selected
   */
  private updateModeIndicator(modeKey: string, label: string, isSelected: boolean): void {
    const text = this.modeTexts.get(modeKey);
    const bullet = isSelected ? '●' : '○';
    const color = isSelected ? '#00ff00' : '#888888';
    text?.setText(`${bullet} ${label}`).setColor(color);
  }

  /**
   * Selects game mode and updates UI.
   */
  private selectMode(mode: 'normal' | 'test'): void {
    this.gameMode = mode;

    // Update mode indicators
    this.updateModeIndicator('normal', 'Normal Mode (progressive spawning)', mode === 'normal');
    this.updateModeIndicator('test', 'Test Mode (spawn selected enemies)', mode === 'test');

    // Show/hide enemy selection
    this.enemySelectionContainer?.setVisible(mode === 'test');
  }

  /**
   * Toggles enemy selection for test mode.
   */
  private toggleEnemy(enemyType: EnemyType): void {
    if (this.selectedEnemies.has(enemyType)) {
      this.selectedEnemies.delete(enemyType);
    } else {
      this.selectedEnemies.add(enemyType);
    }

    // Update checkbox visual
    const props = getEnemyProperties(enemyType);
    const isChecked = this.selectedEnemies.has(enemyType);
    const text = this.enemyTexts.get(enemyType);

    if (text) {
      text.setText(`${isChecked ? '☑' : '☐'} ${props.name} (${props.description})`);
      text.setColor(isChecked ? '#00ff00' : '#888888');
    }
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
   * Starts the game with selected configuration.
   */
  private startGame(): void {
    // Clear any previous error
    if (this.errorText) {
      this.errorText.setText('');
    }

    // Validate configuration using pure function
    const validationError = validateTestModeConfig(this.gameMode, this.selectedEnemies);
    if (validationError) {
      if (this.errorText) {
        this.errorText.setText(validationError);
      }
      return;
    }

    // Pass configuration to MainGameScene via registry (type-safe)
    const gameMode: GameRegistry['gameMode'] = this.gameMode;
    const enabledEnemies: GameRegistry['enabledEnemies'] = Array.from(this.selectedEnemies);

    this.game.registry.set('gameMode', gameMode);
    this.game.registry.set('enabledEnemies', enabledEnemies);

    // Start main game scene
    this.scene.start('MainGameScene');
  }
}
