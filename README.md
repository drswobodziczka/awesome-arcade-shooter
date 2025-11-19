# Awesome Arcade Shooter

Collection of arcade game projects.

## Projects

### Arcade Plane Shooter
Classic 2D plane shooter game in `PoCs/arcade-shooter/`

[📖 Documentation](./PoCs/arcade-shooter/README.md) | [🎮 Play Online](https://drswobodziczka.github.io/awesome-arcade-shooter/)

## Development

### Running a project

From root directory:
```bash
npm run dev                    # Run arcade-shooter (default)
npm run arcade-shooter:dev     # Run arcade-shooter explicitly
```

From project directory:
```bash
cd PoCs/arcade-shooter
npm install
npm run dev
```

### Building for production

From root:
```bash
npm run build                  # Build arcade-shooter
npm run arcade-shooter:build   # Build arcade-shooter explicitly
```

From project:
```bash
cd PoCs/arcade-shooter
npm run build
```

### Running tests

From root:
```bash
npm test                       # Test arcade-shooter
npm run arcade-shooter:test    # Test arcade-shooter explicitly
```

From project:
```bash
cd PoCs/arcade-shooter
npm test
```

## Repository Structure

```
awesome-arcade-shooter/
├── PoCs/
│   └── arcade-shooter/       # Classic plane shooter game
│       ├── src/
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── .github/
│   └── workflows/
│       ├── build-and-test.yml    # CI for all projects
│       └── deploy-pages.yml       # Deploy to GitHub Pages
└── package.json              # Root scripts for all projects
```

## Adding New Projects

1. Create project directory in `PoCs/`
2. Add project scripts to root `package.json`
3. Update workflows if needed

## Deployment

Arcade Shooter automatically deploys to GitHub Pages on push to main:
- 🎮 **Live demo**: https://drswobodziczka.github.io/awesome-arcade-shooter/
- Workflow: `.github/workflows/deploy-pages.yml`
