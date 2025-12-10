/**
 * @file MenuScene.ts
 * @description Menu scene for game configuration and start.
 * Uses DOM-based overlay for UI.
 */

import Phaser from 'phaser';
import { EnemyType, getEnemyProperties } from './enemies';
import type { GameRegistry, GameConfig } from './types';
import { validateTestModeConfig, getDefaultConfig } from './types';

/**
 * Menu scene for configuring game mode and starting the game.
 * Displays HTML overlay for configuration.
 */
export class MenuScene extends Phaser.Scene {
  /** Selected game mode */
  private gameMode: 'normal' | 'test' = 'normal';
  /** Selected enemies for test mode */
  private selectedEnemies: Set<EnemyType> = new Set([EnemyType.STANDARD]);
  /** Game configuration */
  private config: GameConfig = getDefaultConfig();
  
  // DOM Elements references
  private modal: HTMLElement | null = null;
  private modeNormalBtn: HTMLElement | null = null;
  private modeTestBtn: HTMLElement | null = null;
  private settingsContainer: HTMLElement | null = null;
  private errorMsg: HTMLElement | null = null;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.modal = document.getElementById('mainMenuModal');
    if (!this.modal) {
      console.error('Menu modal not found!');
      return;
    }

    this.modeNormalBtn = document.getElementById('modeNormal');
    this.modeTestBtn = document.getElementById('modeTest');
    this.settingsContainer = document.getElementById('testModeSettings');
    this.errorMsg = document.getElementById('menuErrorMsg');

    // Show modal
    this.modal.classList.add('visible');

    // Initialize UI
    this.initEnemiesTab();
    this.initValues();
    this.setupEventListeners();
    this.updateModeUI();

    // Keyboard shortcuts
    // Clean up previous listeners to be safe (though usually scene specific)
    this.input.keyboard?.off('keydown-UP');
    this.input.keyboard?.off('keydown-DOWN');
    this.input.keyboard?.off('keydown-LEFT');
    this.input.keyboard?.off('keydown-RIGHT');
    this.input.keyboard?.off('keydown-ENTER');

