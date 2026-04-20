import { create } from 'zustand'
import { DEFAULT_WORKSPACE_NAME } from '../config/app'
import { mergeFilesByPath } from '../lib/file-system'
import { createId } from '../lib/id'
import { storage, STORAGE_KEYS } from '../lib/storage'
import {
  createWorkspaceRecord,
  createWorkspaceSummary,
  getNextWorkspaceName,
  makeUniqueWorkspaceName,
  normalizeWorkspaceSettings,
  sanitizeWorkspaceName,
  sortWorkspaceSummaries,
} from '../lib/workspace'
import type { VfsFile, Workspace, WorkspaceSummary } from '../types'

type WorkspaceState = {
  hydrated: boolean
  activeWorkspaceId: string | null
  workspaces: WorkspaceSummary[]
  workspaceById: Record<string, Workspace | undefined>
  hydrate: () => Promise<void>
  setActiveWorkspaceId: (id: string) => void
  ensureWorkspaceLoaded: (id: string) => Promise<void>
  createWorkspace: (name?: string) => Promise<string>
  renameWorkspace: (id: string, name: string) => Promise<void>
  deleteWorkspace: (id: string) => Promise<void>
  upsertFiles: (workspaceId: string, files: VfsFile[]) => Promise<void>
  removeFile: (workspaceId: string, fileId: string) => Promise<void>
  clearFiles: (workspaceId: string) => Promise<void>
  updateSettings: (workspaceId: string, patch: Partial<Workspace['settings']>) => Promise<void>
}

async function saveWorkspaceIndex(index: WorkspaceSummary[]) {
  await storage.setItem(STORAGE_KEYS.workspacesIndex, index)
}

async function saveWorkspace(workspace: Workspace) {
  await storage.setItem(STORAGE_KEYS.workspace(workspace.id), workspace)
}

async function loadWorkspaceIndex() {
  return storage.getItem<WorkspaceSummary[]>(STORAGE_KEYS.workspacesIndex)
}

async function loadWorkspace(id: string) {
  return storage.getItem<Workspace>(STORAGE_KEYS.workspace(id))
}

