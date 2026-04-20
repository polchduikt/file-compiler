import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { DropzoneProps } from './types'

export function Dropzone({ disabled, onFiles }: DropzoneProps) {
  const [isOver, setIsOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!folderInputRef.current) return
    folderInputRef.current.setAttribute('webkitdirectory', '')
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      setIsOver(false)
      if (disabled) return
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        void onFiles(event.dataTransfer.files)
      }
    },
    [disabled, onFiles],
  )

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
      <div
        onDragEnter={(event) => {
          event.preventDefault()
          if (!disabled) setIsOver(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsOver(false)
        }}
        onDrop={onDrop}
        className={[
          'flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 text-center transition',
          isOver
            ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-400/50 dark:bg-indigo-500/10'
            : 'border-slate-300 bg-slate-50 dark:border-white/10 dark:bg-white/5',
          disabled ? 'opacity-60' : '',
        ].join(' ')}
      >
        <div className="text-base font-semibold">Drag & drop files here</div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Or choose files / a whole folder.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            className="btn btn-primary"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            Add files
          </button>
          <button
            type="button"
            className="btn"
            disabled={disabled}
            onClick={() => folderInputRef.current?.click()}
          >
            Add folder
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) void onFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) void onFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
