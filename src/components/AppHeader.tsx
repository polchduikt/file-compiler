import type { I18nContextValue } from '../i18n/context'
import type { Locale } from '../i18n/translations'
import type { AppPage } from '../lib/routing'
import type { Theme } from '../hooks/useAppChrome'

type AppHeaderProps = {
  activePage: AppPage
  locale: Locale
  onNavigatePage: (page: AppPage) => void
  onSwitchLocale: (locale: Locale) => void
  onThemeChange: (theme: Theme) => void
  t: I18nContextValue['t']
  theme: Theme
}

export function AppHeader({
  activePage,
  locale,
  onNavigatePage,
  onSwitchLocale,
  onThemeChange,
  t,
  theme,
}: AppHeaderProps) {
  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-6 px-6 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <img
              src="./logo.png"
              alt="Files To Context logo"
              className="h-10 w-10 shrink-0 object-contain"
            />
            <button
              type="button"
              className="text-lg font-bold tracking-tight hover:text-indigo-300"
              title={t('tooltip.navHome')}
              onClick={() => onNavigatePage('app')}
            >
              {t('app.title')}
            </button>
            <div className="ml-2 flex items-center gap-2">
              <button
                type="button"
                className={activePage === 'docs' ? 'btn btn-primary h-9 px-3' : 'btn h-9 px-3'}
                title={t('tooltip.navDocs')}
                onClick={() => onNavigatePage('docs')}
              >
                {t('nav.documentation')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="segmented-control" role="group" aria-label={t('language.label')}>
            <button
              type="button"
              className={locale === 'en' ? 'segment is-active' : 'segment'}
              title={t('tooltip.langEn')}
              onClick={() => onSwitchLocale('en')}
            >
              {t('language.short.en')}
            </button>
            <button
              type="button"
              className={locale === 'uk' ? 'segment is-active' : 'segment'}
              title={t('tooltip.langUk')}
              onClick={() => onSwitchLocale('uk')}
            >
              {t('language.short.uk')}
            </button>
          </div>

          <div className="segmented-control" role="group" aria-label={t('theme.label')}>
            <button
              type="button"
              className={theme === 'light' ? 'segment is-active' : 'segment'}
              title={t('tooltip.themeLight')}
              onClick={() => onThemeChange('light')}
            >
              {t('theme.light')}
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'segment is-active' : 'segment'}
              title={t('tooltip.themeDark')}
              onClick={() => onThemeChange('dark')}
            >
              {t('theme.dark')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
