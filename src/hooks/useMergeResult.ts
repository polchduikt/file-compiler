import { useEffect, useRef, useState } from 'react'
import MergeWorker from '../workers/mergeWorker?worker'
import type { MergeRequest, MergeResponse, MergeResult, Workspace } from '../types'

type MergeWorkspace = Pick<Workspace, 'files' | 'settings'>

export function useMergeResult(workspace: MergeWorkspace | undefined) {
  const workerRef = useRef<Worker | null>(null)
  const latestRequestIdRef = useRef(0)
  const [mergeError, setMergeError] = useState<string | null>(null)
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null)
  const [isMerging, setIsMerging] = useState(false)

  useEffect(() => {
    const worker = new MergeWorker()

    worker.onmessage = (event: MessageEvent<MergeResponse>) => {
      if (event.data.requestId !== latestRequestIdRef.current) return
      setMergeResult(event.data.result)
      setMergeError(null)
      setIsMerging(false)
    }

    worker.onerror = (event) => {
      setMergeError(event.message || 'Merge failed')
      setMergeResult(null)
      setIsMerging(false)
    }

    workerRef.current = worker

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!workspace || workspace.files.length === 0) {
      latestRequestIdRef.current += 1
      queueMicrotask(() => {
        setIsMerging(false)
        setMergeError(null)
        setMergeResult(null)
      })
      return
    }

    const worker = workerRef.current
    if (!worker) {
      queueMicrotask(() => {
        setMergeError('Merge worker is not available')
        setMergeResult(null)
        setIsMerging(false)
      })
      return
    }

    const requestId = latestRequestIdRef.current + 1
    latestRequestIdRef.current = requestId

    const request: MergeRequest = {
      files: workspace.files.map((file) => ({
        ext: file.ext,
        isText: file.isText,
        name: file.name,
        path: file.path,
        size: file.size,
        text: file.text,
      })),
      options: {
        addSeparators: workspace.settings.addSeparators,
        includeExts: workspace.settings.includeAllExts ? [] : workspace.settings.includeExts,
        newline: workspace.settings.newline,
        separatorTemplate: workspace.settings.separatorTemplate,
      },
      requestId,
    }

    queueMicrotask(() => {
      setIsMerging(true)
      setMergeError(null)
      setMergeResult(null)
    })

    worker.postMessage(request)
  }, [workspace])

  const reset = () => {
    latestRequestIdRef.current += 1
    setMergeError(null)
    setMergeResult(null)
    setIsMerging(false)
  }

  return {
    isMerging,
    mergeError,
    mergeResult,
    reset,
  }
}
