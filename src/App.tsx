import { useEffect, useMemo, useState } from 'react'
import { Dropzone } from './components/Dropzone'
import { FileList } from './components/FileList'
import { OptionsPanel } from './components/OptionsPanel'
import { PreviewPanel } from './components/PreviewPanel'
import { useMergeResult } from './hooks/useMergeResult'
import { downloadTextAsFile, downloadTextAsZip } from './lib/download'
import { ingestFiles } from './lib/ingest'
import { resolveDownloadPlan, resolvePreviewValue } from './lib/merge'
import { getNextWorkspaceName } from './lib/workspace'
import { useWorkspaceStore } from './store/workspaceStore'

function App() {
  const hydrate = useWorkspaceStore((state) => state.hydrate)
  const hydrated = useWorkspaceStore((state) => state.hydrated)
  const workspaceId = useWorkspaceStore((state) => state.activeWorkspaceId)
  const workspaces = useWorkspaceStore((state) => state.workspaces)
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId)
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace)
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace)
  const ensureWorkspaceLoaded = useWorkspaceStore((state) => state.ensureWorkspaceLoaded)
  const workspace = useWorkspaceStore((state) =>
    workspaceId ? state.workspaceById[workspaceId] : undefined,
  )
  const upsertFiles = useWorkspaceStore((state) => state.upsertFiles)
  const removeFile = useWorkspaceStore((state) => state.removeFile)
  const clearFiles = useWorkspaceStore((state) => state.clearFiles)
  const updateSettings = useWorkspaceStore((state) => state.updateSettings)

  const [ingestError, setIngestError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { mergeError, mergeResult, reset } = useMergeResult(workspace)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy merged content', error)
    }
  }

  const handleSelectWorkspace = async (id: string) => {
    setActiveWorkspaceId(id)
    await ensureWorkspaceLoaded(id)
    setIngestError(null)
  }

  const handleCreateWorkspace = async () => {
    const newId = await createWorkspace(getNextWorkspaceName(workspaces))
    setActiveWorkspaceId(newId)
    await ensureWorkspaceLoaded(newId)
    setIngestError(null)
  }

  const handleDeleteWorkspace = async () => {
    if (!workspaceId || workspaces.length <= 1) return
    const activeWorkspace = workspaces.find((item) => item.id === workspaceId)
    const confirmed = window.confirm(`Delete workspace "${activeWorkspace?.name || 'Unnamed'}"?`)
    if (!confirmed) return

    setIngestError(null)
    reset()
    await deleteWorkspace(workspaceId)
  }

  const handleDownload = async () => {
    if (!workspace || !mergeResult?.mergedText) return

    const plan = resolveDownloadPlan(
      workspace.settings.outputFileName,
      workspace.settings.zipOutput,
    )

    if (plan.kind === 'zip') {
      await downloadTextAsZip(mergeResult.mergedText, plan.innerFilename, plan.filename)
      return
    }

    await downloadTextAsFile(mergeResult.mergedText, plan.filename)
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      <nav className="border-b border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-6 px-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <img
                src="./logo.png"
                alt="File Compiler logo"
                className="h-10 w-10 shrink-0 object-contain"
              />
              <h1 className="text-lg font-bold tracking-tight">File Compiler</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="input w-40"
              disabled={!hydrated || workspaces.length === 0}
              value={workspaceId ?? ''}
              onChange={async (event) => {
                const id = event.target.value
                if (!id) return
                await handleSelectWorkspace(id)
              }}
            >
              {workspaces.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn btn-primary"
              disabled={!hydrated}
              onClick={() => void handleCreateWorkspace()}
            >
              New
            </button>

            <button
              type="button"
              className="btn btn-danger"
              disabled={!hydrated || !workspaceId || workspaces.length <= 1}
              title={workspaces.length <= 1 ? 'Cannot delete the last workspace' : 'Delete this workspace'}
              onClick={() => void handleDeleteWorkspace()}
            >
              Delete
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn"
              disabled={!mergeResult?.mergedText && !mergeError}
              onClick={reset}
            >
              Reset
            </button>

            <button
              type="button"
              className="btn btn-success"
              disabled={!previewValue}
              onClick={() => void handleCopy()}
              title="Copy to clipboard"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              type="button"
              className="btn btn-primary"
              disabled={!workspace?.settings.outputFileName || !mergeResult?.mergedText}
              onClick={() => void handleDownload()}
            >
              Download
            </button>
          </div>
        </div>
      </nav>

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden p-6">
        <aside className="flex w-80 flex-col gap-6 overflow-y-auto">
          <Dropzone
            disabled={!hydrated || !workspaceId}
            onFiles={async (files) => {
              if (!workspaceId) return
              setIngestError(null)
              const { accepted, rejected } = await ingestFiles(files)
              if (rejected.length > 0) {
                setIngestError(`Rejected ${rejected.length} file(s). First: ${rejected[0]?.name}`)
              }
              await upsertFiles(workspaceId, accepted)
            }}
          />

          {ingestError ? (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
              {ingestError}
            </div>
          ) : null}

          <OptionsPanel
            key={workspaceId ?? 'none'}
            settings={workspace?.settings}
            onChange={(patch) => {
              if (!workspaceId) return
              return updateSettings(workspaceId, patch)
            }}
          />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
          {mergeError ? (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
              {mergeError}
            </div>
          ) : null}

          <div className="grid min-h-0 flex-1 gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <FileList
              files={workspace?.files}
              onClear={() => {
                if (!workspaceId) return
                reset()
                return clearFiles(workspaceId)
              }}
              onRemove={(fileId) => {
                if (!workspaceId) return
                return removeFile(workspaceId, fileId)
              }}
            />
            <PreviewPanel value={previewValue} files={workspace?.files} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
