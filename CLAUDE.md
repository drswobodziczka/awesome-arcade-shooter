# Project Instructions - Arcade Shooter

## ⚠️ CRITICAL RULE #1: SAVE RAFAL'S TIME

**BE STRICT. AVOID NOISE AND REDUNDANCY.**

- Give **concise, actionable answers** - no elaborates unless asked
- **Action over explanation** - show code/commands, skip the essay
- If Rafal wants details, he'll ask explicitly
- Respect token budget and cognitive load

## ⚠️ CRITICAL RULE #2: WRITE CODE ACCORDING TO PROJECT'S GUIDELINES

=> /docs/agent/coding_guidelines.md
=> /docs/agent/tech-stack-justification.md
=> /docs/agent/game-mechanics.md

## ⚠️ CRITICAL RULE #3: WRITE TESTS ACCORDING TO PROJECT'S GUIDELINES

=> /docs/agent/testing_guidelines.md

---

## Project Type

Classic arcade-style shooter game.

---

## Development Principles

- Start simple, iterate
- Test early and often
- Keep code modular

---

## Documentation References

### Coding Guidelines
**Location:** `docs/coding-guidelines.md`

TDD methodology and development iteration cycle. Mandatory for all feature implementation.

### Tech Stack Justification
**Location:** `docs/tech-stack-justification.md`

Why TypeScript + HTML5 Canvas + Vite chosen for this game. Covers zero-dependency approach, bundle size, performance targets, and migration triggers.

### Game Mechanics Reference
**Location:** `docs/game-mechanics.md`

Current gameplay balance: player stats, 4 enemy types, spawn rates, difficulty progression, scoring, collision system.

### Code Documentation
**Location:** All source files in `PoCs/arcade-shooter/src/`

Every file, interface, and function documented with JSDoc. Key modules:
- `utils.ts` - AABB collision detection
- `enemies.ts` - 4 enemy types with behaviors and unlock system
- `spawning.ts` - Time-based spawn intervals
- `rendering.ts` - Canvas 2D drawing


