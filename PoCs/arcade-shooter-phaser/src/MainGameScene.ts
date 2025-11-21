/**
 * @file MainGameScene.ts
 * @description Main Phaser scene for the arcade shooter game.
 * Manages game state, entities, and core game loop using Phaser 3 framework.
 */

import Phaser from 'phaser';
import { Enemy, EnemyType, updateEnemyMovement, getEnemyProperties, createEnemy } from './enemies';
import { spawnEnemies, spawnEnemiesTestMode, SpawnTimers } from './spawning';
import { showEnemyIntroduction, isFirstEncounter, markAsEncountered } from './enemyIntro';
import type { GameRegistry } from './types';

/**
 * Game configuration constants.
 */
const CONFIG = {
  PLAYER_SPEED: 5,
  PLAYER_SIZE: 30,
  GAME_SPEED: 0.8,
  SHOOT_INTERVAL: 200,
  BULLET_SPEED: 7,
  BULLET_SIZE: 5,
  ENEMY_BULLET_SPEED_MULT: 0.7,
  STANDARD_ENEMY_SPAWN_INTERVAL: 1000,
  SPECIAL_ENEMY_SPAWN_INTERVAL: 4500,
  TEST_MODE_SPAWN_INTERVAL: 1500,
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
  private enemies: Array<Enemy & { sprite: Phaser.GameObjects.Triangle | Phaser.GameObjects.Arc; hpBar?: { bg: Phaser.GameObjects.Rectangle; bar: Phaser.GameObjects.Rectangle } }> = [];
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
  /** Audio buffers for synth sounds */
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  /** Set of encountered enemy types for first-time introductions */
  private encounteredEnemies: Set<EnemyType> = new Set();
  /** Game paused flag (used when showing enemy introduction modal) */
  private gamePaused: boolean = false;
  /** Flag to prevent showing multiple enemy introduction modals at once */
  private isShowingIntroModal: boolean = false;
  /** Game mode: 'normal' for progressive spawning, 'test' for custom enemy selection */
  private gameMode: 'normal' | 'test' = 'normal';
  /** Test mode configuration: which enemy types to spawn */
  private enabledEnemies: EnemyType[] = [EnemyType.STANDARD];

  constructor() {
    super({ key: 'MainGameScene' });
  }

  /**
   * Phaser lifecycle: preload assets.
   * Called before create() - load sprites, audio, etc.
   */
  preload(): void {
    // Create particle textures programmatically
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // Explosion particle (small square)
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 4, 4);
    graphics.generateTexture('particle', 4, 4);
    graphics.clear();

    // Generate audio using Web Audio API
    this.generateAudioAssets();
  }

  /**
   * Phaser lifecycle: initialize scene.
   * Called after preload() - create game objects.
   */
  create(): void {
    // Get game configuration from registry (set by MenuScene) - type-safe
    // Use ?? for consistency with GameOverScene
    this.gameMode = (this.registry.get('gameMode') as GameRegistry['gameMode']) ?? 'normal';
    this.enabledEnemies = (this.registry.get('enabledEnemies') as GameRegistry['enabledEnemies']) ?? [EnemyType.STANDARD];

    // Reset game state
    this.score = 0;
    this.enemies = [];
    this.enemyBullets = [];
    this.gameOver = false;
    this.lastPlayerShot = 0;
    this.gamePaused = false;
    this.isShowingIntroModal = false;
    this.encounteredEnemies.clear();
    this.spawnTimers = {
      lastStandardSpawn: 0,
      lastYellowSpawn: 0,
      lastPurpleSpawn: 0,
      lastTankSpawn: 0,
    };

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

    // Handle game pause (e.g., during enemy introduction modal)
    if (this.gamePaused) {
      return;
    }

    // Handle game over - transition to GameOverScene
    if (this.gameOver) {
      // Save final score to registry (type-safe)
      const finalScore: GameRegistry['finalScore'] = this.score;
      this.game.registry.set('finalScore', finalScore);
      // Transition to game over scene
      this.scene.start('GameOverScene');
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

    // Spawn enemies into temporary array based on game mode
    const newEnemies: Enemy[] = [];
    if (this.gameMode === 'normal') {
      spawnEnemies(newEnemies, this.spawnTimers, gameTime, now, {
        canvasWidth: this.scale.width,
        standardInterval: CONFIG.STANDARD_ENEMY_SPAWN_INTERVAL,
        specialInterval: CONFIG.SPECIAL_ENEMY_SPAWN_INTERVAL,
      });
    } else {
      // Test mode: spawn random enemies from enabled list
      spawnEnemiesTestMode(newEnemies, this.spawnTimers, now, {
        canvasWidth: this.scale.width,
        enabledEnemies: this.enabledEnemies,
        spawnInterval: CONFIG.TEST_MODE_SPAWN_INTERVAL,
      });
    }

    // Create sprites for newly spawned enemies
    for (const enemy of newEnemies) {
      const props = getEnemyProperties(enemy.type);

      if (enemy.type === EnemyType.TELEPORT) {
        // TELEPORT enemy: render as circle with color cycling
        const centerX = enemy.x + enemy.width / 2;
        const centerY = enemy.y + enemy.height / 2;
        const radius = enemy.width / 2;
        const sprite = this.add.arc(
          centerX,
          centerY,
          radius,
          0,
          360,
          false,
          parseInt(props.color.replace('#', ''), 16)
        );
        sprite.setStrokeStyle(2, 0xffffff); // Add white border
        this.enemies.push({ ...enemy, sprite });
      } else {
        // Other enemies: render as triangles
        const sprite = this.add.triangle(
          enemy.x,
          enemy.y,
          0, enemy.height,                    // bottom point
          -enemy.width/2, 0,                  // top-left
          enemy.width/2, 0,                   // top-right
          parseInt(props.color.replace('#', ''), 16)
        );

        // Add HP bar for TANK enemies
        if (enemy.type === EnemyType.TANK) {
          const barWidth = enemy.width;
          const barHeight = 4;
          const barX = enemy.x;
          const barY = enemy.y - 8;

          const hpBarBg = this.add.rectangle(barX + barWidth / 2, barY + barHeight / 2, barWidth, barHeight, 0x333333);
          const hpBar = this.add.rectangle(barX + barWidth / 2, barY + barHeight / 2, barWidth, barHeight, 0x2ecc71);
          hpBar.setOrigin(0, 0.5);
          hpBar.x = barX;

          this.enemies.push({ ...enemy, sprite, hpBar: { bg: hpBarBg, bar: hpBar } });
        } else {
          this.enemies.push({ ...enemy, sprite });
        }
      }
    }

    // Check for first encounters in newly spawned enemies only (optimization)
    // Only show modal if not already showing one (prevent race condition)
    if (!this.isShowingIntroModal && newEnemies.length > 0) {
      for (const enemy of newEnemies) {
        if (isFirstEncounter(enemy.type, this.encounteredEnemies)) {
          markAsEncountered(enemy.type, this.encounteredEnemies);
          this.gamePaused = true;
          this.isShowingIntroModal = true;
          showEnemyIntroduction(this, enemy.type, () => {
            this.gamePaused = false;
            this.isShowingIntroModal = false;
          });
          break; // Only show one introduction at a time
        }
      }
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
        this.scale.height,
        CONFIG.GAME_SPEED,
        now
      );

      // Update sprite position
      if (enemy.type === EnemyType.TELEPORT) {
        // TELEPORT enemy: update circle position (center-based)
        const centerX = enemy.x + enemy.width / 2;
        const centerY = enemy.y + enemy.height / 2;
        enemy.sprite.setPosition(centerX, centerY);

        // Cycle through colors
        const colors = [0xff00ff, 0x00ffff, 0xffff00, 0xff00aa, 0x00ff88];
        const colorIndex = Math.floor(now / 300) % colors.length;
        (enemy.sprite as Phaser.GameObjects.Arc).setFillStyle(colors[colorIndex]);
      } else {
        // Other enemies: update triangle position (top-left based)
        enemy.sprite.setPosition(enemy.x, enemy.y);

        // Update HP bar for TANK enemies
        if (enemy.type === EnemyType.TANK && enemy.hpBar) {
          const barWidth = enemy.width;
          const barHeight = 4;
          const barX = enemy.x;
          const barY = enemy.y - 8;

          enemy.hpBar.bg.setPosition(barX + barWidth / 2, barY + barHeight / 2);
          enemy.hpBar.bar.setPosition(barX, barY + barHeight / 2);

          // Update HP bar width and color
          const hpRatio = enemy.hp / enemy.maxHp;
          enemy.hpBar.bar.width = barWidth * hpRatio;
          const hpColor = hpRatio > 0.5 ? 0x2ecc71 : hpRatio > 0.25 ? 0xf39c12 : 0xe74c3c;
          enemy.hpBar.bar.setFillStyle(hpColor);
        }
      }

      // Enemy shooting
      const props = getEnemyProperties(enemy.type);
      if (props.canShoot && now - enemy.lastShot > props.shootInterval) {
        this.shootEnemyBullet(enemy);
        enemy.lastShot = now;
      }

      // Remove off-screen enemies
      if (enemy.y > this.scale.height + enemy.height) {
        enemy.sprite.destroy();
        enemy.hpBar?.bg.destroy();
        enemy.hpBar?.bar.destroy();
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

          // Play hit sound
          this.playSynthSound('hit', 0.4);

          // Flash effect on hit
          this.createHitFlash(enemy.sprite);

          // Hit particles (small sparks)
          this.createHitParticles(bullet.x, bullet.y);

          // Destroy bullet
          bullet.destroy();

          // Remove enemy if HP depleted
          if (enemy.hp <= 0) {
            const points = getEnemyProperties(enemy.type).points;
            this.score += points;
            this.updateScore(this.score);

            // Create explosion effect
            this.createExplosion(enemy.sprite.x, enemy.sprite.y, enemy.type);

            // Play explosion sound
            this.playSynthSound('explosion', 0.5);

            // Camera shake on explosion
            this.cameras.main.shake(200, 0.005);

            enemy.sprite.destroy();
            enemy.hpBar?.bg.destroy();
            enemy.hpBar?.bar.destroy();
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

    // Play shoot sound
    this.playSynthSound('shoot', 0.3);
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
   * Generates synth audio assets using Web Audio API.
   * Creates retro arcade-style sound effects for shoot, hit, and explosion.
   */
  private generateAudioAssets(): void {
    if (!this.sound) return;
    const soundManager = this.sound as Phaser.Sound.WebAudioSoundManager;
    if (!soundManager.context) return;

    const audioContext = soundManager.context;
    const sampleRate = audioContext.sampleRate;

    // Shoot sound - short laser pew (0.1s)
    const shootBuffer = audioContext.createBuffer(1, sampleRate * 0.1, sampleRate);
    const shootData = shootBuffer.getChannelData(0);
    for (let i = 0; i < shootData.length; i++) {
      const t = i / sampleRate;
      const freq = 800 - t * 4000; // Descending frequency
      shootData[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 20);
    }
    this.audioBuffers.set('shoot', shootBuffer);

    // Hit sound - short blip (0.05s)
    const hitBuffer = audioContext.createBuffer(1, sampleRate * 0.05, sampleRate);
    const hitData = hitBuffer.getChannelData(0);
    for (let i = 0; i < hitData.length; i++) {
      const t = i / sampleRate;
      hitData[i] = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 50);
    }
    this.audioBuffers.set('hit', hitBuffer);

    // Explosion sound - rumble (0.3s)
    const explBuffer = audioContext.createBuffer(1, sampleRate * 0.3, sampleRate);
    const explData = explBuffer.getChannelData(0);
    for (let i = 0; i < explData.length; i++) {
      const t = i / sampleRate;
      const noise = Math.random() * 2 - 1;
      const freq = 200 - t * 400;
      explData[i] = (Math.sin(2 * Math.PI * freq * t) * 0.5 + noise * 0.5) * Math.exp(-t * 8);
    }
    this.audioBuffers.set('explosion', explBuffer);
  }

  /**
   * Plays a synth sound using Web Audio API.
   * @param key - Sound key ('shoot', 'hit', 'explosion')
   * @param volume - Volume (0-1)
   */
  private playSynthSound(key: string, volume: number = 1.0): void {
    const buffer = this.audioBuffers.get(key);
    if (!buffer || !this.sound) return;

    const soundManager = this.sound as Phaser.Sound.WebAudioSoundManager;
    if (!soundManager.context) return;

    const audioContext = soundManager.context;
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);
  }

  /**
   * Creates a brief white flash on hit sprite.
   * Visual feedback for successful hit.
   *
   * @param sprite - The sprite to flash
   */
  private createHitFlash(sprite: Phaser.GameObjects.Triangle): void {
    // Store original color
    const originalColor = sprite.fillColor;

    // Flash white
    sprite.setFillStyle(0xffffff);

    // Reset color after 50ms
    this.time.delayedCall(50, () => {
      if (sprite.active) {
        sprite.setFillStyle(originalColor);
      }
    });
  }

  /**
   * Creates small particle sparks at hit location.
   * Brief visual feedback on bullet impact.
   *
   * @param x - X coordinate of impact
   * @param y - Y coordinate of impact
   */
  private createHitParticles(x: number, y: number): void {
    const particles = this.add.particles(x, y, 'particle', {
      speed: { min: 20, max: 80 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      tint: 0xffff00, // Yellow sparks
      lifespan: 200,
      quantity: 5,
      blendMode: Phaser.BlendModes.ADD,
    });

    // Auto-destroy emitter
    this.time.delayedCall(250, () => {
      particles.destroy();
    });
  }

  /**
   * Creates an explosion particle effect at the given position.
   * Effect color and intensity vary by enemy type.
   *
   * @param x - X coordinate of explosion
   * @param y - Y coordinate of explosion
   * @param enemyType - Type of enemy that exploded
   */
  private createExplosion(x: number, y: number, enemyType: EnemyType): void {
    const props = getEnemyProperties(enemyType);
    const color = parseInt(props.color.replace('#', ''), 16);

    // Create particle emitter
    const particles = this.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      tint: color,
      lifespan: 500,
      quantity: enemyType === EnemyType.TANK ? 30 : 15, // More particles for TANK
      blendMode: Phaser.BlendModes.ADD,
    });

    // Auto-destroy emitter after effect completes
    this.time.delayedCall(600, () => {
      particles.destroy();
    });
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

}
