# Files To Context — System Architecture & Technical Specifications

This document details the architectural design, component layers, data lifecycles, and concurrency model of **Files To Context**.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Files To Context                              │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│         UI Components           │         │          State Layer            │
│  (Dropzone, TreeModal, Preview) │ ◄─────► │   (Zustand Store + Repos)       │
└─────────────────────────────────┘         └─────────────────────────────────┘
                 │                                           │
                 │ Ingestion                                 │ Storage
                 ▼                                           ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│     Virtual File System (VFS)   │         │     IndexedDB (localForage)     │
│   (Normalized File Metadata)    │         │  (Workspaces, Files, Settings)  │
└─────────────────────────────────┘         └─────────────────────────────────┘
                 │
                 │ Merge Request
                 ▼
┌─────────────────────────────────┐
│      Web Worker Execution       │
│  - Filter Extensions            │
│  - Apply Separator Templates    │
│  - Concatenate & Normalize EOL  │
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│       Output: Monaco Preview / Clipboard Copy / TXT Download / ZIP      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Architectural Layers

### 1. Presentation Layer (`src/components/`)
- **Single Responsibility UI**: High-cohesion, presentation-only components designed with Tailwind CSS v4.
- **Interactive Modals & Panels**:
  - `ProjectTreeModal.tsx`: Visual folder explorer with real-time fuzzy/exact search, folder expansion states, and bulk node toggling.
  - `OptionsPanel.tsx`: Stack presets selector, whitelist badge tag inputs, and tokenized delimiter template configuration.
  - `PreviewPanel.tsx`: Read-only Monaco Editor instance configured for code review (bracket pair colorization, line numbers, word wrapping, minimap disabled).
  - `Dropzone.tsx`: Unified multi-mode drag-and-drop target supporting raw files and folder directories via `webkitdirectory`.
  - `FileList.tsx`: Real-time list of ingested workspace items with per-file deletion and size formatters.

### 2. State & Repository Layer (`src/store/`, `src/repositories/`)
- **Zustand Reactive Store (`src/store/workspaceStore.ts`)**:
  - Maintains active workspace context, workspace summaries index, and cached in-memory workspace instances.
  - Handles optimistic UI updates for file ingestion, file deletion, and setting updates.
- **Repository Pattern (`src/repositories/workspaceRepository.ts`)**:
  - Decouples UI logic from underlying browser storage mechanisms.
  - Uses `localForage` backed by IndexedDB (with transparent fallbacks to WebSQL/localStorage).
  - Isolates schema namespace (`file-compiler`) and version migration logic (`v3`).
- **Startup Auto-Healing & Normalization**:
  - Validates and sanitizes workspace names on application boot.
  - Automatically resolves naming conflicts and guarantees unique titles (`Workspace 1`, `Workspace 2`, ...).

### 3. Concurrency & Web Worker Engine (`src/workers/`)
- **Off-Thread Processing (`src/workers/mergeWorker.ts`)**:
  - Concatenation of hundreds of large source files is offloaded from the main browser thread to a dedicated Web Worker.
  - Prevents UI frame drops and input lag during heavy string formatting and regex operations.
- **Structured Message Protocol**:
  - Main thread dispatches `MergeRequest` containing file descriptors and active `MergeOptions`.
  - Worker performs extension whitelisting, evaluates dynamic separator tokens (`{{path}}`, `{{name}}`), normalizes line endings (`LF` vs `CRLF`), and returns a `MergeResult` with performance metrics.

### 4. Ingestion & Virtual File System (`src/lib/`)
- **Virtual File Representation (`src/types.ts`)**:
  - Ingested files are transformed into normalized `VfsFile` structures tracking relative path, extension, MIME type, size, modification timestamp, text/binary classification, and string content.
- **Binary vs. Text Detection (`src/lib/ingest.ts`)**:
  - Inspects file byte signatures and MIME types to prevent corrupting binary assets during text compilation.
- **Hierarchical Tree Traversal (`src/lib/folder-tree.ts`)**:
  - Builds nested in-memory tree nodes from flat file path paths for folder-level selection and search pruning.

### 5. Static Site Generation (SSG) & Localized Routing (`scripts/`, `src/i18n/`)
- **Dual-Language Routing Subsystem (`src/i18n/`, `src/lib/routing.ts`)**:
  - Supports English (`en`) and Ukrainian (`uk`) locales with automatic language detection and manual switching.
- **Node.js Prerender Pipeline (`scripts/generate-localized-pages.mjs`)**:
  - Automatically produces prerendered HTML static files for SEO landing pages (`/about`, `/docs`, `/chatgpt-context`, `/merge-code-files`).
  - Injects canonical meta tags, alternate `hreflang` links, OpenGraph metadata, and Schema.org `SoftwareApplication` / `FAQPage` structured JSON-LD.
- **GitHub Pages Fallback (`scripts/ensure-gh-pages-fallback.mjs`)**:
  - Generates `404.html` SPA routing fallbacks to enable direct client-side URL routing on static hosts.

---

## Data Lifecycle & Processing Pipeline

```
1. User Ingestion
   [Drag & Drop / Folder Picker]
          │
          ▼
2. VFS Normalization & Binary Filter
   (Transforms files to VfsFile records)
          │
          ▼
3. Zustand Store & IndexedDB Save
   (Persists workspace state locally)
          │
          ▼
4. Web Worker Dispatch
   (MessageEvent with MergeRequest payload)
          │
          ▼
5. Background Concatenation
   - Filter by included extensions
   - Format {{path}} and {{name}} separators
   - Normalize line breaks (LF / CRLF)
          │
          ▼
6. Render & Output Actions
   - Monaco Editor Preview
   - Copy to Clipboard
   - Direct TXT Download / JSZip Archive
```

---

## Privacy & Security Architecture

Files To Context adheres to a strict client-only security model:
- **No Remote API Endpoints**: The application has no backend servers for file processing.
- **Domain-Scoped IndexedDB Sandbox**: Workspace data is stored exclusively inside the browser's origin-isolated storage sandbox.
- **No Third-Party Telemetry**: Zero external tracking scripts, advertising pixels, or telemetry beacons.
