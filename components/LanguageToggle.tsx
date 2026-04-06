'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition text-sm font-medium"
      title={language === 'en' ? '한국어로 변경' : 'Switch to English'}
    >
      <span className={language === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
      <span className="text-gray-400">/</span>
      <span className={language === 'ko' ? 'opacity-100' : 'opacity-50'}>한</span>
    </button>
  )
}
