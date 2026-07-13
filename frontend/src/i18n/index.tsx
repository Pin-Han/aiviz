import { createContext, useContext, useState, useCallback } from 'react'
import zhTW from './locales/zh-TW'
import en from './locales/en'

export type Locale = 'zh-TW' | 'en'
export type TranslationKey = string

const LOCALES: Record<Locale, typeof zhTW> = { 'zh-TW': zhTW, en }
const SUPPORTED: Locale[] = ['zh-TW', 'en']

function detectLocale(): Locale {
  const lang = navigator.language
  if (lang.startsWith('zh')) return 'zh-TW'
  return 'en'
}

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>(null!)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale)

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let text: string = LOCALES[locale][key] ?? LOCALES.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, String(v))
        }
      }
      return text
    },
    [locale],
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export { SUPPORTED as SUPPORTED_LOCALES }
