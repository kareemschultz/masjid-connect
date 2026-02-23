'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Clock, Users, MapPin, AlertCircle, Heart, UserCheck, Navigation, Bell, BellOff, Plus, History, LayoutList, ChevronDown, ChevronUp, Search, X, Loader, UtensilsCrossed } from 'lucide-react'
import { masjids } from '@/lib/masjids'
import { getTodayTimetable, getRamadanDay } from '@/lib/ramadan-timetable'
import { fetchHistoricalSubmissions, useSubmissions } from '@/hooks/use-submissions'
import { guyanaDate } from '@/lib/timezone'
import { isPushSupported, subscribeToPush, unsubscribeFromPush } from '@/lib/push-notifications'
import ShareMenu from '@/components/share-menu'
import SubmitForm from '@/components/submit-form'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { toast } from 'sonner'
import { Toaster } from 'sonner'

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
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
        <button
          onClick={() => setArchiveMode('by-masjid')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            archiveMode === 'by-masjid'
              ? 'bg-gray-700 text-emerald-300 shadow-sm'
              : 'text-gray-500'
          }`}
        >
          🕌 By Masjid
        </button>
        <button
          onClick={() => setArchiveMode('by-date')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            archiveMode === 'by-date'
              ? 'bg-gray-700 text-emerald-300 shadow-sm'
              : 'text-gray-500'
          }`}
        >
          📅 By Date
        </button>
      </div>

      {/* ── By Masjid: collapsible list ── */}
      {archiveMode === 'by-masjid' && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter masjids…"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredMasjids.map(m => {
            const isExpanded = expandedMasjid === m.id
            const isLoading = loadingMasjid === m.id
            const history = masjidHistory[m.id] || []

            return (
              <div key={m.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleMasjid(m.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-emerald-900/10 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">🕌</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-emerald-100 truncate">{m.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{m.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {!m.verified && (
                      <span className="text-[10px] text-amber-600 bg-amber-900/20 px-1.5 py-0.5 rounded-full">unverified</span>
                    )}
                    {isExpanded && history.length > 0 && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                        {history.length} report{history.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && !isLoading && (
                  <div className="border-t border-gray-700 px-4 pb-3">
                    {history.length === 0 ? (
                      <div className="py-4 text-center">
                        <p className="text-gray-400 text-xs">No reports submitted yet for this masjid.</p>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {Object.entries(
                          history.reduce((acc, s) => {
                            (acc[s.date] = acc[s.date] || []).push(s)
                            return acc
                          }, {})
                        ).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => (
                          <div key={date} className="bg-gray-700/50 rounded-xl p-3">
                            <p className="text-[10px] font-semibold text-emerald-400 mb-1.5">
                              📅 {date}
                            </p>
                            {entries.map(s => (
                              <div key={s.id} className="mb-2 last:mb-0">
                                <p className="text-xs text-gray-200 mb-1">🍽️ {s.menu}</p>
                                <div className="flex items-center gap-3 text-[10px] text-gray-400">
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
                                  <p className="mt-1 text-[10px] text-amber-400 bg-amber-900/20 rounded px-2 py-1">{s.notes}</p>
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
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-emerald-100 mb-3">Filter by Date</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedMasjid}
                  onChange={e => setSelectedMasjid(e.target.value)}
                  className="w-full appearance-none bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-200 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="">All Masjids</option>
                  {masjids.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <input
                type="date"
                value={selectedDate}
                min="2026-02-18"
                max={guyanaDate()}
                onChange={e => setSelectedDate(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                onClick={searchByDate}
                disabled={searching}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                {searching ? 'Searching…' : 'Search'}
              </button>
            </div>
          </div>

          {dateResults.length === 0 && !searching ? (
            <div className="text-center py-10 bg-gray-800 rounded-2xl border border-dashed border-emerald-800/40">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-gray-500 text-sm">Pick a date and tap Search to view past reports.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dateResults.map(s => {
                const masjid = masjids.find(m => m.id === s.masjidId)
                return (
                  <div key={s.id} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-emerald-100 text-sm">🕌 {masjid?.name || s.masjidId}</h4>
                        <p className="text-[10px] text-gray-400">{s.date} · by {s.submittedBy}</p>
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl px-3 py-2 mb-2">
                      <p className="text-sm text-gray-200">🍽️ {s.menu}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      {s.servings && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.servings} servings</span>}
                      {(s.attending || 0) > 0 && <span className="flex items-center gap-1 text-emerald-600"><UserCheck className="w-3 h-3" />{s.attending} going</span>}
                      {(s.likes || 0) > 0 && <span className="flex items-center gap-1 text-red-500"><Heart className="w-3 h-3" />{s.likes} likes</span>}
                    </div>
                    {s.notes && (
                      <p className="mt-2 text-xs text-amber-400 bg-amber-900/20 rounded-lg px-3 py-1.5">{s.notes}</p>
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
  const reportedIds = new Set(submissions.map(s => s.masjidId))
  const silent = masjids.filter(m => !reportedIds.has(m.id))
  if (silent.length === 0) return null
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-700/50 transition-colors"
      >
        <span className="text-xs font-semibold text-gray-500">
          {silent.length} masjid{silent.length !== 1 ? 's' : ''} — no update submitted yet
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-gray-700 divide-y divide-gray-50">
          {silent.map(m => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="text-base shrink-0">🕌</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-300 truncate">{m.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{m.address}</p>
              </div>
              {onSubmit && (
                <button
                  onClick={() => onSubmit(m.id)}
                  className="shrink-0 text-[10px] text-emerald-600 hover:underline"
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

  const getMasjid = (id) => masjids.find(m => m.id === id)

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
      <div className="min-h-screen bg-[#0a0b14] pb-nav">
        <PageHero
          icon={UtensilsCrossed}
          title="Iftaar Reports"
          subtitle={ramadan.isRamadan ? `Day ${ramadan.day} · Iftaar ${today?.maghrib || '6:08'} PM` : `Iftaar ${today?.maghrib || '6:08'} PM`}
          gradient="from-emerald-900 to-green-900"
        />
        <div className="px-4 py-5 max-w-2xl mx-auto space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gray-800 rounded-2xl p-4 animate-pulse h-32" />
          ))}
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <Toaster position="top-center" richColors />
      <PageHero
        icon={UtensilsCrossed}
        title="Iftaar Reports"
        subtitle={ramadan.isRamadan ? `Day ${ramadan.day} · Iftaar ${today?.maghrib || '6:08'} PM` : `Iftaar ${today?.maghrib || '6:08'} PM`}
        gradient="from-emerald-900 to-green-900"
      />

      <div className="px-4 max-w-2xl mx-auto space-y-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          {/* View toggle: Today / Archive */}
          <div className="inline-flex p-1 rounded-xl bg-gray-800 gap-1 border border-gray-700">
            <button
              onClick={() => setView('today')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === 'today'
                  ? 'bg-gray-700 text-emerald-300 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" /> Today
              <span className="ml-1 bg-emerald-900/50 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full">
                {submissions.length}
              </span>
            </button>
            <button
              onClick={() => setView('archive')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === 'archive'
                  ? 'bg-gray-700 text-emerald-300 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all disabled:opacity-60 border ${
                  notifsOn
                    ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800'
                    : 'bg-gray-800 text-gray-400 border-gray-700'
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full text-xs font-semibold transition-all shadow-sm active:scale-95"
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
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-emerald-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
            <div className="text-4xl mb-3 opacity-50">🍽️</div>
            <p className="text-sm font-medium text-white">No updates yet tonight</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to share what your masjid is serving!</p>
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
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-emerald-50 text-sm truncate">
                        🕌 {masjid?.name || s.masjidId}
                      </h3>
                      {masjid?.address && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{masjid.address}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <ShareMenu masjidName={masjid?.name || s.masjidId} menu={s.menu} maghrib={today?.maghrib} />
                      <span className="text-[10px] text-gray-500 flex items-center gap-0.5 bg-gray-800 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3" />{getTimeAgo(s.submittedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="bg-emerald-900/10 border border-emerald-800/30 rounded-xl p-3 mb-3">
                    <p className="text-sm font-medium text-gray-100 leading-relaxed">
                      🍽️ {s.menu}
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>by <strong className="text-emerald-400">{s.submittedBy}</strong></span>
                    {s.servings && (
                      <span className="flex items-center gap-1 bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700">
                        <Users className="w-3 h-3" />{s.servings} servings
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  {s.notes && (
                    <p className="mb-3 text-xs text-amber-400 bg-amber-900/20 border border-amber-800/30 rounded-lg px-3 py-2 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {s.notes}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => toggleLike(s.id)}
                      aria-label={likes[s.id] ? 'Unlike' : 'Like'}
                      aria-pressed={!!likes[s.id]}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        likes[s.id]
                          ? 'bg-red-900/20 text-red-400 border border-red-800'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likes[s.id] ? 'fill-current' : ''}`} />
                      <span>{likeCount > 0 ? likeCount : 'Like'}</span>
                    </button>

                    <button
                      onClick={() => toggleAttending(s.id)}
                      aria-label={attending[s.id] ? 'Cancel attendance' : 'Mark attending'}
                      aria-pressed={!!attending[s.id]}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        attending[s.id]
                          ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
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
                        className="p-2 rounded-xl bg-gray-800 text-blue-400 hover:bg-blue-900/20 border border-gray-700 transition-all"
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
