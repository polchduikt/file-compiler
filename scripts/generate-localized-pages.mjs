import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const sourceFile = resolve(distDir, 'index.html')

const variants = [
  {
    outputPath: 'en/index.html',
    lang: 'en',
    localeTag: 'en_US',
    alternateLocaleTag: 'uk_UA',
    title: 'File Compiler - Merge Code Files, Copy, and Download',
    description:
      'Merge code and text files into one clean file in your browser. Copy instantly or download as TXT/ZIP.',
    ogTitle: 'File Compiler - Merge, Copy, and Download Combined Files',
    ogDescription:
      'Combine project files into one clean output in-browser. Copy instantly or download as TXT/ZIP. No backend uploads.',
    canonical: 'https://file-compiler.techindustry.app/en',
    alternates: {
      en: 'https://file-compiler.techindustry.app/en',
      uk: 'https://file-compiler.techindustry.app/uk',
      xDefault: 'https://file-compiler.techindustry.app/en',
    },
  },
  {
    outputPath: 'uk/index.html',
    lang: 'uk',
    localeTag: 'uk_UA',
    alternateLocaleTag: 'en_US',
    title: 'File Compiler - Об’єднання локальних файлів у браузері',
    description:
      'Об’єднуйте локальні кодові й текстові файли в один результат прямо у браузері. Без бекенду та без завантаження на сервер.',
    ogTitle: 'File Compiler - Об’єднуйте, копіюйте та завантажуйте файли',
    ogDescription:
      'Об’єднуйте файли проєкту в один чистий результат у браузері. Копіюйте миттєво або завантажуйте як TXT/ZIP.',
    canonical: 'https://file-compiler.techindustry.app/uk',
    alternates: {
      en: 'https://file-compiler.techindustry.app/en',
      uk: 'https://file-compiler.techindustry.app/uk',
      xDefault: 'https://file-compiler.techindustry.app/en',
    },
  },
  {
    outputPath: 'en/docs/index.html',
    lang: 'en',
    localeTag: 'en_US',
    alternateLocaleTag: 'uk_UA',
    title: 'Documentation - File Compiler',
    description:
      'Step-by-step documentation for File Compiler features, workspaces, merge options, and output.',
    ogTitle: 'File Compiler Documentation',
    ogDescription:
      'Learn how to use workspaces, merge options, project tree selection, and output actions in File Compiler.',
    canonical: 'https://file-compiler.techindustry.app/en/docs',
    alternates: {
      en: 'https://file-compiler.techindustry.app/en/docs',
      uk: 'https://file-compiler.techindustry.app/uk/docs',
      xDefault: 'https://file-compiler.techindustry.app/en/docs',
    },
  },
  {
    outputPath: 'uk/docs/index.html',
    lang: 'uk',
    localeTag: 'uk_UA',
    alternateLocaleTag: 'en_US',
    title: 'Документація - File Compiler',
    description:
      'Коротка інструкція зі всіма функціями File Compiler: робочі простори, параметри об’єднання та результат.',
    ogTitle: 'Документація File Compiler',
    ogDescription:
      'Дізнайтесь, як працювати з робочими просторами, деревом проєкту, параметрами об’єднання та завантаженням результату.',
    canonical: 'https://file-compiler.techindustry.app/uk/docs',
    alternates: {
      en: 'https://file-compiler.techindustry.app/en/docs',
      uk: 'https://file-compiler.techindustry.app/uk/docs',
      xDefault: 'https://file-compiler.techindustry.app/en/docs',
    },
  },
]

function replaceTagContent(html, pattern, nextContent) {
  return html.replace(pattern, `$1${nextContent}$3`)
}

function applyVariant(template, variant) {
  let html = template

  html = html.replace(/<html lang="[^"]*">/, `<html lang="${variant.lang}">`)
  html = replaceTagContent(html, /(<title>)([\s\S]*?)(<\/title>)/, variant.title)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${variant.description}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:locale" content="${variant.localeTag}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:locale:alternate"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:locale:alternate" content="${variant.alternateLocaleTag}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${variant.ogTitle}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${variant.ogDescription}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${variant.canonical}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${variant.ogTitle}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${variant.ogDescription}" />`,
  )
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${variant.canonical}" />`,
  )
  html = html.replace(
    /"url":\s*"[^"]*"/,
    `"url": "${variant.canonical}"`,
  )
  html = html.replace(
    /"description":\s*"[^"]*"/,
    `"description": "${variant.description}"`,
  )
  html = html.replace(
    /"target":\s*"[^"]*"/,
    `"target": "${variant.canonical}"`,
  )

  const alternateBlock = [
    `<link rel="alternate" href="${variant.alternates.en}" hreflang="en" />`,
    `<link rel="alternate" href="${variant.alternates.uk}" hreflang="uk" />`,
    `<link rel="alternate" href="${variant.alternates.xDefault}" hreflang="x-default" />`,
  ].join('\n    ')

  html = html.replace(
    /<link\s+rel="alternate"\s+href="[^"]*"\s+hreflang="en"\s*\/>\s*<link\s+rel="alternate"\s+href="[^"]*"\s+hreflang="uk"\s*\/>\s*<link\s+rel="alternate"\s+href="[^"]*"\s+hreflang="x-default"\s*\/>/,
    alternateBlock,
  )

  return html
}

try {
  const baseHtml = await readFile(sourceFile, 'utf-8')

  for (const variant of variants) {
    const outputFile = resolve(distDir, variant.outputPath)
    const localizedHtml = applyVariant(baseHtml, variant)
    await mkdir(dirname(outputFile), { recursive: true })
    await writeFile(outputFile, localizedHtml, 'utf-8')
  }

  console.log(`Generated ${variants.length} localized route pages`)
} catch (error) {
  console.error('Failed to generate localized pages:', error)
  process.exitCode = 1
}
