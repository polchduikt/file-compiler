import { createContext } from 'react'
import type { Locale, TranslationKey } from './translations'

export type TranslateParams = Record<string, number | string>

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: TranslateParams) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)
