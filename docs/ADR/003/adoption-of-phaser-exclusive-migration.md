# ADR 003: Adoption of Phaser.js as the Exclusive Engine & Migration to Root

## Status
Accepted

## Context
Previously, in [ADR 002](../002/001-extract-shared-core.md), we explored a strategy to maintain two distinct implementations of the game:
1.  **PoC 1 (Canvas API):** A raw HTML5 Canvas implementation (`/arcade-shooter`).
2.  **PoC 2 (Phaser.js):** A Phaser framework-based implementation (`/arcade-shooter-phaser`).

The intention was to extract a shared "Core" (logic/physics) to be used by both rendering engines. However, this dual-maintenance approach has proven to be time-consuming and offers diminishing returns. The Canvas implementation was primarily educational and lacks the robustness required for the project's long-term goals.

## Decision
We have decided to **exclusively focus development on the Phaser.js version**, while preserving the Canvas version for historical reference.

Consequently, we will:
1.  **Archive** the legacy `arcade-shooter` (Canvas) implementation by moving it to a dedicated `pocs/canvas-legacy` directory. It will not be further developed.
2.  **Promote** the `arcade-shooter-phaser` project to the **root** of the repository. This becomes the main "Arcade Shooter" project.
3.  **Adapt Project Descriptors:** Update and merge configuration files (`package.json`, `tsconfig.json`, GitHub Workflows, etc.) to function correctly at the root level, ensuring the build and deployment pipelines target the Phaser implementation.
4.  **Halt** any efforts to abstract a shared core that is agnostic of the rendering engine.
5.  **Refactor** the remaining codebase to remove any artificial separation introduced for the dual-engine architecture.

## Consequences
### Positive
*   **Reduced Complexity:** Removes the need to maintain an abstraction layer between game logic and the rendering engine.
*   **Focus:** All development effort will go into the actual target technology (Phaser.js).
*   **Simplified Structure:** The repository will adopt a standard web project structure at the root.
*   **Historical Preservation:** The original Canvas implementation remains accessible in the `pocs/` directory for reference, without cluttering the active development workspace.
*   **Standardization:** Project descriptors (package.json, workflows) will be standardized at the root level, simplifying tooling integration.

### Negative
*   **Migration Effort:** Requires careful moving of files and updating of import paths, build scripts, and CI/CD configurations to reflect the new root structure.
