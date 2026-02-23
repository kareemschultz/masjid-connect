'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { getItem, setItem, KEYS } from '@/lib/storage'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Don't show if user already dismissed
    const dismissed = getItem(KEYS.INSTALL_PROMPT_DISMISSED, false)
    if (dismissed) return

    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show after a delay so user isn't immediately hit with it
      setTimeout(() => setShowBanner(true), 5000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setItem(KEYS.INSTALL_PROMPT_DISMISSED, true)
  }

  if (!showBanner) return null

  return (
    <div className="fixed left-4 right-4 z-[70] animate-in slide-in-from-bottom-4 duration-300" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 20px) + 0.5rem)' }}>
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-500/20 bg-card p-4 shadow-xl shadow-black/40">
        <div className="flex items-start gap-3">
          <Image
            src="/images/logo.jpg"
            alt="MasjidConnect"
            width={44}
            height={44}
            className="shrink-0 rounded-xl"
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Install MasjidConnect GY</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add to your home screen for the best experience with prayer notifications and offline access.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/80 active:text-muted-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleInstall}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-foreground transition-all active:scale-[0.98] active:bg-emerald-600"
        >
          <Download className="h-4 w-4" />
          Install App
        </button>
      </div>
    </div>
  )
}
