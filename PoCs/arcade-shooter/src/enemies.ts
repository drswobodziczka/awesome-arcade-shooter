/**
 * @file enemies.ts
 * @description Enemy system with 4 distinct types, each with unique behaviors and properties.
 * Handles enemy creation, movement patterns, and time-based unlocking system.
 */

import { GameObject } from './utils';

/**
 * Enum defining all available enemy types in the game.
 * Each type has distinct size, speed, behavior, and unlock timing.
 */
export enum EnemyType {
  /** Basic enemy: bounces horizontally, shoots straight down, available from start */
  STANDARD = 'STANDARD',
  /** Large enemy: can reverse direction vertically, shoots triple-spread, unlocks at 10s */
  YELLOW = 'YELLOW',
  /** Fast tracker: aims at player, no shooting, unlocks at 20s */
  PURPLE = 'PURPLE',
  /** Heavy enemy: slow movement, 5 HP with health bar, unlocks at 20s */
  TANK = 'TANK',
  TELEPORT = 'TELEPORT',
}

/**
 * Enemy game object with movement state and combat properties.
 * Extends GameObject with velocity, health, and shooting cooldown.
 */
export interface Enemy extends GameObject {
  /** Type identifier that determines behavior and appearance */
  type: EnemyType;
  /** Timestamp of last shot fired (ms), used for shoot interval cooldown */
  lastShot: number;
  /** Horizontal velocity in pixels per frame (can be negative for leftward movement) */
  vx: number;
  /** Vertical velocity in pixels per frame (positive = downward, negative = upward) */
  vy: number;
  /** Current hit points remaining */
  hp: number;
  /** Maximum hit points for this enemy (used for HP bar rendering) */
  maxHp: number;
  lastTeleport?: number;
}

/**
 * Configuration properties for an enemy type.
 * Defines all visual and behavioral characteristics.
 */
export interface EnemyProperties {
  /** Enemy size in pixels (square bounding box) */
  size: number;
  /** Vertical movement speed in pixels per frame */
  speed: number;
  /** Horizontal movement speed in pixels per frame */
  horizontalSpeed: number;
  /** CSS color string for rendering */
  color: string;
  /** Minimum time between shots in milliseconds (0 = cannot shoot) */
  shootInterval: number;
  /** Whether this enemy type can fire bullets */
  canShoot: boolean;
  /** Starting hit points */
  hp: number;
  points: number;
}

/**
 * Enemy metadata for introduction screen.
 * Contains display name and narrative description.
 */
export interface EnemyMetadata {
  /** Display name shown in introduction modal */
  name: string;
  /** Narrative description of enemy characteristics and threat level */
  description: string;
}

/**
 * Retrieves the configuration properties for a specific enemy type.
 *
 * @param type - The enemy type to get properties for
 * @returns Configuration object with size, speed, color, shooting behavior, and HP
 */
export function getEnemyProperties(type: EnemyType): EnemyProperties {
  switch (type) {
    case EnemyType.STANDARD:
      return {
        size: 30,
        speed: 2,
        horizontalSpeed: 2,
        color: '#e94560',
        shootInterval: 1000,
        canShoot: true,
        hp: 1,
        points: 10,
      };

    case EnemyType.YELLOW:
      return {
        size: 60, // 2x bigger
        speed: 1.5,
        horizontalSpeed: 2,
        color: '#ffd700',
        shootInterval: 1500,
        canShoot: true,
        hp: 1,
        points: 20,
      };

    case EnemyType.PURPLE:
      return {
        size: 15, // small sneaky
        speed: 3,
        horizontalSpeed: 4,
        color: '#9b59b6',
        shootInterval: 0,
        canShoot: false,
        hp: 1,
        points: 25,
      };

    case EnemyType.TANK:
      return {
        size: 90, // 3x bigger
        speed: 0.8,
        horizontalSpeed: 1,
        color: '#2ecc71',
        shootInterval: 2000,
        canShoot: true,
        hp: 5,
        points: 50,
      };

    case EnemyType.TELEPORT:
      return {
        size: 25, // slightly smaller than player
        speed: 0.3, // very slow between teleports
        horizontalSpeed: 0,
        color: '#ff00ff', // magenta (will change dynamically)
        shootInterval: 1500,
        canShoot: true,
        hp: 1,
        points: 30,
      };
  }
}

