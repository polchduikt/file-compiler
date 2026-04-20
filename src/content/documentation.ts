import type { Locale } from '../i18n/translations'

type DocumentationSection = {
  title: string
  points: string[]
}

type DocumentationContent = {
  title: string
  subtitle: string
  sections: DocumentationSection[]
  footer: string
}

const documentationByLocale: Record<Locale, DocumentationContent> = {
  en: {
    title: 'Documentation',
    subtitle: 'How to use File Compiler quickly and correctly.',
    sections: [
      {
        title: '1. Workspaces',
        points: [
          'Use the workspace dropdown to switch between separate merge sessions.',
          'Click New to create another workspace and keep different tasks isolated.',
          'Click Delete to remove the current workspace (the last workspace cannot be deleted).',
        ],
      },
      {
        title: '2. Add Files',
        points: [
          'Drag and drop files into the dropzone, or click Add files.',
          'Use Add folder to ingest a whole folder structure from your device.',
          'Files are processed locally in your browser; nothing is uploaded to a server.',
        ],
      },
      {
        title: '3. Merge Options',
        points: [
          'Include all extensions merges every text file type.',
          'Include extensions lets you whitelist specific extensions such as .ts, .js, .md.',
          'Smart separators and Separator template control how file boundaries are marked.',
          'Output file name and Download as ZIP define the exported result format.',
        ],
      },
      {
        title: '4. Files List',
        points: [
          'Review all added files, their extensions, and sizes.',
          'Remove deletes one file from the current workspace.',
          'Clear removes all files from the current workspace.',
        ],
      },
      {
        title: '5. Preview and Export',
        points: [
          'Preview updates automatically whenever files or options change.',
          'Copy sends the merged output to your clipboard.',
          'Download saves the merged result as a text file or ZIP, depending on your settings.',
        ],
      },
      {
        title: '6. Language and Theme',
        points: [
          'Use ENG/UA in the top navigation to switch interface language.',
          'Use Light/Dark to change visual theme instantly.',
        ],
      },
    ],
    footer:
      'Tip: Create one workspace per project or feature branch to keep context clean and reusable.',
  },
  uk: {
    title: 'Документація',
    subtitle: 'Як швидко і правильно користуватися File Compiler.',
    sections: [
      {
        title: '1. Робочі простори',
        points: [
          'Використовуйте список робочих просторів, щоб перемикатися між окремими сесіями.',
          'Кнопка Новий створює новий робочий простір для іншого завдання.',
          'Кнопка Видалити видаляє поточний простір (останній простір видалити не можна).',
        ],
      },
      {
        title: '2. Додавання файлів',
        points: [
          'Перетягніть файли в dropzone або натисніть Додати файли.',
          'Кнопка Додати папку додає одразу всю структуру папки.',
          'Усі файли обробляються локально в браузері без відправки на сервер.',
        ],
      },
      {
        title: '3. Параметри обʼєднання',
        points: [
          'Включати всі розширення обʼєднує всі текстові типи файлів.',
          'Включати розширення дозволяє залишити лише вибрані типи (.ts, .js, .md тощо).',
          'Розумні розділювачі і Шаблон розділювача керують межами між файлами.',
          'Назва вихідного файлу і Завантажити як ZIP визначають формат експорту.',
        ],
      },
      {
        title: '4. Список файлів',
        points: [
          'Переглядайте всі додані файли, їх розширення та розмір.',
          'Прибрати видаляє один файл із поточного робочого простору.',
          'Очистити видаляє всі файли з поточного робочого простору.',
        ],
      },
      {
        title: '5. Перегляд і експорт',
        points: [
          'Перегляд оновлюється автоматично при зміні файлів або налаштувань.',
          'Копіювати записує обʼєднаний результат у буфер обміну.',
          'Завантажити зберігає результат як текстовий файл або ZIP (за налаштуванням).',
        ],
      },
      {
        title: '6. Мова і тема',
        points: [
          'У верхньому меню ENG/UA перемикає мову інтерфейсу.',
          'Світла/Темна миттєво перемикає тему оформлення.',
        ],
      },
    ],
    footer:
      'Порада: робіть окремий робочий простір під кожен проєкт або фічу, щоб контекст був чистим.',
  },
}

export function getDocumentationContent(locale: Locale) {
  return documentationByLocale[locale] ?? documentationByLocale.en
}
