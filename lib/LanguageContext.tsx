'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, TranslationKey, t } from './i18n'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'drivewithbui_language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ko') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }

  const translate = (key: TranslationKey): string => {
    return t(key, language)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  
  // During SSR/static generation, return a default context
  if (!context) {
    return {
      language: 'en' as const,
      setLanguage: () => {},
      t: (key: TranslationKey) => t(key, 'en')
    }
  }
  
  return context
}
