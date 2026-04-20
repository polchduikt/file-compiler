import { useMemo, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n/useI18n'
import { collectFileIds, createFolderTree, type FolderTreeNode } from '../lib/folder-tree'

type ProjectTreeModalProps = {
  files: File[]
  onCancel: () => void
  onConfirm: (selectedFiles: File[]) => void | Promise<void>
}

type CheckState = 'checked' | 'indeterminate' | 'unchecked'

function resolveCheckState(node: FolderTreeNode, selectedIds: Set<string>): CheckState {
  const fileIds = collectFileIds(node)
  if (fileIds.length === 0) return 'unchecked'

  let selectedCount = 0
  for (const id of fileIds) {
    if (selectedIds.has(id)) {
      selectedCount += 1
    }
  }

  if (selectedCount === 0) return 'unchecked'
  if (selectedCount === fileIds.length) return 'checked'
  return 'indeterminate'
}

function collectExpandedDirectoryIds(root: FolderTreeNode) {
  const expanded = new Set<string>()
  const stack: FolderTreeNode[] = [root]
  while (stack.length > 0) {
    const current = stack.pop()
    if (!current || current.kind !== 'directory') continue
    expanded.add(current.id)
    for (const child of current.children) {
      if (child.kind === 'directory') {
        stack.push(child)
      }
    }
  }
  return expanded
}

export function ProjectTreeModal({ files, onCancel, onConfirm }: ProjectTreeModalProps) {
  const { t } = useI18n()
  const { entries, root } = useMemo(() => createFolderTree(files), [files])
  const allFileIds = useMemo(() => entries.map((entry) => entry.id), [entries])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(allFileIds))
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => collectExpandedDirectoryIds(root))
  const [submitting, setSubmitting] = useState(false)

  const filesById = new Map(entries.map((entry) => [entry.id, entry.file]))

  const toggleNodeSelection = (node: FolderTreeNode) => {
    const nodeFileIds = collectFileIds(node)
    if (nodeFileIds.length === 0) return

    setSelectedIds((previous) => {
      const next = new Set(previous)
      const allSelected = nodeFileIds.every((id) => next.has(id))

      if (allSelected) {
        for (const id of nodeFileIds) {
          next.delete(id)
        }
      } else {
        for (const id of nodeFileIds) {
          next.add(id)
        }
      }

      return next
    })
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectedFiles = entries
    .filter((entry) => selectedIds.has(entry.id))
    .map((entry) => filesById.get(entry.id))
    .filter((file): file is File => Boolean(file))

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onConfirm(selectedFiles)
    } finally {
      setSubmitting(false)
    }
  }

  const renderNode = (node: FolderTreeNode, depth: number): ReactNode => {
    if (node.kind === 'file') {
      return (
        <li key={node.id}>
          <label
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(node.fileId ?? '')}
              title={t('tooltip.treeToggleSelect')}
              onChange={() => toggleNodeSelection(node)}
            />
            <span className="truncate text-sm">{node.name}</span>
          </label>
        </li>
      )
    }

    const isExpanded = expandedIds.has(node.id)
    const checkState = resolveCheckState(node, selectedIds)

    return (
      <li key={node.id}>
        <div
          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <button
            type="button"
            className="h-5 w-5 rounded border border-slate-300 text-xs dark:border-white/20"
            title={t('tooltip.treeToggleFolder')}
            onClick={() => toggleExpanded(node.id)}
          >
            {isExpanded ? '-' : '+'}
          </button>
          <input
            type="checkbox"
            checked={checkState === 'checked'}
            title={t('tooltip.treeToggleSelect')}
            ref={(element) => {
              if (element) {
                element.indeterminate = checkState === 'indeterminate'
              }
            }}
            onChange={() => toggleNodeSelection(node)}
          />
          <span className="truncate text-sm font-medium">{node.name}</span>
        </div>

        {isExpanded && node.children.length > 0 ? (
          <ul>{node.children.map((child) => renderNode(child, depth + 1))}</ul>
        ) : null}
      </li>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl dark:border-white/15 dark:bg-[#0b1025]">
        <header className="border-b border-slate-300 p-4 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{t('tree.title')}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t('tree.subtitle')}</p>
            </div>
            <div className="chip">{t('tree.selectedCount', { count: selectedFiles.length })}</div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 gap-4 p-4">
          <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-300 dark:border-white/10">
            <div className="flex items-center justify-between border-b border-slate-300 px-4 py-3 dark:border-white/10">
              <h3 className="text-sm font-semibold">{t('tree.projectFiles')}</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn h-8 px-3 py-1"
                  title={t('tooltip.treeSelectAll')}
                  onClick={() => setSelectedIds(new Set(allFileIds))}
                >
                  {t('tree.selectAll')}
                </button>
                <button
                  type="button"
                  className="btn h-8 px-3 py-1"
                  title={t('tooltip.treeClearAll')}
                  onClick={() => setSelectedIds(new Set())}
                >
                  {t('tree.clearAll')}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-2">
              {root.children.length === 0 ? (
                <div className="p-4 text-sm text-slate-600 dark:text-slate-300">
                  {t('tree.empty')}
                </div>
              ) : (
                <ul>{root.children.map((node) => renderNode(node, 0))}</ul>
              )}
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-300 p-4 dark:border-white/10">
          <button
            type="button"
            className="btn"
            disabled={submitting}
            title={t('tooltip.treeCancel')}
            onClick={onCancel}
          >
            {t('tree.cancel')}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={submitting || selectedFiles.length === 0}
            title={t('tooltip.treeApply')}
            onClick={() => void handleConfirm()}
          >
            {t('tree.apply')}
          </button>
        </footer>
      </div>
    </div>
  )
}
