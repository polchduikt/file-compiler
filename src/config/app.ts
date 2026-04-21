import type { WorkspaceSettings } from '../types'

export const APP_NAME = 'Files To Context'
export const DEFAULT_WORKSPACE_NAME = 'Workspace 1'
export const WORKSPACE_NAME_PREFIX = 'Workspace'
export const DEFAULT_OUTPUT_FILE_NAME = 'merged.txt'
export const DEFAULT_PREVIEW_MAX_CHARS = 200_000
export const WORKSPACE_NAME_LIMIT = 60
export const STORAGE_NAMESPACE = 'file-compiler'
export const STORAGE_VERSION = 'v3'
export const PREVIEW_TRUNCATION_SUFFIX = '\n\n...'

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  includeExts: [],
  includeAllExts: true,
  addSeparators: true,
  separatorTemplate: '// --- {{path}} ---',
  outputFileName: DEFAULT_OUTPUT_FILE_NAME,
  zipOutput: false,
  newline: '\n',
  previewMaxChars: DEFAULT_PREVIEW_MAX_CHARS,
}

export const MONACO_LANGUAGE_BY_EXTENSION = {
  '.bash': 'shell',
  '.c': 'c',
  '.cpp': 'cpp',
  '.cs': 'csharp',
  '.css': 'css',
  '.fish': 'shell',
  '.go': 'go',
  '.html': 'html',
  '.java': 'java',
  '.js': 'javascript',
  '.json': 'json',
  '.jsx': 'javascript',
  '.less': 'less',
  '.md': 'markdown',
  '.php': 'php',
  '.py': 'python',
  '.rb': 'ruby',
  '.rs': 'rust',
  '.rst': 'restructuredtext',
  '.sass': 'sass',
  '.scss': 'scss',
  '.sh': 'shell',
  '.sql': 'sql',
  '.tex': 'latex',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.zsh': 'shell',
} as const satisfies Record<string, string>

export const PREVIEW_EDITOR_OPTIONS = {
  bracketPairColorization: {
    enabled: true,
    independentColorPoolPerBracketType: false,
  },
  colorDecorators: true,
  contextmenu: false,
  folding: true,
  foldingHighlight: true,
  fontFamily: "'Fira Code', 'JetBrains Mono', 'SF Mono', 'Monaco', 'Menlo', monospace",
  fontLigatures: true,
  fontSize: 14,
  guides: {
    bracketPairs: true,
    indentation: true,
  },
  lineHeight: 1.5,
  links: false,
  minimap: { enabled: false },
  occurrencesHighlight: 'off',
  padding: { bottom: 16, top: 16 },
  readOnly: true,
  renderWhitespace: 'none',
  scrollBeyondLastLine: false,
  scrollbar: {
    horizontal: 'auto',
    horizontalScrollbarSize: 12,
    vertical: 'auto',
    verticalScrollbarSize: 12,
  },
  selectionHighlight: false,
  wordWrap: 'on',
} as const
