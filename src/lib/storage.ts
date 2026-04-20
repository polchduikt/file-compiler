import localForage from 'localforage'
import { STORAGE_NAMESPACE, STORAGE_VERSION } from '../config/app'

export const storage = localForage.createInstance({
  name: STORAGE_NAMESPACE,
  storeName: 'app',
  description: 'Browser-only storage for workspaces and files',
})

export const STORAGE_KEYS = {
  workspacesIndex: `workspaces:index:${STORAGE_VERSION}`,
  workspace: (id: string) => `workspace:${id}:${STORAGE_VERSION}`,
} as const
