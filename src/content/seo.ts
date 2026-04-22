import type { Locale } from '../i18n/translations'
import type { AppPage } from '../lib/routing'

type FaqItem = {
  answer: string
  question: string
}

type PageMeta = {
  description: string
  ogDescription: string
  ogTitle: string
  title: string
}

type UseCaseLink = {
  description: string
  page: AppPage
  title: string
}

type HomeContent = {
  ctaApp: string
  ctaDocs: string
  description: string
  eyebrow: string
  faq: FaqItem[]
  features: string[]
  title: string
  useCases: UseCaseLink[]
}

type LandingContent = {
  ctaApp: string
  ctaDocs: string
  description: string
  eyebrow: string
  faq: FaqItem[]
  summary: string
  title: string
  valuePoints: string[]
}

const pageMetaByLocale: Record<Locale, Record<AppPage, PageMeta>> = {
  en: {
    app: {
      title: 'Files To Context - Merge Files into AI-Ready Context',
      description:
        'Collect many code and text files into one AI-ready context in your browser. Organize by workspace, copy instantly, or download as TXT/ZIP.',
      ogTitle: 'Files To Context - Build AI-Ready Context from Your Files',
      ogDescription:
        'Collect many project files into one clean AI-ready context in-browser. Fast copy/download, no backend uploads.',
    },
    about: {
      title: 'About Files To Context - Browser-Only AI Context Builder',
      description:
        'Learn what Files To Context does, why it exists, and how it helps developers turn many project files into clean AI-ready context without backend uploads.',
      ogTitle: 'About Files To Context',
      ogDescription:
        'Explore the Files To Context story, workflow, use cases, and browser-only approach for AI-ready project context.',
    },
    docs: {
      title: 'Documentation - Files To Context',
      description:
        'Documentation for Files To Context: workspaces, project tree, presets, and exporting AI-ready context.',
      ogTitle: 'Files To Context Documentation',
      ogDescription:
        'Learn how to use workspaces, merge presets, project tree selection, and output actions in Files To Context.',
    },
    chatgptContext: {
      title: 'Files To Context for ChatGPT - Build Clean Project Context Fast',
      description:
        'Prepare repository context for ChatGPT from many local files in one browser-only workspace. Filter files, copy instantly, or download a ready-to-paste context file.',
      ogTitle: 'Files To Context for ChatGPT',
      ogDescription:
        'Build clean ChatGPT-ready context from your codebase with project tree selection, presets, and zero backend uploads.',
    },
    mergeCodeFiles: {
      title: 'Merge Code Files Online - Files To Context',
      description:
        'Merge code and text files into one structured output for reviews, audits, AI prompts, or handoff docs. Works locally in your browser with TXT and ZIP export.',
      ogTitle: 'Merge Code Files Online with Files To Context',
      ogDescription:
        'Combine many code files into one organized output with separators, presets, and browser-only privacy.',
    },
  },
  uk: {
    app: {
      title: 'Files To Context - Обʼєднуйте файли в AI-контекст',
      description:
        'Збирайте багато кодових і текстових файлів в один AI-контекст прямо у браузері. Керуйте робочими просторами, копіюйте результат або завантажуйте TXT/ZIP.',
      ogTitle: 'Files To Context - Збирайте контекст для нейромереж',
      ogDescription:
        'Обʼєднуйте файли проєкту в один чистий AI-контекст у браузері. Швидке копіювання та завантаження без бекенду.',
    },
    about: {
      title: 'Про Files To Context - локальний конструктор AI-контексту',
      description:
        'Дізнайтесь, що таке Files To Context, навіщо він створений і як допомагає збирати багато файлів проєкту в чистий AI-контекст без сервера.',
      ogTitle: 'Про Files To Context',
      ogDescription:
        'Ознайомтесь з історією, сценаріями використання та локальним browser-only підходом Files To Context.',
    },
    docs: {
      title: 'Документація - Files To Context',
      description:
        'Документація Files To Context: робочі простори, дерево проєкту, пресети та експорт AI-контексту.',
      ogTitle: 'Документація Files To Context',
      ogDescription:
        'Дізнайтесь, як працювати з робочими просторами, деревом проєкту, пресетами та вивантаженням AI-контексту.',
    },
    chatgptContext: {
      title: 'Files To Context для ChatGPT - Підготуйте контекст із файлів',
      description:
        'Підготуйте чистий контекст для ChatGPT з багатьох локальних файлів у браузері. Відбирайте потрібні папки, копіюйте результат або завантажуйте готовий файл.',
      ogTitle: 'Files To Context для ChatGPT',
      ogDescription:
        'Збирайте контекст для ChatGPT з вашого проєкту через дерево файлів, пресети та локальне обʼєднання без сервера.',
    },
    mergeCodeFiles: {
      title: 'Обʼєднати кодові файли онлайн - Files To Context',
      description:
        'Обʼєднуйте кодові й текстові файли в один структурований результат для ревʼю, аудиту, AI-запитів або документації. Усе працює локально в браузері.',
      ogTitle: 'Обʼєднання кодових файлів з Files To Context',
      ogDescription:
        'Поєднуйте багато кодових файлів в один впорядкований результат із розділювачами, пресетами та приватною локальною обробкою.',
    },
  },
}

