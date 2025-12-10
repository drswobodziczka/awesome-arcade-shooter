### Context
Currently, we are using a Hybrid Architecture (ADR 004) where complex UI (Config Menu) is rendered via DOM Overlays (`<div>`) while the game runs in Canvas.

### Problem
While functional, this approach has significant downsides:
1.  **Input Handling Complexity**: Requires complex management to prevent keystrokes from "leaking" to the game scene.
2.  **Architecture Break**: The UI exists outside the Phaser Scene Graph, making state sync and transitions brittle.
3.  **Developer Experience**: Forces context switching between DOM/CSS and Phaser/Canvas API.

### Goal
Research and identify a standard, native Phaser solution for building complex UIs (Tabs, ScrollContainers, Inputs) that renders directly to the Canvas.

### Research Axes
1.  **RexUI Plugin**: Evaluate the most popular Phaser UI plugin. Does it support tabs and grids out of the box?
2.  **Phaser 3 Native Containers**: Can we build a reusable `UIComponent` system using standard Containers and NineSlice?
3.  **Community Standards**: What do other large Phaser projects use? (e.g. `phaser3-project-template` UI patterns).

### Definition of Done
- [ ] Recommendation made: Stick with DOM vs Adopt Lib X.
- [ ] POC created with the chosen library (if any).
