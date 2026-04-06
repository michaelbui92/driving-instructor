'use client'

import { AuthProvider } from '@/components/AuthProvider'
import { LanguageProvider } from '@/lib/LanguageContext'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  )
}