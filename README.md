<p align="center">
  <img src="https://github.com/user-attachments/assets/c16093f3-ea91-47aa-9d6f-58d4edae6dc3" alt="NestLens Logo" width="80" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/nestlens--viewer-v1.0.0-6A0DAD?style=for-the-badge&labelColor=1a1a2e" alt="Version" />
  <img src="https://img.shields.io/badge/NestJS-%23E0234E?style=for-the-badge&logo=nestjs&logoColor=white&labelColor=1a1a2e" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-%233178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1a1a2e" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-5.x-%23000000?style=for-the-badge&logo=express&logoColor=white&labelColor=1a1a2e" alt="Express" />
  <img src="https://img.shields.io/badge/license-MIT-%2333CC33?style=for-the-badge&labelColor=1a1a2e" alt="License" />
</p>

<h1 align="center">Nest Lens</h1>
<p align="center"><em>See your NestJS architecture, clearly.</em></p>

---

## What is NestLens?

NestJS projects grow complex fast. Modules import other modules, controllers define dozens of routes, providers depend on each other — and suddenly you're lost in the code. NestLens solves this by **automatically scanning your source code** and showing you the full architecture as an **interactive visual map**. No manual documentation, no guesswork — just run it and see how everything connects.

---

## What You Get

| Without NestLens | With NestLens |
|---|---|
| Manually trace `@Module` decorators to understand relationships | See modules, imports, controllers, and providers at a glance |
| Search files to find all routes and their HTTP methods | View all routes with color-coded method badges instantly |
| Guess which services a controller depends on | Inspect constructor-injected dependencies from the UI |
| Lose track of the big picture in large codebases | Get live summary statistics across the entire project |

---

## How It Works

NestLens reads your code **without running it**. The analysis engine uses the TypeScript Compiler API to build an in-memory version of your project, walks through the code structure, and finds every `@Module`, `@Controller`, and `@Injectable` decorator. From each one, it pulls out routes, dependencies, and relationships — then builds a clean JSON structure from it.

A lightweight Express server serves this data to a browser-based dashboard, where everything is rendered as an interactive visualization — no build tools, no bundler, no complexity.

---

## Core Concepts

| Concept | What It Does in NestLens |
|---|---|
| **Abstract Syntax Tree (AST)** | Represents source code as a tree structure — NestLens walks it to find decorated classes |
| **TypeScript Compiler API** | Compiles your project in memory, giving access to all files and type information |
| **Decorator Pattern** | NestJS decorators carry metadata — NestLens reads them to extract architecture |
| **Static Analysis** | Everything happens at compile time — your project never needs to run |
| **Dependency Injection** | Constructor parameters are inspected to map which services each class depends on |
| **Express Server** | A minimal HTTP server serves the API and the dashboard |
| **Vanilla JavaScript** | The entire UI is built from JSON data — no frameworks, no build step |

---

## Project Structure

```
nestlens/
├── package.json
├── tsconfig.json
├── .gitignore
│
├── package/
│   ├── server.ts        — Express server, runs analysis, serves dashboard on port 4000
│   ├── parser.ts        — Core analysis engine using the TypeScript Compiler API
│   └── types.ts         — TypeScript interfaces for the data model
│
└── dist/
    └── package/
        ├── server.js
        ├── parser.js
        ├── types.js
        └── client/
            ├── index.html   — Interactive dashboard (HTML + CSS + JS, fully self-contained)
            └── logo.png
```

---

## The Dashboard

The dashboard is a single-page application that runs entirely in your browser.

**Live statistics** — real-time counts for modules, controllers, providers, and routes.

**Module graph** — the root module sits at the center with SVG lines connecting to its imported child modules. Each card shows controller count, provider count, and imports.

**Three layout modes:**
- **Radial** — modules arranged in a circle around the root, with relationship lines
- **Tree** — hierarchical top-down view showing the dependency tree
- **Cards** — clean grid view, no lines, just an inventory of all modules

**Focus mode** — click any module to highlight its relationships and dim everything else.

**Detail modals** — click a module to see its controllers, providers, and imports. Click a controller to see all routes with HTTP method badges. Click a provider to see its dependencies and public methods.

**Color-coded HTTP methods** — `GET` (green), `POST` (orange), `PUT` (blue), `PATCH` (purple), `DELETE` (red).

**Search** — filter modules in real time from the header bar.

**Keyboard shortcuts** — zoom, reset view, fullscreen, and more.

---

## How to Use

### Prerequisites

- **Node.js v18** or later
- A **NestJS project** to analyze

### Step 1 — Install NestLens

```bash
npm install nestlens-viewer
```

### Step 2 — Run It

Navigate to your NestJS project root and run:

```bash
npx nest-viewer
```

NestLens will scan your `src/app.module.ts` and all files it imports, then open the dashboard automatically at `http://localhost:4000`.

### Step 3 — Explore

- Use the **bottom control bar** to switch between Radial, Tree, and Cards layouts
- **Click any module card** to open its detail modal
- **Right-click** a card to show or hide its relationships
- **Scroll** to pan, **Ctrl + scroll** to zoom
- Use the **search bar** to filter modules by name

> **Tip:** If you're running NestLens from inside the project folder, it will automatically find your `src/app.module.ts`.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + +` | Zoom in |
| `Ctrl + -` | Zoom out |
| `Ctrl + 0` | Reset view |
| `F11` | Toggle fullscreen |
| `Escape` | Close modal / exit focus mode |
| `Click + Drag` | Move cards around |

---

## Built With AI

The interactive dashboard (`dist/package/client/index.html`) was designed and implemented with assistance from [OpenCode AI](https://opencode.ai), which helped generate the HTML, CSS, and JavaScript for the visualization layer.

---

## Contributing

NestLens is open-source and welcomes contributions from developers at any level.

**Reporting bugs** — open an issue with a clear description and steps to reproduce.

**Suggesting features** — open an issue describing what you need and how it should work.

**Submitting pull requests** — fix bugs, add features, improve docs, or write tests. Please open an issue first for significant changes so we can discuss the scope.

**Improving documentation** — corrections, clarifications, and translations are all welcome.


## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with care by developers, for developers.<br/>
  <sub>NestLens — See your NestJS architecture, clearly.</sub>
</p>
