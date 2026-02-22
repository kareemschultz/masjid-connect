'use client'

import { useState, useEffect } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { Shield, Plus, Trash2, AlertTriangle, Info, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Announcement {
  id: string
  title: string
  body: string
  type: 'info' | 'urgent' | 'event'
  expiresAt: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState<'info' | 'urgent' | 'event'>('info')
  const [expiresIn, setExpiresIn] = useState('7')

  useEffect(() => {
    const admin = getItem(KEYS.IS_ADMIN, false)
    if (!admin) { router.replace('/'); return }
    setIsAdmin(true)
    setAnnouncements(getItem(KEYS.ANNOUNCEMENTS, []))
  }, [router])

  if (!isAdmin) return null

  const addAnnouncement = () => {
    if (!title.trim() || !body.trim()) return
    const expires = new Date()
    expires.setDate(expires.getDate() + parseInt(expiresIn))
    const newA: Announcement = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      type,
      expiresAt: expires.toISOString(),
      createdAt: new Date().toISOString(),
    }
    const updated = [newA, ...announcements]
    setAnnouncements(updated)
    setItem(KEYS.ANNOUNCEMENTS, updated)
    setTitle(''); setBody(''); setShowForm(false)
  }

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id)
    setAnnouncements(updated)
    setItem(KEYS.ANNOUNCEMENTS, updated)
  }

  const typeConfig = {
    info: { color: 'border-blue-500/30 bg-blue-500/10', badge: 'bg-blue-500', icon: Info, label: 'Info' },
    urgent: { color: 'border-red-500/30 bg-red-500/10', badge: 'bg-red-500', icon: AlertTriangle, label: 'Urgent' },
    event: { color: 'border-emerald-500/30 bg-emerald-500/10', badge: 'bg-emerald-500', icon: CalendarDays, label: 'Event' },
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero icon={Shield} title="Admin Panel" subtitle="Manage Announcements" gradient="from-red-900 to-rose-900" showBack />

      <div className="space-y-4 px-4 -mt-2">
        <button onClick={() => setShowForm(!showForm)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white active:scale-[0.98] transition-transform">
          <Plus className="h-4 w-4" /> New Announcement
        </button>

        {showForm && (
          <div className="space-y-3 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Announcement message" rows={3} className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50 resize-none" />
            <div className="flex gap-2">
              {(['info', 'urgent', 'event'] as const).map(t => (
                <button key={t} onClick={() => setType(t)} className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all ${type === t ? typeConfig[t].badge + ' text-white' : 'bg-gray-800 text-gray-400'}`}>{t}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400">Expires in</label>
              <select value={expiresIn} onChange={e => setExpiresIn(e.target.value)} className="rounded-lg border border-gray-800 bg-gray-800 px-2 py-1 text-xs text-[#f9fafb] outline-none">
                <option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option>
              </select>
            </div>
            <button onClick={addAnnouncement} disabled={!title.trim() || !body.trim()} className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40 active:scale-[0.98] transition-transform">Publish</button>
          </div>
        )}

        <div className="space-y-3">
          {announcements.length === 0 && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center text-sm text-gray-500">No announcements yet</div>
          )}
          {announcements.map(a => {
            const cfg = typeConfig[a.type]
            const expired = new Date(a.expiresAt) < new Date()
            return (
              <div key={a.id} className={`rounded-2xl border p-4 ${expired ? 'opacity-40 border-gray-800 bg-gray-900' : cfg.color}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white ${cfg.badge}`}>{cfg.label}</span>
                    {expired && <span className="text-[10px] text-red-400">Expired</span>}
                  </div>
                  <button onClick={() => deleteAnnouncement(a.id)} className="text-gray-500 active:text-red-400" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
                <h3 className="mt-2 text-sm font-bold text-[#f9fafb]">{a.title}</h3>
                <p className="mt-1 text-xs text-gray-400">{a.body}</p>
                <p className="mt-2 text-[10px] text-gray-600">Expires: {new Date(a.expiresAt).toLocaleDateString()}</p>
              </div>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
