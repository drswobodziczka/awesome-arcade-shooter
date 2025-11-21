/**
 * @file enemyIntro.ts
 * @description Enemy introduction modal system.
 * Handles first-encounter presentation with visual preview and narrative description.
 */

import { EnemyType, getEnemyProperties, getEnemyMetadata } from './enemies';

/**
 * Draws an enlarged enemy preview on the introduction canvas.
 * Uses the same rendering logic as main game but at larger scale.
 *
 * @param ctx - Canvas 2D context for preview
 * @param type - Enemy type to render
 */
function drawEnemyPreview(ctx: CanvasRenderingContext2D, type: EnemyType): void {
  const props = getEnemyProperties(type);
  const canvasSize = 200;

  // Clear canvas
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Calculate scale to fit enemy nicely (with some padding)
  const maxSize = canvasSize * 0.6;
  const scale = maxSize / props.size;
  const scaledSize = props.size * scale;

  // Center the enemy
  const x = (canvasSize - scaledSize) / 2;
  const y = (canvasSize - scaledSize) / 2;

  // Special rendering for TELEPORT enemy
  if (type === EnemyType.TELEPORT) {
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    const centerX = x + scaledSize / 2;
    const centerY = y + scaledSize / 2;
    const radius = scaledSize / 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else {
    // Draw triangle for other enemies
    ctx.fillStyle = props.color;
    ctx.beginPath();
    // Point down (enemy orientation)
    ctx.moveTo(x + scaledSize / 2, y + scaledSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + scaledSize, y);
    ctx.closePath();
    ctx.fill();

    // Add outline for better visibility
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Add HP indicator for TANK
  if (type === EnemyType.TANK) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`HP: ${props.hp}`, canvasSize / 2, canvasSize - 20);
  }
}

/**
 * Shows the enemy introduction modal for a newly encountered enemy type.
 * Pauses game by blocking input until modal is closed.
 *
 * @param type - Enemy type to introduce
 * @param onClose - Callback function to resume game
 */
export function showEnemyIntroduction(type: EnemyType, onClose: () => void): void {
  const modal = document.getElementById('enemyIntroModal');
  const previewCanvas = document.getElementById('enemyPreviewCanvas') as HTMLCanvasElement;
  const nameEl = document.getElementById('enemyName');
  const descEl = document.getElementById('enemyDescription');
  const closeBtn = document.getElementById('closeIntroBtn');

  if (!modal || !previewCanvas || !nameEl || !descEl || !closeBtn) {
    console.error('Enemy introduction modal elements not found');
    onClose();
    return;
  }

  // Get enemy metadata
  const metadata = getEnemyMetadata(type);

  // Update modal content
  nameEl.textContent = metadata.name;
  descEl.textContent = metadata.description;

  // Draw enemy preview
  const ctx = previewCanvas.getContext('2d');
  if (ctx) {
    drawEnemyPreview(ctx, type);
  }

  // Show modal
  modal.classList.add('visible');

  // Close handlers
  const closeModal = () => {
    modal.classList.remove('visible');
    document.removeEventListener('keydown', keyHandler);
    closeBtn.removeEventListener('click', closeModal);
    onClose();
  };

  const keyHandler = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      closeModal();
    }
  };

  // Register close handlers
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', keyHandler);
}

/**
 * Checks if an enemy type has been encountered before.
 *
 * @param type - Enemy type to check
 * @param encounteredTypes - Set of previously encountered enemy types
 * @returns true if this is first encounter, false otherwise
 */
export function isFirstEncounter(type: EnemyType, encounteredTypes: Set<EnemyType>): boolean {
  return !encounteredTypes.has(type);
}

/**
 * Marks an enemy type as encountered.
 *
 * @param type - Enemy type to mark
 * @param encounteredTypes - Set of previously encountered enemy types (mutated)
 */
export function markAsEncountered(type: EnemyType, encounteredTypes: Set<EnemyType>): void {
  encounteredTypes.add(type);
}
