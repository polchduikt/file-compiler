import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nContextValue, type TranslateParams } from './context'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  translations,
  type Locale,
} from './translations'

function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.some((locale) => locale.code === value)
}

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  const persisted = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (persisted && isSupportedLocale(persisted)) {
    return persisted
  }

  const candidates = [...navigator.languages, navigator.language]
    .filter(Boolean)
    .map((language) => language.toLowerCase())

  if (candidates.some((language) => language.startsWith('uk'))) {
    return 'uk'
  }

  return DEFAULT_LOCALE
}

function formatTemplate(template: string, params: TranslateParams = {}) {
  return template.replace(/\{(\w+)\}/g, (_, token: string) =>
    token in params ? String(params[token]) : `{${token}}`,
  )
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => detectBrowserLocale())

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale])

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = translations[locale]
    const fallback = translations.en

    return {
      locale,
      setLocale,
      t: (key, params) => {
        const value = dictionary[key] ?? fallback[key] ?? key
        return formatTemplate(value, params)
      },
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
