'use client'

import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/Toast'
import PWAProvider from '@/components/PWAProvider'
import { I18nProvider } from '@/lib/i18n/context'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <AuthProvider>
        <PWAProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </PWAProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
