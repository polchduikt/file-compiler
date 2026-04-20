import type { VfsFile } from '../types'

export function normalizeExtension(extension: string) {
  const normalized = extension.trim().toLowerCase()
  if (!normalized) return ''
  return normalized.startsWith('.') ? normalized : `.${normalized}`
}

export function getExtensionFromPath(path: string) {
  const filename = path.split('/').pop() ?? path
  const separatorIndex = filename.lastIndexOf('.')
  if (separatorIndex <= 0) return ''
  return normalizeExtension(filename.slice(separatorIndex))
}

export function normalizeVirtualPath(path: string) {
  return (path || '').replaceAll('\\', '/').replace(/^\/+/, '') || ''
}

export function getRelativePathFromFile(file: File) {
  const fileWithRelativePath = file as File & { webkitRelativePath?: string }
  return normalizeVirtualPath(fileWithRelativePath.webkitRelativePath || file.name)
}

export function mergeFilesByPath(existing: VfsFile[], incoming: VfsFile[]) {
  const filesByPath = new Map(existing.map((file) => [file.path, file]))
  for (const file of incoming) {
    filesByPath.set(file.path, file)
  }

  return [...filesByPath.values()].sort((left, right) => left.path.localeCompare(right.path))
}
