'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, X, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function ShareMenu({ masjidName, menu, maghrib }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  const shareText = `🌙 Tonight's Iftaar at ${masjidName}\n🍽️ ${menu}\n⏰ Iftaar at ${maghrib || '6:08'} PM\n\n📱 MasjidConnect GY — masjidconnectgy.com`

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Iftaar at ${masjidName}`, text: shareText, url: window.location.href })
      } catch {
        setOpen(true)
        return
      }
    }
    setOpen(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText + '\n' + window.location.href)
      setCopied(true)
      toast('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + window.location.href)}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => navigator.share ? handleNativeShare() : setOpen(!open)}
        className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-900/20 rounded-full transition-all"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 bg-secondary rounded-xl shadow-xl border border-border p-2 z-50 w-48 animate-fade-in">
          <button onClick={() => setOpen(false)} aria-label="Close share menu" className="absolute top-1 right-1 p-1 text-muted-foreground hover:text-muted-foreground/60">
            <X className="w-3 h-3" />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-emerald-900/20 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
          >
            <span>💬</span> WhatsApp
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-emerald-900/20 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
          >
            <span>✈️</span> Telegram
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-emerald-900/20 rounded-lg transition-colors w-full"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  )
}