/**
 * Factory function to create a new enemy instance with initialized state.
 * Generates random horizontal velocity within the enemy type's speed range.
 *
 * @param type - The type of enemy to create
 * @param x - Initial X position (typically random across canvas width)
 * @param y - Initial Y position (typically above screen at -size)
 * @param now - Current timestamp for shooting cooldown initialization
 * @returns Fully initialized Enemy object ready to be added to game state
 */
export function createEnemy(
  type: EnemyType,
  x: number,
  y: number,
  now: number
): Enemy {
  const props = getEnemyProperties(type);
  const vx = (Math.random() - 0.5) * 2 * props.horizontalSpeed;

  const enemy: Enemy = {
    type,
    x,
    y,
    width: props.size,
    height: props.size,
    lastShot: now,
    vx,
    vy: props.speed,
    hp: props.hp,
    maxHp: props.hp,
  };

  // Initialize lastTeleport for TELEPORT enemy
  if (type === EnemyType.TELEPORT) {
    enemy.lastTeleport = now;
  }

  return enemy;
}

/**
 * Updates enemy position based on its type-specific movement behavior.
 * Mutates the enemy object's x, y, vx, and vy properties.
 *
 * Movement behaviors:
 * - STANDARD: Constant downward + horizontal bounce at walls
 * - YELLOW: Bi-directional vertical (1% chance to reverse) + horizontal bounce
 * - PURPLE: Tracks player's horizontal position, constant downward speed
 * - TANK: Same as STANDARD but with slower speed values
 *
 * @param enemy - The enemy to update (mutated in place)
 * @param playerX - Current player X position for tracking behavior
 * @param playerY - Current player Y position (unused currently)
 * @param playerWidth - Player width for centering calculations
 * @param canvasWidth - Canvas width for boundary checks
 * @param gameSpeed - Global game speed multiplier (< 1 to slow down, > 1 to speed up)
 */
export function updateEnemyMovement(
  enemy: Enemy,
  playerX: number,
  playerY: number,
  playerWidth: number,
  canvasWidth: number,
  canvasHeight: number,
  now?: number,
  gameSpeed: number
): void {
  const props = getEnemyProperties(enemy.type);

  switch (enemy.type) {
    case EnemyType.STANDARD:
      // Move down and bounce horizontally
      enemy.y += enemy.vy * gameSpeed;
      enemy.x += enemy.vx * gameSpeed;

      if (enemy.x <= 0 || enemy.x >= canvasWidth - enemy.width) {
        enemy.vx = -enemy.vx;
        enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      }
      break;

    case EnemyType.YELLOW:
      // Can move backward (up) sometimes
      enemy.y += enemy.vy * gameSpeed;
      enemy.x += enemy.vx * gameSpeed;

      // Randomly reverse vertical direction, but not if too far up
      if (Math.random() < 0.01 && enemy.y > 50) {
        enemy.vy = -enemy.vy;
      }

      // Force downward if going too far up
      if (enemy.y < 0 && enemy.vy < 0) {
        enemy.vy = Math.abs(enemy.vy);
      }

      // Bounce horizontally
      if (enemy.x <= 0 || enemy.x >= canvasWidth - enemy.width) {
        enemy.vx = -enemy.vx;
        enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      }
      break;

    case EnemyType.PURPLE:
      // Track player position
      const centerX = enemy.x + enemy.width / 2;
      const targetX = playerX + playerWidth / 2;

      // Move toward player horizontally
      if (centerX < targetX - 5) {
        enemy.x += props.horizontalSpeed * gameSpeed;
      } else if (centerX > targetX + 5) {
        enemy.x -= props.horizontalSpeed * gameSpeed;
      }

      // Move down
      enemy.y += props.speed * gameSpeed;

      // Keep in bounds
      enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      break;

    case EnemyType.TANK:
      // Slow, steady movement
      enemy.y += enemy.vy * gameSpeed;
      enemy.x += enemy.vx * gameSpeed;

      if (enemy.x <= 0 || enemy.x >= canvasWidth - enemy.width) {
        enemy.vx = -enemy.vx;
        enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      }
      break;

    case EnemyType.TELEPORT:
      // Teleport every second to lower Y position with random X
      if (now && enemy.lastTeleport && now - enemy.lastTeleport >= 1000) {
        // Teleport: jump down 100-150px and to random X
        const teleportDistance = 100 + Math.random() * 50;
        const newY = enemy.y + teleportDistance;

        // Only teleport if it won't go off-screen
        if (newY < canvasHeight - enemy.height) {
          enemy.y = newY;
          enemy.x = Math.random() * (canvasWidth - enemy.width);
        }
        enemy.lastTeleport = now;
      }

      // Between teleports, move down very slowly
      enemy.y += props.speed;

      // Keep in bounds horizontally
      enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      break;
  }
}

