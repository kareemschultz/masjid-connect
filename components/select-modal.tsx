'use client'

import { X, Check } from 'lucide-react'
import { useEffect } from 'react'

interface SelectModalProps {
  open: boolean
  onClose: () => void
  title: string
  options: { key: string; label: string }[]
  selected: string
  onSelect: (key: string) => void
}

export function SelectModal({ open, onClose, title, options, selected, onSelect }: SelectModalProps) {
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
      <div className="relative w-full max-w-lg animate-slide-in rounded-t-3xl border-t border-gray-800 bg-gray-900 pb-safe">
        <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onSelect(opt.key)
                onClose()
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${
                selected === opt.key
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-foreground active:bg-white/5'
              }`}
            >
              <span className="flex-1 text-sm font-medium">{opt.label}</span>
              {selected === opt.key && <Check className="h-5 w-5 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
