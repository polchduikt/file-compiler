import type { VfsFile } from '../types'
import { getExtensionFromPath, getRelativePathFromFile } from './file-system'
import { createId } from './id'

export type IngestResult = {
  accepted: VfsFile[]
  rejected: Array<{ name: string; reason: string }>
}

function createWorkspaceFile(file: File, text: string, isText: boolean): VfsFile {
  const path = getRelativePathFromFile(file)

  return {
    ext: getExtensionFromPath(path),
    id: createId('f'),
    isText,
    lastModified: file.lastModified,
    mime: file.type || 'application/octet-stream',
    name: file.name,
    path,
    size: file.size,
    text: isText ? text : undefined,
  }
}

export async function ingestFiles(files: FileList | File[]): Promise<IngestResult> {
  const list = Array.from(files)
  const accepted: VfsFile[] = []
  const rejected: Array<{ name: string; reason: string }> = []

  for (const file of list) {
    try {
      const buffer = await file.arrayBuffer()
      const view = new Uint8Array(buffer)
      const sampleLength = Math.min(view.length, 32 * 1024)
      let suspiciousBytes = 0

      for (let index = 0; index < sampleLength; index++) {
        const byte = view[index]!
        if (byte === 0) suspiciousBytes += 3
        else if (byte < 7 || (byte > 13 && byte < 32)) suspiciousBytes += 1
      }

      const isBinary = sampleLength > 0 && suspiciousBytes / sampleLength > 0.02

      if (isBinary) {
        accepted.push(createWorkspaceFile(file, '', false))
        continue
      }

      const decoder = new TextDecoder('utf-8', { fatal: false })
      accepted.push(createWorkspaceFile(file, decoder.decode(view), true))
    } catch (error) {
      rejected.push({
        name: file.name,
        reason: error instanceof Error ? error.message : 'Failed to read file',
      })
    }
  }

  return { accepted, rejected }
}
