'use client'

import { X, Check } from 'lucide-react'
import { useEffect } from 'react'

interface SelectModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  options: { key: string; label: string; note?: string }[]
  selected: string
  onSelect: (key: string) => void
}

export function SelectModal({ open, onClose, title, subtitle, options, selected, onSelect }: SelectModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-in rounded-t-3xl border-t border-border bg-card pb-safe">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">{subtitle}</p>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onSelect(opt.key)
                onClose()
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                selected === opt.key
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-foreground active:bg-card/5'
              }`}
            >
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium">{opt.label}</span>
                {opt.note && <span className="block text-[10px] text-muted-foreground/80 mt-0.5">{opt.note}</span>}
              </div>
              {selected === opt.key && <Check className="h-5 w-5 shrink-0 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