    this.input.keyboard?.on('keydown-UP', () => this.setMode('normal'));
    this.input.keyboard?.on('keydown-DOWN', () => this.setMode('test'));
    this.input.keyboard?.on('keydown-LEFT', () => this.setMode('normal'));
    this.input.keyboard?.on('keydown-RIGHT', () => this.setMode('test'));
    this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
  }

  private initEnemiesTab(): void {
    const container = document.getElementById('tab-enemies');
    if (!container) return;

    container.innerHTML = ''; // Clear existing

    Object.values(EnemyType).forEach((enemyType) => {
      const props = getEnemyProperties(enemyType);
      
      const div = document.createElement('div');
      div.className = 'checkbox-item';
      div.dataset.enemy = enemyType;
      
      const icon = document.createElement('span');
      icon.className = 'checkbox-icon';
      icon.textContent = '☐';
      
      const label = document.createElement('span');
      label.textContent = `${props.name} (${props.description})`;

      div.appendChild(icon);
      div.appendChild(label);

      div.onclick = () => {
        this.toggleEnemy(enemyType, div, icon);
      };

      // Set initial state
      if (this.selectedEnemies.has(enemyType)) {
        div.classList.add('checked');
        icon.textContent = '☑';
      }

      container.appendChild(div);
    });
  }

  private toggleEnemy(type: EnemyType, div: HTMLElement, icon: HTMLElement): void {
    if (this.selectedEnemies.has(type)) {
      this.selectedEnemies.delete(type);
      div.classList.remove('checked');
      icon.textContent = '☐';
    } else {
      this.selectedEnemies.add(type);
      div.classList.add('checked');
      icon.textContent = '☑';
    }
  }

  private initValues(): void {
    // Initialize all counters
    const items = document.querySelectorAll('.config-item');
    items.forEach((item) => {
      const key = (item as HTMLElement).dataset.key;
      if (key) {
        const val = this.getConfigValue(key);
        const valDisplay = item.querySelector('.config-value');
        if (valDisplay) valDisplay.textContent = val.toString();
      }
    });
  }

  private setupEventListeners(): void {
    // Mode Selection
    if (this.modeNormalBtn) this.modeNormalBtn.onclick = () => this.setMode('normal');
    if (this.modeTestBtn) this.modeTestBtn.onclick = () => this.setMode('test');

    // Tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      (tab as HTMLElement).onclick = (e) => {
        const target = e.currentTarget as HTMLElement;
        const tabId = target.dataset.tab;
        
        // Update tabs
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        target.classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tabId}`)?.classList.add('active');
      };
    });

    // Config Inputs (+/-)
    document.querySelectorAll('.config-item').forEach(item => {
      const el = item as HTMLElement;
      const key = el.dataset.key!;
      const min = parseFloat(el.dataset.min!);
      const max = parseFloat(el.dataset.max!);
      const step = parseFloat(el.dataset.step!);

      const minusBtn = el.querySelector('.minus') as HTMLElement;
      const plusBtn = el.querySelector('.plus') as HTMLElement;

      if (minusBtn) minusBtn.onclick = () => this.updateConfigValue(key, -step, min, max, el);
      if (plusBtn) plusBtn.onclick = () => this.updateConfigValue(key, step, min, max, el);
    });

    // Start Button
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) startBtn.onclick = () => this.startGame();
  }

  private setMode(mode: 'normal' | 'test'): void {
    this.gameMode = mode;
    this.updateModeUI();
  }

  private updateModeUI(): void {
    if (this.modeNormalBtn) {
      if (this.gameMode === 'normal') this.modeNormalBtn.classList.add('selected');
      else this.modeNormalBtn.classList.remove('selected');
    }

    if (this.modeTestBtn) {
      if (this.gameMode === 'test') this.modeTestBtn.classList.add('selected');
      else this.modeTestBtn.classList.remove('selected');
    }

    if (this.settingsContainer) {
      if (this.gameMode === 'test') this.settingsContainer.classList.add('visible');
      else this.settingsContainer.classList.remove('visible');
    }
  }

  private getConfigValue(key: string): number {
    // Safe access using any cast for dynamic key access, or specific checks
    // Using specific checks for type safety like in original
    if (key === 'gameSpeed') return this.config.gameSpeed;
    if (key === 'playerSpeed') return this.config.playerSpeed;
    if (key === 'bulletSpeed') return this.config.bulletSpeed;
    if (key === 'enemyBulletSpeedMult') return this.config.enemyBulletSpeedMult;
    if (key === 'playerShootInterval') return this.config.playerShootInterval;
    if (key === 'enemyShootStandard') return this.config.enemyShootIntervals[EnemyType.STANDARD];
    if (key === 'enemyShootYellow') return this.config.enemyShootIntervals[EnemyType.YELLOW];
    if (key === 'enemyShootTank') return this.config.enemyShootIntervals[EnemyType.TANK];
    if (key === 'enemyShootTeleport') return this.config.enemyShootIntervals[EnemyType.TELEPORT];
    if (key === 'standardSpawnInterval') return this.config.standardSpawnInterval;
    if (key === 'specialSpawnInterval') return this.config.specialSpawnInterval;
    if (key === 'testSpawnInterval') return this.config.testSpawnInterval;
    return 0;
  }

  private updateConfigValue(key: string, delta: number, min: number, max: number, element: HTMLElement): void {
    const current = this.getConfigValue(key);
    const newValue = Math.max(min, Math.min(max, current + delta));
    const rounded = Math.round(newValue * 100) / 100;

    // Update config object
    if (key === 'gameSpeed') this.config.gameSpeed = rounded;
    else if (key === 'playerSpeed') this.config.playerSpeed = rounded;
    else if (key === 'bulletSpeed') this.config.bulletSpeed = rounded;
    else if (key === 'enemyBulletSpeedMult') this.config.enemyBulletSpeedMult = rounded;
    else if (key === 'playerShootInterval') this.config.playerShootInterval = rounded;
    else if (key === 'enemyShootStandard') this.config.enemyShootIntervals[EnemyType.STANDARD] = rounded;
    else if (key === 'enemyShootYellow') this.config.enemyShootIntervals[EnemyType.YELLOW] = rounded;
    else if (key === 'enemyShootTank') this.config.enemyShootIntervals[EnemyType.TANK] = rounded;
    else if (key === 'enemyShootTeleport') this.config.enemyShootIntervals[EnemyType.TELEPORT] = rounded;
    else if (key === 'standardSpawnInterval') this.config.standardSpawnInterval = rounded;
    else if (key === 'specialSpawnInterval') this.config.specialSpawnInterval = rounded;
    else if (key === 'testSpawnInterval') this.config.testSpawnInterval = rounded;

    // Update UI
    const valDisplay = element.querySelector('.config-value');
    if (valDisplay) valDisplay.textContent = rounded.toString();
  }

  private startGame(): void {
    if (this.errorMsg) this.errorMsg.textContent = '';

    const validationError = validateTestModeConfig(this.gameMode, this.selectedEnemies);
    if (validationError) {
      if (this.errorMsg) this.errorMsg.textContent = validationError;
      return;
    }

    // Hide modal
    if (this.modal) this.modal.classList.remove('visible');

    // Pass configuration to MainGameScene via registry
    const gameMode: GameRegistry['gameMode'] = this.gameMode;
    const enabledEnemies: GameRegistry['enabledEnemies'] = Array.from(this.selectedEnemies);
    const config: GameRegistry['config'] = this.config;

    this.game.registry.set('gameMode', gameMode);
    this.game.registry.set('enabledEnemies', enabledEnemies);
    this.game.registry.set('config', config);

    this.scene.start('MainGameScene');
  }

  shutdown(): void {
    if (this.modal) this.modal.classList.remove('visible');
  }
}
