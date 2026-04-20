import type { VfsFile, WorkspaceSettings } from '../types'

export type DropzoneProps = {
  disabled?: boolean
  onFiles: (files: FileList | File[]) => void | Promise<void>
  onOpenProjectTree?: (files: File[]) => void | Promise<void>
}

export type FileListProps = {
  files?: VfsFile[]
  onClear: () => void | Promise<void>
  onRemove: (fileId: string) => void | Promise<void>
}

export type OptionsPanelProps = {
  settings?: WorkspaceSettings
  onChange: (patch: Partial<WorkspaceSettings>) => void | Promise<void>
}

export type PreviewPanelProps = {
  value: string
  files?: Array<{ ext: string; name: string }>
}
