import { getLandingPageContent } from '../content/seo'
import { useI18n } from '../i18n/useI18n'
import { buildLocalizedPath, type AppPage } from '../lib/routing'

type LandingPageProps = {
  page: Extract<AppPage, 'chatgptContext' | 'mergeCodeFiles'>
}

export function LandingPage({ page }: LandingPageProps) {
  const { locale } = useI18n()
  const content = getLandingPageContent(locale, page)
  const summaryHeading = locale === 'uk' ? 'Чому це важливо' : 'Why this page matters'
  const valueHeading = locale === 'uk' ? 'Ключова цінність' : 'Key value'
  const faqHeading = 'FAQ'

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
          {content.eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
          {content.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn btn-primary" href={buildLocalizedPath(locale, 'app')}>
            {content.ctaApp}
          </a>
          <a className="btn" href={buildLocalizedPath(locale, 'docs')}>
            {content.ctaDocs}
          </a>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{summaryHeading}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {content.summary}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{valueHeading}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {content.valuePoints.map((item) => (
              <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{faqHeading}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {content.faq.map((item) => (
            <article
              key={item.question}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
