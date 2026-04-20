# File Compiler

File Compiler is a browser-first web app that merges many local files into a single output document, audits, migration prep, and code review workflows.
## Overview

The app helps you:

- collect files by drag-and-drop or file/folder pickers
- filter what gets merged by extension
- add path-aware separators between files
- preview merged output in a Monaco editor
- copy output to clipboard or download as `.txt` / `.zip`
- keep multiple persistent workspaces in browser storage

Everything runs client-side. Files are not uploaded to a server.

## Technology Stack

- **Language**: TypeScript
- **UI**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Local Persistence**: localForage (IndexedDB/WebStorage)
- **Compression**: JSZip
- **Editor/Preview**: Monaco Editor (`@monaco-editor/react`)
- **Linting**: ESLint 9
- **Deployment**: GitHub Actions + GitHub Pages

## Architecture Highlights

- **Browser-only processing**: merge logic is executed in a Web Worker.
- **Deterministic merging**: files are normalized, sorted, and merged by explicit rules.
- **Workspace persistence**: each workspace stores files and merge settings locally.
- **Name normalization**: workspace names are deduplicated and migrated automatically.
- **Safety for large inputs**: preview is truncated by configurable character limit.
- **Binary-aware ingestion**: text vs binary is detected heuristically before merge.

## Core Features

### Workspace Management

- create, delete, and select workspaces
- automatic unique names (`Workspace 1`, `Workspace 2`, ...)
- hydration and migration of stored workspace names on startup

### File Ingestion

- drag and drop files
- add files from picker
- add folders from picker (`webkitdirectory`, supported in Chrome/Edge)
- replace files by path and keep a sorted virtual file list

### Merge Controls

- include all extensions or whitelist specific extensions
- custom separator template with tokens: `{{path}}`, `{{name}}`
- newline mode support (`LF` / `CRLF`)
- optional ZIP output

### Output & Preview

- Monaco-based read-only preview with inferred language mode
- live line/character counters
- copy to clipboard
- download merged text or ZIP archive

## Project Structure

```text
src/
  components/       # UI building blocks
  config/           # app-level constants
  hooks/            # React hooks (merge orchestration)
  lib/              # pure utilities (ingest, merge, storage, naming, download)
  store/            # Zustand workspace store
  workers/          # Web Worker merge execution
  App.tsx           # application shell and flow orchestration
```

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Default local URL: `http://localhost:5173`

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

## NPM Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build production bundle
- `npm run build:gh` - alias for GitHub Pages build
- `npm run build:native` - native config-loader build (optional local fallback)
- `npm run preview` - preview production bundle locally
- `npm run lint` - run ESLint

## Data and Privacy

- No server-side processing
- No file uploads
- Workspaces are saved locally in browser storage only