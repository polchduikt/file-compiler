# Files To Context — Browser-Only Code Merger

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25_Client--Side-brightgreen.svg)](#privacy--data-security)
[![i18n: EN | UK](https://img.shields.io/badge/i18n-EN_%7C_UK-blue.svg)](#internationalization-i18n--seo-ssg)

[![React 19](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x_%2F_6.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38b2ac.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443E38.svg)](https://zustand.docs.pmnd.rs/)
[![Web Workers](https://img.shields.io/badge/Web_Workers-Multi--Threaded-purple.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
[![IndexedDB](https://img.shields.io/badge/IndexedDB-LocalForage-orange.svg)](https://localforage.github.io/localForage/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-v0.50-1E1E1E.svg?logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![JSZip](https://img.shields.io/badge/JSZip-Archive_Engine-yellow.svg)](https://stuk.github.io/jszip/)
[![Hosted on GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222222.svg?logo=githubpages&logoColor=white)](https://file-compiler.techindustry.app)

---

## Overview

**Files To Context** is a high-performance, browser-only web application designed for collecting, filtering, transforming, and merging multiple local source code files, configurations, and documentation into a single structured, AI-ready prompt context or downloadable archive (`.txt` / `.zip`).

Designed specifically for AI-assisted workflows (ChatGPT, Claude, Gemini, DeepSeek), code audits, architectural reviews, migrations, and repository handoffs, Files To Context runs entirely on the client side. Files are processed locally in the browser using multi-threaded **Web Workers** and stored in **IndexedDB** via a clean repository abstraction—ensuring zero server uploads, zero network latency, and complete code privacy.

---

## Tech Stack

### Core Runtime & Framework
- **React 19** (`react` & `react-dom` 19.2) — Modern reactive UI with concurrent rendering
- **TypeScript** (~6.0) — Strict compile-time type safety across domain models and workers
- **Vite 8** (`@vitejs/plugin-react` & native config loader) — Sub-millisecond HMR and optimized production bundling

### Styling & Code Editor
- **Tailwind CSS v4** (`@tailwindcss/vite`) — Modern utility-first styling system
- **Monaco Editor** (`@monaco-editor/react`) — Visual Studio Code editor engine for syntax-highlighted output preview with bracket pair colorization and folding

### State Management & Client Persistence
- **Zustand v5** — Reactive state store with normalized workspace indexes and fast updates
- **localForage** — Asynchronous IndexedDB storage engine with automatic fallback to WebStorage
- **Repository Pattern** (`workspaceRepository.ts`) — Clean decoupling of storage mechanisms from UI business logic

### Concurrency & Performance
- **Web Workers** (`mergeWorker.ts`) — Dedicated background thread execution for text parsing, token replacement, and large file concatenation without blocking the main UI thread
- **JSZip** — In-browser compression engine for creating downloadable `.zip` bundles

### Internationalization & SEO
- **Custom i18n Subsystem** (`I18nProvider.tsx`) — Dual-language support for English (`en`) and Ukrainian (`uk`)
- **Static Site Generation (SSG)** (`scripts/generate-localized-pages.mjs`) — Prerendered HTML pages with localized routes, canonical links, OpenGraph cards, and Schema.org `SoftwareApplication` / `FAQPage` JSON-LD metadata

---

## Core Features

- **Isolated Workspace Management**: Create, rename, delete, and switch between separate workspaces with automatic collision-free naming and per-workspace configuration persistence.
- **Cross-Browser Workspace Portability**: Full JSON backup export and restore capability to transfer workspaces across devices and browsers without external accounts.
- **Flexible Ingestion Pipeline**: Ingest project files via drag-and-drop dropzone, file selector dialog, or recursive folder ingestion via `webkitdirectory`.
- **Interactive Project Tree Modal**: Hierarchical tree explorer allowing developers to navigate directories, search/filter files by name or extension in real-time, and perform bulk selections (`Select all`, `Clear all`).
- **14+ Stack Merge Presets**: Instant configuration presets tailored for popular tech stacks (Java, JS/TS, React, Node.js, Python, C#/.NET, PHP, Go, Rust, Kotlin/Android, Swift/iOS, Ruby/Rails, DevOps/IaC, and Markdown Docs).
- **Smart Boundary Separators**: Configurable delimiter templates with dynamic tokens (`{{path}}`, `{{name}}`) to maintain file context boundaries for LLMs.
- **Granular Extension Filtering**: Merge all detected text files or strictly whitelist target extensions (`.ts`, `.java`, `.py`, `.md`, `.json`, etc.).
- **Off-Thread Web Worker Merge Engine**: Fast concatenation and line normalizations (`LF` / `CRLF`) executed asynchronously on a background worker thread.
- **Monaco Output Preview & Live Metrics**: Syntax-highlighted read-only editor with line count, character count, and total byte size metrics, featuring auto-truncation for multi-megabyte payloads.
- **One-Click Export & Clipboard Sync**: Instant clipboard copy and direct download options for `.txt` files or structured `.zip` archives.
- **100% Client-Side Privacy Guarantee**: Zero backend dependencies, zero telemetry, and zero file transfers over the network.

---

## System Architecture & Patterns

The platform implements a modular, client-side decoupled architecture designed for high-concurrency text processing and zero-backend execution:

- **Presentation Layer**: Modular, accessible UI components styled with Tailwind CSS v4, featuring a full Monaco Code Editor preview.
- **State & Repository Layer**: Reactive Zustand store paired with a Repository Pattern isolating IndexedDB / localForage persistence.
- **Off-Thread Web Worker Engine**: Multi-threaded concatenation offloaded to `mergeWorker.ts` to prevent UI thread blocking during large repository merges.
- **Virtual File System (VFS)**: In-memory normalized file descriptor abstraction with binary detection and tree hierarchy traversal algorithms.
- **Localized Static Site Generation (SSG)**: Automated pre-rendering pipeline generating multi-language HTML pages, sitemaps, and Schema.org metadata for SEO.

Detailed architecture specifications: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Supported Presets Matrix

| Preset | Target Extensions | Default Separator Template | Default Output |
| :--- | :--- | :--- | :--- |
| **Java** | `.java`, `.kt`, `.kts`, `.xml`, `.properties`, `.yml`, `.yaml`, `.sql` | `// --- {{path}} ---` | `merged-java.txt` |
| **JavaScript / TypeScript** | `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`, `.json`, `.css`, `.scss`, `.html` | `// --- {{path}} ---` | `merged-web.txt` |
| **React Frontend** | `.tsx`, `.ts`, `.jsx`, `.js`, `.css`, `.scss`, `.html`, `.json` | `// --- {{path}} ---` | `merged-react.txt` |
| **Node.js Backend** | `.ts`, `.js`, `.mjs`, `.cjs`, `.json`, `.graphql`, `.gql`, `.env` | `// --- {{path}} ---` | `merged-node.txt` |
| **Python** | `.py`, `.pyi`, `.ipynb`, `.toml`, `.yaml`, `.yml`, `.ini`, `.cfg` | `# --- {{path}} ---` | `merged-python.txt` |
| **C# / .NET** | `.cs`, `.csproj`, `.sln`, `.props`, `.targets`, `.json`, `.xml`, `.config` | `// --- {{path}} ---` | `merged-dotnet.txt` |
| **PHP** | `.php`, `.phtml`, `.inc`, `.json`, `.yaml`, `.yml`, `.twig` | `// --- {{path}} ---` | `merged-php.txt` |
| **Go** | `.go`, `.mod`, `.sum`, `.yaml`, `.yml`, `.json`, `.sql` | `// --- {{path}} ---` | `merged-go.txt` |
| **Rust** | `.rs`, `.toml`, `.lock`, `.md` | `// --- {{path}} ---` | `merged-rust.txt` |
| **Kotlin / Android** | `.kt`, `.kts`, `.gradle`, `.properties`, `.xml`, `.yaml`, `.yml` | `// --- {{path}} ---` | `merged-kotlin.txt` |
| **Swift / iOS** | `.swift`, `.plist`, `.xcconfig`, `.strings`, `.json`, `.yml` | `// --- {{path}} ---` | `merged-swift.txt` |
| **Ruby / Rails** | `.rb`, `.rake`, `.gemspec`, `.ru`, `.erb`, `.yml`, `.yaml` | `# --- {{path}} ---` | `merged-ruby.txt` |
| **DevOps / IaC** | `.yml`, `.yaml`, `.tf`, `.tfvars`, `.hcl`, `.json`, `.sh`, `.ps1` | `# --- {{path}} ---` | `merged-infra.txt` |
| **Docs / Markdown** | `.md`, `.mdx`, `.txt`, `.rst`, `.adoc`, `.html` | `<!-- --- {{path}} --- -->` | `merged-docs.txt` |

---

## Repository Structure

```
file-compiler/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD to GitHub Pages
├── docs/
│   └── ARCHITECTURE.md             # Detailed system architecture & specifications
├── scripts/
│   ├── ensure-gh-pages-fallback.mjs # Creates 404.html fallback for client-side routing
│   └── generate-localized-pages.mjs # Pre-renders localized SSG pages, sitemap, and JSON-LD
├── public/                         # Static assets (favicons, robots.txt, logo)
├── src/
│   ├── assets/                     # App-level static SVGs and images
│   ├── components/                 # Modular UI components
│   │   ├── AboutPage.tsx           # About product overview page
│   │   ├── AppHeader.tsx           # Navigation bar with workspace selector & actions
│   │   ├── DocumentationPage.tsx   # Interactive documentation page
│   │   ├── Dropzone.tsx            # File & folder ingestion dropzone
│   │   ├── FileList.tsx            # Virtualized list of uploaded workspace files
│   │   ├── LandingPage.tsx         # Use-case landing pages (ChatGPT, Merge Code)
│   │   ├── OptionsPanel.tsx        # Presets, separator templates, and extension whitelisting
│   │   ├── PreviewPanel.tsx        # Monaco Editor preview & download/copy actions
│   │   ├── ProjectTreeModal.tsx    # Modal file tree navigation, search, and bulk selection
│   │   ├── RenameWorkspaceModal.tsx # Workspace rename dialog
│   │   └── types.ts                # Component-level UI prop definitions
│   ├── config/                     # Constants, Monaco options, and default settings
│   │   └── app.ts
│   ├── content/                    # Multilingual copy for SEO, docs, and landings
│   │   ├── documentation.ts
│   │   └── seo.ts
│   ├── hooks/                      # Custom React hooks (app chrome, merge results, controller)
│   │   ├── useAppChrome.ts
│   │   ├── useMergeResult.ts
│   │   └── useWorkspaceController.ts
│   ├── i18n/                       # Translation context, hooks, and language dictionaries
│   │   ├── I18nProvider.tsx
│   │   ├── context.ts
│   │   ├── translations.ts
│   │   └── useI18n.ts
│   ├── lib/                        # Pure domain logic and helper utilities
│   │   ├── download.ts             # Blob and file download triggers
│   │   ├── file-system.ts          # File normalization, size formatters, and path resolvers
│   │   ├── folder-tree.ts          # Tree hierarchy builder and search filtering algorithms
│   │   ├── id.ts                   # Collision-resistant ID generator
│   │   ├── ingest.ts               # File and directory reading logic
│   │   ├── merge.ts                # Separator templating and newline normalization
│   │   ├── presets.ts              # Preset definitions and resolver logic
│   │   ├── routing.ts              # Hash-based and pathname-based localized client router
│   │   ├── settings.ts             # Workspace settings normalizer
│   │   ├── storage.ts              # Local storage wrapper
│   │   ├── workspace.ts            # Workspace record factories and naming sanitizers
│   │   ├── workspace-backup.ts     # JSON backup schema validation and parser
│   │   └── workspaceDisplay.ts     # Label formatters
│   ├── repositories/               # Storage abstraction layer
│   │   └── workspaceRepository.ts  # LocalForage (IndexedDB) persistence adapter
│   ├── store/                      # Global state management
│   │   └── workspaceStore.ts       # Zustand workspace store
│   ├── workers/                    # Web Workers
│   │   └── mergeWorker.ts          # Background file merge and text processing worker
│   ├── App.tsx                     # Main application container and routing coordinator
│   ├── main.tsx                    # React application root entrypoint
│   ├── index.css                   # Tailwind CSS v4 root stylesheet
│   └── types.ts                    # Global TypeScript interfaces and domain types
├── index.html                      # HTML5 root template
├── package.json                    # Project dependencies and script definitions
├── tsconfig.json                   # TypeScript project references
├── tsconfig.app.json               # TypeScript application config
├── tsconfig.node.json              # TypeScript Node scripts config
├── eslint.config.js                # ESLint 9 configuration
└── vite.config.mjs                 # Vite build configuration
```

---

## Running Locally

### Prerequisites
- **Node.js**: `20.x` or higher
- **npm**: `10.x` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/polchduikt/file-compiler.git
cd file-compiler
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### 4. Code Quality & Type Checking
```bash
# Run ESLint validation
npm run lint

# Run TypeScript compilation check
npx tsc -b --pretty false
```

### 5. Build for Production
```bash
npm run build
```
This script executes:
1. TypeScript compilation check (`tsc -b`)
2. Vite production bundle optimization
3. Multilingual SSG prerendering (`generate-localized-pages.mjs`)
4. GitHub Pages SPA fallback generation (`ensure-gh-pages-fallback.mjs`)

### 6. Preview Production Bundle
```bash
npm run preview
```

---

## NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `vite` | Starts local development server with Vite HMR |
| `build` | `tsc -b && vite build --configLoader native && node scripts/generate-localized-pages.mjs && node scripts/ensure-gh-pages-fallback.mjs` | Full production build with SSG generation |
| `build:gh` | `npm run build` | Alias for GitHub Pages production build |
| `build:native` | `npm run build` | Alias for standard native production build |
| `lint` | `eslint .` | Runs ESLint 9 checks across the codebase |
| `preview` | `vite preview` | Serves the production `dist/` directory locally |

---

## Privacy & Data Security

Files To Context is engineered with a strict **Privacy-First** architecture:
- **Zero Backend Communication**: Files are read, parsed, and merged exclusively within your local browser runtime.
- **Zero Server Uploads**: No file contents, file paths, repository structures, or metadata are ever transmitted across the internet.
- **Hermetic IndexedDB Storage**: Workspaces and files are persisted strictly inside your browser's private IndexedDB sandbox scoped to your domain.
- **Telemetry-Free**: No third-party trackers, analytics, or behavioral cookies are embedded.

---

## Status

Files To Context is actively maintained and continually updated with new presets, performance optimizations, and workflow enhancements.

---

## License

This project is licensed under the [MIT License](LICENSE).
