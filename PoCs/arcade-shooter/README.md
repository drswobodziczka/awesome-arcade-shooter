# Arcade Plane Shooter

Minimalistic browser-based 2D plane shooter.

## Features
- Player movement (arrow keys) and shooting (space)
- Enemy spawning and AI shooting
- Collision detection
- Score tracking

## Tech Stack
- TypeScript
- Vite
- HTML5 Canvas

## Run
```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Deployment

### 1. Local Development Server
```bash
npm run dev
```
Vite starts hot-reload dev server at `http://localhost:5173/`

### 2. Deploy to GitHub Pages

**GitHub Pages** - free static site hosting for public repos:
- Automatic HTTPS
- CDN-backed (fast globally)
- Perfect for static apps (HTML/JS/CSS)
- 100GB bandwidth/month

**Setup:**
1. Push changes to `main` branch
2. Enable GitHub Pages in repo Settings → Pages → Source: "GitHub Actions"
3. Workflow auto-builds and deploys
4. Game available at: `https://<username>.github.io/<repo-name>/`

**How it works:**
- Vite builds static files to `dist/`
- GitHub Actions workflow deploys on every push to `main`
- No server needed - pure frontend

## Controls
- Arrow keys: Move
- Space: Shoot
- Enter: Restart (after game over)

## Test
```bash
npm test
```
