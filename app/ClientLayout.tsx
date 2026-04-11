'use client'

import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/Toast'
import PWAProvider from '@/components/PWAProvider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <PWAProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </PWAProvider>
    </AuthProvider>
  )
}