/**
 * Determines if an enemy type is available based on elapsed game time.
 * Implements progressive difficulty curve by unlocking stronger enemies over time.
 *
 * Unlock schedule:
 * - STANDARD: Always available (0ms)
 * - YELLOW: Unlocks at 10 seconds
 * - PURPLE: Unlocks at 20 seconds
 * - TANK: Unlocks at 20 seconds
 *
 * @param type - Enemy type to check
 * @param gameTime - Milliseconds elapsed since game start
 * @returns true if enemy type can spawn, false otherwise
 */
export function isEnemyTypeUnlocked(type: EnemyType, gameTime: number): boolean {
  switch (type) {
    case EnemyType.STANDARD:
      return true; // always available
    case EnemyType.YELLOW:
      return gameTime >= 10000; // 10 seconds
    case EnemyType.PURPLE:
      return gameTime >= 20000; // 20 seconds
    case EnemyType.TANK:
      return gameTime >= 20000; // 20 seconds
    case EnemyType.TELEPORT:
      return gameTime >= 30000; // 30 seconds
  }
}

/**
 * Returns an array of all currently unlocked enemy types.
 * Used by spawning system to randomly select from available types.
 *
 * @param gameTime - Milliseconds elapsed since game start
 * @returns Array of unlocked enemy types (always includes at least STANDARD)
 */
export function getAvailableEnemyTypes(gameTime: number): EnemyType[] {
  const types: EnemyType[] = [EnemyType.STANDARD];

  if (isEnemyTypeUnlocked(EnemyType.YELLOW, gameTime)) {
    types.push(EnemyType.YELLOW);
  }
  if (isEnemyTypeUnlocked(EnemyType.PURPLE, gameTime)) {
    types.push(EnemyType.PURPLE);
  }
  if (isEnemyTypeUnlocked(EnemyType.TANK, gameTime)) {
    types.push(EnemyType.TANK);
  }

  return types;
}

/**
 * Retrieves narrative metadata for enemy introduction screen.
 *
 * @param type - The enemy type to get metadata for
 * @returns Enemy metadata with name and description
 */
export function getEnemyMetadata(type: EnemyType): EnemyMetadata {
  switch (type) {
    case EnemyType.STANDARD:
      return {
        name: 'Zwiadowca',
        description: 'Podstawowy przeciwnik. Porusza się w dół, odbijając się od ścian. Strzela pojedynczymi pociskami prosto w dół.',
      };

    case EnemyType.YELLOW:
      return {
        name: 'Ciężki Bombardier',
        description: 'Duży, niebezpieczny wróg. Potrafi czasem cofać się w górę, co czyni go nieprzewidywalnym. Strzela potrójną salwą pocisków!',
      };

    case EnemyType.PURPLE:
      return {
        name: 'Szybki Pościg',
        description: 'Mały i zwinny. Aktywnie śledzi twoją pozycję, starając się taranować. Nie strzela, ale jest bardzo szybki!',
      };

    case EnemyType.TANK:
      return {
        name: 'Opancerzony Czołg',
        description: 'Masywny i powolny, ale niezwykle wytrzymały. Posiada 5 punktów życia - potrzeba wielu trafień, by go zniszczyć.',
      };

    case EnemyType.TELEPORT:
      return {
        name: 'Teleporter',
        description: 'Tajemniczy wróg zdolny do teleportacji. Co sekundę przeskakuje w dół, zmieniając pozycję. Strzela w kierunku gracza!',
      };
  }
}
