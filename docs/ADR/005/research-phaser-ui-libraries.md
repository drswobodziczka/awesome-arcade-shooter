# 005. Research: Native Phaser UI Solutions vs. Hybrid Architecture

Date: 2025-12-10
Status: Proposed
Refers to: [Issue #87](https://github.com/drswobodziczka/awesome-arcade-shooter/issues/87)
Relates to: [004. Hybrid UI Architecture](./../004/hybrid-ui-and-navigation.md)

## Context

In **ADR 004**, we adopted a Hybrid UI approach (DOM Overlay) to solve the immediate need for a complex configuration panel (Issue #42).

While successful in delivering the feature, this approach introduced significant architectural downsides ("Cons"):
1.  **Input Coupling & Leaking**: We must aggressively manage event propagation to prevent UI keystrokes (e.g., arrow keys) from triggering game actions (movement).
2.  **Context Switching**: The developer must mentally switch between the DOM API (HTML/CSS) and the Phaser API (Canvas/WebGL).
3.  **Broken Scene Structure**: The UI is not part of the Phaser Scene graph. It exists "outside" the game lifecycle, making transitions, extensive animations, and state synchronization more brittle.
4.  **"Hackiness"**: The solution feels like a workaround rather than a native game component.

## Decision

We decide to **halt** further expansion of the DOM Overlay architecture for now. We acknowledge the current solution as "Technical Debt" to be paid off later.

We decide to **initiate a research phase** to identify a native Phaser-compatible solution for complex UIs. The goal is to bring the UI back into the Phaser Scene graph, utilizing GameObjects instead of DOM elements.

## Research Axes

We will investigate the following areas/libraries:

1.  **RexUI Plugin**: The most popular third-party UI library for Phaser 3. It provides grids, scrollable panels, sliders, and tabs rendered purely on Canvas.
2.  **Phaser Editor 2D Components**: How does the visual editor handle UI components? Can we adopt its patterns?
3.  **User Interface (Phaser 3 Official/Community examples)**: Patterns for building composite GameObjects (Containers) that act as UI controls.
4.  **NineSlice / Feather**: Lightweight UI scaling solutions.

## Consequences

- We accept the DOM overlay for the current "Test Mode" but will not use it for core gameplay HUDs or future menus if possible.
- A future refactoring task will be scheduled to replace `MenuScene.ts`'s DOM logic with the chosen library from this research.
