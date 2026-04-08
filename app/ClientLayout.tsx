'use client'

import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/Toast'
import AOSInit from '@/components/AOSInit'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AOSInit />
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}
