import { getHomeSeoContent } from '../content/seo'
import { useI18n } from '../i18n/useI18n'
import { buildLocalizedPath } from '../lib/routing'

export function AboutPage() {
  const { locale } = useI18n()
  const content = getHomeSeoContent(locale)

  const storyTitle = locale === 'uk' ? 'Чому ми це створили' : 'Why we built it'
  const storyText =
    locale === 'uk'
      ? 'Files To Context створений для ситуацій, коли проєкт уже завеликий для ручного копіювання, але вам потрібно швидко передати його структуру, код і документацію в одну зрозумілу форму.'
      : 'Files To Context was built for the moment when a project becomes too large for manual copy-paste, but you still need to turn its structure, code, and docs into one readable context block.'
  const visualTitle = locale === 'uk' ? 'Як це виглядає' : 'How it works visually'
  const workflowTitle = locale === 'uk' ? 'Сценарій роботи' : 'Typical workflow'
  const workflowSteps =
    locale === 'uk'
      ? [
          'Оберіть лише потрібні файли або папки через дерево проєкту.',
          'Застосуйте пресет і сформуйте чистий структурований результат.',
          'Скопіюйте контекст або завантажте його для ChatGPT, Claude чи документації.',
        ]
      : [
          'Choose only the folders and files you need with the project tree.',
          'Apply a preset and shape one clean, structured output.',
          'Copy the final context or download it for ChatGPT, Claude, or docs.',
        ]
  const illustrationLabels =
    locale === 'uk'
      ? {
          sourceA: 'Controller.java',
          sourceB: 'README.md',
          sourceC: 'config.yml',
          result: 'AI Context',
          browser: 'Browser-only',
        }
      : {
          sourceA: 'Controller.java',
          sourceB: 'README.md',
          sourceC: 'config.yml',
          result: 'AI Context',
          browser: 'Browser-only',
        }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow dark:border-white/15 dark:bg-white/5">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-indigo-600 dark:text-indigo-300">
                {content.eyebrow}
              </p>
              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-5xl">
                {content.title}
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                {content.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {content.features.map((feature) => (
                <span key={feature} className="chip px-3 py-1.5 text-xs md:text-sm">
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a className="btn btn-primary" href={buildLocalizedPath(locale, 'app')}>
                {content.ctaApp}
              </a>
              <a className="btn" href={buildLocalizedPath(locale, 'docs')}>
                {content.ctaDocs}
              </a>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-indigo-300/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900 p-6 text-white shadow-2xl dark:border-white/10">
            <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-sky-400/20 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-sky-100">
                {illustrationLabels.browser}
              </div>

              <div className="relative mt-6 flex min-h-[220px] items-center justify-between gap-4">
                <div className="flex w-44 flex-col gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-white/60">01</div>
                    <div className="mt-1 text-sm font-semibold">{illustrationLabels.sourceA}</div>
                  </div>
                  <div className="translate-x-6 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-white/60">02</div>
                    <div className="mt-1 text-sm font-semibold">{illustrationLabels.sourceB}</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-white/60">03</div>
                    <div className="mt-1 text-sm font-semibold">{illustrationLabels.sourceC}</div>
                  </div>
                </div>

                <div className="relative flex flex-1 items-center justify-center">
                  <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
                  <div className="absolute h-20 w-20 rounded-full border border-cyan-300/40 bg-cyan-300/10 blur-xl" />
                  <div className="relative h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,0.95)]" />
                </div>

                <div className="relative w-44">
                  <div className="rounded-[24px] border border-cyan-300/30 bg-white/12 p-5 shadow-[0_20px_60px_rgba(14,165,233,0.2)] backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">Output</div>
                    <div className="mt-3 text-lg font-semibold">{illustrationLabels.result}</div>
                    <div className="mt-4 grid gap-2 text-xs text-white/70">
                      <div className="rounded-full bg-white/10 px-3 py-1">Prompt-ready</div>
                      <div className="rounded-full bg-white/10 px-3 py-1">Structured</div>
                      <div className="rounded-full bg-white/10 px-3 py-1">Copy / TXT / ZIP</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-md text-sm leading-6 text-slate-100/80">
                {locale === 'uk'
                  ? 'Замість хаотичного копіювання з різних папок ви отримуєте один чистий, читабельний контекст для AI.'
                  : 'Instead of chaotic copy-paste from scattered folders, you get one clean, readable context block for AI.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{storyTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
            {storyText}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {content.useCases.map((item) => (
              <a
                key={item.page}
                href={buildLocalizedPath(locale, item.page)}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/70 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-indigo-400/40 dark:hover:bg-indigo-500/10"
              >
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{visualTitle}</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-sky-50 p-4 dark:border-white/10 dark:from-indigo-500/10 dark:to-sky-400/10">
              <div className="text-xs uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Files</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip">src/</span>
                <span className="chip">docs/</span>
                <span className="chip">config/</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-indigo-900 p-4 text-white dark:border-white/10">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                {workflowTitle}
              </div>
              <div className="mt-3 space-y-3">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-100/90">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow dark:border-white/15 dark:bg-white/5">
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">FAQ</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {content.faq.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40"
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
