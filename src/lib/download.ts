import JSZip from 'jszip'

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function downloadTextAsFile(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  downloadBlob(blob, filename)
}

export async function downloadTextAsZip(text: string, innerFilename: string, zipFilename: string) {
  const zip = new JSZip()
  zip.file(innerFilename, text)
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, zipFilename)
}