function normalizeWorkspaceIndexNames(index: WorkspaceSummary[]) {
  const normalized: WorkspaceSummary[] = []
  const renamed: Array<{ id: string; name: string }> = []

  for (const workspace of index) {
    let candidateName = workspace.name.trim() || DEFAULT_WORKSPACE_NAME

    if (candidateName.toLowerCase() === 'my workspace') {
      candidateName = getNextWorkspaceName(normalized)
    }

    const uniqueName = makeUniqueWorkspaceName(candidateName, normalized)
    if (uniqueName !== workspace.name) {
      renamed.push({ id: workspace.id, name: uniqueName })
    }

    normalized.push({
      ...workspace,
      name: uniqueName,
    })
  }

  return { normalized, renamed }
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  hydrated: false,
  activeWorkspaceId: null,
  workspaces: [],
  workspaceById: {},

  hydrate: async () => {
    if (get().hydrated) return

    const rawIndex = sortWorkspaceSummaries((await loadWorkspaceIndex()) ?? [])
    const { normalized: index, renamed } = normalizeWorkspaceIndexNames(rawIndex)

    if (renamed.length > 0) {
      await saveWorkspaceIndex(index)

      for (const rename of renamed) {
        const workspace = await loadWorkspace(rename.id)
        if (!workspace) continue
        await saveWorkspace({ ...workspace, name: rename.name })
      }
    }

    const primaryWorkspaceId = index[0]?.id ?? null
    const workspaceById: WorkspaceState['workspaceById'] = {}

    if (primaryWorkspaceId) {
      const primaryWorkspace = await loadWorkspace(primaryWorkspaceId)
      if (primaryWorkspace) {
        workspaceById[primaryWorkspaceId] = primaryWorkspace
      }
    }

    set({
      activeWorkspaceId: primaryWorkspaceId,
      hydrated: true,
      workspaceById,
      workspaces: index,
    })

    if (!primaryWorkspaceId) {
      const workspaceId = await get().createWorkspace(DEFAULT_WORKSPACE_NAME)
      get().setActiveWorkspaceId(workspaceId)
    }
  },

  setActiveWorkspaceId: (id) => {
    set({ activeWorkspaceId: id })
  },

  ensureWorkspaceLoaded: async (id) => {
    if (get().workspaceById[id]) return

    const workspace = await loadWorkspace(id)
    if (!workspace) return

    set((state) => ({
      workspaceById: {
        ...state.workspaceById,
        [id]: workspace,
      },
    }))
  },

  createWorkspace: async (name) => {
    const id = createId('ws')
    const sanitizedName = sanitizeWorkspaceName(name, DEFAULT_WORKSPACE_NAME)
    const uniqueName = makeUniqueWorkspaceName(sanitizedName, get().workspaces)
    const workspace = createWorkspaceRecord(id, uniqueName)
    const nextIndex = sortWorkspaceSummaries([
      createWorkspaceSummary(workspace),
      ...get().workspaces.filter((item) => item.id !== id),
    ])

    set((state) => ({
      activeWorkspaceId: state.activeWorkspaceId ?? id,
      workspaceById: {
        ...state.workspaceById,
        [id]: workspace,
      },
      workspaces: nextIndex,
    }))

    await saveWorkspace(workspace)
    await saveWorkspaceIndex(nextIndex)
    return id
  },

  renameWorkspace: async (id, name) => {
    const existing = get().workspaceById[id] ?? (await loadWorkspace(id))
    if (!existing) return

    const now = Date.now()
    const workspace: Workspace = {
      ...existing,
      name: sanitizeWorkspaceName(name, existing.name),
      updatedAt: now,
    }

    const nextIndex = sortWorkspaceSummaries(
      get().workspaces.map((item) =>
        item.id === id ? { ...item, name: workspace.name, updatedAt: now } : item,
      ),
    )

    set((state) => ({
      workspaceById: {
        ...state.workspaceById,
        [id]: workspace,
      },
      workspaces: nextIndex,
    }))

    await saveWorkspace(workspace)
    await saveWorkspaceIndex(nextIndex)
  },

  deleteWorkspace: async (id) => {
    const nextIndex = get().workspaces.filter((workspace) => workspace.id !== id)
    const nextWorkspaceById = { ...get().workspaceById }
    delete nextWorkspaceById[id]

    const nextActiveWorkspaceId =
      get().activeWorkspaceId === id ? (nextIndex[0]?.id ?? null) : get().activeWorkspaceId

    set({
      activeWorkspaceId: nextActiveWorkspaceId,
      workspaceById: nextWorkspaceById,
      workspaces: nextIndex,
    })

    await storage.removeItem(STORAGE_KEYS.workspace(id))
    await saveWorkspaceIndex(nextIndex)

    if (!nextActiveWorkspaceId) {
      const workspaceId = await get().createWorkspace(DEFAULT_WORKSPACE_NAME)
      get().setActiveWorkspaceId(workspaceId)
    }
  },

  upsertFiles: async (workspaceId, files) => {
    const existing = get().workspaceById[workspaceId] ?? (await loadWorkspace(workspaceId))
    if (!existing) return

    const now = Date.now()
    const workspace: Workspace = {
      ...existing,
      files: mergeFilesByPath(existing.files, files),
      updatedAt: now,
    }

    const nextIndex = sortWorkspaceSummaries(
      get().workspaces.map((item) =>
        item.id === workspaceId ? { ...item, updatedAt: now } : item,
      ),
    )

    set((state) => ({
      workspaceById: {
        ...state.workspaceById,
        [workspaceId]: workspace,
      },
      workspaces: nextIndex,
    }))

    await saveWorkspace(workspace)
    await saveWorkspaceIndex(nextIndex)
  },

  removeFile: async (workspaceId, fileId) => {
    const existing = get().workspaceById[workspaceId] ?? (await loadWorkspace(workspaceId))
    if (!existing) return

    const now = Date.now()
    const workspace: Workspace = {
      ...existing,
      files: existing.files.filter((file) => file.id !== fileId),
      updatedAt: now,
    }

    const nextIndex = sortWorkspaceSummaries(
      get().workspaces.map((item) =>
        item.id === workspaceId ? { ...item, updatedAt: now } : item,
      ),
    )

    set((state) => ({
      workspaceById: {
        ...state.workspaceById,
        [workspaceId]: workspace,
      },
      workspaces: nextIndex,
    }))

    await saveWorkspace(workspace)
    await saveWorkspaceIndex(nextIndex)
  },

  clearFiles: async (workspaceId) => {
    const existing = get().workspaceById[workspaceId] ?? (await loadWorkspace(workspaceId))
    if (!existing) return

    const now = Date.now()
    const workspace: Workspace = {
      ...existing,
      files: [],
      updatedAt: now,
    }

    const nextIndex = sortWorkspaceSummaries(
      get().workspaces.map((item) =>
        item.id === workspaceId ? { ...item, updatedAt: now } : item,
      ),
    )

    set((state) => ({
      workspaceById: {
        ...state.workspaceById,
        [workspaceId]: workspace,
      },
      workspaces: nextIndex,
    }))

    await saveWorkspace(workspace)
    await saveWorkspaceIndex(nextIndex)
  },

  updateSettings: async (workspaceId, patch) => {
    const existing = get().workspaceById[workspaceId] ?? (await loadWorkspace(workspaceId))
    if (!existing) return

    const now = Date.now()
    const workspace: Workspace = {
      ...existing,
      settings: normalizeWorkspaceSettings(existing.settings, patch),
      updatedAt: now,
    }

    const nextIndex = sortWorkspaceSummaries(
      get().workspaces.map((item) =>
        item.id === workspaceId ? { ...item, updatedAt: now } : item,
      ),
    )

    set((state) => ({
      workspaceById: {
        ...state.workspaceById,
        [workspaceId]: workspace,
      },
      workspaces: nextIndex,
    }))

    await saveWorkspace(workspace)
    await saveWorkspaceIndex(nextIndex)
  },
}))
