import { useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { PREVIEW_EDITOR_OPTIONS } from '../config/app'
import { countLines, resolvePreviewLanguage } from '../lib/merge'
import type { PreviewPanelProps } from './types'

export function PreviewPanel({ value, files }: PreviewPanelProps) {
  const language = useMemo(() => resolvePreviewLanguage(files), [files])
  const lineCount = useMemo(() => countLines(value), [value])

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#3E3E42] bg-[#1E1E1E] shadow-lg">
      <div className="border-b border-[#3E3E42] px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#D4D4D4]">Preview</h2>
            <p className="mt-1 text-xs text-[#858585]">
              {language === 'plaintext'
                ? 'Read-only merged output'
                : `${language.charAt(0).toUpperCase() + language.slice(1)} - Read-only`}
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-lg border border-[#3E3E42] bg-[#2D2D30] px-3 py-1">
            <span className="text-xs font-medium text-[#CE9178]">
              {lineCount.toLocaleString()} lines
            </span>
            <span className="text-[#3E3E42]">/</span>
            <span className="text-xs font-medium text-[#9CDCFE]">
              {value.length.toLocaleString()} chars
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={value}
          theme="vs-dark"
          options={PREVIEW_EDITOR_OPTIONS}
        />
      </div>
    </div>
  )
}
