import { useMemo } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { FileListProps } from './types'

export function FileList({ files, onClear, onRemove }: FileListProps) {
  const { t } = useI18n()
  const totalBytes = useMemo(() => files?.reduce((sum, file) => sum + file.size, 0) ?? 0, [files])

  if (!files) {
    return (
      <div className="rounded-xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
        <div className="text-sm text-slate-600 dark:text-slate-400">{t('fileList.loading')}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 rounded-xl border border-slate-300 bg-white shadow dark:border-white/15 dark:bg-white/5">
      <div className="border-b border-slate-300 p-6 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold">{t('fileList.title')}</h2>
            <span className="chip">{t('fileList.count', { count: files.length })}</span>
            <span className="chip">{(totalBytes / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <button
            type="button"
            className="btn"
            disabled={files.length === 0}
            onClick={() => void onClear()}
          >
            {t('actions.clear')}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
        {files.length === 0 ? (
          <div className="p-4 text-sm text-slate-600 dark:text-slate-400">
            {t('fileList.empty')}
          </div>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li
                key={file.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{file.path}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="chip">{file.ext || t('fileList.noExt')}</span>
                      <span className="chip">{(file.size / 1024).toFixed(1)} KB</span>
                      {!file.isText ? <span className="chip">{t('fileList.binary')}</span> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger shrink-0"
                    onClick={() => void onRemove(file.id)}
                  >
                    {t('actions.remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
