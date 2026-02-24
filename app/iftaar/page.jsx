'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Clock, Users, MapPin, AlertCircle, Heart, UserCheck, Navigation, Bell, BellOff, Plus, History, LayoutList, ChevronDown, ChevronUp, Search, X, Loader, UtensilsCrossed } from 'lucide-react'
import { MASJIDS as masjids } from '@/lib/masjid-data'
import { getTodayTimetable, getRamadanDay } from '@/lib/ramadan-timetable'
import { fetchHistoricalSubmissions, useSubmissions } from '@/hooks/use-submissions'
import { guyanaDate } from '@/lib/timezone'
import { isPushSupported, subscribeToPush, unsubscribeFromPush } from '@/lib/push-notifications'
import { canonicalMasjidId, masjidIdsMatch } from '@/lib/masjid-id'
import ShareMenu from '@/components/share-menu'
import SubmitForm from '@/components/submit-form'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PremiumAtmosphere } from '@/components/premium-atmosphere'
import { toast } from 'sonner'
import { Toaster } from 'sonner'

const SURFACE_CLASS =
  'rounded-2xl border border-border/80 bg-card/82 backdrop-blur-md shadow-[0_22px_52px_-35px_rgba(251,191,36,0.45)]'

const SUBSURFACE_CLASS = 'rounded-xl border border-border/70 bg-secondary/62 backdrop-blur-sm'

