'use client'

import { useEffect, useState } from 'react'

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(isStandalone)

    // Handle install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show prompt after a delay to not be too intrusive
      setTimeout(() => setShowInstallPrompt(true), 3000)
    }

    // Handle app install
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  return (
    <>
      {children}
      
      {/* Install PWA Prompt */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 animate-slide-up">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add to Home Screen</p>
                <p className="text-sm text-gray-500">Get the app for quick access</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                Later
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-secondary transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
