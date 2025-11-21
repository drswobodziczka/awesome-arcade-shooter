/**
 * @file MenuScene.ts
 * @description Menu scene for game configuration and start.
 * Replaces DOM-based test panel with in-game UI.
 */

import Phaser from 'phaser';
import { EnemyType, getEnemyProperties } from './enemies';

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

    // Enable Enter key to start
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
   * Selects game mode and updates UI.
   */
  private selectMode(mode: 'normal' | 'test'): void {
    this.gameMode = mode;

    // Update mode indicators
    this.modeTexts.get('normal')?.setText(
      mode === 'normal' ? '● Normal Mode (progressive spawning)' : '○ Normal Mode (progressive spawning)'
    ).setColor(mode === 'normal' ? '#00ff00' : '#888888');

    this.modeTexts.get('test')?.setText(
      mode === 'test' ? '● Test Mode (spawn selected enemies)' : '○ Test Mode (spawn selected enemies)'
    ).setColor(mode === 'test' ? '#00ff00' : '#888888');

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
   * Starts the game with selected configuration.
   */
  private startGame(): void {
    // Validate test mode has at least one enemy
    if (this.gameMode === 'test' && this.selectedEnemies.size === 0) {
      // Show error (could add a text element for this)
      console.warn('Please select at least one enemy for test mode');
      return;
    }

    // Pass configuration to MainGameScene via registry
    this.game.registry.set('gameMode', this.gameMode);
    this.game.registry.set('enabledEnemies', Array.from(this.selectedEnemies));

    // Start main game scene
    this.scene.start('MainGameScene');
  }
}
