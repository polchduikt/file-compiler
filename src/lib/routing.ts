import type { Locale } from '../i18n/translations'

export type AppPage = 'app' | 'about' | 'docs' | 'chatgptContext' | 'mergeCodeFiles'

type RouteResult = {
  locale: Locale
  page: AppPage
  path: string
}

const DEFAULT_PAGE: AppPage = 'app'
const PAGE_SEGMENTS: Record<AppPage, Record<Locale, string>> = {
  app: { en: '', uk: '' },
  about: { en: 'about', uk: 'pro-nas' },
  docs: { en: 'docs', uk: 'docs' },
  chatgptContext: { en: 'chatgpt-context', uk: 'kontekst-dlya-chatgpt' },
  mergeCodeFiles: { en: 'merge-code-files', uk: 'obyednaty-kodovi-faily' },
}

function normalizeBase(basePath: string) {
  if (!basePath || basePath === '/') return '/'
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  const hasTrailingSlash = withLeadingSlash.endsWith('/')
  const trimmed = withLeadingSlash.replace(/\/+$/, '')
  const normalized = trimmed || '/'
  if (normalized === '/') return '/'
  return hasTrailingSlash ? `${normalized}/` : normalized
}

function toLocale(segment: string | undefined): Locale | null {
  if (!segment) return null
  const normalized = segment.toLowerCase()
  if (normalized === 'en') return 'en'
  if (normalized === 'uk' || normalized === 'ua') return 'uk'
  return null
}

export function appPathToBrowserPath(path: string, basePath: string) {
  const normalizedBase = normalizeBase(basePath)
  const normalizedPath = normalizePath(path)
  if (normalizedBase === '/') return normalizedPath
  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1)
  return `${baseWithoutTrailingSlash}${normalizedPath}`
}

export function browserPathToAppPath(pathname: string, basePath: string) {
  const normalizedBase = normalizeBase(basePath)
  const normalizedPathname = normalizePath(pathname)
  if (normalizedBase === '/') return normalizedPathname

  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1)
  if (!normalizedPathname.startsWith(baseWithoutTrailingSlash)) {
    return normalizedPathname
  }

  const sliced = normalizedPathname.slice(baseWithoutTrailingSlash.length)
  return normalizePath(sliced || '/')
}

export function buildLocalizedPath(locale: Locale, page: AppPage) {
  const segment = PAGE_SEGMENTS[page][locale]
  return segment ? `/${locale}/${segment}/` : `/${locale}/`
}

function resolveLocalizedPage(locale: Locale, slug: string): AppPage | null {
  const normalizedSlug = slug.toLowerCase()

  for (const [page, segments] of Object.entries(PAGE_SEGMENTS) as Array<
    [AppPage, Record<Locale, string>]
  >) {
    if (page === 'app') continue
    if (segments[locale].toLowerCase() === normalizedSlug) {
      return page
    }
  }

  return null
}

export function resolveRoute(
  pathname: string,
  fallbackLocale: Locale,
  hash: string,
  basePath: string,
): RouteResult {
  const legacyDocsHash = hash === '#docs'
  const appPath = browserPathToAppPath(pathname, basePath)

  if (appPath === '/') {
    const page = legacyDocsHash ? 'docs' : DEFAULT_PAGE
    return { locale: fallbackLocale, page, path: buildLocalizedPath(fallbackLocale, page) }
  }

  const segments = appPath.slice(1).split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment === 'docs') {
    return {
      locale: fallbackLocale,
      page: 'docs',
      path: buildLocalizedPath(fallbackLocale, 'docs'),
    }
  }

  const routeLocale = toLocale(firstSegment)
  if (!routeLocale) {
    return {
      locale: fallbackLocale,
      page: DEFAULT_PAGE,
      path: buildLocalizedPath(fallbackLocale, DEFAULT_PAGE),
    }
  }

  if (segments.length === 1) {
    return {
      locale: routeLocale,
      page: DEFAULT_PAGE,
      path: buildLocalizedPath(routeLocale, DEFAULT_PAGE),
    }
  }

  const localizedSlug = segments.slice(1).join('/')
  const localizedPage = resolveLocalizedPage(routeLocale, localizedSlug)
  if (localizedPage) {
    return {
      locale: routeLocale,
      page: localizedPage,
      path: buildLocalizedPath(routeLocale, localizedPage),
    }
  }

  return { locale: routeLocale, page: DEFAULT_PAGE, path: buildLocalizedPath(routeLocale, DEFAULT_PAGE) }
}
