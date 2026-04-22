import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const sourceFile = resolve(distDir, 'index.html')
const sitemapFile = resolve(distDir, 'sitemap.xml')
const siteUrl = 'https://file-compiler.techindustry.app'
const lastModified = '2026-04-22'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildSoftwareJson(variant) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Files To Context',
    applicationCategory: 'DeveloperApplication',
    inLanguage: variant.lang === 'uk' ? ['uk', 'en'] : ['en', 'uk'],
    operatingSystem: 'Web',
    url: variant.canonical,
    description: variant.description,
    image: `${siteUrl}/logo.png`,
    featureList: variant.featureList,
    potentialAction: {
      '@type': 'UseAction',
      target: variant.canonical,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

function buildFaqJson(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function renderFaq(items) {
  if (!items.length) return ''

  return `
    <section class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
      <h2 class="text-2xl font-semibold text-slate-950">FAQ</h2>
      <div class="mt-5 grid gap-4 md:grid-cols-3">
        ${items
          .map(
            (item) => `
              <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 class="text-sm font-semibold text-slate-900">${escapeHtml(item.question)}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(item.answer)}</p>
              </article>`,
          )
          .join('')}
      </div>
    </section>`
}

function renderLinkCards(items) {
  return items
    .map(
      (item) => `
        <a href="${item.href}" class="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/70">
          <h3 class="text-base font-semibold text-slate-900">${escapeHtml(item.title)}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(item.description)}</p>
        </a>`,
    )
    .join('')
}

function renderBulletCards(items) {
  return items
    .map(
      (item) => `
        <li class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          ${escapeHtml(item)}
        </li>`,
    )
    .join('')
}

const appContent = {
  en: {
    eyebrow: 'Browser-only AI context builder',
    title: 'Open the Files To Context app',
    description:
      'Collect code, docs, configs, and notes into one clean AI-ready context directly in your browser. Use the app to select files, apply presets, preview the result, and export it in seconds.',
    primaryCta: 'Open About page',
    secondaryCta: 'Read documentation',
    featureList: [
      'Project tree selection for precise file scope',
      'Workspace presets and JSON backup import/export',
      'Instant copy, TXT download, and ZIP export',
    ],
  },
  uk: {
    eyebrow: 'Локальний конструктор AI-контексту',
    title: 'Відкрийте застосунок Files To Context',
    description:
      'Збирайте код, документацію, конфіги та нотатки в один чистий AI-контекст прямо у браузері. У застосунку можна вибрати потрібні файли, застосувати пресети, переглянути результат і швидко його експортувати.',
    primaryCta: 'Відкрити сторінку про нас',
    secondaryCta: 'Перейти до документації',
    featureList: [
      'Дерево проєкту для точного вибору файлів',
      'Пресети робочого простору та backup у JSON',
      'Швидке копіювання, TXT-завантаження та ZIP-експорт',
    ],
  },
}

const aboutContent = {
  en: {
    eyebrow: 'Browser-only AI context builder',
    title: 'Turn project files into one clean context for AI tools',
    description:
      'Files To Context was built for the moment when a repository becomes too large for manual copy-paste, but you still need to turn its code, docs, and structure into one prompt-ready context.',
    storyTitle: 'Why we built it',
    storyText:
      'We wanted a browser-only tool that helps developers prepare context for ChatGPT, Claude, reviews, audits, and handoff docs without sending files to a backend. The result is a focused workflow for picking only the useful files and turning them into one readable output.',
    visualTitle: 'How it works visually',
    workflowTitle: 'Typical workflow',
    browserChip: 'Browser-only',
    outputLabel: 'Output',
    outputTitle: 'AI Context',
    outputTags: ['Prompt-ready', 'Structured', 'Copy / TXT / ZIP'],
    visualCaption:
      'Instead of chaotic copy-paste from scattered folders, you get one clean, readable context block for AI.',
    featureList: [
      'Browser-only processing with no backend uploads',
      'Project tree selection for precise file scope',
      'Workspace backups, presets, TXT and ZIP export',
    ],
    ctaApp: 'Open the app',
    ctaDocs: 'Read documentation',
    workflowSteps: [
      'Choose only the folders and files you need with the project tree.',
      'Apply a preset and shape one clean, structured output.',
      'Copy the final context or download it for ChatGPT, Claude, or docs.',
    ],
    cards: [
      {
        href: `${siteUrl}/en/chatgpt-context`,
        title: 'Prepare ChatGPT context',
        description: 'Pick only the useful folders and generate a clean prompt-ready project context.',
      },
      {
        href: `${siteUrl}/en/merge-code-files`,
        title: 'Merge code files online',
        description: 'Combine many files into one readable output for reviews, audits, and documentation.',
      },
      {
        href: `${siteUrl}/en/docs`,
        title: 'Learn the workflow',
        description: 'See how workspaces, presets, file trees, export, and download options work.',
      },
    ],
    faq: [
      {
        question: 'Does Files To Context upload my files to a server?',
        answer: 'No. Files are processed locally in your browser, so you can build context without backend uploads.',
      },
      {
        question: 'Can I choose only part of a repository?',
        answer: 'Yes. Use the project tree to expand folders, search by name, and include only the files you want.',
      },
      {
        question: 'What can I do with the merged result?',
        answer: 'You can copy it to the clipboard, download it as TXT, or export it as ZIP depending on your workspace settings.',
      },
    ],
  },
  uk: {
    eyebrow: 'Локальний конструктор AI-контексту',
    title: 'Перетворюйте файли проєкту в один чистий контекст для AI-інструментів',
    description:
      'Files To Context створений для моменту, коли репозиторій уже завеликий для ручного copy-paste, але вам все ще потрібно зібрати код, документацію та структуру в один prompt-ready контекст.',
    storyTitle: 'Чому ми це створили',
    storyText:
      'Ми хотіли browser-only інструмент, який допомагає підготувати контекст для ChatGPT, Claude, ревʼю, аудитів і handoff-документів без завантаження файлів на сервер. У результаті вийшов зручний сценарій, де ви обираєте лише потрібні файли й отримуєте один читабельний результат.',
    visualTitle: 'Як це виглядає',
    workflowTitle: 'Типовий сценарій',
    browserChip: 'Browser-only',
    outputLabel: 'Результат',
    outputTitle: 'AI Контекст',
    outputTags: ['Готово для prompt', 'Структуровано', 'Копія / TXT / ZIP'],
    visualCaption:
      'Замість хаотичного копіювання з різних папок ви отримуєте один чистий, читабельний контекст для AI.',
    featureList: [
      'Локальна обробка у браузері без завантаження на сервер',
      'Дерево проєкту для точного вибору файлів',
      'Бекапи воркспейсів, пресети, TXT та ZIP експорт',
    ],
    ctaApp: 'Відкрити застосунок',
    ctaDocs: 'Перейти до документації',
    workflowSteps: [
      'Оберіть лише потрібні папки й файли через дерево проєкту.',
      'Застосуйте пресет і сформуйте один чистий структурований результат.',
      'Скопіюйте контекст або завантажте його для ChatGPT, Claude чи документації.',
    ],
    cards: [
      {
        href: `${siteUrl}/uk/kontekst-dlya-chatgpt`,
        title: 'Підготувати контекст для ChatGPT',
        description: 'Оберіть лише потрібні папки й згенеруйте чистий контекст для prompt або аналізу.',
      },
      {
        href: `${siteUrl}/uk/obyednaty-kodovi-faily`,
        title: 'Обʼєднати кодові файли',
        description: 'Зберіть багато файлів в один читабельний результат для ревʼю, аудиту чи документації.',
      },
      {
        href: `${siteUrl}/uk/docs`,
        title: 'Подивитися інструкцію',
        description: 'Дізнайтесь, як працюють воркспейси, пресети, дерево файлів та експорт результату.',
      },
    ],
    faq: [
      {
        question: 'Files To Context завантажує файли на сервер?',
        answer: 'Ні. Файли обробляються локально у браузері, тому ви можете збирати контекст без бекенду.',
      },
      {
        question: 'Чи можна вибрати лише частину репозиторію?',
        answer: 'Так. Використовуйте дерево проєкту, пошук по назві та вибір окремих папок або файлів.',
      },
      {
        question: 'Що можна зробити з результатом?',
        answer: 'Результат можна скопіювати в буфер, завантажити як TXT або експортувати як ZIP залежно від налаштувань.',
      },
    ],
  },
}

const docsContent = {
  en: {
    title: 'Files To Context Documentation',
    subtitle:
      'A concise guide to workspaces, project tree selection, presets, and exporting AI-ready context.',
    sections: [
      'Workspaces: create, rename, export, and restore JSON backups.',
      'Add files: drag and drop, add a folder, or choose files through the project tree.',
      'Merge options: presets, separators, extension filters, TXT and ZIP export.',
      'Output: live preview, clipboard copy, and downloadable context files.',
    ],
  },
  uk: {
    title: 'Документація Files To Context',
    subtitle:
      'Коротка інструкція по воркспейсам, дереву проєкту, пресетам та експорту AI-контексту.',
    sections: [
      'Робочі простори: створення, перейменування, експорт та відновлення JSON-бекапів.',
      'Додавання файлів: drag and drop, додавання папки або вибір через дерево проєкту.',
      'Параметри обʼєднання: пресети, розділювачі, вибір розширень, TXT та ZIP експорт.',
      'Результат: live preview, копіювання в буфер і завантаження готового контексту.',
    ],
  },
}

const landingContent = {
  en: {
    chatgptContext: {
      eyebrow: 'ChatGPT workflow',
      title: 'Prepare repository context for ChatGPT without manual copy-paste chaos',
      description:
        'Select only the useful files, merge them in a readable order, and create one clean context block that is easier for ChatGPT or other AI tools to understand.',
      summaryTitle: 'Why this page matters',
      summary:
        'This page is built for developers, reviewers, and teams who need to compress a large codebase into something AI can actually reason about.',
      valueTitle: 'Key value',
      valuePoints: [
        'Use project tree search to exclude noise like build outputs or unrelated modules.',
        'Apply presets and separators so the final context stays structured and readable.',
        'Keep everything local in the browser when working with sensitive repositories.',
      ],
      ctaApp: 'Open the app',
      ctaDocs: 'See documentation',
      faq: [
        {
          question: 'Why is this useful for ChatGPT?',
          answer:
            'AI tools work better when the input is structured. Files To Context helps you compress a codebase into a readable, ordered, prompt-ready format.',
        },
        {
          question: 'Can I filter out unneeded folders before merging?',
          answer:
            'Yes. The project tree lets you select only specific folders or files, so you can keep prompts focused.',
        },
      ],
    },
    mergeCodeFiles: {
      eyebrow: 'Code merge workflow',
      title: 'Merge code files into one structured output for reviews, audits, and AI prompts',
      description:
        'Combine many project files into one result with consistent separators, selective extensions, workspace presets, and instant export.',
      summaryTitle: 'Why this page matters',
      summary:
        'This is useful when you need a single file for architecture review, documentation handoff, security audit, onboarding, or LLM context preparation.',
      valueTitle: 'Key value',
      valuePoints: [
        'Merge only the extensions you want or include every detected text file.',
        'Keep file boundaries readable with separator templates and path tokens.',
        'Export as TXT or ZIP, or copy directly into your clipboard in seconds.',
      ],
      ctaApp: 'Start merging files',
      ctaDocs: 'Read documentation',
      faq: [
        {
          question: 'Can I merge docs and configs together with source code?',
          answer:
            'Yes. You can include code files, Markdown, JSON, YAML, configs, and other text files in one structured output.',
        },
        {
          question: 'Do I need a backend or account?',
          answer:
            'No. The app is static and browser-only, so you can use it directly without server-side processing.',
        },
      ],
    },
  },
  uk: {
    chatgptContext: {
      eyebrow: 'Сценарій для ChatGPT',
      title: 'Готуйте контекст репозиторію для ChatGPT без хаосу з ручним копіюванням',
      description:
        'Оберіть лише потрібні файли, обʼєднайте їх у правильному порядку та отримайте один чистий блок контексту, який легше сприймають ChatGPT та інші AI-інструменти.',
      summaryTitle: 'Чому ця сторінка важлива',
      summary:
        'Ця сторінка корисна для розробників і команд, яким потрібно стиснути великий кодовий проєкт у формат, зручний для аналізу нейромережами.',
      valueTitle: 'Ключова цінність',
      valuePoints: [
        'Через дерево проєкту можна відсіяти шум на кшталт build-артефактів або зайвих модулів.',
        'Пресети й розділювачі допомагають зробити фінальний контекст структурованим і читабельним.',
        'Усе працює локально в браузері, що зручно для чутливих репозиторіїв.',
      ],
      ctaApp: 'Відкрити застосунок',
      ctaDocs: 'Переглянути документацію',
      faq: [
        {
          question: 'Чому це корисно для ChatGPT?',
          answer:
            'AI-моделі краще працюють зі структурованим вводом. Files To Context допомагає перетворити кодову базу в читабельний, впорядкований контекст для prompt.',
        },
        {
          question: 'Чи можна прибрати непотрібні папки до обʼєднання?',
          answer:
            'Так. Дерево проєкту дозволяє вибрати лише конкретні папки або файли, щоб контекст залишався сфокусованим.',
        },
      ],
    },
    mergeCodeFiles: {
      eyebrow: 'Сценарій обʼєднання коду',
      title: 'Обʼєднуйте кодові файли в один структурований результат для ревʼю, аудиту та AI-запитів',
      description:
        'Поєднуйте багато файлів проєкту в один результат із розділювачами, вибором розширень, пресетами та швидким експортом.',
      summaryTitle: 'Чому ця сторінка важлива',
      summary:
        'Це корисно, коли потрібен один файл для архітектурного ревʼю, передачі документації, безпекового аудиту, онбордингу або підготовки LLM-контексту.',
      valueTitle: 'Ключова цінність',
      valuePoints: [
        'Можна обʼєднувати лише потрібні розширення або всі знайдені текстові файли.',
        'Шаблони розділювачів і токени шляху зберігають зрозумілі межі між файлами.',
        'Результат можна експортувати як TXT, ZIP або швидко копіювати в буфер.',
      ],
      ctaApp: 'Почати обʼєднання',
      ctaDocs: 'Відкрити документацію',
      faq: [
        {
          question: 'Чи можна обʼєднати документацію, конфіги й код разом?',
          answer:
            'Так. Ви можете включати кодові файли, Markdown, JSON, YAML, конфіги та інші текстові формати в один структурований результат.',
        },
        {
          question: 'Чи потрібен акаунт або сервер?',
          answer:
            'Ні. Це статичний браузерний застосунок, який працює без серверної обробки.',
        },
      ],
    },
  },
}

function renderAppBody(locale) {
  const content = appContent[locale]
  const primaryHref = locale === 'uk' ? `${siteUrl}/uk/pro-nas` : `${siteUrl}/en/about`

  return {
    html: `
      <div class="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
        <main class="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <section class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">${escapeHtml(content.eyebrow)}</p>
            <h1 class="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">${escapeHtml(content.title)}</h1>
            <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">${escapeHtml(content.description)}</p>
            <ul class="mt-6 grid gap-3 md:grid-cols-3">${renderBulletCards(content.featureList)}</ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <a class="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" href="${primaryHref}">${escapeHtml(content.primaryCta)}</a>
              <a class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900" href="${siteUrl}/${locale}/docs">${escapeHtml(content.secondaryCta)}</a>
            </div>
          </section>
        </main>
      </div>`,
    faq: [],
  }
}

function renderAboutBody(locale) {
  const content = aboutContent[locale]
  const tags = content.featureList
    .map((item) => `<span class="chip px-3 py-1.5 text-xs md:text-sm">${escapeHtml(item)}</span>`)
    .join('')

  const workflow = content.workflowSteps
    .map(
      (item, index) => `
        <div class="flex gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">${index + 1}</div>
          <p class="text-sm leading-6 text-slate-100/90">${escapeHtml(item)}</p>
        </div>`,
    )
    .join('')

  const outputTags = content.outputTags
    .map((item) => `<div class="rounded-full bg-white/10 px-3 py-1">${escapeHtml(item)}</div>`)
    .join('')

  return {
    html: `
      <div class="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
        <main class="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <section class="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow">
            <div class="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
              <div class="flex flex-col gap-6">
                <div class="space-y-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.26em] text-indigo-600">${escapeHtml(content.eyebrow)}</p>
                  <h1 class="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">${escapeHtml(content.title)}</h1>
                  <p class="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">${escapeHtml(content.description)}</p>
                </div>
                <div class="flex flex-wrap gap-2">${tags}</div>
                <div class="flex flex-wrap gap-3">
                  <a class="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" href="${siteUrl}/${locale}">${escapeHtml(content.ctaApp)}</a>
                  <a class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900" href="${siteUrl}/${locale}/docs">${escapeHtml(content.ctaDocs)}</a>
                </div>
              </div>

              <div class="relative min-h-[320px] overflow-hidden rounded-[28px] border border-indigo-300/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900 p-6 text-white shadow-2xl">
                <div class="absolute -left-10 top-8 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl"></div>
                <div class="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl"></div>
                <div class="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-sky-400/20 blur-3xl"></div>

                <div class="relative flex h-full flex-col justify-between">
                  <div class="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-sky-100">${escapeHtml(content.browserChip)}</div>

                  <div class="relative mt-6 flex min-h-[220px] items-center justify-between gap-4">
                    <div class="flex w-44 flex-col gap-3">
                      <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                        <div class="text-xs text-white/60">01</div>
                        <div class="mt-1 text-sm font-semibold">Controller.java</div>
                      </div>
                      <div class="translate-x-6 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                        <div class="text-xs text-white/60">02</div>
                        <div class="mt-1 text-sm font-semibold">README.md</div>
                      </div>
                      <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                        <div class="text-xs text-white/60">03</div>
                        <div class="mt-1 text-sm font-semibold">config.yml</div>
                      </div>
                    </div>

                    <div class="relative flex flex-1 items-center justify-center">
                      <div class="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"></div>
                      <div class="absolute h-20 w-20 rounded-full border border-cyan-300/40 bg-cyan-300/10 blur-xl"></div>
                      <div class="relative h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,0.95)]"></div>
                    </div>

                    <div class="relative w-44">
                      <div class="rounded-[24px] border border-cyan-300/30 bg-white/12 p-5 shadow-[0_20px_60px_rgba(14,165,233,0.2)] backdrop-blur">
                        <div class="text-xs uppercase tracking-[0.22em] text-cyan-100/70">${escapeHtml(content.outputLabel)}</div>
                        <div class="mt-3 text-lg font-semibold">${escapeHtml(content.outputTitle)}</div>
                        <div class="mt-4 grid gap-2 text-xs text-white/70">${outputTags}</div>
                      </div>
                    </div>
                  </div>

                  <p class="mt-6 max-w-md text-sm leading-6 text-slate-100/80">${escapeHtml(content.visualCaption)}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
              <h2 class="text-2xl font-semibold text-slate-950">${escapeHtml(content.storyTitle)}</h2>
              <p class="mt-4 text-sm leading-7 text-slate-600 md:text-base">${escapeHtml(content.storyText)}</p>
              <div class="mt-6 grid gap-4 md:grid-cols-3">${renderLinkCards(content.cards)}</div>
            </article>

            <article class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
              <h2 class="text-2xl font-semibold text-slate-950">${escapeHtml(content.visualTitle)}</h2>
              <div class="mt-5 space-y-4">
                <div class="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-sky-50 p-4">
                  <div class="text-xs uppercase tracking-[0.2em] text-indigo-600">Files</div>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <span class="chip">src/</span>
                    <span class="chip">docs/</span>
                    <span class="chip">config/</span>
                  </div>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-indigo-900 p-4 text-white">
                  <div class="text-xs uppercase tracking-[0.2em] text-cyan-100/70">${escapeHtml(content.workflowTitle)}</div>
                  <div class="mt-3 space-y-3">${workflow}</div>
                </div>
              </div>
            </article>
          </section>

          ${renderFaq(content.faq)}
        </main>
      </div>`,
    faq: content.faq,
  }
}

function renderDocsBody(locale) {
  const content = docsContent[locale]

  return {
    html: `
      <div class="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
        <main class="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <section class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
            <h1 class="text-3xl font-bold tracking-tight text-slate-950">${escapeHtml(content.title)}</h1>
            <p class="mt-3 text-sm leading-7 text-slate-600">${escapeHtml(content.subtitle)}</p>
          </section>
          <section class="grid gap-4 md:grid-cols-2">
            ${content.sections
              .map(
                (item, index) => `
                  <article class="rounded-2xl border border-slate-300 bg-white p-5 shadow">
                    <h2 class="text-base font-semibold text-slate-950">${index + 1}</h2>
                    <p class="mt-3 text-sm leading-6 text-slate-600">${escapeHtml(item)}</p>
                  </article>`,
              )
              .join('')}
          </section>
        </main>
      </div>`,
    faq: [],
  }
}

function renderLandingBody(locale, page) {
  const content = landingContent[locale][page]

  return {
    html: `
      <div class="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
        <main class="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <section class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">${escapeHtml(content.eyebrow)}</p>
            <h1 class="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">${escapeHtml(content.title)}</h1>
            <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">${escapeHtml(content.description)}</p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a class="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" href="${siteUrl}/${locale}">${escapeHtml(content.ctaApp)}</a>
              <a class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900" href="${siteUrl}/${locale}/docs">${escapeHtml(content.ctaDocs)}</a>
            </div>
          </section>
          <section class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <article class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
              <h2 class="text-xl font-semibold text-slate-950">${escapeHtml(content.summaryTitle)}</h2>
              <p class="mt-3 text-sm leading-7 text-slate-600">${escapeHtml(content.summary)}</p>
            </article>
            <article class="rounded-[28px] border border-slate-300 bg-white p-6 shadow">
              <h2 class="text-xl font-semibold text-slate-950">${escapeHtml(content.valueTitle)}</h2>
              <ul class="mt-4 space-y-3">${renderBulletCards(content.valuePoints)}</ul>
            </article>
          </section>
          ${renderFaq(content.faq)}
        </main>
      </div>`,
    faq: content.faq,
  }
}

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
    canonical: `${siteUrl}/en`,
    alternates: {
      en: `${siteUrl}/en`,
      uk: `${siteUrl}/uk`,
      xDefault: `${siteUrl}/en`,
    },
    changefreq: 'weekly',
    priority: '1.0',
    featureList: [
      'Merge multiple local files into one AI-ready context',
      'Project tree file selection',
      'Workspace management and rename',
      'Copy merged output to clipboard',
      'Download output as TXT or ZIP',
    ],
    ...renderAppBody('en'),
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
    canonical: `${siteUrl}/uk`,
    alternates: {
      en: `${siteUrl}/en`,
      uk: `${siteUrl}/uk`,
      xDefault: `${siteUrl}/en`,
    },
    changefreq: 'weekly',
    priority: '0.95',
    featureList: [
      'Merge multiple local files into one AI-ready context',
      'Project tree file selection',
      'Workspace management and rename',
      'Copy merged output to clipboard',
      'Download output as TXT or ZIP',
    ],
    ...renderAppBody('uk'),
  },
  {
    outputPath: 'en/about/index.html',
    lang: 'en',
    localeTag: 'en_US',
    alternateLocaleTag: 'uk_UA',
    title: 'About Files To Context - Browser-Only AI Context Builder',
    description:
      'Learn what Files To Context does, why it exists, and how it helps developers turn many project files into clean AI-ready context without backend uploads.',
    ogTitle: 'About Files To Context',
    ogDescription:
      'Explore the Files To Context story, workflow, use cases, and browser-only approach for AI-ready project context.',
    canonical: `${siteUrl}/en/about`,
    alternates: {
      en: `${siteUrl}/en/about`,
      uk: `${siteUrl}/uk/pro-nas`,
      xDefault: `${siteUrl}/en/about`,
    },
    changefreq: 'weekly',
    priority: '0.92',
    featureList: [
      'Learn what Files To Context does',
      'Explore browser-only workflow and use cases',
      'See how project files become AI-ready context',
    ],
    ...renderAboutBody('en'),
  },
  {
    outputPath: 'uk/pro-nas/index.html',
    lang: 'uk',
    localeTag: 'uk_UA',
    alternateLocaleTag: 'en_US',
    title: 'Про Files To Context - локальний конструктор AI-контексту',
    description:
      'Дізнайтесь, що таке Files To Context, навіщо він створений і як допомагає збирати багато файлів проєкту в чистий AI-контекст без сервера.',
    ogTitle: 'Про Files To Context',
    ogDescription:
      'Ознайомтесь з історією, сценаріями використання та локальним browser-only підходом Files To Context.',
    canonical: `${siteUrl}/uk/pro-nas`,
    alternates: {
      en: `${siteUrl}/en/about`,
      uk: `${siteUrl}/uk/pro-nas`,
      xDefault: `${siteUrl}/en/about`,
    },
    changefreq: 'weekly',
    priority: '0.9',
    featureList: [
      'Дізнайтесь, що робить Files To Context',
      'Ознайомтесь із browser-only сценарієм роботи',
      'Подивіться, як файли стають AI-контекстом',
    ],
    ...renderAboutBody('uk'),
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
    canonical: `${siteUrl}/en/docs`,
    alternates: {
      en: `${siteUrl}/en/docs`,
      uk: `${siteUrl}/uk/docs`,
      xDefault: `${siteUrl}/en/docs`,
    },
    changefreq: 'monthly',
    priority: '0.8',
    featureList: [
      'Documentation for workspaces, presets, and project tree selection',
      'Browser-only file merging workflow',
      'Export merged AI-ready context as TXT or ZIP',
    ],
    ...renderDocsBody('en'),
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
    canonical: `${siteUrl}/uk/docs`,
    alternates: {
      en: `${siteUrl}/en/docs`,
      uk: `${siteUrl}/uk/docs`,
      xDefault: `${siteUrl}/en/docs`,
    },
    changefreq: 'monthly',
    priority: '0.8',
    featureList: [
      'Documentation for workspaces, presets, and project tree selection',
      'Browser-only file merging workflow',
      'Export merged AI-ready context as TXT or ZIP',
    ],
    ...renderDocsBody('uk'),
  },
  {
    outputPath: 'en/chatgpt-context/index.html',
    lang: 'en',
    localeTag: 'en_US',
    alternateLocaleTag: 'uk_UA',
    title: 'Files To Context for ChatGPT - Build Clean Project Context Fast',
    description:
      'Prepare repository context for ChatGPT from many local files in one browser-only workspace. Filter files, copy instantly, or download a ready-to-paste context file.',
    ogTitle: 'Files To Context for ChatGPT',
    ogDescription:
      'Build clean ChatGPT-ready context from your codebase with project tree selection, presets, and zero backend uploads.',
    canonical: `${siteUrl}/en/chatgpt-context`,
    alternates: {
      en: `${siteUrl}/en/chatgpt-context`,
      uk: `${siteUrl}/uk/kontekst-dlya-chatgpt`,
      xDefault: `${siteUrl}/en/chatgpt-context`,
    },
    changefreq: 'weekly',
    priority: '0.9',
    featureList: [
      'Prepare repository context for ChatGPT',
      'Filter repository files with project tree selection',
      'Copy or export prompt-ready AI context',
    ],
    ...renderLandingBody('en', 'chatgptContext'),
  },
  {
    outputPath: 'uk/kontekst-dlya-chatgpt/index.html',
    lang: 'uk',
    localeTag: 'uk_UA',
    alternateLocaleTag: 'en_US',
    title: 'Files To Context для ChatGPT - Підготуйте контекст із файлів',
    description:
      'Підготуйте чистий контекст для ChatGPT з багатьох локальних файлів у браузері. Відбирайте потрібні папки, копіюйте результат або завантажуйте готовий файл.',
    ogTitle: 'Files To Context для ChatGPT',
    ogDescription:
      'Збирайте контекст для ChatGPT з вашого проєкту через дерево файлів, пресети та локальне обʼєднання без сервера.',
    canonical: `${siteUrl}/uk/kontekst-dlya-chatgpt`,
    alternates: {
      en: `${siteUrl}/en/chatgpt-context`,
      uk: `${siteUrl}/uk/kontekst-dlya-chatgpt`,
      xDefault: `${siteUrl}/en/chatgpt-context`,
    },
    changefreq: 'weekly',
    priority: '0.88',
    featureList: [
      'Prepare repository context for ChatGPT',
      'Filter repository files with project tree selection',
      'Copy or export prompt-ready AI context',
    ],
    ...renderLandingBody('uk', 'chatgptContext'),
  },
  {
    outputPath: 'en/merge-code-files/index.html',
    lang: 'en',
    localeTag: 'en_US',
    alternateLocaleTag: 'uk_UA',
    title: 'Merge Code Files Online - Files To Context',
    description:
      'Merge code and text files into one structured output for reviews, audits, AI prompts, or handoff docs. Works locally in your browser with TXT and ZIP export.',
    ogTitle: 'Merge Code Files Online with Files To Context',
    ogDescription:
      'Combine many code files into one organized output with separators, presets, and browser-only privacy.',
    canonical: `${siteUrl}/en/merge-code-files`,
    alternates: {
      en: `${siteUrl}/en/merge-code-files`,
      uk: `${siteUrl}/uk/obyednaty-kodovi-faily`,
      xDefault: `${siteUrl}/en/merge-code-files`,
    },
    changefreq: 'weekly',
    priority: '0.86',
    featureList: [
      'Merge code files online in your browser',
      'Use separators and presets for structured output',
      'Export merged files as TXT or ZIP',
    ],
    ...renderLandingBody('en', 'mergeCodeFiles'),
  },
  {
    outputPath: 'uk/obyednaty-kodovi-faily/index.html',
    lang: 'uk',
    localeTag: 'uk_UA',
    alternateLocaleTag: 'en_US',
    title: 'Обʼєднати кодові файли онлайн - Files To Context',
    description:
      'Обʼєднуйте кодові й текстові файли в один структурований результат для ревʼю, аудиту, AI-запитів або документації. Усе працює локально в браузері.',
    ogTitle: 'Обʼєднання кодових файлів з Files To Context',
    ogDescription:
      'Поєднуйте багато кодових файлів в один впорядкований результат із розділювачами, пресетами та приватною локальною обробкою.',
    canonical: `${siteUrl}/uk/obyednaty-kodovi-faily`,
    alternates: {
      en: `${siteUrl}/en/merge-code-files`,
      uk: `${siteUrl}/uk/obyednaty-kodovi-faily`,
      xDefault: `${siteUrl}/en/merge-code-files`,
    },
    changefreq: 'weekly',
    priority: '0.84',
    featureList: [
      'Merge code files online in your browser',
      'Use separators and presets for structured output',
      'Export merged files as TXT or ZIP',
    ],
    ...renderLandingBody('uk', 'mergeCodeFiles'),
  },
]

