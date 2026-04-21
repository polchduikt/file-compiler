import { useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { getPresetById, MERGE_PRESETS, resolvePresetId, type MergePresetId } from '../lib/presets'
import { normalizeExtensionListInput } from '../lib/settings'
import type { OptionsPanelProps } from './types'

export function OptionsPanel({ settings, onChange }: OptionsPanelProps) {
  const { t } = useI18n()
  const [extDraft, setExtDraft] = useState(() => settings?.includeExts.join(', ') ?? '')

  if (!settings) {
    return (
      <div className="rounded-xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
        <div className="text-sm text-slate-600 dark:text-slate-400">{t('options.loading')}</div>
      </div>
    )
  }

  const presetId = resolvePresetId(settings)

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-6 text-base font-semibold">{t('options.title')}</h3>

      <div className="space-y-5">
        <label className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">{t('options.includeAllExts')}</div>
          <input
            type="checkbox"
            checked={settings.includeAllExts}
            title={t('tooltip.includeAllExts')}
            onChange={(event) => void onChange({ includeAllExts: event.target.checked })}
            className="h-5 w-5"
          />
        </label>

        <label className="flex flex-col gap-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('options.presets')}
          </div>
          <select
            className="input"
            title={t('tooltip.presetSelect')}
            value={presetId}
            onChange={(event) => {
              const nextPresetId = event.target.value as MergePresetId | 'custom'
              if (nextPresetId === 'custom') return

              const preset = getPresetById(nextPresetId)
              if (!preset) return
              setExtDraft((preset.settingsPatch.includeExts ?? []).join(', '))
              void onChange(preset.settingsPatch)
            }}
          >
            <option value="custom">{t('options.presetCustom')}</option>
            {MERGE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('options.includeExts')}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">{t('options.commaSeparated')}</div>
          <input
            className="input"
            disabled={settings.includeAllExts}
            title={t('tooltip.includeExts')}
            value={extDraft}
            onChange={(event) => setExtDraft(event.target.value)}
            onBlur={() => void onChange({ includeExts: normalizeExtensionListInput(extDraft) })}
            placeholder=".js .ts .css .html"
          />
        </label>

        <label className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">{t('options.smartSeparators')}</div>
          <input
            type="checkbox"
            checked={settings.addSeparators}
            title={t('tooltip.smartSeparators')}
            onChange={(event) => void onChange({ addSeparators: event.target.checked })}
            className="h-5 w-5"
          />
        </label>

        <label className="flex flex-col gap-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('options.separatorTemplate')}</div>
          <input
            className="input"
            title={t('tooltip.separatorTemplate')}
            value={settings.separatorTemplate}
            onChange={(event) => void onChange({ separatorTemplate: event.target.value })}
            placeholder="// --- {{path}} ---"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t('options.tokens')}
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('options.outputName')}</div>
          <input
            className="input"
            title={t('tooltip.outputFileName')}
            value={settings.outputFileName}
            onChange={(event) => void onChange({ outputFileName: event.target.value })}
          />
        </label>

        <label className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">{t('options.downloadZip')}</div>
          <input
            type="checkbox"
            checked={settings.zipOutput}
            title={t('tooltip.downloadZip')}
            onChange={(event) => void onChange({ zipOutput: event.target.checked })}
            className="h-5 w-5"
          />
        </label>
      </div>
    </div>
  )
}
