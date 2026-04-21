import { STORAGE_KEYS, storage } from '../lib/storage'
import type { Workspace, WorkspaceSummary } from '../types'

export type WorkspaceRepository = {
  getWorkspaceIndex: () => Promise<WorkspaceSummary[] | null>
  setWorkspaceIndex: (index: WorkspaceSummary[]) => Promise<void>
  getWorkspace: (id: string) => Promise<Workspace | null>
  setWorkspace: (workspace: Workspace) => Promise<void>
  removeWorkspace: (id: string) => Promise<void>
}

export const workspaceRepository: WorkspaceRepository = {
  getWorkspaceIndex: () => storage.getItem<WorkspaceSummary[]>(STORAGE_KEYS.workspacesIndex),
  setWorkspaceIndex: async (index) => {
    await storage.setItem(STORAGE_KEYS.workspacesIndex, index)
  },
  getWorkspace: (id) => storage.getItem<Workspace>(STORAGE_KEYS.workspace(id)),
  setWorkspace: async (workspace) => {
    await storage.setItem(STORAGE_KEYS.workspace(workspace.id), workspace)
  },
  removeWorkspace: async (id) => {
    await storage.removeItem(STORAGE_KEYS.workspace(id))
  },
}
