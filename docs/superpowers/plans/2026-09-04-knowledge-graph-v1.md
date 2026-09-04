# Knowledge Graph V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a maintainable Three.js project for a spoiler-safe, multi-layer 《放开那个女巫》 relationship graph.

**Architecture:** Vite + TypeScript owns the application shell and build. `src/data.ts` is the single knowledge source; `GraphScene` renders and interacts with it; `main.ts` handles UI state and filtering. Data validation tests prevent broken links and accidental removal of required top-level systems.

**Tech Stack:** Three.js 0.185.1, Vite 8.2.2, TypeScript 7.0.2, Vitest 4.1.10.

**Spec:** `docs/superpowers/specs/2026-09-04-knowledge-graph-design.md`

## Global Constraints

- Spoiler boundary: `温蒂测试飞行设备（滑翔之翼）`.
- Do not encode later identity reveals, endings, faction changes, war outcomes, or resolved foreshadowing.
- Keep graph data independent from Three.js rendering.
- Required systems: 女巫联盟、市政厅、第三边陲区、沉睡岛女巫、四大王国、教会.

---

### Task 1: Project foundation

**Files:** `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`

**Interfaces:** Produces Vite dev/build commands and a `#app` mount point.

- [x] Add Vite/TypeScript/Three.js dependencies.
- [x] Configure strict TypeScript and relative production base.
- [x] Add HTML application shell.
- [x] Verify through CI build.

### Task 2: Knowledge graph data

**Files:** `src/data.ts`, `tests/data.test.ts`

**Interfaces:** Produces `nodes`, `links`, `progress`, `kindLabels`, and `relationLabels`.

- [x] Define node and relationship types.
- [x] Add people, organizations, locations, kingdoms, and system nodes.
- [x] Add requested top-level structures and neutral spoiler-safe descriptions.
- [x] Add tests for unique ids, valid link endpoints, required systems, and reading-progress boundary.

### Task 3: Three.js visualization

**Files:** `src/GraphScene.ts`

**Interfaces:** Consumes `GraphNode[]` and `GraphLink[]`; produces `setVisible`, `focus`, `resetView`, `onHover`, and `onSelect`.

- [x] Render different geometry per node kind.
- [x] Cluster nodes by faction/system.
- [x] Draw typed relationship lines.
- [x] Add OrbitControls, raycasting, hover highlight, click lock, and camera focus.

### Task 4: Application UI

**Files:** `src/main.ts`, `src/styles.css`

**Interfaces:** Consumes graph data and `GraphScene` callbacks.

- [x] Add search, kind filter, group filter, and Roland-direct filter.
- [x] Add responsive left controls and right detail panel.
- [x] Make relationship cards focus linked nodes.
- [x] Show the spoiler boundary prominently.

### Task 5: Verification and handoff

**Files:** `.github/workflows/ci.yml`, `README.md`

**Interfaces:** Produces repeatable CI verification and contributor instructions.

- [x] Run `npm test` on GitHub Actions.
- [x] Run `npm run build` on GitHub Actions.
- [ ] Update README after CI is green.
- [ ] Open PR from `feat/knowledge-graph-v1` to `main`.
