import { getDocumentationContent } from '../content/documentation'
import { useI18n } from '../i18n/useI18n'

export function DocumentationPage() {
  const { locale } = useI18n()
  const content = getDocumentationContent(locale)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="rounded-xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
        <h2 className="text-2xl font-bold tracking-tight">{content.title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{content.subtitle}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {content.sections.map((section) => (
          <article
            key={section.title}
            className="rounded-xl border border-slate-300 bg-white p-5 shadow dark:border-white/15 dark:bg-white/5"
          >
            <h3 className="text-base font-semibold">{section.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {section.points.map((point) => (
                <li key={point} className="leading-6">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="rounded-xl border border-slate-300 bg-white p-5 text-sm text-slate-700 shadow dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
        {content.footer}
      </section>
    </div>
  )
}
