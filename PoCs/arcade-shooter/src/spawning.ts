import { Enemy, EnemyType, createEnemy, getEnemyProperties, isEnemyTypeUnlocked } from './enemies';

export interface SpawnTimers {
  lastStandardSpawn: number;
  lastYellowSpawn: number;
  lastPurpleSpawn: number;
  lastTankSpawn: number;
}

export interface SpawnConfig {
  canvasWidth: number;
  standardInterval: number;
  specialInterval: number;
}

// Spawn all enemy types based on game time
export function spawnEnemies(
  enemies: Enemy[],
  timers: SpawnTimers,
  gameTime: number,
  now: number,
  config: SpawnConfig
): void {
  // Spawn standard enemies
  if (now - timers.lastStandardSpawn > config.standardInterval) {
    const props = getEnemyProperties(EnemyType.STANDARD);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.STANDARD, x, -props.size, now));
    timers.lastStandardSpawn = now;
  }

  // Spawn YELLOW enemies (after 30s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.YELLOW, gameTime) &&
    now - timers.lastYellowSpawn > config.specialInterval
  ) {
    const props = getEnemyProperties(EnemyType.YELLOW);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.YELLOW, x, -props.size, now));
    timers.lastYellowSpawn = now;
  }

  // Spawn PURPLE enemies (after 60s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.PURPLE, gameTime) &&
    now - timers.lastPurpleSpawn > config.specialInterval
  ) {
    const props = getEnemyProperties(EnemyType.PURPLE);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.PURPLE, x, -props.size, now));
    timers.lastPurpleSpawn = now;
  }

  // Spawn TANK enemies (after 120s, 5x slower)
  if (
    isEnemyTypeUnlocked(EnemyType.TANK, gameTime) &&
    now - timers.lastTankSpawn > config.specialInterval
  ) {
    const props = getEnemyProperties(EnemyType.TANK);
    const x = Math.random() * (config.canvasWidth - props.size);
    enemies.push(createEnemy(EnemyType.TANK, x, -props.size, now));
    timers.lastTankSpawn = now;
  }
}
