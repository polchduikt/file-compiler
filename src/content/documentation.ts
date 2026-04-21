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
    subtitle: 'How to use Files To Context quickly and correctly.',
    sections: [
      {
        title: '1. Workspaces',
        points: [
          'Use the workspace dropdown to switch between separate merge sessions.',
          'Click New to create another workspace and keep tasks isolated.',
          'Click Rename to change the current workspace name.',
          'Click Delete to remove the current workspace (the last workspace cannot be deleted).',
          'Use Export to save the active workspace as a JSON backup.',
          'Use Import to restore a workspace backup and continue in a new workspace.',
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
        title: '3. Merge Options and Presets',
        points: [
          'Use Presets to apply stack-specific merge options in one click (Java, JS/TS, React, Node.js, Python, C#, PHP, Go, Rust, Kotlin, Swift, Ruby, DevOps, Docs).',
          'Include all extensions merges every text file type.',
          'Include extensions lets you whitelist specific extensions such as .ts, .js, .md.',
          'Smart separators and Separator template control how file boundaries are marked.',
          'Output file name and Download as ZIP define the exported format.',
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
        title: '6. Project Tree Selection',
        points: [
          'Click Project tree in the upload panel to open a modal file tree.',
          'Use the search field to filter files/folders by name.',
          'Expand folders and select only the files or folders you need.',
          'Use Select all and Clear all in one row for fast bulk actions.',
          'Click Add selected files to import only chosen files into the workspace.',
        ],
      },
    ],
    footer:
      'Tip: Create one workspace per project or feature branch and keep JSON backups for reusable contexts.',
  },
  uk: {
    title: 'Документація',
    subtitle: 'Як швидко та правильно користуватися Files To Context.',
    sections: [
      {
        title: '1. Робочі простори',
        points: [
          'Використовуйте список робочих просторів, щоб перемикатися між окремими сесіями обʼєднання.',
          'Кнопка Новий створює новий робочий простір для іншого завдання.',
          'Кнопка Перейменувати змінює назву поточного робочого простору.',
          'Кнопка Видалити видаляє поточний простір (останній простір видалити не можна).',
          'Кнопка Експорт зберігає активний робочий простір у JSON-бекап.',
          'Кнопка Імпорт відновлює бекап у новий робочий простір.',
        ],
      },
      {
        title: '2. Додавання файлів',
        points: [
          'Перетягніть файли в dropzone або натисніть Додати файли.',
          'Кнопка Додати папку додає всю структуру папки з пристрою.',
          'Усі файли обробляються локально в браузері без відправки на сервер.',
        ],
      },
      {
        title: '3. Параметри обʼєднання і пресети',
        points: [
          'Пресети дозволяють одним кліком застосувати налаштування під популярні стеки (Java, JS/TS, React, Node.js, Python, C#, PHP, Go, Rust, Kotlin, Swift, Ruby, DevOps, Docs).',
          'Включати всі розширення обʼєднує всі текстові типи файлів.',
          'Включати розширення дозволяє залишити лише вибрані типи (.ts, .js, .md тощо).',
          'Розумні розділювачі та Шаблон розділювача керують межами між файлами.',
          'Назва вихідного файлу та Завантажити як ZIP визначають формат експорту.',
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
        title: '6. Вибір через дерево проєкту',
        points: [
          'Натисніть Дерево проєкту в панелі завантаження, щоб відкрити модальне дерево файлів.',
          'Використовуйте поле пошуку, щоб фільтрувати файли/папки за назвою.',
          'Розгортайте папки та обирайте тільки потрібні файли або цілі папки.',
          'Кнопки Обрати все та Очистити вибір розташовані в один ряд для швидкої масової дії.',
          'Натисніть Додати вибрані файли, щоб імпортувати лише вибрані елементи в робочий простір.',
        ],
      },
    ],
    footer:
      'Порада: робіть окремий робочий простір під кожен проєкт або фічу та зберігайте JSON-бекапи для швидкого відновлення.',
  },
}

export function getDocumentationContent(locale: Locale) {
  return documentationByLocale[locale] ?? documentationByLocale.en
}