const homeContentByLocale: Record<Locale, HomeContent> = {
  en: {
    eyebrow: 'Browser-only AI context builder',
    title: 'Turn project files into one clean context for AI tools',
    description:
      'Files To Context helps you collect repository files, docs, configs, and notes into one structured output for ChatGPT, Claude, audits, code reviews, and handoff docs.',
    features: [
      'Browser-only processing with no backend uploads',
      'Project tree selection for precise file scope',
      'Workspace backups, presets, TXT and ZIP export',
    ],
    ctaApp: 'Open the app',
    ctaDocs: 'Read documentation',
    useCases: [
      {
        page: 'chatgptContext',
        title: 'Prepare ChatGPT context',
        description: 'Pick only the useful folders and generate a clean prompt-ready project context.',
      },
      {
        page: 'mergeCodeFiles',
        title: 'Merge code files online',
        description: 'Combine many files into one readable output for reviews, audits, and documentation.',
      },
      {
        page: 'docs',
        title: 'Learn the workflow',
        description: 'See how workspaces, presets, file trees, export, and download options work.',
      },
    ],
    faq: [
      {
        question: 'Does Files To Context upload my files to a server?',
        answer:
          'No. Files are processed locally in your browser, so you can build context without backend uploads.',
      },
      {
        question: 'Can I choose only part of a repository?',
        answer:
          'Yes. Use the project tree to expand folders, search by name, and include only the files you want.',
      },
      {
        question: 'What can I do with the merged result?',
        answer:
          'You can copy it to the clipboard, download it as TXT, or export it as ZIP depending on your workspace settings.',
      },
    ],
  },
  uk: {
    eyebrow: 'Локальний конструктор AI-контексту',
    title: 'Перетворюйте файли проєкту в один чистий контекст для AI-інструментів',
    description:
      'Files To Context допомагає зібрати код, документацію, конфіги та нотатки в один структурований результат для ChatGPT, Claude, ревʼю, аудиту та передачі контексту.',
    features: [
      'Локальна обробка в браузері без завантаження на сервер',
      'Дерево проєкту для точного вибору файлів',
      'Бекапи воркспейсів, пресети, TXT та ZIP експорт',
    ],
    ctaApp: 'Відкрити застосунок',
    ctaDocs: 'Перейти до документації',
    useCases: [
      {
        page: 'chatgptContext',
        title: 'Підготувати контекст для ChatGPT',
        description: 'Оберіть лише потрібні папки й створіть чистий контекст для prompt або аналізу.',
      },
      {
        page: 'mergeCodeFiles',
        title: 'Обʼєднати кодові файли',
        description: 'Зберіть багато файлів в один читабельний результат для ревʼю, аудиту чи документації.',
      },
      {
        page: 'docs',
        title: 'Подивитися інструкцію',
        description: 'Дізнайтесь, як працюють воркспейси, пресети, дерево файлів та експорт результату.',
      },
    ],
    faq: [
      {
        question: 'Files To Context завантажує файли на сервер?',
        answer:
          'Ні. Файли обробляються локально у браузері, тому ви можете збирати контекст без бекенду.',
      },
      {
        question: 'Чи можна вибрати лише частину репозиторію?',
        answer:
          'Так. Використовуйте дерево проєкту, пошук по назві та вибір окремих папок або файлів.',
      },
      {
        question: 'Що можна зробити з результатом?',
        answer:
          'Результат можна скопіювати в буфер, завантажити як TXT або експортувати як ZIP залежно від налаштувань.',
      },
    ],
  },
}

const landingContentByLocale: Record<
  Locale,
  Record<'chatgptContext' | 'mergeCodeFiles', LandingContent>
> = {
  en: {
    chatgptContext: {
      eyebrow: 'ChatGPT workflow',
      title: 'Prepare repository context for ChatGPT without manual copy-paste chaos',
      description:
        'Select only the useful files, merge them in a readable order, and create one clean context block that is easier for ChatGPT or other AI tools to understand.',
      summary:
        'This page is built for developers, reviewers, and teams who need to compress a large codebase into something AI can actually reason about.',
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
      summary:
        'This is useful when you need a single file for architecture review, documentation handoff, security audit, onboarding, or LLM context preparation.',
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
      summary:
        'Ця сторінка корисна для розробників і команд, яким потрібно стиснути великий кодовий проєкт у формат, зручний для аналізу нейромережами.',
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
      summary:
        'Це корисно, коли потрібен один файл для архітектурного ревʼю, передачі документації, безпекового аудиту, онбордингу або підготовки LLM-контексту.',
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

export function getPageMeta(locale: Locale, page: AppPage) {
  return pageMetaByLocale[locale][page]
}

export function getHomeSeoContent(locale: Locale) {
  return homeContentByLocale[locale]
}

export function getLandingPageContent(
  locale: Locale,
  page: Extract<AppPage, 'chatgptContext' | 'mergeCodeFiles'>,
) {
  return landingContentByLocale[locale][page]
}

export function getFaqItems(locale: Locale, page: AppPage) {
  if (page === 'app') return homeContentByLocale[locale].faq
  if (page === 'chatgptContext' || page === 'mergeCodeFiles') {
    return landingContentByLocale[locale][page].faq
  }
  return []
}
