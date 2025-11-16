// Types
export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Collision detection (AABB)
export function checkCollision(a: GameObject, b: GameObject): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
