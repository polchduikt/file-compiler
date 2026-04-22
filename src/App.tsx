import { useMemo } from 'react'
import { AboutPage } from './components/AboutPage'
import { DocumentationPage } from './components/DocumentationPage'
import { Dropzone } from './components/Dropzone'
import { FileList } from './components/FileList'
import { LandingPage } from './components/LandingPage'
import { OptionsPanel } from './components/OptionsPanel'
import { PreviewPanel } from './components/PreviewPanel'
import { ProjectTreeModal } from './components/ProjectTreeModal'
import { RenameWorkspaceModal } from './components/RenameWorkspaceModal'
import { AppHeader } from './components/AppHeader'
import { useAppChrome } from './hooks/useAppChrome'
import { useWorkspaceController } from './hooks/useWorkspaceController'
import { useI18n } from './i18n/useI18n'
import { localizeWorkspaceName } from './lib/workspaceDisplay'

function App() {
  const { locale, setLocale, t } = useI18n()
  const { activePage, handleNavigatePage, handleSwitchLocale, setTheme, theme } = useAppChrome({
    locale,
    setLocale,
  })
  const {
    clearFiles,
    copied,
    handleConfirmProjectTree,
    handleConfirmRenameWorkspace,
    handleCopy,
    handleCreateWorkspace,
    handleDeleteWorkspace,
    handleDownload,
    handleExportWorkspace,
    handleImportWorkspace,
    handleIngestFiles,
    hydrated,
    importInputRef,
    ingestError,
    loadWorkspaceData,
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
    workspacesCount,
  } = useWorkspaceController(t)

  const localizedWorkspacePrefix = useMemo(() => t('workspace.defaultPrefix'), [t])

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      <AppHeader
        activePage={activePage}
        locale={locale}
        onNavigatePage={handleNavigatePage}
        onSwitchLocale={handleSwitchLocale}
        onThemeChange={setTheme}
        t={t}
        theme={theme}
      />

      {activePage === 'about' ? (
        <main className="min-h-0 flex-1 overflow-auto p-6">
          <AboutPage />
        </main>
      ) : activePage === 'docs' ? (
        <main className="min-h-0 flex-1 overflow-auto p-6">
          <DocumentationPage />
        </main>
      ) : activePage === 'chatgptContext' || activePage === 'mergeCodeFiles' ? (
        <main className="min-h-0 flex-1 overflow-auto p-6">
          <LandingPage page={activePage} />
        </main>
      ) : (
        <div className="flex min-h-0 flex-1 gap-6 overflow-hidden p-6">
          <aside className="flex w-80 flex-col gap-6 overflow-y-auto">
            <Dropzone
              disabled={!hydrated || !workspaceId}
              onOpenProjectTree={setProjectTreeFiles}
              onFiles={handleIngestFiles}
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
            <section className="rounded-xl border border-slate-300 bg-white p-4 shadow dark:border-white/15 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <select
                    className="input w-44"
                    disabled={!hydrated || workspacesCount === 0}
                    title={t('tooltip.workspaceSelect')}
                    value={workspaceId ?? ''}
                    onChange={async (event) => {
                      const id = event.target.value
                      if (!id) return
                      await loadWorkspaceData(id)
                    }}
                  >
                    {workspaces.map((item) => (
                      <option key={item.id} value={item.id}>
                        {localizeWorkspaceName(item.name, localizedWorkspacePrefix)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-primary shrink-0"
                    disabled={!hydrated}
                    title={t('tooltip.newWorkspace')}
                    onClick={() => void handleCreateWorkspace()}
                  >
                    {t('actions.new')}
                  </button>

                  <button
                    type="button"
                    className="btn shrink-0"
                    disabled={!hydrated || !workspaceId}
                    title={t('tooltip.renameWorkspace')}
                    onClick={() => workspaceId && setRenameWorkspaceId(workspaceId)}
                  >
                    {t('actions.rename')}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger shrink-0"
                    disabled={!hydrated || !workspaceId || workspacesCount <= 1}
                    title={
                      workspacesCount <= 1
                        ? t('workspace.delete.disabled')
                        : t('tooltip.deleteWorkspace')
                    }
                    onClick={() => void handleDeleteWorkspace(localizedWorkspacePrefix)}
                  >
                    {t('actions.delete')}
                  </button>

                  <button
                    type="button"
                    className="btn shrink-0"
                    disabled={!hydrated || !workspaceId || !workspace}
                    title={t('tooltip.exportWorkspace')}
                    onClick={() => void handleExportWorkspace()}
                  >
                    {t('actions.export')}
                  </button>

                  <button
                    type="button"
                    className="btn shrink-0"
                    disabled={!hydrated}
                    title={t('tooltip.importWorkspace')}
                    onClick={() => importInputRef.current?.click()}
                  >
                    {t('actions.import')}
                  </button>

                  <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(event) => void handleImportWorkspace(event)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={!previewValue}
                    onClick={() => void handleCopy()}
                    title={t('tooltip.copyOutput')}
                  >
                    {copied ? t('actions.copied') : t('actions.copy')}
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!workspace?.settings.outputFileName}
                    title={t('tooltip.downloadOutput')}
                    onClick={() => void handleDownload()}
                  >
                    {t('actions.download')}
                  </button>
                </div>
              </div>
            </section>

            {mergeError ? (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
                {t(mergeError)}
              </div>
            ) : null}

            <div className="grid min-h-0 flex-1 gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <FileList
                files={workspace?.files}
                onClear={() => {
                  if (!workspaceId) return
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
      )}

      {projectTreeFiles ? (
        <ProjectTreeModal
          files={projectTreeFiles}
          onCancel={() => setProjectTreeFiles(null)}
          onConfirm={handleConfirmProjectTree}
        />
      ) : null}

      {renameWorkspaceId ? (
        <RenameWorkspaceModal
          initialName={workspaces.find((item) => item.id === renameWorkspaceId)?.name ?? ''}
          onCancel={() => setRenameWorkspaceId(null)}
          onSave={handleConfirmRenameWorkspace}
        />
      ) : null}
    </div>
  )
}

export default App
