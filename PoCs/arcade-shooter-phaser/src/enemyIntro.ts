/**
 * @file enemyIntro.ts
 * @description Enemy introduction modal system for Phaser version.
 * Handles first-encounter presentation with visual preview and narrative description.
 */

import Phaser from "phaser";
import { EnemyType, getEnemyProperties, getEnemyMetadata } from "./enemies";

/**
 * Draws an enlarged enemy preview using Phaser graphics.
 * Uses the same rendering logic as main game but at larger scale.
 *
 * @param scene - Phaser scene to render in
 * @param type - Enemy type to render
 * @param x - X position for preview
 * @param y - Y position for preview
 * @returns Array of created game objects for cleanup
 */
function drawEnemyPreview(
  scene: Phaser.Scene,
  type: EnemyType,
  x: number,
  y: number
): Phaser.GameObjects.GameObject[] {
  const props = getEnemyProperties(type);
  const objects: Phaser.GameObjects.GameObject[] = [];

  // Calculate scale to fit enemy nicely (with some padding)
  const previewSize = 120;
  const scale = previewSize / props.size;
  const scaledSize = props.size * scale;

  // Create graphics for shape rendering
  const graphics = scene.add.graphics();
  objects.push(graphics);

  if (type === EnemyType.TELEPORT) {
    // TELEPORT enemy - multicolored circle
    const radius = scaledSize / 2;

    // Outer body (Enemy color)
    graphics.fillStyle(parseInt(props.color.replace("#", ""), 16), 1);
    graphics.fillCircle(x, y, radius);

    // Inner energy ring (Cyan for sci-fi effect)
    graphics.fillStyle(0x00ffff, 0.8);
    graphics.fillCircle(x, y, radius * 0.6);

    // Core (White)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(x, y, radius * 0.3);

    // Outline
    graphics.lineStyle(2, 0xffffff, 0.5);
    graphics.strokeCircle(x, y, radius);
  } else {
    // STANDARD/OTHER enemies - Triangle pointing down

    // Fill (color)
    graphics.fillStyle(parseInt(props.color.replace("#", ""), 16), 1);
    graphics.beginPath();
    graphics.moveTo(x - scaledSize / 2, y - scaledSize / 2); // top-left (base)
    graphics.lineTo(x + scaledSize / 2, y - scaledSize / 2); // top-right (base)
    graphics.lineTo(x, y + scaledSize / 2); // bottom-center (tip)
    graphics.closePath();
    graphics.fillPath();

    // Outline (white/grey)
    graphics.lineStyle(2, 0xffffff, 0.3);
    graphics.strokeTriangle(
      x - scaledSize / 2,
      y - scaledSize / 2,
      x + scaledSize / 2,
      y - scaledSize / 2,
      x,
      y + scaledSize / 2
    );
  }

  // Add HP indicator for TANK
  if (type === EnemyType.TANK) {
    const hpText = scene.add.text(x, y + scaledSize + 15, `HP: ${props.hp}`, {
      fontSize: "20px",
      color: "#ffffff",
      fontFamily: "Arial",
      fontStyle: "bold",
    });
    hpText.setOrigin(0.5, 0);
    objects.push(hpText);
  }

  return objects;
}

/**
 * Shows the enemy introduction modal for a newly encountered enemy type.
 * Pauses game scene and displays modal overlay.
 *
 * @param scene - Phaser scene to show modal in
 * @param type - Enemy type to introduce
 * @param onClose - Callback function to resume game
 */
export function showEnemyIntroduction(
  scene: Phaser.Scene,
  type: EnemyType,
  onClose: () => void
): void {
  const modal = document.getElementById("enemyIntroModal");
  const nameEl = document.getElementById("enemyName");
  const descEl = document.getElementById("enemyDescription");
  const closeBtn = document.getElementById("closeIntroBtn");
  const previewContainer = document.getElementById("enemyPreviewPhaser");

  if (!modal || !previewContainer || !nameEl || !descEl || !closeBtn) {
    console.error("Enemy introduction modal elements not found");
    onClose();
    return;
  }

  // Get enemy metadata
  const metadata = getEnemyMetadata(type);

  // Update modal content
  nameEl.textContent = metadata.name;
  descEl.textContent = metadata.description;

  // Clear previous preview
  previewContainer.innerHTML = "";

  let previewGame: Phaser.Game | null = null;

  // Create a mini Phaser game for the preview
  try {
    const previewConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 200,
      height: 200,
      parent: "enemyPreviewPhaser",
      backgroundColor: "#16213e",
      scene: {
        create: function (this: Phaser.Scene) {
          const centerX = this.scale.width / 2;
          const centerY = this.scale.height / 2;
          drawEnemyPreview(this, type, centerX, centerY);
        },
      },
    };

    previewGame = new Phaser.Game(previewConfig);
  } catch (error) {
    console.error("Failed to create Phaser preview game:", error);
    // Continue showing modal even if preview fails
  }

  // Show modal
  modal.classList.add("visible");

  // Close handlers with proper cleanup
  const closeModal = () => {
    try {
      // Remove modal visibility
      modal.classList.remove("visible");

      // Clean up event listeners
      document.removeEventListener("keydown", keyHandler);
      closeBtn.removeEventListener("click", closeModal);

      // Destroy preview game if it exists
      if (previewGame) {
        previewGame.destroy(true);
        previewGame = null;
      }
    } catch (error) {
      console.error("Error closing enemy introduction modal:", error);
    } finally {
      // Always call onClose to resume game, even if cleanup fails
      onClose();
    }
  };

  const keyHandler = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      e.preventDefault();
      closeModal();
    }
  };

  // Register close handlers
  try {
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", keyHandler);
  } catch (error) {
    console.error("Error registering event handlers:", error);
    // If we can't register handlers, close immediately
    closeModal();
  }
}

/**
 * Checks if an enemy type has been encountered before.
 *
 * @param type - Enemy type to check
 * @param encounteredTypes - Set of previously encountered enemy types
 * @returns true if this is first encounter, false otherwise
 */
export function isFirstEncounter(
  type: EnemyType,
  encounteredTypes: Set<EnemyType>
): boolean {
  return !encounteredTypes.has(type);
}

/**
 * Marks an enemy type as encountered.
 *
 * @param type - Enemy type to mark
 * @param encounteredTypes - Set of previously encountered enemy types (mutated)
 */
export function markAsEncountered(
  type: EnemyType,
  encounteredTypes: Set<EnemyType>
): void {
  encounteredTypes.add(type);
}
