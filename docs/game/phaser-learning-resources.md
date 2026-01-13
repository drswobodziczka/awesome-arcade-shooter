# Phaser.js Learning Resources

## 🎯 TOP 3 Fundamentalne Źródła

### 1. Making Your First Phaser Game (Oficjalny Tutorial)
**Link:** https://docs.phaser.io/phaser/getting-started/making-your-first-phaser-game

**Typ:** 10 progresywnych modułów (part1.html → part10.html)

**Co obejmuje:**
- Game configuration i rendering setup
- Asset loading (images, sprite sheets)
- Arcade Physics (static/dynamic bodies)
- Player mechanics (sprite creation, animations, keyboard controls)
- Game elements (collectibles, scoring, enemy AI)

**Dla kogo:** Wymaga tylko podstawowej znajomości JavaScript

---

### 2. MDN: 2D Breakout Game Using Phaser
**Link:** https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser

**Typ:** 16-częściowy tutorial z live code samples

**Co obejmuje:**
- Framework initialization i asset loading
- Movement, physics, collision detection
- Paddle controls i game-over states
- Brick field, scoring system
- Win conditions, lives, animations, randomization

**Dla kogo:** Intermediate learners (basic to intermediate JS knowledge)

**Bonus:** MDN oferuje też wersję vanilla JS tego samego projektu dla kontrastu

---

### 3. Phaser Examples (5000+ Code Snippets)
**Link:** https://phaser.io/examples

**Typ:** Searchable repository konkretnych rozwiązań

**Zastosowanie:** Reference podczas kodowania - konkretny kod do konkretnych problemów z live preview

---

## 📚 Dodatkowe Zasoby

### Oficjalna Dokumentacja
- **API Docs:** https://docs.phaser.io/
- **Learn Hub:** https://phaser.io/learn
- **Getting Started:** https://phaser.io/tutorials/getting-started-phaser3

### Community & Kursy
- **Codecademy:** Learn Phaser.js Fundamentals - https://www.codecademy.com/learn/learn-phaser-js-fundamentals
- **GameDev Academy:** Phaser Mini-Degree z full curriculum
- **Udemy:** Game Development in JS/TS - The Complete Guide (w/ Phaser 3)

---

## 🚀 Phaser Launcher

**Co to jest:** Darmowa aplikacja (Windows 64-bit / macOS) - all-in-one development environment

**Rozmiar:** ~60-100MB

**Kluczowe Features:**
- **Code Editor** - z code completion i Phaser function insight
- **Media Browser** - zarządzanie assetami
- **Project Manager** - tworzenie i organizacja projektów
- **Game Runner** - play/debug z hot-reload
- **Built-in Tutorials** - dostęp do newsów i tutoriali
- **Phaser by Example** - 400-stronicowa książka wbudowana

**Templates (v1.0.9, marzec 2025):** Color Sort, 2048, Breakout, Football Kick, Pachinko

**Download:** https://phaser.io/download/phaser-launcher

**Tutorial:** https://phaser.io/tutorials/getting-started-with-phaser-launcher

**Zaleta:** Nie trzeba konfigurować node, npm, web servers - działa out-of-the-box

---

## ⚖️ Phaser Launcher vs Professional Setup (Windsurf/Claude Code + Vite)

### Target Audience Launcha: Absolute Beginners

Phaser Launcher został stworzony dla osób **bez żadnego setup'u** - zero node/npm/IDE experience.

### Co oferuje Launcher:

| Feature | Launcher | AI-Assisted IDE + Vite | Winner |
|---------|----------|------------------------|--------|
| **Code Editor** | Basic JS + Phaser IntelliSense | AI generuje/refactoruje/debuguje kod | 🏆 **AI IDE** |
| **Hot Reload** | Ctrl+S → refresh | Vite HMR (instant, bez save) | 🏆 **Vite** |
| **Media Browser** | GUI asset management | File explorer + extensions | ⚠️ Marginally useful |
| **Setup Time** | Zero config | One-time setup (already done) | ⚠️ Irrelevant if you have setup |
| **Learning Resources** | Built-in 400p book + tutorials | Internet + better curated sources | ⚠️ Nice-to-have |
| **Game Templates** | 6 templates (2048, Breakout, Snake, etc.) | GitHub examples (5000+) | 🟰 Equal |
| **Testing** | ❌ None | Vitest integration | 🏆 **Pro Setup** |
| **Git Integration** | ❌ None | Native support | 🏆 **Pro Setup** |
| **TypeScript** | ❌ JS only | Full TS support | 🏆 **Pro Setup** |
| **Production Builds** | ❌ Limited | Vite optimization | 🏆 **Pro Setup** |
| **Extensions Ecosystem** | ❌ None | Unlimited | 🏆 **Pro Setup** |

