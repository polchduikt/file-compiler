import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { I18nContextValue } from '../i18n/context'
import { downloadTextAsFile, downloadTextAsZip } from '../lib/download'
import { ingestFiles } from '../lib/ingest'
import { resolveDownloadPlan, resolvePreviewValue } from '../lib/merge'
import { buildWorkspaceBackupFilename, serializeWorkspaceBackup } from '../lib/workspace-backup'
import { getNextWorkspaceName } from '../lib/workspace'
import { useWorkspaceStore } from '../store/workspaceStore'
import { useMergeResult } from './useMergeResult'

const WORKSPACE_NAME_RE = /^workspace\s+(\d+)$/i

function localizeWorkspaceName(name: string, prefix: string) {
  const match = name.trim().match(WORKSPACE_NAME_RE)
  if (!match) return name
  return `${prefix} ${match[1]}`
}

export function useWorkspaceController(t: I18nContextValue['t']) {
  const hydrate = useWorkspaceStore((state) => state.hydrate)
  const hydrated = useWorkspaceStore((state) => state.hydrated)
  const workspaceId = useWorkspaceStore((state) => state.activeWorkspaceId)
  const workspaces = useWorkspaceStore((state) => state.workspaces)
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId)
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace)
  const renameWorkspace = useWorkspaceStore((state) => state.renameWorkspace)
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace)
  const ensureWorkspaceLoaded = useWorkspaceStore((state) => state.ensureWorkspaceLoaded)
  const workspace = useWorkspaceStore((state) =>
    workspaceId ? state.workspaceById[workspaceId] : undefined,
  )
  const upsertFiles = useWorkspaceStore((state) => state.upsertFiles)
  const removeFile = useWorkspaceStore((state) => state.removeFile)
  const clearFiles = useWorkspaceStore((state) => state.clearFiles)
  const updateSettings = useWorkspaceStore((state) => state.updateSettings)
  const importWorkspaceBackup = useWorkspaceStore((state) => state.importWorkspaceBackup)

  const [ingestError, setIngestError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [projectTreeFiles, setProjectTreeFiles] = useState<File[] | null>(null)
  const [renameWorkspaceId, setRenameWorkspaceId] = useState<string | null>(null)
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const { mergeError, mergeResult } = useMergeResult(workspace)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  useEffect(() => {
    if (workspaceId) {
      void ensureWorkspaceLoaded(workspaceId)
    }
  }, [ensureWorkspaceLoaded, workspaceId])

  const previewValue = useMemo(
    () => resolvePreviewValue(mergeResult, workspace?.settings.previewMaxChars),
    [mergeResult, workspace?.settings.previewMaxChars],
  )

  const loadWorkspaceData = async (id: string) => {
    setActiveWorkspaceId(id)
    await ensureWorkspaceLoaded(id)
    setIngestError(null)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(t('workspace.error.copy'), error)
    }
  }

  const handleCreateWorkspace = async () => {
    const newId = await createWorkspace(getNextWorkspaceName(workspaces))
    await loadWorkspaceData(newId)
  }

  const handleDeleteWorkspace = async (localizedWorkspacePrefix: string) => {
    if (!workspaceId || workspaces.length <= 1) return
    const activeWorkspace = workspaces.find((item) => item.id === workspaceId)
    const confirmed = window.confirm(
      t('workspace.delete.confirm', {
        name: activeWorkspace
          ? localizeWorkspaceName(activeWorkspace.name, localizedWorkspacePrefix)
          : t('workspace.delete.unnamed'),
      }),
    )
    if (!confirmed) return

    setIngestError(null)
    await deleteWorkspace(workspaceId)
  }

  const handleConfirmRenameWorkspace = async (name: string) => {
    if (!renameWorkspaceId) return
    await renameWorkspace(renameWorkspaceId, name)
    setRenameWorkspaceId(null)
  }

  const handleDownload = async () => {
    if (!workspace || !mergeResult?.mergedText) return

    const plan = resolveDownloadPlan(workspace.settings.outputFileName, workspace.settings.zipOutput)

    if (plan.kind === 'zip') {
      await downloadTextAsZip(mergeResult.mergedText, plan.innerFilename, plan.filename)
      return
    }

    await downloadTextAsFile(mergeResult.mergedText, plan.filename)
  }

  const handleExportWorkspace = async () => {
    if (!workspace) return

    const backupJson = serializeWorkspaceBackup(workspace)
    await downloadTextAsFile(backupJson, buildWorkspaceBackupFilename(workspace.name))
  }

  const handleImportWorkspace = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const backupJson = await file.text()
      const importedWorkspaceId = await importWorkspaceBackup(backupJson)
      await loadWorkspaceData(importedWorkspaceId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setIngestError(t('workspace.import.failed', { message }))
    }
  }

  const handleConfirmProjectTree = async (selectedFiles: File[]) => {
    if (!workspaceId || selectedFiles.length === 0) {
      setProjectTreeFiles(null)
      return
    }

    setIngestError(null)
    const { accepted, rejected } = await ingestFiles(selectedFiles)
    if (rejected.length > 0) {
      setIngestError(
        t('workspace.rejected', {
          count: rejected.length,
          name: rejected[0]?.name ?? '',
        }),
      )
    }
    await upsertFiles(workspaceId, accepted)
    setProjectTreeFiles(null)
  }

  const handleIngestFiles = async (files: FileList | File[]) => {
    if (!workspaceId) return
    setIngestError(null)
    const { accepted, rejected } = await ingestFiles(files)
    if (rejected.length > 0) {
      setIngestError(
        t('workspace.rejected', {
          count: rejected.length,
          name: rejected[0]?.name ?? '',
        }),
      )
    }
    await upsertFiles(workspaceId, accepted)
  }

  return {
    clearFiles,
    copied,
    ensureWorkspaceLoaded,
    handleConfirmProjectTree,
    handleConfirmRenameWorkspace,
    handleCopy,
    handleCreateWorkspace,
    handleDeleteWorkspace,
    handleDownload,
    handleExportWorkspace,
    handleImportWorkspace,
    handleIngestFiles,
    hydrate,
    hydrated,
    importInputRef,
    ingestError,
    mergeError,
    previewValue,
    projectTreeFiles,
    removeFile,
    renameWorkspaceId,
    setProjectTreeFiles,
    setRenameWorkspaceId,
    updateSettings,
    workspace,
    workspaceId,
    workspaces,
    loadWorkspaceData,
    workspacesCount: workspaces.length,
  }
}
