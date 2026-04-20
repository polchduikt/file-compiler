type BrowserFileWithRelativePath = File & { webkitRelativePath?: string }

export type FolderTreeFileEntry = {
  id: string
  name: string
  path: string
  file: File
}

export type FolderTreeNode = {
  id: string
  name: string
  path: string
  kind: 'directory' | 'file'
  children: FolderTreeNode[]
  fileId?: string
}

export type FolderTreeResult = {
  entries: FolderTreeFileEntry[]
  root: FolderTreeNode
}

function resolveRelativePath(file: File) {
  const withRelativePath = file as BrowserFileWithRelativePath
  const path = withRelativePath.webkitRelativePath?.trim()
  return path && path.length > 0 ? path : file.name
}

function createDirectoryNode(path: string, name: string): FolderTreeNode {
  return {
    children: [],
    id: `dir:${path || '/'}`,
    kind: 'directory',
    name,
    path,
  }
}

function sortNodes(node: FolderTreeNode) {
  node.children.sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind === 'directory' ? -1 : 1
    }
    return left.name.localeCompare(right.name)
  })

  for (const child of node.children) {
    if (child.kind === 'directory') {
      sortNodes(child)
    }
  }
}

export function createFolderTree(files: File[]): FolderTreeResult {
  const root = createDirectoryNode('', 'root')
  const entries: FolderTreeFileEntry[] = files.map((file) => {
    const path = resolveRelativePath(file).replaceAll('\\', '/')
    return {
      file,
      id: `file:${path}`,
      name: path.split('/').at(-1) || file.name,
      path,
    }
  })

  const directoriesByPath = new Map<string, FolderTreeNode>()
  directoriesByPath.set('', root)

  for (const entry of entries) {
    const parts = entry.path.split('/').filter(Boolean)
    if (parts.length === 0) continue

    const fileName = parts[parts.length - 1]
    const directoryParts = parts.slice(0, -1)
    let currentPath = ''
    let parent = root

    for (const segment of directoryParts) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment
      let node = directoriesByPath.get(currentPath)
      if (!node) {
        node = createDirectoryNode(currentPath, segment)
        directoriesByPath.set(currentPath, node)
        parent.children.push(node)
      }
      parent = node
    }

    parent.children.push({
      children: [],
      fileId: entry.id,
      id: entry.id,
      kind: 'file',
      name: fileName,
      path: entry.path,
    })
  }

  sortNodes(root)
  return { entries, root }
}

export function collectFileIds(node: FolderTreeNode): string[] {
  if (node.kind === 'file') {
    return node.fileId ? [node.fileId] : []
  }

  const result: string[] = []
  for (const child of node.children) {
    result.push(...collectFileIds(child))
  }
  return result
}
