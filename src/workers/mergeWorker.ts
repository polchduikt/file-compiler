import { normalizeExtension } from '../lib/file-system'
import { applySeparatorTemplate, joinWithConfiguredNewline } from '../lib/merge'
import type { MergeRequest, MergeResponse, MergeResult } from '../types'

self.onmessage = (event: MessageEvent<MergeRequest>) => {
  const { files, options, requestId } = event.data
  const include = new Set((options.includeExts ?? []).map(normalizeExtension).filter(Boolean))

  const included: typeof files = []
  const skipped: typeof files = []

  for (const file of files) {
    if (!file.isText || typeof file.text !== 'string') {
      skipped.push(file)
      continue
    }

    if (include.size === 0) {
      included.push(file)
      continue
    }

    const extension = normalizeExtension(file.ext)
    if (extension && include.has(extension)) {
      included.push(file)
    } else {
      skipped.push(file)
    }
  }

  const parts: string[] = []
  let totalInputBytes = 0

  for (const file of included) {
    totalInputBytes += file.size
    if (options.addSeparators) {
      parts.push(applySeparatorTemplate(options.separatorTemplate, file))
    }
    parts.push(file.text ?? '')
  }

  const result: MergeResult = {
    includedCount: included.length,
    mergedText: joinWithConfiguredNewline(parts, options.newline),
    skippedCount: skipped.length,
    totalInputBytes,
  }

  const response: MergeResponse = { requestId, result }
  ;(self as unknown as Worker).postMessage(response)
}
