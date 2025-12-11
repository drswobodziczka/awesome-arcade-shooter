# Game Development Libraries - TypeScript/JavaScript/Vite Stack

## Główne biblioteki gamedev dla TS/JS/Vite

### 2D Game Development

#### **Phaser 3** ⭐ Najpopularniejszy
- Kompletny framework do gier 2D
- Wbudowana fizyka (Arcade Physics, Matter.js)
- Sprite management, animacje, tekstury
- Świetna dokumentacja i społeczność
- Działa z Vite out-of-the-box
- **Use case:** Classic arcade games, platformers, top-down shooters

```typescript
// Example
this.add.sprite(x, y, 'player');
this.physics.arcade.add.collider(player, enemy);
```

#### **PixiJS**
- Szybki renderer WebGL/Canvas
- Niższy poziom niż Phaser (więcej kontroli, mniej gotowych features)
- Świetny do budowania custom game engine'ów
- Rendering sprites, tekstur, filtrów, particle effects
- **Use case:** Custom engines, interactive graphics, gdy potrzebujesz pełnej kontroli

```typescript
// Example
const sprite = new PIXI.Sprite(texture);
app.stage.addChild(sprite);
```

#### **Excalibur.js**
- TypeScript-first (natywnie napisany w TS)
- Built-in physics, collision detection
- Mniejsza społeczność niż Phaser
- **Use case:** Projekty TypeScript-first, gdy preferujesz native TS API

---

### 3D Game Development

#### **Three.js** ⭐ Standard branżowy
- Standard dla 3D w przeglądarce
- Ogólnego przeznaczenia (nie tylko gry)
- Ogromna społeczność i ekosystem
- Rendering, materials, textures, lighting, shadows
- **Use case:** 3D visualizations, simpler 3D games, 3D experiences

```typescript
// Example
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
```

#### **Babylon.js**
- Pełny 3D game engine
- Lepszy dla gier niż Three.js (więcej game-specific features)
- Physics, particles, audio, animations wbudowane
- Świetne TypeScript support (napisany w TS)
- **Use case:** Complex 3D games, VR/AR experiences

```typescript
// Example
const engine = new BABYLON.Engine(canvas);
const scene = new BABYLON.Scene(engine);
```

---

## Porównanie funkcjonalności

| Element | 2D | 3D |
|---------|----|----|
| **Rendering** | Phaser: WebGL + Canvas<br>PixiJS: WebGL + Canvas | Three.js: WebGL<br>Babylon.js: WebGL/WebGPU |
| **Sprites/Textures** | `this.add.sprite()`<br>`PIXI.Sprite()` | `THREE.TextureLoader()`<br>`BABYLON.Texture()` |
| **Fizyka** | Phaser Arcade Physics<br>Matter.js<br>Box2D | Cannon.js<br>Ammo.js (Bullet wrapper)<br>Havok (Babylon) |
| **Modele 3D** | N/A | `GLTFLoader`, `FBXLoader`<br>Import z Blender/Maya |
| **Animacje** | Sprite sheets, tweens | Skeletal, morph targets |
| **Particle Systems** | Built-in (Phaser)<br>Custom (PixiJS) | Built-in w obu |
| **Audio** | Web Audio API wrappers | Spatial audio support |

---

## Techniczne szczegóły renderingu

### 2D (Phaser/PixiJS):
- **WebGL renderer** - główny (GPU-accelerated)
- **Canvas fallback** - dla starszych przeglądarek
- **Sprites** - texture atlases, sprite sheets
- **Tekstury** - PNG, JPG, WebP
- **Blend modes** - multiply, add, screen, etc.
- **Filters/Shaders** - custom GLSL shaders

### 3D (Three.js/Babylon.js):
- **WebGL/WebGPU** - GPU rendering
- **Materials** - PBR (Physically Based Rendering), Standard, Phong
- **Tekstury** - diffuse, normal, specular maps
- **Modele** - GLTF/GLB, FBX, OBJ
- **Lighting** - directional, point, spot, ambient
- **Shadows** - shadow mapping, PCF, VSM

---

## Fizyka

### 2D:
- **Phaser Arcade Physics** - prosty, szybki, arcade-style (bez rotacji)
- **Matter.js** - pełna fizyka 2D (rigid body, constraints)
- **Box2D** - industry standard (używany w Angry Birds)
- **Planck.js** - port Box2D do JS

### 3D:
- **Cannon.js** - lightweight physics engine
- **Ammo.js** - port Bullet Physics (używany w AAA)
- **Rapier** - modern, Rust-based, bardzo szybki
- **Havok** - commercial-grade (Babylon.js official)

---

## Dla tego projektu (Arcade Shooter 2D)

### Rekomendacja: **Phaser 3**

**Zalety:**
- All-in-one solution - rendering, physics, input, audio
- Arcade Physics idealny do arcade shootera
- Sprite management out of the box
- Duża społeczność = dużo przykładów
- TypeScript definitions dostępne

**Alternatywa: PixiJS + custom kod**
- Większa kontrola
- Mniejszy bundle size
- Więcej pracy (musisz sam napisać game loop, collision, etc.)

---

## Integracja z Vite

Wszystkie wymienione biblioteki działają z Vite bez problemów:

```bash
# Phaser
npm install phaser

# PixiJS
npm install pixi.js

# Three.js
npm install three
npm install --save-dev @types/three

# Babylon.js
npm install @babylonjs/core
```

### Przykład Vite + Phaser:

```typescript
// src/main.ts
import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [GameScene]
};

new Phaser.Game(config);
```

Hot Module Replacement (HMR) działa bez dodatkowej konfiguracji!

---

## Resources

- **Phaser:** https://phaser.io/
- **PixiJS:** https://pixijs.com/
- **Three.js:** https://threejs.org/
- **Babylon.js:** https://www.babylonjs.com/
- **Matter.js:** https://brm.io/matter-js/
- **Cannon.js:** https://schteppe.github.io/cannon.js/
