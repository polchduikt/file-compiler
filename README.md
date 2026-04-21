# File Compiler

File Compiler is a browser-only web app for merging local project files into one clean output.  
You can copy the merged result or download it as `.txt` / `.zip` without uploading source files to any backend.

## Overview

The app is designed for code reviews, AI context preparation, migration audits, and documentation exports.  
Everything runs client-side (React + Web Worker + IndexedDB).

## Core Features

### Workspace Management

- create, rename, delete, and switch workspaces
- automatic workspace naming (`Workspace 1`, `Workspace 2`, ...)
- workspace export to JSON backup
- workspace import from JSON backup (for browser-to-browser migration)

### File Collection

- drag and drop files
- add files via picker
- add folder via `webkitdirectory` (Chrome/Edge)
- project tree modal with folder navigation
- project tree search/filter by file or folder name
- bulk tree actions: Select all / Clear all

### Merge Controls

- include all extensions or whitelist specific extensions
- configurable separator template with tokens: `{{path}}`, `{{name}}`
- newline mode (`LF` / `CRLF`)
- optional ZIP output
- stack presets for quick setup:
  - Java
  - JavaScript / TypeScript
  - React Frontend
  - Node.js Backend
  - Python
  - C# / .NET
  - PHP
  - Go
  - Rust
  - Kotlin / Android
  - Swift / iOS
  - Ruby / Rails
  - DevOps / IaC
  - Docs / Markdown

### Preview & Output

- read-only Monaco preview
- live line and character counters
- copy merged output to clipboard
- download merged output as text or ZIP


## Architecture

- UI in `src/components`
- orchestration and app-level behavior in `src/hooks`
- pure utilities and domain logic in `src/lib`
- persistence abstraction in `src/repositories`
- state container in `src/store`
- heavy merge processing in `src/workers` (Web Worker)


## Project Structure

```text
src/
  assets/           # static assets imported by app code
  components/       # reusable UI components
  config/           # app constants and config values
  content/          # static content (documentation page text)
  hooks/            # app/workspace orchestration hooks
  i18n/             # localization context and dictionaries
  lib/              # pure utilities (merge, ingest, routing, presets, backup)
  repositories/     # storage repository abstractions
  store/            # Zustand state store
  workers/          # Web Worker for merge execution
  App.tsx           # top-level app shell
```

## Technology Stack

- TypeScript
- React 19
- Vite 8
- Tailwind CSS 4
- Zustand
- localForage (IndexedDB/WebStorage)
- JSZip
- Monaco Editor (`@monaco-editor/react`)
- ESLint 9
- GitHub Actions + GitHub Pages

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Default local URL: `http://localhost:5173`

### Quality Checks

```bash
npm run lint
npx tsc -b --pretty false
```

### Production Build

```bash
npm run build
```

## NPM Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check, build, generate localized pages, create GH Pages fallback
- `npm run build:gh` - alias for GitHub Pages build
- `npm run build:native` - alias of build
- `npm run preview` - preview production bundle locally
- `npm run lint` - run ESLint

## Data & Privacy

- no backend file processing
- no file uploads
- workspaces and files are stored only in browser storage for the current domain
