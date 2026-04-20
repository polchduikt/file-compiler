export type VfsFile = {
  id: string
  name: string
  path: string
  ext: string
  mime: string
  size: number
  lastModified: number
  isText: boolean
  text?: string
}

export type MergeOptions = {
  includeExts: string[]
  addSeparators: boolean
  separatorTemplate: string
  newline: '\n' | '\r\n'
}

export type MergeResult = {
  mergedText: string
  includedCount: number
  skippedCount: number
  totalInputBytes: number
}

export type MergeRequestFile = Pick<VfsFile, 'path' | 'name' | 'ext' | 'size' | 'isText' | 'text'>

export type MergeRequest = {
  requestId: number
  files: MergeRequestFile[]
  options: MergeOptions
}

export type MergeResponse = {
  requestId: number
  result: MergeResult
}

export type WorkspaceSettings = {
  includeExts: string[]
  includeAllExts: boolean
  addSeparators: boolean
  separatorTemplate: string
  outputFileName: string
  zipOutput: boolean
  newline: '\n' | '\r\n'
  previewMaxChars: number
}

export type Workspace = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  files: VfsFile[]
  settings: WorkspaceSettings
}

export type WorkspaceSummary = Pick<Workspace, 'id' | 'name' | 'createdAt' | 'updatedAt'>
