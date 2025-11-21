# Technical Stack Justification -- v02 (2025-11-19)

## Game Engine Selection - Phaser 3 

Zdecydowaliśmy się na **Phaser 3** jako główny silnik gry. Kluczowe powody tej decyzji:

- **All-in-one solution** - chcemy mieć wszystkie możliwe fajne rzeczy z silnika gry dostępne out-of-the-box
- **Game development, not low-level coding** - developować po bożemu, bardziej jak w prawdziwym game devie, zamiast rzeźbić niskopoziomowe rozwiązania
- **Free built-in features**:
  - Fizyka (Arcade Physics, Matter.js)
  - System efektów wizualnych
  - System dźwięku
  - Sprite management i animacje
  - Input handling
- **Istniejący POC** - mamy już dostępny proof-of-concept z Phaserem, który będziemy rozwijać równolegle

# Tech Stack Justification - Indie Arcade Shooter -- v01 (2025-11-15)

## Executive Summary

Zero-dependency HTML5 Canvas approach chosen for maximum portability, minimal overhead, and complete control over game mechanics. Ideal for fast iteration in indie development.

---

## Core Technology Choices

### 1. TypeScript 5.9.3 (Strict Mode)
**Why chosen:**
- Type safety prevents runtime bugs in game logic (collision, spawning, state)
- Autocomplete speeds up development
- Strict mode catches edge cases early (null checks, type assertions)
- Compiles to clean ES2020 JavaScript

**Alternatives rejected:**
- **Plain JavaScript**: Too error-prone for complex game state management
- **Reason/ReScript**: Steeper learning curve, smaller ecosystem

---

### 2. HTML5 Canvas 2D
**Why chosen:**
- Native browser support (no plugins, no downloads)
- Full control over rendering pipeline
- Lightweight: Perfect for 2D sprite-based games
- 60 FPS easily achievable with `requestAnimationFrame`

**Alternatives rejected:**
- **Phaser.js**: Overkill for simple mechanics; adds 1MB+ overhead
- **PixiJS**: WebGL focus unnecessary for 400×600 canvas
- **Unity WebGL**: 20MB+ builds, slow load times
- **Godot HTML5**: Similar bloat issues

**Trade-offs accepted:**
- Manual implementation of game loop, collision, rendering
- No built-in particle systems or advanced effects
- Worth it: Full transparency, zero black boxes

---

### 3. Vite 7.2.2
**Why chosen:**
- **Instant HMR** (Hot Module Reload): Edit code → see changes in <200ms
- **Zero config**: Works out-of-box with TypeScript
- **Optimized builds**: Tree-shaking, minification, code-splitting
- **Dev server**: Faster than Webpack (ES modules native support)

**Alternatives rejected:**
- **Webpack**: Slower dev server, complex config
- **Parcel**: Less predictable builds, smaller community

---

### 4. Vitest 4.0.9
**Why chosen:**
- **Native Vite integration**: Reuses Vite config (no duplication)
- **Fast**: Parallel test execution, smart watch mode
- **Jest-compatible API**: Easy migration if needed
- **TypeScript support**: No extra setup required

**Alternatives rejected:**
- **Jest**: Requires babel/ts-jest transformations, slower
- **Mocha**: Manual setup for TypeScript, assertions, coverage

---

### 5. No Game Engine
**Why this matters:**
- **Bundle size**: ~30KB (minified) vs 1-20MB with engines
- **Load time**: <1 second vs 5-30 seconds
- **Learning curve**: Standard web APIs vs engine-specific patterns
- **Debugging**: Browser DevTools show exact code, no abstractions

**When to reconsider:**
If game requires:
- Physics simulation (Box2D-level complexity)
- 100+ simultaneous entities
- Advanced particle effects, shaders
- Multi-platform deployment (mobile, desktop)

**Current scope**: 4 enemy types, simple AABB collision → engine unnecessary

---

## Deployment Stack

### GitHub Pages (Static Hosting)
**Why chosen:**
- **Free**: No hosting costs
- **CI/CD integrated**: Auto-deploy on `git push`
- **CDN**: Global edge servers for fast loading
- **HTTPS**: Built-in SSL

**Process:**
1. Push to `main` → GitHub Actions triggers
2. `npm run build` → Vite generates optimized `dist/`
3. Deploy to `github.io` domain

---

## CI/CD Pipeline

### GitHub Actions
**Build & Test** (`.github/workflows/build-and-test.yml`):
- Runs on: Push to main, Pull Requests
- Tests on: Node 20.x & 22.x (compatibility check)
- Steps: Install → Build → Test

**Deploy** (`.github/workflows/deploy-pages.yml`):
- Trigger: Push to main
- Action: Build → Upload artifact → Deploy to Pages

---

## Dependencies Analysis

**Production dependencies:** `0`
**Dev dependencies:** `4`
```json
{
  "vite": "7.2.2",          // Build tool
  "vitest": "4.0.9",        // Testing
  "typescript": "5.9.3",    // Type checking
  "@types/node": "^22.10.5" // Node types for Vite config
}
```

**Total install size:** ~50MB (dev only, not shipped)
**Shipped bundle:** ~30KB (minified + gzipped)

---

## Performance Characteristics

### Development
- **Dev server start**: <2 seconds
- **HMR update**: <200ms
- **Full rebuild**: <1 second
- **Test suite**: <500ms

### Production
- **Build time**: ~3 seconds
- **Bundle size**: 30KB
- **Load time**: <1 second (on 3G)
- **Runtime FPS**: 60 (stable)

---

## Scalability Considerations

### Current architecture supports:
- ✅ Adding new enemy types (modular `ENEMY_TYPES` object)
- ✅ Power-ups, obstacles (same entity pattern)
- ✅ Sound effects (Web Audio API drop-in)
- ✅ Levels, difficulty curves (config-driven)

### Refactoring needed for:
- ⚠️ 50+ simultaneous entities (consider object pooling)
- ⚠️ Sprite animations (need sprite sheet loader)
- ⚠️ Complex AI (state machines, pathfinding)

### Engine migration triggers:
- 🔴 Multiplayer (need authoritative server)
- 🔴 Mobile touch controls + gyroscope
- 🔴 WebGL shaders, post-processing effects

---

## Maintenance & Long-term Viability

### Dependency stability:
- **TypeScript**: Industry standard, backward compatible
- **Vite**: Backed by Evan You (Vue.js), active development
- **HTML5 Canvas**: W3C standard since 2014, won't deprecate

### Knowledge transferability:
- Skills learned apply to: React, Vue, Angular, Node.js
- No vendor lock-in (can migrate to any framework)

### Future-proofing:
- ES2020 target compatible with 95%+ browsers
- Progressive enhancement path: Add WebGL renderer if needed
- Modular architecture allows piecemeal rewrites

---

## Conclusion

**Tech stack optimized for:**
1. **Fast iteration**: HMR + TypeScript autocomplete
2. **Zero bloat**: No unnecessary abstractions
3. **Free deployment**: GitHub Pages CI/CD
4. **Learning value**: Understand game fundamentals

**Best suited for:**
- Indie developers prototyping mechanics
- 2D arcade games with <100 entities
- Web-first distribution strategy

**Migration path exists** if game outgrows stack (add Phaser, migrate to Unity, etc.)

**Current verdict:** Perfect fit for this project's scope and goals.