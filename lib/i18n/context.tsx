'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Locale } from './translations'

type TranslationDict = typeof translations.en

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('dwb-locale') as Locale | null
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLocaleState(saved)
    } else {
      // Detect from browser
      const browserLang = navigator.language
      if (browserLang.startsWith('ko')) {
        setLocaleState('ko')
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('dwb-locale', newLocale)
  }

  // Helper to get nested translation key
  const t = (key: string): string => {
    const dict = translations[locale] as TranslationDict
    const keys = key.split('.')
    let result: any = dict
    for (const k of keys) {
      result = result?.[k]
    }
    return typeof result === 'string' ? result : key
  }

  // Prevent hydration mismatch - render with 'en' until mounted
  const activeLocale = mounted ? locale : 'en'

  return (
    <I18nContext.Provider value={{ locale: activeLocale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback for SSR / non-provider usage
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: (key: string) => key,
    }
  }
  return context
}
