'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { Shield, Plus, Trash2, AlertTriangle, Info, CalendarDays, Loader, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────
interface Announcement {
  id: string
  title: string
  body: string
  type: 'info' | 'urgent' | 'event'
  expires_at: string
  created_at: string
  author_name?: string
}

interface FeedbackItem {
  id: string
  type: string
  name?: string
  email?: string
  message: string
  reviewed: boolean
  created_at: string
}

interface EventSubmission {
  id: string
  title: string
  type: string
  venue: string
  date: string
  time?: string
  description?: string
  contact?: string
  submitted_by: string
  approved: boolean
  created_at: string
}

type TabKey = 'announcements' | 'feedback' | 'events' | 'prayer'

const TABS: { key: TabKey; label: string; subtitle: string }[] = [
  { key: 'announcements', label: '📢 Announcements', subtitle: 'Manage Announcements' },
  { key: 'feedback', label: '💬 Feedback', subtitle: 'User Feedback & Reports' },
  { key: 'events', label: '📅 Events', subtitle: 'Event Submissions' },
  { key: 'prayer', label: '🕌 Prayer Times', subtitle: 'Prayer Time Reports' },
]

// ─── Helpers ─────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('announcements')

  // Announcement state
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState<'info' | 'urgent' | 'event'>('info')
  const [expiresIn, setExpiresIn] = useState('7')
  const [submitting, setSubmitting] = useState(false)

  // Feedback state
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [feedbackLoaded, setFeedbackLoaded] = useState(false)
  const [feedbackFilter, setFeedbackFilter] = useState('all')
  const [expandedFeedback, setExpandedFeedback] = useState<Set<string>>(new Set())

  // Events state
  const [events, setEvents] = useState<EventSubmission[]>([])
  const [eventsLoaded, setEventsLoaded] = useState(false)

  // Prayer state
  const [prayerFeedback, setPrayerFeedback] = useState<FeedbackItem[]>([])
  const [prayerLoaded, setPrayerLoaded] = useState(false)
  const [expandedPrayer, setExpandedPrayer] = useState<Set<string>>(new Set())

  // ─── Auth ────────────────────────────────────────────────────────
  const checkRole = useCallback(async () => {
    try {
      const res = await fetch('/api/user/role')
      if (res.ok) {
        const data = await res.json()
        if (data.role === 'admin' || data.role === 'masjid_admin') {
          setIsAdmin(true)
        } else {
          router.replace('/')
        }
      } else {
        router.replace('/')
      }
    } catch {
      router.replace('/')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { checkRole() }, [checkRole])

  // ─── Loaders ─────────────────────────────────────────────────────
  const loadAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements')
      if (res.ok) setAnnouncements(await res.json())
    } catch (e) { console.error(e) }
    setAnnouncementsLoaded(true)
  }

  const loadFeedback = async () => {
    try {
      const res = await fetch('/api/feedback')
      if (res.ok) setFeedback(await res.json())
    } catch (e) { console.error(e) }
    setFeedbackLoaded(true)
  }

  const loadEvents = async () => {
    try {
      const res = await fetch('/api/events')
      if (res.ok) setEvents(await res.json())
    } catch (e) { console.error(e) }
    setEventsLoaded(true)
  }

  const loadPrayer = async () => {
    try {
      const res = await fetch('/api/feedback?type=prayer_time')
      if (res.ok) setPrayerFeedback(await res.json())
    } catch (e) { console.error(e) }
    setPrayerLoaded(true)
  }

  // Lazy-load data on tab switch
  useEffect(() => {
    if (!isAdmin) return
    if (activeTab === 'announcements' && !announcementsLoaded) loadAnnouncements()
    if (activeTab === 'feedback' && !feedbackLoaded) loadFeedback()
    if (activeTab === 'events' && !eventsLoaded) loadEvents()
    if (activeTab === 'prayer' && !prayerLoaded) loadPrayer()
  }, [activeTab, isAdmin, announcementsLoaded, feedbackLoaded, eventsLoaded, prayerLoaded])

  // ─── Announcement actions ────────────────────────────────────────
  const addAnnouncement = async () => {
    if (!title.trim() || !body.trim()) return
    setSubmitting(true)
    const expires = new Date()
    expires.setDate(expires.getDate() + parseInt(expiresIn))
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), type, expires_at: expires.toISOString() })
      })
      if (res.ok) {
        await loadAnnouncements()
        setTitle(''); setBody(''); setShowForm(false)
      } else { alert('Failed to create announcement') }
    } catch (e) { console.error(e); alert('Error creating announcement') }
    finally { setSubmitting(false) }
  }

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
      if (res.ok) setAnnouncements(prev => prev.filter(a => a.id !== id))
    } catch (e) { console.error(e) }
  }

  // ─── Feedback actions ────────────────────────────────────────────
  const toggleReviewed = async (item: FeedbackItem) => {
    const newVal = !item.reviewed
    try {
      await fetch(`/api/feedback/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewed: newVal })
      })
      setFeedback(prev => prev.map(f => f.id === item.id ? { ...f, reviewed: newVal } : f))
      setPrayerFeedback(prev => prev.map(f => f.id === item.id ? { ...f, reviewed: newVal } : f))
    } catch (e) { console.error(e) }
  }

  // ─── Event actions ───────────────────────────────────────────────
  const toggleApproved = async (item: EventSubmission) => {
    const newVal = !item.approved
    try {
      await fetch(`/api/events/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: newVal })
      })
      setEvents(prev => prev.map(e => e.id === item.id ? { ...e, approved: newVal } : e))
    } catch (e) { console.error(e) }
  }

  // ─── Configs ─────────────────────────────────────────────────────
  const announcementTypeConfig = {
    info: { color: 'border-blue-500/30 bg-blue-500/10', badge: 'bg-blue-500', icon: Info, label: 'Info' },
    urgent: { color: 'border-red-500/30 bg-red-500/10', badge: 'bg-red-500', icon: AlertTriangle, label: 'Urgent' },
    event: { color: 'border-emerald-500/30 bg-emerald-500/10', badge: 'bg-emerald-500', icon: CalendarDays, label: 'Event' },
  }

  const feedbackTypeBadge: Record<string, string> = {
    correction: 'bg-blue-500',
    halal_update: 'bg-emerald-500',
    feature: 'bg-purple-500',
    bug: 'bg-red-500',
    prayer_time: 'bg-amber-500',
    other: 'bg-gray-500',
  }

  const feedbackTypeLabel: Record<string, string> = {
    correction: 'Correction',
    halal_update: 'Halal Update',
    feature: 'Feature',
    bug: 'Bug',
    prayer_time: 'Prayer Time',
    add_masjid: 'Add Masjid',
    other: 'Other',
  }

  const feedbackFilters = [
    { key: 'all', label: 'All' },
    { key: 'correction', label: 'Corrections' },
    { key: 'halal_update', label: 'Halal Updates' },
    { key: 'feature', label: 'Features' },
    { key: 'bug', label: 'Bugs' },
    { key: 'other', label: 'Other' },
  ]

  // ─── Loading / Auth gate ─────────────────────────────────────────
  if (loading) return <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center text-white"><Loader className="animate-spin" /></div>
  if (!isAdmin) return null

  const currentTab = TABS.find(t => t.key === activeTab)!

  // ─── Feedback card renderer ──────────────────────────────────────
  const renderFeedbackCard = (item: FeedbackItem, expandedSet: Set<string>, setExpandedSet: (s: Set<string>) => void) => {
    const isExpanded = expandedSet.has(item.id)
    const badge = feedbackTypeBadge[item.type] || 'bg-gray-500'
    const label = feedbackTypeLabel[item.type] || item.type
    const from = item.name ? `${item.name}${item.email ? ` <${item.email}>` : ''}` : (item.email || 'Anonymous')

    return (
      <div key={item.id} className={`rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-opacity ${item.reviewed ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white ${badge}`}>{label}</span>
          </div>
          <button
            onClick={() => toggleReviewed(item)}
            title={item.reviewed ? 'Mark unreviewed' : 'Mark reviewed'}
            className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${item.reviewed ? 'bg-emerald-600/20 text-emerald-400' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}
          >
            <Check className="h-3 w-3" />
            {item.reviewed ? 'Done' : 'Review'}
          </button>
        </div>
        <p className="mt-1 text-[11px] text-gray-500">{from}</p>
        <p
          className={`mt-1.5 text-xs text-gray-300 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''} cursor-pointer`}
          onClick={() => {
            const next = new Set(expandedSet)
            isExpanded ? next.delete(item.id) : next.add(item.id)
            setExpandedSet(next)
          }}
        >
          {item.message}
        </p>
        <p className="mt-2 text-[10px] text-gray-600">{timeAgo(item.created_at)}</p>
      </div>
    )
  }

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero icon={Shield} title="Admin Panel" subtitle={currentTab.subtitle} gradient="from-red-900 to-rose-900" showBack heroTheme="community" />

      {/* Tab pills */}
      <div className="overflow-x-auto scrollbar-none -mt-1">
        <div className="flex gap-2 px-4 pb-3 w-max min-w-full">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 mt-2">
        {/* ─── Tab 1: Announcements ──────────────────────────────── */}
        {activeTab === 'announcements' && (
          <>
            <button onClick={() => setShowForm(!showForm)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white active:scale-[0.98] transition-transform">
              <Plus className="h-4 w-4" /> New Announcement
            </button>

            {showForm && (
              <div className="space-y-3 rounded-2xl border border-gray-800 bg-gray-900 p-4">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Announcement message" rows={3} className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50 resize-none" />
                <div className="flex gap-2">
                  {(['info', 'urgent', 'event'] as const).map(t => (
                    <button key={t} onClick={() => setType(t)} className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all ${type === t ? announcementTypeConfig[t].badge + ' text-white' : 'bg-gray-800 text-gray-400'}`}>{t}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Expires in</label>
                  <select value={expiresIn} onChange={e => setExpiresIn(e.target.value)} className="rounded-lg border border-gray-800 bg-gray-800 px-2 py-1 text-xs text-[#f9fafb] outline-none">
                    <option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option>
                  </select>
                </div>
                <button onClick={addAnnouncement} disabled={submitting || !title.trim() || !body.trim()} className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40 active:scale-[0.98] transition-transform">
                  {submitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            )}

            <div className="space-y-3">
              {!announcementsLoaded && <div className="flex justify-center py-8"><Loader className="h-5 w-5 animate-spin text-gray-500" /></div>}
              {announcementsLoaded && announcements.length === 0 && (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center text-sm text-gray-500">No announcements yet</div>
              )}
              {announcements.map(a => {
                const cfg = announcementTypeConfig[a.type] || announcementTypeConfig.info
                const expiresDate = a.expires_at ? new Date(a.expires_at) : new Date()
                const expired = expiresDate < new Date()
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
                    <div className="mt-2 flex justify-between text-[10px] text-gray-600">
                      <span>Expires: {expiresDate.toLocaleDateString()}</span>
                      {a.author_name && <span>By {a.author_name}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ─── Tab 2: Feedback ───────────────────────────────────── */}
        {activeTab === 'feedback' && (
          <>
            <div className="overflow-x-auto scrollbar-none -mx-4">
              <div className="flex gap-2 px-4 pb-1 w-max min-w-full">
                {feedbackFilters.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFeedbackFilter(f.key)}
                    className={`flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all ${
                      feedbackFilter === f.key ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {!feedbackLoaded && <div className="flex justify-center py-8"><Loader className="h-5 w-5 animate-spin text-gray-500" /></div>}
              {feedbackLoaded && feedback.filter(f => feedbackFilter === 'all' || f.type === feedbackFilter).length === 0 && (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center text-sm text-gray-500">No feedback found</div>
              )}
              {feedback
                .filter(f => feedbackFilter === 'all' || f.type === feedbackFilter)
                .map(item => renderFeedbackCard(item, expandedFeedback, setExpandedFeedback))}
            </div>
          </>
        )}

        {/* ─── Tab 3: Events ─────────────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            {!eventsLoaded && <div className="flex justify-center py-8"><Loader className="h-5 w-5 animate-spin text-gray-500" /></div>}
            {eventsLoaded && events.length === 0 && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center text-sm text-gray-500">No event submissions yet</div>
            )}
            {events.map(ev => (
              <div key={ev.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-[#f9fafb]">{ev.title}</h3>
                    <span className="rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">{ev.type || 'community'}</span>
                  </div>
                  {ev.approved ? (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-600/20 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                      <Check className="h-3 w-3" /> Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => toggleApproved(ev)}
                      className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-medium text-white transition-all active:scale-95"
                    >
                      Approve
                    </button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
                  <span>📍 {ev.venue}</span>
                  <span>📅 {new Date(ev.date).toLocaleDateString()}</span>
                  {ev.time && <span>🕐 {ev.time}</span>}
                </div>
                {ev.description && <p className="mt-2 text-xs text-gray-300">{ev.description}</p>}
                {ev.contact && <p className="mt-1.5 text-[11px] text-gray-500">Contact: {ev.contact}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] text-gray-600">Submitted by {ev.submitted_by} · {timeAgo(ev.created_at)}</p>
                  {ev.approved && (
                    <button
                      onClick={() => toggleApproved(ev)}
                      className="text-[10px] text-gray-600 underline"
                    >
                      Unapprove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Tab 4: Prayer Times ───────────────────────────────── */}
        {activeTab === 'prayer' && (
          <div className="space-y-3">
            {!prayerLoaded && <div className="flex justify-center py-8"><Loader className="h-5 w-5 animate-spin text-gray-500" /></div>}
            {prayerLoaded && prayerFeedback.length === 0 && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center text-sm text-gray-500">No prayer time reports yet</div>
            )}
            {prayerFeedback.map(item => renderFeedbackCard(item, expandedPrayer, setExpandedPrayer))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
