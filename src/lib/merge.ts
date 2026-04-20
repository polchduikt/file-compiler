import {
  DEFAULT_PREVIEW_MAX_CHARS,
  MONACO_LANGUAGE_BY_EXTENSION,
  PREVIEW_TRUNCATION_SUFFIX,
} from '../config/app'
import { normalizeExtension } from './file-system'
import { sanitizeOutputFileName } from './workspace'
import type { MergeResult, WorkspaceSettings } from '../types'

export function applySeparatorTemplate(template: string, file: { path: string; name: string }) {
  return template.replaceAll('{{path}}', file.path).replaceAll('{{name}}', file.name)
}

export function joinWithConfiguredNewline(parts: string[], newline: WorkspaceSettings['newline']) {
  return parts.join(newline === '\r\n' ? '\r\n' : '\n')
}

export function resolvePreviewValue(
  mergeResult: MergeResult | null,
  previewMaxChars = DEFAULT_PREVIEW_MAX_CHARS,
) {
  const mergedText = mergeResult?.mergedText ?? ''
  if (mergedText.length <= previewMaxChars) return mergedText
  return `${mergedText.slice(0, previewMaxChars)}${PREVIEW_TRUNCATION_SUFFIX}`
}

export function resolvePreviewLanguage(files: Array<{ ext: string }> = []) {
  if (files.length === 0) return 'plaintext'
  const languageByExtension: Record<string, string> = MONACO_LANGUAGE_BY_EXTENSION

  const extensionCounts = new Map<string, number>()

  for (const file of files) {
    const extension = normalizeExtension(file.ext)
    extensionCounts.set(extension, (extensionCounts.get(extension) ?? 0) + 1)
  }

  const [mostCommonExtension] =
    [...extensionCounts.entries()].sort((left, right) => right[1] - left[1])[0] ?? []

  return (mostCommonExtension && languageByExtension[mostCommonExtension]) || 'plaintext'
}

export function countLines(value: string) {
  if (!value) return 0
  return value.split(/\r\n|\r|\n/).length
}

export function resolveDownloadPlan(outputFileName: string, zipOutput: boolean) {
  const sanitizedOutputFileName = sanitizeOutputFileName(outputFileName)

  if (!zipOutput) {
    return {
      filename: sanitizedOutputFileName,
      kind: 'file' as const,
    }
  }

  const zipFilename = sanitizedOutputFileName.toLowerCase().endsWith('.zip')
    ? sanitizedOutputFileName
    : `${sanitizedOutputFileName}.zip`

  return {
    filename: zipFilename,
    innerFilename: sanitizedOutputFileName.toLowerCase().endsWith('.zip')
      ? 'merged.txt'
      : sanitizedOutputFileName,
    kind: 'zip' as const,
  }
}
