import { access, copyFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const indexHtml = resolve(distDir, 'index.html')
const fallback404 = resolve(distDir, '404.html')

try {
  await access(indexHtml, constants.R_OK)
  await copyFile(indexHtml, fallback404)
  console.log('Created dist/404.html from dist/index.html')
} catch (error) {
  console.error('Failed to create GitHub Pages fallback file:', error)
  process.exitCode = 1
}
