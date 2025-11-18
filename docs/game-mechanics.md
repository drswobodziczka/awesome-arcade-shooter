# Game Mechanics Reference

Quick reference for current game mechanics and balance values.

---

## Player

**Controls:**
- Arrow Keys: 4-directional movement
- Space: Fire bullets
- Enter: Restart (game over screen)

**Properties:**
- Size: 30×30px triangle (cyan, points up)
- Speed: 5px/frame
- Fire rate: 200ms cooldown
- Collision: AABB with enemies/bullets → game over
- Starting position: Bottom-center (185, 550)

**Combat:**
- Bullet speed: 7px/frame upward
- Bullet size: 5×10px rectangle (green)
- Damage: 1 HP per hit
- Score: +10 per enemy killed

---

## Enemy Types

### 1. STANDARD (Red `#e94560`)
**Availability:** From game start

| Property | Value |
|----------|-------|
| Size | 30×30px |
| HP | 1 |
| Movement | 2px/frame down, 2px/frame horizontal bounce |
| Shooting | Every 1000ms, straight down |
| Behavior | Bounces off left/right walls |

---

### 2. YELLOW (Gold `#ffd700`)
**Availability:** Unlocks at 10 seconds

| Property | Value |
|----------|-------|
| Size | 60×60px (2x larger) |
| HP | 1 |
| Movement | 1.5px/frame vertical (can reverse), 2px/frame horizontal |
| Shooting | Every 1500ms, **triple-spread** (left/center/right) |
| Behavior | 1% chance/frame to reverse vertical direction, forced down if Y < 0 |

**Unique mechanic:** Can move upward briefly (adds unpredictability)

---

### 3. PURPLE (Purple `#9b59b6`)
**Availability:** Unlocks at 20 seconds

| Property | Value |
|----------|-------|
| Size | 15×15px (small) |
| HP | 1 |
| Movement | 3px/frame down, 4px/frame horizontal tracking |
| Shooting | None (kamikaze type) |
| Behavior | Actively aims at player's horizontal center |

**Threat:** Fast and tracks player, forces constant repositioning

---

### 4. TANK (Green `#2ecc71`)
**Availability:** Unlocks at 20 seconds

| Property | Value |
|----------|-------|
| Size | 90×90px (3x larger) |
| HP | **5** (shows HP bar) |
| Movement | 0.8px/frame down, 1px/frame horizontal bounce |
| Shooting | Every 2000ms, straight down |
| Behavior | Slow but durable, HP bar changes color (green→yellow→red) |

**Balance:** Takes 5 hits, but only gives 10 points total (not per hit)

---

## Spawning System

**Standard enemies:**
- Interval: Every 1000ms (1 second)
- Position: Random X, above screen (Y = -30)

**Special enemies (Yellow/Purple/Tank):**
- Interval: Every 4500ms (~4.5 seconds)
- Selection: Random from unlocked special types
- Position: Random X, above screen (Y = -size)

**Unlock timeline:**
```
0s  ────► STANDARD available
10s ────► YELLOW unlocks
20s ────► PURPLE + TANK unlock
```

---

## Bullet Mechanics

**Player bullets:**
- Speed: -7px/frame (upward)
- Color: Green `#00ff00`
- Collision: Removes bullet, damages enemy

**Enemy bullets:**
- Speed: 4.9px/frame (70% of player speed, downward)
- Color: Orange `#ff6b00`
- Collision: Game over

**Yellow triple-spread:**
- Center: Straight down
- Left: 2px/frame leftward diagonal
- Right: 2px/frame rightward diagonal
- Spacing: 15px horizontal offset from center

---

## Collision System

**Algorithm:** AABB (Axis-Aligned Bounding Box)

**Collision pairs checked:**
1. Player ↔ Enemies → Game over
2. Player ↔ Enemy bullets → Game over
3. Player bullets ↔ Enemies → Damage enemy, remove bullet

**No collision:** Enemy bullets ↔ Enemy bullets (pass through)

---

## Difficulty Progression

| Time | Events |
|------|--------|
| 0s | Game starts, STANDARD enemies spawn every 1s |
| 10s | YELLOW enemies unlock (spawn every 4.5s) |
| 20s | PURPLE + TANK unlock (both spawn every 4.5s pool) |

**Difficulty curve:**
- Early game (0-10s): Single enemy type, predictable patterns
- Mid game (10-20s): Large enemies with spread shots
- Late game (20s+): Tracking enemies + durable tanks

**No difficulty scaling:** Spawn rates and enemy stats are constant (designed for infinite survival)

---

## Game Loop

**Target FPS:** 60 (via `requestAnimationFrame`)

**Frame sequence:**
1. Process input (keyboard state)
2. Update player position
3. Handle player shooting
4. Spawn enemies (time-based)
5. Update bullets (movement, bounds check)
6. Update enemies (AI movement, shooting)
7. Check collisions (bullets/enemies, player/everything)
8. Remove off-screen entities
9. Render frame

---

## Scoring

- Base reward: **10 points per enemy**
- No multipliers or combos
- Tank enemies: 10 points total (not per hit)

**High score strategy:**
- Prioritize STANDARD enemies (fastest to kill, same points)
- Avoid tanks (5 hits for same reward)
- Position to minimize dodging (more time shooting)

---

## Canvas Layout

**Dimensions:** 400×600px
**Coordinate system:** (0,0) at top-left

**Safe zones:**
- Top: Y < 0 (enemies spawn here)
- Bottom: Y > 600 (bullets despawn)
- Sides: X < 0 or X > 400 (out of bounds)

**Player spawn:** (185, 550) - bottom-center with 30px margin

---

## Known Behaviors

**Enemy boundary fixes:**
- YELLOW: Forced downward if Y < 0 (prevents escaping screen)
- All types: X clamped to [0, canvas_width - enemy_width]

**Bullet cleanup:**
- Player bullets: Removed when Y < -height
- Enemy bullets: Removed when Y > canvas_height
- Diagonal bullets (Yellow spread): Also check X bounds

**Game over triggers:**
- Player touches any enemy
- Player touches any enemy bullet
- **NOT** triggered by: Enemies reaching bottom (they despawn peacefully)
