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
    title: 'Files To Context - Merge Files into AI-Ready Context',
    description:
      'Collect many code and text files into one AI-ready context in your browser. Organize by workspace, copy instantly, or download as TXT/ZIP.',
    ogTitle: 'Files To Context - Build AI-Ready Context from Your Files',
    ogDescription:
      'Collect many project files into one clean AI-ready context in-browser. Fast copy/download, no backend uploads.',
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
    title: 'Files To Context - Обʼєднуйте файли в AI-контекст',
    description:
      'Збирайте багато кодових і текстових файлів в один AI-контекст прямо у браузері. Керуйте робочими просторами, копіюйте результат або завантажуйте TXT/ZIP.',
    ogTitle: 'Files To Context - Збирайте контекст для нейромереж',
    ogDescription:
      'Обʼєднуйте файли проєкту в один чистий AI-контекст у браузері. Швидке копіювання та завантаження без бекенду.',
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
    title: 'Documentation - Files To Context',
    description:
      'Documentation for Files To Context: workspaces, project tree, presets, and exporting AI-ready context.',
    ogTitle: 'Files To Context Documentation',
    ogDescription:
      'Learn how to use workspaces, merge presets, project tree selection, and output actions in Files To Context.',
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
    title: 'Документація - Files To Context',
    description:
      'Документація Files To Context: робочі простори, дерево проєкту, пресети та експорт AI-контексту.',
    ogTitle: 'Документація Files To Context',
    ogDescription:
      'Дізнайтесь, як працювати з робочими просторами, деревом проєкту, пресетами та вивантаженням AI-контексту.',
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
