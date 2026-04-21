import type { VfsFile, Workspace, WorkspaceSettings } from '../types'
import { getExtensionFromPath, normalizeExtension, normalizeVirtualPath } from './file-system'
import { createId } from './id'

const BACKUP_FORMAT = 'file-compiler-workspace'
const BACKUP_VERSION = 1

type WorkspaceBackupDocument = {
  format: string
  version: number
  exportedAt: string
  workspace: {
    name: string
    settings: Partial<WorkspaceSettings>
    files: unknown[]
  }
}

export type WorkspaceImportPayload = {
  name: string
  settings: Partial<WorkspaceSettings>
  files: VfsFile[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toSafeString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function toSafeNumber(value: unknown, fallback = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return value
}

function normalizeFile(raw: unknown): VfsFile | null {
  if (!isRecord(raw)) return null

  const path = normalizeVirtualPath(toSafeString(raw.path))
  if (!path) return null

  const fallbackName = path.split('/').at(-1) ?? 'file'
  const name = toSafeString(raw.name, fallbackName) || fallbackName
  const isText = typeof raw.isText === 'boolean' ? raw.isText : true
  const ext = normalizeExtension(toSafeString(raw.ext) || getExtensionFromPath(path))
  const text = isText ? toSafeString(raw.text) : undefined

  return {
    id: createId('f'),
    name,
    path,
    ext,
    mime: toSafeString(raw.mime, isText ? 'text/plain' : 'application/octet-stream'),
    size: Math.max(0, toSafeNumber(raw.size, text?.length ?? 0)),
    lastModified: Math.max(0, toSafeNumber(raw.lastModified, Date.now())),
    isText,
    text,
  }
}

function normalizeSettings(raw: unknown): Partial<WorkspaceSettings> {
  if (!isRecord(raw)) return {}

  const settings: Partial<WorkspaceSettings> = {}

  if (Array.isArray(raw.includeExts)) {
    settings.includeExts = raw.includeExts
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.trim())
      .filter(Boolean)
  }

  if (typeof raw.includeAllExts === 'boolean') {
    settings.includeAllExts = raw.includeAllExts
  }

  if (typeof raw.addSeparators === 'boolean') {
    settings.addSeparators = raw.addSeparators
  }

  if (typeof raw.separatorTemplate === 'string') {
    settings.separatorTemplate = raw.separatorTemplate
  }

  if (typeof raw.outputFileName === 'string') {
    settings.outputFileName = raw.outputFileName
  }

  if (typeof raw.zipOutput === 'boolean') {
    settings.zipOutput = raw.zipOutput
  }

  if (raw.newline === '\n' || raw.newline === '\r\n') {
    settings.newline = raw.newline
  }

  if (typeof raw.previewMaxChars === 'number' && Number.isFinite(raw.previewMaxChars)) {
    settings.previewMaxChars = Math.max(1, Math.floor(raw.previewMaxChars))
  }

  return settings
}

export function buildWorkspaceBackupFilename(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base || 'workspace'}-backup.json`
}

export function serializeWorkspaceBackup(workspace: Workspace) {
  const document: WorkspaceBackupDocument = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    workspace: {
      name: workspace.name,
      settings: workspace.settings,
      files: workspace.files.map((file) => ({
        name: file.name,
        path: file.path,
        ext: file.ext,
        mime: file.mime,
        size: file.size,
        lastModified: file.lastModified,
        isText: file.isText,
        text: file.text,
      })),
    },
  }

  return JSON.stringify(document, null, 2)
}

export function parseWorkspaceBackup(raw: string): WorkspaceImportPayload {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON format')
  }

  if (!isRecord(parsed)) {
    throw new Error('Invalid backup structure')
  }

  if (parsed.format !== BACKUP_FORMAT || parsed.version !== BACKUP_VERSION) {
    throw new Error('Unsupported backup format')
  }

  const workspace = parsed.workspace
  if (!isRecord(workspace)) {
    throw new Error('Missing workspace data')
  }

  const rawFiles = Array.isArray(workspace.files) ? workspace.files : []
  const files = rawFiles.map(normalizeFile).filter((file): file is VfsFile => Boolean(file))

  const settings = normalizeSettings(workspace.settings)

  return {
    name: toSafeString(workspace.name, 'Imported workspace'),
    settings,
    files,
  }
}
