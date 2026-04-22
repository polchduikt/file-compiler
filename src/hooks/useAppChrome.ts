import { useEffect, useState } from 'react'
import { getPageMeta } from '../content/seo'
import type { Locale } from '../i18n/translations'
import {
  appPathToBrowserPath,
  buildLocalizedPath,
  resolveRoute,
  type AppPage,
} from '../lib/routing'

export type Theme = 'light' | 'dark'

type UseAppChromeParams = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const THEME_STORAGE_KEY = 'file-compiler:theme:v1'
const APP_BASE_PATH = import.meta.env.BASE_URL || '/'

function detectTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const persisted = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (persisted === 'light' || persisted === 'dark') {
    return persisted
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useAppChrome({ locale, setLocale }: UseAppChromeParams) {
  const [theme, setTheme] = useState<Theme>(() => detectTheme())
  const [activePage, setActivePage] = useState<AppPage>('app')

  useEffect(() => {
    const pageMeta = getPageMeta(locale, activePage)
    document.title = pageMeta.title
    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute('content', pageMeta.description)
    }

    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const canonicalPath = buildLocalizedPath(locale, activePage)
    const canonicalUrl = new URL(canonicalPath, window.location.origin).toString()
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl)
    }

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl)
    }

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', pageMeta.ogTitle)
    }

    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', pageMeta.ogDescription)
    }

    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', pageMeta.ogTitle)
    }

    const twitterDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="twitter:description"]',
    )
    if (twitterDescription) {
      twitterDescription.setAttribute('content', pageMeta.ogDescription)
    }
  }, [activePage, locale])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    root.style.colorScheme = theme

    window.localStorage.setItem(THEME_STORAGE_KEY, theme)

    const themeColorTag = document.querySelector('meta[name="theme-color"]')
    if (themeColorTag) {
      themeColorTag.setAttribute('content', theme === 'dark' ? '#020817' : '#f8fafc')
    }
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const syncRouteWithLocation = () => {
      const route = resolveRoute(
        window.location.pathname,
        locale,
        window.location.hash,
        APP_BASE_PATH,
      )
      setActivePage(route.page)
      if (route.locale !== locale) {
        setLocale(route.locale)
      }

      const canonicalBrowserPath = appPathToBrowserPath(route.path, APP_BASE_PATH)
      if (window.location.pathname !== canonicalBrowserPath || window.location.hash) {
        window.history.replaceState(null, '', `${canonicalBrowserPath}${window.location.search}`)
      }
    }

    syncRouteWithLocation()
    window.addEventListener('popstate', syncRouteWithLocation)
    return () => window.removeEventListener('popstate', syncRouteWithLocation)
  }, [locale, setLocale])

  const handleSwitchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return
    setLocale(nextLocale)
    const nextAppPath = buildLocalizedPath(nextLocale, activePage)
    const nextBrowserPath = appPathToBrowserPath(nextAppPath, APP_BASE_PATH)
    if (window.location.pathname !== nextBrowserPath || window.location.hash) {
      window.history.pushState(null, '', `${nextBrowserPath}${window.location.search}`)
    }
  }

  const handleNavigatePage = (nextPage: AppPage) => {
    setActivePage(nextPage)
    const nextAppPath = buildLocalizedPath(locale, nextPage)
    const nextBrowserPath = appPathToBrowserPath(nextAppPath, APP_BASE_PATH)
    if (window.location.pathname !== nextBrowserPath || window.location.hash) {
      window.history.pushState(null, '', `${nextBrowserPath}${window.location.search}`)
    }
  }

  return {
    activePage,
    handleNavigatePage,
    handleSwitchLocale,
    setTheme,
    theme,
  }
}
