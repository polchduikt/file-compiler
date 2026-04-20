import { useState } from 'react'
import { useI18n } from '../i18n/useI18n'

type RenameWorkspaceModalProps = {
  initialName: string
  onCancel: () => void
  onSave: (name: string) => void | Promise<void>
}

export function RenameWorkspaceModal({
  initialName,
  onCancel,
  onSave,
}: RenameWorkspaceModalProps) {
  const { t } = useI18n()
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  const trimmedInitial = initialName.trim()
  const trimmedName = name.trim()
  const canSave = trimmedName.length > 0 && trimmedName !== trimmedInitial

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      await onSave(trimmedName)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-5 shadow-2xl dark:border-white/15 dark:bg-[#0b1025]">
        <h2 className="text-lg font-bold">{t('rename.title')}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t('rename.subtitle')}</p>

        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t('rename.label')}
          <input
            autoFocus
            className="input mt-2"
            title={t('tooltip.renameInput')}
            placeholder={t('rename.placeholder')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onCancel()
              if (event.key === 'Enter') {
                event.preventDefault()
                void handleSave()
              }
            }}
          />
        </label>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="btn"
            title={t('tooltip.renameCancel')}
            disabled={saving}
            onClick={onCancel}
          >
            {t('rename.cancel')}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            title={t('tooltip.renameSave')}
            disabled={saving || !canSave}
            onClick={() => void handleSave()}
          >
            {t('rename.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
