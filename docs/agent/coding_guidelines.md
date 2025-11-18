# Coding Guidelines - Arcade Shooter

## 1. TypeScript + Vite + HTML5 Canvas Fundamentals

### TypeScript
- **Enable strict mode** in `tsconfig.json` (`strict: true`, `noImplicitAny`, `strictNullChecks`)
- **Never use `any`** - use `unknown` if type is truly unknown
- **Define types explicitly** - makes code safer and more readable
- **Let Vite handle the rest** - it has smart defaults for TypeScript

### Vite
- **Leverage built-in features** - HMR, tree-shaking, code splitting work out of the box
- **Use `npm run build`** for optimized production bundles (Rollup handles minification, DCE)
- **Profile during development** - Chrome/Firefox DevTools show exact timing

### HTML5 Canvas Performance
- **Use `requestAnimationFrame`** - never `setTimeout`/`setInterval` for animations
- **Multiple canvas layers** - separate static background from dynamic objects
- **Dirty rectangles** - redraw only changed areas, not entire canvas
- **Minimize drawing** - skip off-screen objects entirely
- **Avoid sub-pixel rendering** - round positions to prevent anti-aliasing overhead
- **Sprite sheets** - combine images to reduce HTTP requests
- **Use offscreen canvas** - pre-render complex scenes, then `drawImage()` to main canvas
- **Prefer `drawImage()` over canvas operations** - faster than `rotate()`, `scale()`, `shadowBlur`, etc.

---

## 2. Fundamental Software Engineering Principles

### Core Philosophy
- **Less code > more code** - every line is a liability
- **Good enough > perfect** - ship working code, iterate later
- **Think 3 hours, code 1 hour** - not the reverse

### Design Principles
- **KISS** - Keep It Simple, Stupid (simplicity beats cleverness)
- **DRY** - Don't Repeat Yourself (one source of truth for every concept)
- **YAGNI** - You Aren't Gonna Need It (don't build for imaginary futures)
- **SOLID**:
  - **S**ingle Responsibility (one reason to change)
  - **O**pen/Closed (extend, don't modify)
  - **L**iskov Substitution (subtypes must be substitutable)
  - **I**nterface Segregation (no unused dependencies)
  - **D**ependency Inversion (depend on abstractions)

### Code Quality
- **Clear names** - function/variable names should explain intent
- **Small functions** - if it doesn't fit on screen, split it
- **Modularize** - separate concerns, loose coupling
- **Delete > refactor > write** - removing code is best, fixing is second, adding is last resort

### Workflow
1. **Understand the problem** - don't code until you know what you're solving
2. **Think deeply first** - mental model before keyboard
3. **Write minimally** - solve the actual problem, not adjacent ones
4. **Refactor ruthlessly** - simplify after it works

---

## 3. Software Delivery Best Practices

### Requirements
- **Ask questions upfront** - clarify final requirements before starting
- **Talk to users** - surveys, interviews, prototypes, shadowing
- **Invest in requirements** - spend 8-14% of effort here (reduces 80-200% overruns to <60%)
- **Document clearly** - single source of truth for what needs building

### Problem Solving
- **Decompose everything** - break complex problems into small, manageable pieces
- **Divide and conquer** - assign different features to different efforts/sprints
- **Incremental milestones** - smaller chunks = less risky estimates

### Planning
- **Never act without a plan** - deliver it, find it, or build it (in that order)
- **Plan before coding** - understand the scope, then execute
- **Validate assumptions** - if unclear, ask before committing code

### Iteration
- **Ship working code** - iterate based on real feedback
- **Test early and often** - catch issues before they compound
- **Fail fast** - find problems quickly, fix them quickly

---

## Summary Checklist

Before writing code:
- [ ] Do I understand the requirements?
- [ ] Is there a simpler solution?
- [ ] Can I break this into smaller pieces?
- [ ] Have I thought through edge cases?

While writing code:
- [ ] Is this the minimal solution?
- [ ] Are names clear and intent obvious?
- [ ] Am I following TypeScript strict mode?
- [ ] Am I optimizing canvas operations?

Before committing:
- [ ] Does it work?
- [ ] Is it tested?
- [ ] Can I delete any code?
- [ ] Will my future self understand this?