---

### Verdict dla Experienced Developers:

**❌ NIE INSTALUJ** jeśli już masz:
- AI-assisted IDE (Windsurf, Cursor, Claude Code)
- Vite setup z hot reload
- Git workflow
- Modern tooling (ESLint, Vitest, TypeScript)

**Launcher = training wheels dla beginnerów bez setup'u.**

---

### Jedyne Potencjalne Użycie dla Pro Dev:

**Game Templates jako code reference:**
- Sprawdź czy templates są dostępne na GitHubie (bez instalowania)
- Lub pozostań przy Phaser Examples (5000+ snippets: https://phaser.io/examples/v3)

**Bottom line:** Twój professional setup oferuje AI assistance, modern tooling i production-ready workflow. Launcher oferuje "wygodę" którą już masz, ale bez AI i zaawansowanych features.

---

## 🎮 Phaser.js vs Inne Silniki - Kiedy Używać?

### ✅ Mocne Strony Phaser

**Popularność:**
- Najczęściej wybierany framework do HTML5 game development
- Aktywna społeczność, częste update'y, bogate zasoby (tutorials, Stack Overflow)

**Rendering:**
- Auto-swap między Canvas i WebGL (w zależności od wsparcia przeglądarki)
- 43 FPS w benchmarkach rendering (tylko Babylon.js nieznacznie szybszy)

**Multi-Platform:**
- Deploy do iOS, Android, desktop (via Cordova, Electron)
- Natywne działanie w przeglądarkach

**Complete Framework:**
- Pełny game framework z bogatym API
- Wbudowany tweening engine dla animacji
- Wsparcie dla texture, video, audio, JSON, XML

**Development Speed:**
- Kod-first approach - pełna kontrola bez visual editora
- Szybkie prototypowanie i deployment

---

### ⚠️ Ograniczenia Phaser

**Tylko 2D:**
- Silnik nie wspiera 3D (do tego Three.js / Babylon.js)

**Physics Limitations:**
- Complex hitboxes trudne do stworzenia
- Problemy ze stabilnością przy wielu obiektach w proximity

**Framework Constraints:**
- Narzuca własny flow i narzędzia
- Mniejsza elastyczność niż pure Canvas/WebGL

**Brak Visual Editora:**
- Wszystko w kodzie (plus dla programistów, minus dla designerów)

---

### 🎯 Kiedy Używać Phaser

**✅ IDEALNY DLA:**
- 2D games (platformers, shooters, puzzle, arcade)
- Browser-first development
- Rapid prototyping
- Solo/small team developers
- Projekty wymagające szybkiego MVPa
- Educational projects (nauka game dev)

**❌ UNIKAJ GDY:**
- Potrzebujesz 3D (użyj Three.js, Babylon.js)
- Mega-complex physics (użyj Unity, Godot)
- Visual editor jest must-have (użyj Unity, Godot, Construct)
- Native AAA performance (użyj Unreal, Unity)

---

### 🆚 Quick Comparison

| Aspekt | Phaser | Unity | Three.js | Pixi.js |
|--------|--------|-------|----------|---------|
| **2D Games** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **3D Games** | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| **Learning Curve** | ⭐⭐⭐⭐ (low) | ⭐⭐ (medium) | ⭐⭐⭐ (low-med) | ⭐⭐⭐⭐ (low) |
| **Bundle Size** | Medium | Large | Small-Medium | Small |
| **Community** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Web-First** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

### 🔮 Phaser 4 (Beta - Q4 2025)

**Co nowego:**
- Mniejszy bundle size
- Modern TypeScript rewrite
- WebGPU focus
- Pełny rewrite z zachowaniem kompatybilności API

---

## 📊 Verdict

**Phaser.js jest TOP CHOICE dla:**
- Web-based 2D games (simple → moderately complex)
- Developerów którzy lubią code-first approach
- Projektów wymagających szybkiego startu
- Gier deploy'owanych primarily do browsers

**NIE jest dobrym wyborem gdy:**
- Potrzebujesz 3D
- Wymagasz advanced physics simulation
- Wolisz visual scripting / drag-and-drop editors
- Target platform to desktop/console AAA
