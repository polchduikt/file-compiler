import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Dropzone } from './components/Dropzone'
import { DocumentationPage } from './components/DocumentationPage'
import { FileList } from './components/FileList'
import { OptionsPanel } from './components/OptionsPanel'
import { PreviewPanel } from './components/PreviewPanel'
import { ProjectTreeModal } from './components/ProjectTreeModal'
import { RenameWorkspaceModal } from './components/RenameWorkspaceModal'
import { useMergeResult } from './hooks/useMergeResult'
import { useI18n } from './i18n/useI18n'
import { downloadTextAsFile, downloadTextAsZip } from './lib/download'
import { ingestFiles } from './lib/ingest'
import { resolveDownloadPlan, resolvePreviewValue } from './lib/merge'
import { appPathToBrowserPath, buildLocalizedPath, resolveRoute, type AppPage } from './lib/routing'
import { buildWorkspaceBackupFilename, serializeWorkspaceBackup } from './lib/workspace-backup'
import { getNextWorkspaceName } from './lib/workspace'
import { useWorkspaceStore } from './store/workspaceStore'
import type { Locale } from './i18n/translations'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'file-compiler:theme:v1'
const WORKSPACE_NAME_RE = /^workspace\s+(\d+)$/i
const APP_BASE_PATH = import.meta.env.BASE_URL || '/'

function detectTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const persisted = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (persisted === 'light' || persisted === 'dark') {
    return persisted
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function localizeWorkspaceName(name: string, prefix: string) {
  const match = name.trim().match(WORKSPACE_NAME_RE)
  if (!match) return name
  return `${prefix} ${match[1]}`
}

function App() {
  const { locale, setLocale, t } = useI18n()
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
  const [theme, setTheme] = useState<Theme>(() => detectTheme())
  const [activePage, setActivePage] = useState<AppPage>('app')
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

  useEffect(() => {
    document.title =
      activePage === 'docs' ? `${t('nav.documentation')} - ${t('app.title')}` : t('meta.title')
    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute(
        'content',
        activePage === 'docs' ? t('docs.metaDescription') : t('meta.description'),
      )
    }

    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const canonicalPath = buildLocalizedPath(locale, activePage)
    const canonicalUrl = new URL(canonicalPath, window.location.origin).toString()
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl)
    }

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl)
    }
  }, [activePage, locale, t])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    root.style.colorScheme = theme

    window.localStorage.setItem(THEME_STORAGE_KEY, theme)

    const themeColorTag = document.querySelector('meta[name="theme-color"]')
    if (themeColorTag) {
      themeColorTag.setAttribute('content', theme === 'dark' ? '#020817' : '#f8fafc')
    }
  }, [theme])

  const previewValue = useMemo(
    () => resolvePreviewValue(mergeResult, workspace?.settings.previewMaxChars),
    [mergeResult, workspace?.settings.previewMaxChars],
  )
  const localizedWorkspacePrefix = t('workspace.defaultPrefix')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const syncRouteWithLocation = () => {
      const route = resolveRoute(window.location.pathname, locale, window.location.hash, APP_BASE_PATH)
      setActivePage(route.page)
      if (route.locale !== locale) {
        setLocale(route.locale)
      }

      const canonicalBrowserPath = appPathToBrowserPath(route.path, APP_BASE_PATH)
      if (window.location.pathname !== canonicalBrowserPath || window.location.hash) {
        window.history.replaceState(
          null,
          '',
          `${canonicalBrowserPath}${window.location.search}`,
        )
      }
    }

    syncRouteWithLocation()
    window.addEventListener('popstate', syncRouteWithLocation)
    return () => window.removeEventListener('popstate', syncRouteWithLocation)
  }, [locale, setLocale])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(t('workspace.error.copy'), error)
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

  const handleOpenRenameWorkspace = () => {
    if (!workspaceId) return
    setRenameWorkspaceId(workspaceId)
  }

  const handleConfirmRenameWorkspace = async (name: string) => {
    if (!renameWorkspaceId) return
    await renameWorkspace(renameWorkspaceId, name)
    setRenameWorkspaceId(null)
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
      setActiveWorkspaceId(importedWorkspaceId)
      await ensureWorkspaceLoaded(importedWorkspaceId)
      setIngestError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setIngestError(t('workspace.import.failed', { message }))
    }
  }

  const handleOpenProjectTree = (files: File[]) => {
    setProjectTreeFiles(files)
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

  const handleSwitchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return
    setLocale(nextLocale)
    const nextAppPath = buildLocalizedPath(nextLocale, activePage)
    const nextBrowserPath = appPathToBrowserPath(nextAppPath, APP_BASE_PATH)
    if (window.location.pathname !== nextBrowserPath || window.location.hash) {
      window.history.pushState(null, '', `${nextBrowserPath}${window.location.search}`)
    }
  }

  const handleNavigatePage = (nextPage: AppPage) => {
    setActivePage(nextPage)
    const nextAppPath = buildLocalizedPath(locale, nextPage)
    const nextBrowserPath = appPathToBrowserPath(nextAppPath, APP_BASE_PATH)
    if (window.location.pathname !== nextBrowserPath || window.location.hash) {
      window.history.pushState(null, '', `${nextBrowserPath}${window.location.search}`)
    }
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
              <button
                type="button"
                className="text-lg font-bold tracking-tight hover:text-indigo-300"
                title={t('tooltip.navHome')}
                onClick={() => handleNavigatePage('app')}
              >
                {t('app.title')}
              </button>
              <div className="ml-2 flex items-center gap-2">
                <button
                  type="button"
                  className={activePage === 'docs' ? 'btn btn-primary h-9 px-3' : 'btn h-9 px-3'}
                  title={t('tooltip.navDocs')}
                  onClick={() => handleNavigatePage('docs')}
                >
                  {t('nav.documentation')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="segmented-control" role="group" aria-label={t('language.label')}>
              <button
                type="button"
                className={locale === 'en' ? 'segment is-active' : 'segment'}
                title={t('tooltip.langEn')}
                onClick={() => handleSwitchLocale('en')}
              >
                {t('language.short.en')}
              </button>
              <button
                type="button"
                className={locale === 'uk' ? 'segment is-active' : 'segment'}
                title={t('tooltip.langUk')}
                onClick={() => handleSwitchLocale('uk')}
              >
                {t('language.short.uk')}
              </button>
            </div>

            <div className="segmented-control" role="group" aria-label={t('theme.label')}>
              <button
                type="button"
                className={theme === 'light' ? 'segment is-active' : 'segment'}
                title={t('tooltip.themeLight')}
                onClick={() => setTheme('light')}
              >
                {t('theme.light')}
              </button>
              <button
                type="button"
                className={theme === 'dark' ? 'segment is-active' : 'segment'}
                title={t('tooltip.themeDark')}
                onClick={() => setTheme('dark')}
              >
                {t('theme.dark')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {activePage === 'docs' ? (
        <main className="min-h-0 flex-1 overflow-auto p-6">
          <DocumentationPage />
        </main>
      ) : (
        <div className="flex min-h-0 flex-1 gap-6 overflow-hidden p-6">
          <aside className="flex w-80 flex-col gap-6 overflow-y-auto">
            <Dropzone
              disabled={!hydrated || !workspaceId}
              onOpenProjectTree={handleOpenProjectTree}
              onFiles={async (files) => {
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
            <section className="rounded-xl border border-slate-300 bg-white p-4 shadow dark:border-white/15 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <select
                    className="input w-44"
                    disabled={!hydrated || workspaces.length === 0}
                    title={t('tooltip.workspaceSelect')}
                    value={workspaceId ?? ''}
                    onChange={async (event) => {
                      const id = event.target.value
                      if (!id) return
                      await handleSelectWorkspace(id)
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
                    onClick={handleOpenRenameWorkspace}
                  >
                    {t('actions.rename')}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger shrink-0"
                    disabled={!hydrated || !workspaceId || workspaces.length <= 1}
                    title={
                      workspaces.length <= 1
                        ? t('workspace.delete.disabled')
                        : t('tooltip.deleteWorkspace')
                    }
                    onClick={() => void handleDeleteWorkspace()}
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
                    disabled={!workspace?.settings.outputFileName || !mergeResult?.mergedText}
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