function replaceTagContent(html, pattern, nextContent) {
  return html.replace(pattern, `$1${nextContent}$3`)
}

function buildStructuredData(variant) {
  const scripts = [
    `<script type="application/ld+json">\n${JSON.stringify(buildSoftwareJson(variant), null, 2)}\n    </script>`,
  ]

  if (variant.faq.length > 0) {
    scripts.push(
      `<script type="application/ld+json">\n${JSON.stringify(buildFaqJson(variant.faq), null, 2)}\n    </script>`,
    )
  }

  return scripts.join('\n    ')
}

function applyVariant(template, variant) {
  let html = template

  html = html.replace(/<html lang="[^"]*">/, `<html lang="${variant.lang}">`)
  html = replaceTagContent(html, /(<title>)([\s\S]*?)(<\/title>)/, variant.title)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(variant.description)}" />`,
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
    `<meta property="og:title" content="${escapeHtml(variant.ogTitle)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(variant.ogDescription)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${variant.canonical}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(variant.ogTitle)}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(variant.ogDescription)}" />`,
  )
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${variant.canonical}" />`,
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

  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    buildStructuredData(variant),
  )

  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${variant.html}\n    </div>`)

  return html
}

function buildSitemap(items) {
  const urls = items
    .map(
      (item) => `  <url>
    <loc>${item.canonical}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${item.alternates.en}" />
    <xhtml:link rel="alternate" hreflang="uk" href="${item.alternates.uk}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${item.alternates.xDefault}" />
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

try {
  const baseHtml = await readFile(sourceFile, 'utf-8')

  for (const variant of variants) {
    const outputFile = resolve(distDir, variant.outputPath)
    const localizedHtml = applyVariant(baseHtml, variant)
    await mkdir(dirname(outputFile), { recursive: true })
    await writeFile(outputFile, localizedHtml, 'utf-8')
  }

  await writeFile(sitemapFile, buildSitemap(variants), 'utf-8')
  console.log(`Generated ${variants.length} localized route pages and sitemap`)
} catch (error) {
  console.error('Failed to generate localized pages:', error)
  process.exitCode = 1
}
