import {
  DEFAULT_OUTPUT_FILE_NAME,
  DEFAULT_WORKSPACE_NAME,
  DEFAULT_WORKSPACE_SETTINGS,
  WORKSPACE_NAME_LIMIT,
  WORKSPACE_NAME_PREFIX,
} from '../config/app'
import type { Workspace, WorkspaceSettings, WorkspaceSummary } from '../types'

export function sanitizeWorkspaceName(name?: string, fallback = DEFAULT_WORKSPACE_NAME) {
  const value = name?.trim().slice(0, WORKSPACE_NAME_LIMIT)
  return value || fallback
}

export function sanitizeOutputFileName(filename: string) {
  const value = filename.trim()
  return value || DEFAULT_OUTPUT_FILE_NAME
}

export function createWorkspaceName(position: number) {
  return `${WORKSPACE_NAME_PREFIX} ${position}`
}

const WORKSPACE_NAME_RE = /^workspace\s+(\d+)$/i

export function getNextWorkspaceName(workspaces: Array<Pick<WorkspaceSummary, 'name'>>) {
  let maxIndex = 0

  for (const workspace of workspaces) {
    const match = workspace.name.trim().match(WORKSPACE_NAME_RE)
    if (!match) continue

    const value = Number(match[1])
    if (Number.isFinite(value)) {
      maxIndex = Math.max(maxIndex, value)
    }
  }

  return createWorkspaceName(maxIndex + 1)
}

export function makeUniqueWorkspaceName(
  desiredName: string,
  workspaces: Array<Pick<WorkspaceSummary, 'name'>>,
) {
  const normalizedDesiredName = desiredName.trim().toLowerCase()
  const occupied = new Set(workspaces.map((workspace) => workspace.name.trim().toLowerCase()))

  if (!occupied.has(normalizedDesiredName)) {
    return desiredName
  }

  if (WORKSPACE_NAME_RE.test(desiredName.trim())) {
    return getNextWorkspaceName(workspaces)
  }

  let suffix = 2
  while (occupied.has(`${normalizedDesiredName} (${suffix})`)) {
    suffix += 1
  }

  return `${desiredName} (${suffix})`
}

export function createWorkspaceRecord(id: string, name?: string, now = Date.now()): Workspace {
  return {
    createdAt: now,
    files: [],
    id,
    name: sanitizeWorkspaceName(name),
    settings: { ...DEFAULT_WORKSPACE_SETTINGS },
    updatedAt: now,
  }
}

export function createWorkspaceSummary(workspace: Workspace): WorkspaceSummary {
  return {
    createdAt: workspace.createdAt,
    id: workspace.id,
    name: workspace.name,
    updatedAt: workspace.updatedAt,
  }
}

export function sortWorkspaceSummaries(workspaces: WorkspaceSummary[]) {
  return [...workspaces].sort((left, right) => right.updatedAt - left.updatedAt)
}

export function normalizeWorkspaceSettings(
  current: WorkspaceSettings,
  patch: Partial<WorkspaceSettings>,
): WorkspaceSettings {
  const includeExts = patch.includeExts
    ? patch.includeExts.map((extension) => extension.trim().toLowerCase()).filter(Boolean)
    : current.includeExts

  const normalizedIncludeExts = includeExts.map((extension) =>
    extension.startsWith('.') ? extension : `.${extension}`,
  )

  const includeAllExts = patch.includeAllExts ?? current.includeAllExts

  return {
    ...current,
    ...patch,
    includeAllExts,
    includeExts: includeAllExts ? [] : normalizedIncludeExts,
    outputFileName: sanitizeOutputFileName(patch.outputFileName ?? current.outputFileName),
    previewMaxChars: Math.max(1, patch.previewMaxChars ?? current.previewMaxChars),
    separatorTemplate:
      (patch.separatorTemplate ?? current.separatorTemplate).trim() || current.separatorTemplate,
  }
}
