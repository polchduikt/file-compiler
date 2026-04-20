import { useState } from 'react'
import { normalizeExtensionListInput } from '../lib/settings'
import type { OptionsPanelProps } from './types'

export function OptionsPanel({ settings, onChange }: OptionsPanelProps) {
  const [extDraft, setExtDraft] = useState(() => settings?.includeExts.join(', ') ?? '')

  if (!settings) {
    return (
      <div className="rounded-xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
        <div className="text-sm text-slate-600 dark:text-slate-400">Loading options...</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-6 text-base font-semibold">Merge Options</h3>

      <div className="space-y-5">
        <label className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">Include all extensions</div>
          <input
            type="checkbox"
            checked={settings.includeAllExts}
            onChange={(event) => void onChange({ includeAllExts: event.target.checked })}
            className="h-5 w-5"
          />
        </label>

        <label className="flex flex-col gap-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Include extensions
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Comma/space separated</div>
          <input
            className="input"
            disabled={settings.includeAllExts}
            value={extDraft}
            onChange={(event) => setExtDraft(event.target.value)}
            onBlur={() => void onChange({ includeExts: normalizeExtensionListInput(extDraft) })}
            placeholder=".js .ts .css .html"
          />
        </label>

        <label className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">Smart separators</div>
          <input
            type="checkbox"
            checked={settings.addSeparators}
            onChange={(event) => void onChange({ addSeparators: event.target.checked })}
            className="h-5 w-5"
          />
        </label>

        <label className="flex flex-col gap-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Separator template
          </div>
          <input
            className="input"
            value={settings.separatorTemplate}
            onChange={(event) => void onChange({ separatorTemplate: event.target.value })}
            placeholder="// --- {{path}} ---"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tokens: {'{{path}}'}, {'{{name}}'}
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Output file name
          </div>
          <input
            className="input"
            value={settings.outputFileName}
            onChange={(event) => void onChange({ outputFileName: event.target.value })}
          />
        </label>

        <label className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">Download as ZIP</div>
          <input
            type="checkbox"
            checked={settings.zipOutput}
            onChange={(event) => void onChange({ zipOutput: event.target.checked })}
            className="h-5 w-5"
          />
        </label>
      </div>
    </div>
  )
}
