'use client'

import { useState, useEffect } from 'react'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { X, AlertTriangle, Info, CalendarDays } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  body: string
  type: 'info' | 'urgent' | 'event'
  expiresAt: string
  createdAt: string
}

export function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    const all = getItem<Announcement[]>(KEYS.ANNOUNCEMENTS, [])
    const now = new Date()
    const active = all.filter(a => new Date(a.expiresAt) > now)
    setAnnouncements(active)
    setDismissed(getItem(KEYS.DISMISSED_ANNOUNCEMENTS, []))
  }, [])

  const dismiss = (id: string) => {
    const updated = [...dismissed, id]
    setDismissed(updated)
    setItem(KEYS.DISMISSED_ANNOUNCEMENTS, updated)
  }

  const visible = announcements.filter(a => !dismissed.includes(a.id))
  if (visible.length === 0) return null

  const config = {
    info: { bg: 'bg-blue-500/10 border-blue-500/30', icon: Info, iconColor: 'text-blue-400' },
    urgent: { bg: 'bg-red-500/10 border-red-500/30', icon: AlertTriangle, iconColor: 'text-red-400' },
    event: { bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CalendarDays, iconColor: 'text-emerald-400' },
  }

  return (
    <div className="space-y-2">
      {visible.map(a => {
        const cfg = config[a.type]
        const Icon = cfg.icon
        return (
          <div key={a.id} className={`flex items-start gap-3 rounded-2xl border p-3.5 ${cfg.bg}`}>
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#f9fafb]">{a.title}</div>
              <div className="mt-0.5 text-[11px] text-gray-400 leading-relaxed">{a.body}</div>
            </div>
            <button onClick={() => dismiss(a.id)} className="shrink-0 rounded-lg p-1 text-gray-500 active:text-gray-300" aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
