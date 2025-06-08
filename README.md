# Flashy UI Lab – Developer Guide

## 1 · Goal and Vision

A single playground where **every attention‑grabbing web component** you create lives side‑by‑side:

* Quickly iterate and learn advanced front‑end tricks.
* Copy any snippet into another project by grabbing one folder.
* Avoid duplicating React/Vite boilerplate for each demo.

---

## 2 · High‑Level Architecture

* **One Vite + React app** with Tailwind pre‑configured.
* A **dark sidebar** lists available demos.
* Clicking a name routes to `/src/components/<Component>/demo.tsx`, rendered on a blank canvas.
* Automatic registry: no manual sidebar editing when you add a new snippet.

### Directory Layout

```
flashy-ui-lab/
├─ package.json        # root deps + scripts
├─ vite.config.ts
├─ tsconfig.json
└─ src/
   ├─ App.tsx
   ├─ ComponentRegistry.ts
   ├─ Sidebar.tsx
   └─ components/
      ├─ HeadlineCrumble/
      │   ├─ index.tsx
      │   ├─ demo.tsx
      │   └─ meta.json
      └─ ParallaxHero/
          └─ …
```

---

## 3 · Setup Instructions

1. **Install prerequisites**

   ```bash
   corepack enable       # enables pnpm (Node ≥ 16.13)
   ```

2. **Bootstrap the project**

   ```bash
   pnpm install
   pnpm dev              # ➜ http://localhost:5173
   ```

3. **Build production**

   ```bash
   pnpm build            # outputs to dist/
   ```

---

## 4 · Adding a New Component

1. **Scaffold**

   ```bash
   mkdir -p src/components/SparkleTrail
   ```

2. **Create `index.tsx`**

   ```tsx
   import { motion } from 'framer-motion';

   export default function SparkleTrail({ text = '✨ Hello' }) {
     return <motion.h1 /* …sparkle effect… */>{text}</motion.h1>;
   }
   ```

3. **Create `demo.tsx`**

   ```tsx
   import SparkleTrail from './index';
   export default () => <SparkleTrail text="Hover me!" />;
   ```

4. **Create `meta.json`**

   ```json
   { "title": "Sparkle Trail", "description": "Letters leave glitter while you hover." }
   ```

5. **(Optional) Local deps**

   Inside `src/components/SparkleTrail/package.json` list any runtime libs (e.g. `framer-motion`).
   The root workspace will link them automatically.

Refresh the browser — Sparkle Trail appears in the sidebar.

---

## 5 · Guidelines & Best Practices

| Area          | Recommendation                                          |
| ------------- | ------------------------------------------------------- |
| **Animation** | `framer-motion`, `gsap`, `@react-three/fiber`           |
| **Styling**   | Tailwind utilities + component‑scoped CSS Modules       |
| **Isolation** | Never mutate global styles/resets from a component      |
| **Assets**    | Keep demo images/GLB files inside the component folder  |
| **Build**     | Use `tsup` (`pnpm run build`) to emit CJS + ESM + types |

---

## 6 · Future Steps

1. **Publish selected components to npm**
   * add `name`, `version`, `files` to each component's `package.json`.
2. **Hygen generator** for instant scaffolding (`pnpm exec hygen component new --name Foo`).
3. **Storybook export** (already compatible, just `pnpm storybook init`).
4. **CI/CD** – GitHub Action to run tests, lint, and build on push.
5. **Visual regression tests** – Playwright to snapshot demo routes.

---

## 7 · "Why not one repo per snippet?"

| Requirement             | Monorepo Lab   | 30 separate repos |
| ----------------------- | -------------- | ----------------- |
| Change one dependency   | once           | 30×               |
| Start all demos         | `pnpm dev`     | 30 local servers  |
| Discoverability         | sidebar search | GitHub spelunking |
| Cross‑component helpers | easy share     | duplicate code    |

---

### End‑Goal Recap

* **Learn advanced visual techniques fast.**
* **Copy‑paste any effect** into client work without wrestling DevOps.
* **Iterate experimentally**: your AI co‑pilot (or human teammates) can open the lab, pick a blank slot, and prototype.

> **Hand off** this document + the repo skeleton to any coding AI and it should know exactly how to extend the playground. 