// ─── Archive mode: 'by-date' or 'by-masjid' ─────────────────────────────────
function ArchiveView() {
  const [archiveMode, setArchiveMode] = useState('by-masjid')
  const [searchQuery, setSearchQuery] = useState('')

  // By-date state
  const [selectedMasjid, setSelectedMasjid] = useState('')
  const [selectedDate, setSelectedDate] = useState(guyanaDate())
  const [dateResults, setDateResults] = useState([])
  const [searching, setSearching] = useState(false)

  // By-masjid state
  const [expandedMasjid, setExpandedMasjid] = useState(null)
  const [masjidHistory, setMasjidHistory] = useState({})
  const [loadingMasjid, setLoadingMasjid] = useState(null)

  const searchByDate = async () => {
    setSearching(true)
    const data = await fetchHistoricalSubmissions(selectedDate, selectedMasjid || null)
    setDateResults(data)
    setSearching(false)
  }

  const toggleMasjid = useCallback(async (masjidId) => {
    if (expandedMasjid === masjidId) {
      setExpandedMasjid(null)
      return
    }
    setExpandedMasjid(masjidId)
    if (masjidHistory[masjidId]) return
    setLoadingMasjid(masjidId)
    const data = await fetchHistoricalSubmissions(null, masjidId)
    setMasjidHistory(prev => ({ ...prev, [masjidId]: data }))
    setLoadingMasjid(null)
  }, [expandedMasjid, masjidHistory])

  const filteredMasjids = masjids.filter(m =>
    !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Archive mode tabs */}
      <div className={`flex gap-1 p-1 ${SUBSURFACE_CLASS}`}>
        <button
          onClick={() => setArchiveMode('by-masjid')}
          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            archiveMode === 'by-masjid'
              ? 'border border-emerald-500/35 bg-emerald-500/20 text-emerald-300 shadow-sm'
              : 'text-muted-foreground/80 hover:text-foreground'
          }`}
        >
          🕌 By Masjid
        </button>
        <button
          onClick={() => setArchiveMode('by-date')}
          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            archiveMode === 'by-date'
              ? 'border border-emerald-500/35 bg-emerald-500/20 text-emerald-300 shadow-sm'
              : 'text-muted-foreground/80 hover:text-foreground'
          }`}
        >
          📅 By Date
        </button>
      </div>

      {/* ── By Masjid: collapsible list ── */}
      {archiveMode === 'by-masjid' && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter masjids…"
              className={`w-full py-2.5 pl-9 pr-8 text-sm text-foreground/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${SUBSURFACE_CLASS}`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground/60">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredMasjids.map(m => {
            const isExpanded = expandedMasjid === m.id
            const isLoading = loadingMasjid === m.id
            const history = masjidHistory[m.id] || []

            return (
              <div key={m.id} className={`${SURFACE_CLASS} overflow-hidden`}>
                <button
                  onClick={() => toggleMasjid(m.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-emerald-900/10"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">🕌</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-emerald-100 truncate">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{m.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {!m.verified && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-300">unverified</span>
                    )}
                    {isExpanded && history.length > 0 && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">
                        {history.length} report{history.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && !isLoading && (
                  <div className="border-t border-border px-4 pb-3">
                    {history.length === 0 ? (
                      <div className="py-4 text-center">
                        <p className="text-xs text-muted-foreground">No reports submitted yet for this masjid.</p>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {Object.entries(
                          history.reduce((acc, s) => {
                            (acc[s.date] = acc[s.date] || []).push(s)
                            return acc
                          }, {})
                        ).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => (
                          <div key={date} className={`${SUBSURFACE_CLASS} p-3`}>
                            <p className="text-[10px] font-semibold text-emerald-400 mb-1.5">
                              📅 {date}
                            </p>
                            {entries.map(s => (
                              <div key={s.id} className="mb-2 last:mb-0">
                                <p className="text-xs text-foreground/80 mb-1">🍽️ {s.menu}</p>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                  <span>by <strong>{s.submittedBy}</strong></span>
                                  {s.servings && (
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />{s.servings} servings
                                    </span>
                                  )}
                                  {s.attending > 0 && (
                                    <span className="flex items-center gap-1 text-emerald-600">
                                      <UserCheck className="w-3 h-3" />{s.attending} going
                                    </span>
                                  )}
                                  {s.likes > 0 && (
                                    <span className="flex items-center gap-1 text-red-500">
                                      <Heart className="w-3 h-3" />{s.likes}
                                    </span>
                                  )}
                                </div>
                                {s.notes && (
                                  <p className="mt-1 rounded px-2 py-1 text-[10px] text-amber-200 bg-amber-500/12 border border-amber-500/20">{s.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── By Date: search form + results ── */}
      {archiveMode === 'by-date' && (
        <div className="space-y-3">
          <div className={`${SURFACE_CLASS} p-4`}>
            <h3 className="text-sm font-semibold text-emerald-100 mb-3">Filter by Date</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedMasjid}
                  onChange={e => setSelectedMasjid(e.target.value)}
                  className={`w-full appearance-none px-3 py-2.5 pr-8 text-sm text-foreground/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${SUBSURFACE_CLASS}`}
                >
                  <option value="">All Masjids</option>
                  {masjids.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <input
                type="date"
                value={selectedDate}
                min="2026-02-18"
                max={guyanaDate()}
                onChange={e => setSelectedDate(e.target.value)}
                className={`flex-1 px-3 py-2.5 text-sm text-foreground/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${SUBSURFACE_CLASS}`}
              />
              <button
                onClick={searchByDate}
                disabled={searching}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                {searching ? 'Searching…' : 'Search'}
              </button>
            </div>
          </div>

          {dateResults.length === 0 && !searching ? (
            <div className={`${SURFACE_CLASS} border-dashed border-emerald-700/35 py-10 text-center`}>
              <div className="text-4xl mb-2">📅</div>
              <p className="text-muted-foreground/80 text-sm">Pick a date and tap Search to view past reports.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dateResults.map(s => {
                const masjid = masjids.find(m => masjidIdsMatch(m.id, s.masjidId))
                return (
                  <div key={s.id} className={`${SURFACE_CLASS} p-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-emerald-100 text-sm">🕌 {masjid?.name || s.masjidId}</h4>
                        <p className="text-[10px] text-muted-foreground">{s.date} · by {s.submittedBy}</p>
                      </div>
                    </div>
                    <div className={`${SUBSURFACE_CLASS} mb-2 px-3 py-2`}>
                      <p className="text-sm text-foreground/80">🍽️ {s.menu}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      {s.servings && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.servings} servings</span>}
                      {(s.attending || 0) > 0 && <span className="flex items-center gap-1 text-emerald-600"><UserCheck className="w-3 h-3" />{s.attending} going</span>}
                      {(s.likes || 0) > 0 && <span className="flex items-center gap-1 text-red-500"><Heart className="w-3 h-3" />{s.likes} likes</span>}
                    </div>
                    {s.notes && (
                      <p className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/12 px-3 py-1.5 text-xs text-amber-200">{s.notes}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SilentMasjids({ submissions, onSubmit }) {
  const [open, setOpen] = useState(false)
  const reportedIds = new Set(submissions.map(s => canonicalMasjidId(s.masjidId)))
  const silent = masjids.filter(m => !reportedIds.has(canonicalMasjidId(m.id)))
  if (silent.length === 0) return null
  return (
    <div className={`${SURFACE_CLASS} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-emerald-900/10"
      >
        <span className="text-xs font-semibold text-muted-foreground/80">
          {silent.length} masjid{silent.length !== 1 ? 's' : ''} — no update submitted yet
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="divide-y divide-border border-t border-border">
          {silent.map(m => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="text-base shrink-0">🕌</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground truncate">{m.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{m.address}</p>
              </div>
              {onSubmit && (
                <button
                  onClick={() => onSubmit(m.id)}
                  className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold text-emerald-300"
                >
                  + Report
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function IftaarPage() {
  const { submissions, loading, addSubmission, reactToSubmission } = useSubmissions()
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [defaultMasjidId, setDefaultMasjidId] = useState('')

  const today = getTodayTimetable()
  const ramadan = getRamadanDay()

  const [likes, setLikes] = useState({})
  const [attending, setAttending] = useState({})
  const [sortBy, setSortBy] = useState('time')
  const [view, setView] = useState('today')
  const [notifsOn, setNotifsOn] = useState(false)
  const [notifsLoading, setNotifsLoading] = useState(false)

  // Init notification state from localStorage
  useEffect(() => {
    setNotifsOn(localStorage.getItem('ramadan_notifs') === 'true')
  }, [])

  // Sync reaction state from API
  useEffect(() => {
    if (!submissions.length) return
    setLikes(Object.fromEntries(submissions.filter(s => s.userLiked).map(s => [s.id, true])))
    setAttending(Object.fromEntries(submissions.filter(s => s.userAttending).map(s => [s.id, true])))
  }, [submissions])

  const toggleNotifs = async () => {
    if (!isPushSupported()) return
    setNotifsLoading(true)
    try {
      if (!notifsOn) {
        const result = await subscribeToPush()
        if (result.success) {
          setNotifsOn(true)
          toast('Iftaar reminders enabled! 🔔')
        } else if (result.reason === 'denied') {
          toast.error('Notifications blocked — enable them in your browser settings')
        } else {
          toast.error('Could not enable reminders. Try again.')
        }
      } else {
        await unsubscribeFromPush()
        setNotifsOn(false)
        toast('Reminders turned off')
      }
    } finally {
      setNotifsLoading(false)
    }
  }

  const toggleLike = (id) => {
    setLikes(prev => {
      const wasLiked = !!prev[id]
      if (!wasLiked) toast('JazakAllah Khair! 🤲')
      reactToSubmission(id, 'like', wasLiked ? -1 : 1)
      return { ...prev, [id]: !wasLiked }
    })
  }

  const toggleAttending = (id) => {
    setAttending(prev => {
      const wasAttending = !!prev[id]
      if (!wasAttending) toast("See you there, In sha Allah! 🕌")
      reactToSubmission(id, 'attend', wasAttending ? -1 : 1)
      return { ...prev, [id]: !wasAttending }
    })
  }

  const getTimeAgo = (isoStr) => {
    const diff = Date.now() - new Date(isoStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  // Live-update time ago
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(id)
  }, [])

  const getMasjid = (id) => masjids.find(m => masjidIdsMatch(m.id, id))

  const sorted = useMemo(() => [...submissions].sort((a, b) => {
    if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0)
    if (sortBy === 'attending') return (b.attending || 0) - (a.attending || 0)
    return new Date(b.submittedAt) - new Date(a.submittedAt)
  }), [submissions, sortBy])

  const handleOpenSubmit = (masjidId) => {
    setDefaultMasjidId(typeof masjidId === 'string' ? masjidId : '')
    setShowSubmitForm(true)
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
        <PremiumAtmosphere tone="iftaar" />
        <PageHero
          icon={UtensilsCrossed}
          title="Iftaar Reports"
          subtitle={ramadan.isRamadan ? `Day ${ramadan.day} · Iftaar ${today?.maghrib || '6:08'} PM` : `Iftaar ${today?.maghrib || '6:08'} PM`}
          gradient="from-amber-900 via-emerald-900 to-teal-900"
          heroTheme="ramadan"
        />
        <div className="relative mx-auto max-w-2xl space-y-3 px-4 py-5">
          {[1,2,3].map(i => (
            <div key={i} className={`${SURFACE_CLASS} h-32 animate-pulse p-4`} />
          ))}
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
      <PremiumAtmosphere tone="iftaar" />
      <Toaster position="top-center" richColors />
      <PageHero
        icon={UtensilsCrossed}
        title="Iftaar Reports"
        subtitle={ramadan.isRamadan ? `Day ${ramadan.day} · Iftaar ${today?.maghrib || '6:08'} PM` : `Iftaar ${today?.maghrib || '6:08'} PM`}
        gradient="from-amber-900 via-emerald-900 to-teal-900"
        heroTheme="ramadan"
      />

      <div className="relative mx-auto max-w-2xl space-y-4 px-4 pt-4">
        <div className={`${SURFACE_CLASS} mb-2 flex items-center justify-between p-3`}>
          {/* View toggle: Today / Archive */}
          <div className={`inline-flex gap-1 p-1 ${SUBSURFACE_CLASS}`}>
            <button
              onClick={() => setView('today')}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                view === 'today'
                  ? 'border border-emerald-500/35 bg-emerald-500/20 text-emerald-300 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" /> Today
              <span className="ml-1 rounded-full border border-emerald-500/30 bg-emerald-900/35 px-1.5 py-0.5 text-[10px] text-emerald-200">
                {submissions.length}
              </span>
            </button>
            <button
              onClick={() => setView('archive')}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                view === 'archive'
                  ? 'border border-emerald-500/35 bg-emerald-500/20 text-emerald-300 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Archive
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Notification toggle */}
            {typeof window !== 'undefined' && isPushSupported() && (
              <button
                onClick={toggleNotifs}
                disabled={notifsLoading}
                title={notifsOn ? 'Disable iftaar reminders' : 'Enable iftaar reminders'}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-60 ${
                  notifsOn
                    ? 'border-emerald-500/35 bg-emerald-500/20 text-emerald-300'
                    : 'border-border/70 bg-secondary/70 text-muted-foreground'
                }`}
              >
                {notifsLoading
                  ? <Loader className="w-3.5 h-3.5 animate-spin" />
                  : notifsOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />
                }
                {notifsOn ? 'On' : 'Off'}
              </button>
            )}
            {/* Submit button */}
            <button
              onClick={() => handleOpenSubmit('')}
              className="flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-600 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-all active:scale-[0.97] active:bg-amber-700"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit
            </button>
          </div>
        </div>

        {/* Archive view */}
        {view === 'archive' && <ArchiveView />}

        {/* Today view */}
        {view === 'today' && <>
        {/* Sort buttons */}
        {submissions.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {[
              { key: 'time', label: 'Recent' },
              { key: 'popular', label: 'Popular' },
              { key: 'attending', label: 'Attendance' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                aria-pressed={sortBy === s.key}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  sortBy === s.key
                    ? 'bg-emerald-600 text-foreground border-emerald-500/45 shadow-sm'
                    : 'bg-secondary/70 text-muted-foreground border-border/70 hover:border-emerald-300/45'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className={`${SURFACE_CLASS} border-dashed py-12 text-center`}>
            <div className="text-4xl mb-3 opacity-50">🍽️</div>
            <p className="text-sm font-medium text-foreground">No updates yet tonight</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first to share what your masjid is serving!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sorted.map((s, i) => {
              const masjid = getMasjid(s.masjidId)
              const likeCount = s.likes || 0
              const attendCount = s.attending || 0

              return (
                <div
                  key={s.id}
                  className={`${SURFACE_CLASS} animate-fade-up p-4`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-emerald-50 text-sm truncate">
                        🕌 {masjid?.name || s.masjidId}
                      </h3>
                      {masjid?.address && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{masjid.address}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <ShareMenu masjidName={masjid?.name || s.masjidId} menu={s.menu} maghrib={today?.maghrib} />
                      <span className="text-[10px] text-muted-foreground/80 flex items-center gap-0.5 rounded border border-border/70 bg-secondary/60 px-1.5 py-0.5">
                        <Clock className="w-3 h-3" />{getTimeAgo(s.submittedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/12 p-3">
                    <p className="text-sm font-semibold text-foreground leading-relaxed">
                      🍽️ {s.menu}
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>by <strong className="text-emerald-400">{s.submittedBy}</strong></span>
                    {s.servings && (
                      <span className="flex items-center gap-1 bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                        <Users className="w-3 h-3" />{s.servings} servings
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  {s.notes && (
                    <p className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/22 bg-amber-500/12 px-3 py-2 text-xs text-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {s.notes}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => toggleLike(s.id)}
                      aria-label={likes[s.id] ? 'Unlike' : 'Like'}
                      aria-pressed={!!likes[s.id]}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all ${
                        likes[s.id]
                          ? 'border-red-500/35 bg-red-500/15 text-red-300'
                          : 'border-border/70 bg-secondary/65 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likes[s.id] ? 'fill-current' : ''}`} />
                      <span>{likeCount > 0 ? likeCount : 'Like'}</span>
                    </button>

                    <button
                      onClick={() => toggleAttending(s.id)}
                      aria-label={attending[s.id] ? 'Cancel attendance' : 'Mark attending'}
                      aria-pressed={!!attending[s.id]}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all ${
                        attending[s.id]
                          ? 'border-emerald-500/35 bg-emerald-500/15 text-emerald-300'
                          : 'border-border/70 bg-secondary/65 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <UserCheck className={`w-3.5 h-3.5 ${attending[s.id] ? 'fill-current' : ''}`} />
                      <span>{attending[s.id] ? 'Going' : "I'm Going"}</span>
                      {attendCount > 0 && <span className="ml-1 opacity-70">({attendCount})</span>}
                    </button>

                    {masjid && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${masjid.lat},${masjid.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-sky-500/35 bg-sky-500/12 p-2 text-sky-300 transition-all hover:bg-sky-500/20"
                        title="Directions"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
            <SilentMasjids submissions={submissions} onSubmit={handleOpenSubmit} />
          </div>
        )}
        </>}
      </div>

      {/* Submit form modal */}
      {showSubmitForm && (
        <SubmitForm
          onClose={() => setShowSubmitForm(false)}
          onSubmit={addSubmission}
          defaultMasjidId={defaultMasjidId}
        />
      )}

      <BottomNav />
    </div>
  )
}
