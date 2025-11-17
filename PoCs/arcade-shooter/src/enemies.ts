import { GameObject } from './utils';

export enum EnemyType {
  STANDARD = 'STANDARD',
  YELLOW = 'YELLOW',
  PURPLE = 'PURPLE',
  TANK = 'TANK',
}

export interface Enemy extends GameObject {
  type: EnemyType;
  lastShot: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
}

export interface EnemyProperties {
  size: number;
  speed: number;
  horizontalSpeed: number;
  color: string;
  shootInterval: number;
  canShoot: boolean;
  hp: number;
}

// Get properties for enemy type
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
      };
  }
}

// Create enemy of specific type
export function createEnemy(
  type: EnemyType,
  x: number,
  y: number,
  now: number
): Enemy {
  const props = getEnemyProperties(type);
  const vx = (Math.random() - 0.5) * 2 * props.horizontalSpeed;

  return {
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
}

// Update enemy movement based on type
export function updateEnemyMovement(
  enemy: Enemy,
  playerX: number,
  playerY: number,
  playerWidth: number,
  canvasWidth: number
): void {
  const props = getEnemyProperties(enemy.type);

  switch (enemy.type) {
    case EnemyType.STANDARD:
      // Move down and bounce horizontally
      enemy.y += enemy.vy;
      enemy.x += enemy.vx;

      if (enemy.x <= 0 || enemy.x >= canvasWidth - enemy.width) {
        enemy.vx = -enemy.vx;
        enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      }
      break;

    case EnemyType.YELLOW:
      // Can move backward (up) sometimes
      enemy.y += enemy.vy;
      enemy.x += enemy.vx;

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
        enemy.x += props.horizontalSpeed;
      } else if (centerX > targetX + 5) {
        enemy.x -= props.horizontalSpeed;
      }

      // Move down
      enemy.y += props.speed;

      // Keep in bounds
      enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      break;

    case EnemyType.TANK:
      // Slow, steady movement
      enemy.y += enemy.vy;
      enemy.x += enemy.vx;

      if (enemy.x <= 0 || enemy.x >= canvasWidth - enemy.width) {
        enemy.vx = -enemy.vx;
        enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - enemy.width));
      }
      break;
  }
}

// Check if enemy type is unlocked based on game time
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
  }
}

// Get available enemy types based on game time
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
