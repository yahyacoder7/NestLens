<p align="center">
  <img src="https://img.shields.io/badge/NestLens-v1.0.0-6A0DAD?style=for-the-badge&labelColor=1a1a2e" alt="Version" />
  <img src="https://img.shields.io/badge/NestJS-6.0-%23E0234E?style=for-the-badge&logo=nestjs&logoColor=white&labelColor=1a1a2e" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-%233178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1a1a2e" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-ISC-%2333CC33?style=for-the-badge&labelColor=1a1a2e" alt="License" />
</p>

<h1 align="center">🔍 NestLens</h1>
<p align="center"><em>Static Architecture Visualisation Tool for NestJS Projects</em></p>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [How It Works](#-how-it-works)
- [Concepts Used](#-concepts-used)
- [Project Structure](#-project-structure)
- [The Dashboard](#-the-dashboard)
- [Getting Started](#-getting-started)
- [Built With AI](#-built-with-ai)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧩 The Problem

NestJS is a powerful framework for building scalable server-side applications, but for **beginners** — and even experienced developers — understanding how a NestJS project is **structurally organized** can be overwhelming.

When you open a NestJS project, you are faced with:

- **Modules** that import and export each other
- **Controllers** that define routes with HTTP methods
- **Providers/Services** with injected dependencies
- **Complex graphs** of interconnections between all these components

Reading through dozens of files just to understand "what talks to what" is tedious, time-consuming, and error-prone. There is no built-in way to **visualize** the architecture of a NestJS project at a glance.

---

## ✅ Our Solution

**NestLens** solves this by providing an **automatic, static analysis engine** that scans your NestJS source code using the TypeScript Compiler API, extracts the full architecture graph — modules, controllers, providers, routes, and dependencies — and renders it as a **beautiful, interactive, single-page dashboard**.

With NestLens, beginners can:

| Before NestLens | After NestLens |
|---|---|
| Manually trace `@Module` decorators to understand relationships | See modules, imports, controllers, and providers at a glance |
| Search files to find all routes and their HTTP methods | View all routes with method badges and full paths instantly |
| Guess which services a controller depends on | Inspect constructor-injected dependencies directly from the UI |
| Lose track of the big picture in large codebases | Get live summary statistics (modules, controllers, providers, routes) |

---

## ⚙️ How It Works

```
┌───────────────────────────────────────────────────────────────────┐
│                        NestLens Pipeline                          │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌────────────────┐    ┌──────────────────┐   │
│  │  TypeScript   │    │   AST Walker   │    │  JSON Structure  │   │
│  │  Compiler API │───>│  (parser.ts)   │───>│  (types.ts)      │   │
│  │  creates      │    │  extracts      │    │  { modules,      │   │
│  │  program      │    │  @Module,      │    │    controllers,  │   │
│  │               │    │  @Controller,  │    │    providers }   │   │
│  └──────────────┘    │  @Injectable    │    └────────┬─────────┘   │
│                      └────────────────┘             │              │
│                                                      │              │
│                      ┌────────────────┐             │              │
│                      │  Express       │             │              │
│                      │  Server        │<────────────┘              │
│                      │  (server.ts)   │                            │
│                      │  Port 4000     │                            │
│                      └────────┬───────┘                            │
│                               │                                    │
│                               ▼                                    │
│                      ┌────────────────┐                            │
│                      │  Interactive   │  GET /api/data             │
│                      │  Dashboard     │<────────────────────       │
│                      │  (index.html)  │                            │
│                      │  SVG + CSS + JS│                            │
│                      └────────────────┘                            │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Step-by-step:**

1. **Scanning** — `parser.ts` uses `ts.createProgram()` to compile your NestJS project's source files
2. **Parsing** — The AST walker visits every file, finds classes decorated with `@Module`, `@Controller`, and `@Injectable`, and extracts all metadata (decorator arguments, constructor parameters, method names, route paths)
3. **Serving** — `server.ts` runs an Express server that exposes the parsed structure at `GET /api/data` and serves the static dashboard
4. **Visualizing** — `index.html` fetches the data and renders an interactive dark-themed dashboard with SVG connectors, expandable cards, and detail modals

---

## 🧠 Concepts Used

| Concept | How It Is Used |
|---|---|
| **Abstract Syntax Tree (AST)** | The TypeScript Compiler API represents source code as an AST; we walk this tree to find decorated classes |
| **TypeScript Compiler API** | `ts.createProgram()` compiles the project in memory, giving us access to all source files and their type information |
| **Decorator Pattern** | NestJS uses decorators (`@Module`, `@Controller`, `@Injectable`) as metadata — we parse these to extract the architecture |
| **Static Analysis** | The entire analysis happens at compile time — no runtime execution of the target project is needed |
| **Dependency Injection** | We inspect constructor parameters to map out which services each controller/provider depends on |
| **Express Server** | A lightweight HTTP server serves the API and static assets |
| **Dynamic HTML Rendering** | Vanilla JavaScript builds the entire UI from the JSON data — modules, cards, modals, and SVG connector lines |

---

## 📁 Project Structure

```
nestlens/
├── package.json              # Project metadata, dependencies, and scripts
├── tsconfig.json             # TypeScript compiler configuration
├── .gitignore                # Git ignore rules
│
└── package/
    ├── server.ts             # 🖥️ Express entry point — starts server on port 4000,
    │                         #    runs the analysis, serves the dashboard, opens browser
    │
    ├── parser.ts             # 🔬 Core analysis engine — uses TypeScript Compiler API
    │                         #    to walk the AST and extract project structure
    │                         #    Functions:
    │                         #      - runASTAnalysis()     → entry point, returns NestProjectStructure
    │                         #      - visit(node)          → recursive AST walker, dispatches to parsers
    │                         #      - parserModule(node)   → extracts @Module metadata
    │                         #      - parserController(node)→ extracts @Controller metadata + routes
    │                         #      - parserProvider(node)  → extracts @Injectable metadata + methods
    │
    ├── types.ts              # 📦 TypeScript interfaces defining the data model
    │                         #    Types:
    │                         #      - NestProjectStructure → { modules, controllers, providers }
    │                         #      - ModuleNode          → name, imports, controllers, providers, exports
    │                         #      - ControllerNode      → name, prefix, dependencies, routers
    │                         #      - RouterNode          → name, path, method (GET/POST/etc.)
    │                         #      - ProviderNode        → name, dependencies, services
    │                         #      - ServiceNode         → name
    │
    ├── viewer.ts             # 📐 Placeholder for future CLI/terminal viewer (empty)
    │
    └── client/
        └── index.html        # 🎨 Interactive single-page dashboard
                              #    Features:
                              #      - Dark cyber theme with gradient accents
                              #      - Header with live statistics badges
                              #      - SVG connector lines between root and child modules
                              #      - Expandable module cards (controllers, providers, imports)
                              #      - Detail modals with full route tables & dependency lists
                              #      - Color-coded HTTP method badges
                              #      - Responsive design (mobile, tablet, desktop)
                              #      - Loading spinner & error state handling
```

---

## 🎨 The Dashboard

The presentation layer (`package/client/index.html`) is a **fully self-contained single-page application** — no build tools, no frameworks, no external dependencies beyond what the server provides.

### Key Features

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 NestLens                          Modules: 5  Routes: 23      │
│  Static Architecture Visualization     Ctrl: 8    Prov: 12         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ AppModule ──────────────────────────────────────────────────┐   │
│  │  ├─ Controllers:  AuthController  TaskController  UserCtrl   │   │
│  │  ├─ Providers:    AuthService     TaskService     UserSvc    │   │
│  │  └─ Imports:      DatabaseModule  ConfigModule               │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                          │                                           │
│               ┌──────────┼──────────┐                               │
│               ▼          ▼          ▼                               │
│  ┌─ DatabaseModule ┐  ┌─ AuthModule ┐  ┌─ TaskModule ┐            │
│  │ Controllers: 3  │  │ Ctrl: 2     │  │ Ctrl: 3     │            │
│  │ Providers:   5  │  │ Prov: 4     │  │ Prov: 3     │            │
│  └────────────────┘  └─────────────┘  └─────────────┘            │
│                                                                     │
│  [Click a module to expand / Click a controller for route details] │
└─────────────────────────────────────────────────────────────────────┘
```

- **Live Statistics** — Module count, controller count, provider count, and route count update in real time
- **Root Module Card** — The entry module (e.g., `AppModule`) is prominently displayed with its children
- **SVG Connectors** — Visual lines connect the root module to its imported child modules
- **Expandable Cards** — Each module card can be expanded inline to show its controllers, providers, and imports
- **Detail Modals** — Click any controller to see its full route table (method + path badges); click any provider to see its dependencies and public methods
- **Color-Coded Methods** — `GET` (green), `POST` (orange), `PUT` (blue), `PATCH` (purple), `DELETE` (red)
- **Fully Responsive** — Works on desktop, tablet, and mobile screen sizes

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A NestJS project to analyze

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nestlens.git
cd nestlens

# Install dependencies
npm install
```

### Configuration

Open `package/parser.ts` and update the `filePath` array on **line 229** to point to your NestJS project's main module:

```typescript
const filePath: string[] = [
  "C:\\path\\to\\your\\nestjs-project\\src\\app.module.ts",
];
```

### Running

```bash
npm run nestlens
```

The server will:
1. Analyze your NestJS project
2. Start a server on **http://localhost:4000**
3. Automatically open the dashboard in your default browser

---

## 🤖 Built With AI

The interactive dashboard interface (`package/client/index.html`) was designed and implemented with assistance from **[OpenCode AI](https://opencode.ai)** — an intelligent coding assistant that helped generate the HTML, CSS, and JavaScript for the visualisation layer.

This collaboration allowed us to deliver a polished, professional UI with:
- A cohesive dark cyber-aesthetic theme
- Smooth animations and transitions
- Clean, maintainable vanilla JavaScript
- Responsive design across all device sizes

The interface is **fully customizable** — you can modify colors, layout, animations, or add new features directly in `package/client/index.html` without any build step.

---

## 🤝 Contributing

**NestLens is open-source and welcomes everyone to contribute!**

Whether you are a beginner looking to make your first open-source contribution or an experienced developer with ideas to improve the tool, you are invited to participate.

### Ways to Contribute

- **🐛 Report Bugs** — Open an issue with a clear description and reproduction steps
- **💡 Suggest Features** — Have an idea for improvement? We would love to hear it
- **🔧 Submit PRs** — Fix bugs, add features, improve documentation, or write tests
- **📖 Improve Docs** — Help make the project more accessible to newcomers
- **🌍 Localize** — Add support for multilingual documentation

### Roadmap Ideas

- [ ] CLI arguments for dynamic file path input (no hardcoded paths)
- [ ] Support for more decorators (`@Guard`, `@Interceptor`, `@Pipe`, `@Filter`)
- [ ] Export to PNG/SVG of the architecture graph
- [ ] Terminal-based viewer (`viewer.ts`)
- [ ] GitHub Action for automatic architecture diffs on PRs
- [ ] Monorepo support (multiple NestJS apps in one repo)

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by developers, for developers.
  <br />
  <sub>NestLens — See your NestJS architecture, clearly.</sub>
</p>
