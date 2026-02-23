'use client'

import { useState, useMemo } from 'react'
import { ShieldCheck, Search, X, MapPin, Phone, Globe, AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// ─── Types ────────────────────────────────────────────────────────────────────

type Authority = 'CIOG' | 'D.E.H.C.'
type BizCategory = 'Fast Food' | 'Restaurant' | 'Café' | 'Catering' | 'Meat Plant' | 'Butcher'
type Status = 'active' | 'revoked'
type AreaFilter = 'All' | 'Georgetown' | 'East Coast Demerara' | 'East Bank Demerara' | 'West Coast Demerara' | 'Berbice' | 'Essequibo' | 'Linden' | 'Nationwide'

interface Location { address: string; area: AreaFilter }

interface Business {
  id: string
  name: string
  category: BizCategory
  authorities: Authority[]
  status: Status
  locations: Location[]
  phone?: string
  website?: string
  notes?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BUSINESSES: Business[] = [
  // ── Nationwide / Multi-location ──────────────────────────────────────────
  {
    id: 'churchs-chicken',
    name: "Church's Chicken",
    category: 'Fast Food',
    authorities: ['CIOG', 'D.E.H.C.'],
    status: 'active',
    notes: 'Dual certified by both CIOG and D.E.H.C. Ramadan Iftar Meal: GYD $3,500 (4 pcs chicken, 2 sides, 1 drink).',
    locations: [
      { address: 'Durban & Hill Street, Mandela', area: 'Georgetown' },
      { address: 'Avenue of the Republic', area: 'Georgetown' },
      { address: 'Hinck Street', area: 'Georgetown' },
      { address: 'Camp & Middle Streets', area: 'Georgetown' },
      { address: 'Robb & Camp Street', area: 'Georgetown' },
      { address: 'Giftland Mall Food Court, Pattensen', area: 'East Coast Demerara' },
      { address: 'Amazonia Mall, Providence', area: 'East Bank Demerara' },
      { address: 'Diamond Public Road, E.B.D.', area: 'East Bank Demerara' },
      { address: 'Vreed-en-Hoop', area: 'West Coast Demerara' },
      { address: 'Lenora West Central Mall', area: 'West Coast Demerara' },
      { address: 'Rosignol Stelling Road, W.C.B.', area: 'West Coast Demerara' },
      { address: 'Corriverton Public Road, East Berbice', area: 'Berbice' },
      { address: 'Rose Hall Corentyne', area: 'Berbice' },
      { address: 'New Amsterdam', area: 'Berbice' },
      { address: 'Buxton', area: 'East Coast Demerara' },
      { address: 'Parika, East Bank Essequibo', area: 'Essequibo' },
      { address: 'Linden Coop-Crescent, Mackenzie', area: 'Linden' },
      { address: 'Bartica', area: 'Essequibo' },
    ],
  },
  {
    id: 'popeyes',
    name: "Popeye's Chicken & Seafood",
    category: 'Fast Food',
    authorities: ['CIOG'],
    status: 'active',
    locations: [
      { address: '42 Water & America Street', area: 'Georgetown' },
      { address: '228-229 Camp Street', area: 'Georgetown' },
      { address: '1E Vlissengen & Duncan Road', area: 'Georgetown' },
      { address: '195 Parika, East Bank Essequibo', area: 'Essequibo' },
    ],
  },
  {
    id: 'royal-castle',
    name: 'Royal Castle',
    category: 'Fast Food',
    authorities: ['CIOG'],
    status: 'active',
    locations: [
      { address: '52 Sheriff & Garnett Streets', area: 'Georgetown' },
      { address: 'Regent Street, City Mall', area: 'Georgetown' },
      { address: 'Croal Street, Stabroek', area: 'Georgetown' },
      { address: 'Vlissingen Road, Bel Air', area: 'Georgetown' },
      { address: 'Great Diamond Food Court', area: 'East Bank Demerara' },
      { address: 'Giftland Mall Food Court', area: 'East Coast Demerara' },
    ],
  },
  {
    id: 'burger-republik',
    name: 'Burger Republik Inc',
    category: 'Fast Food',
    authorities: ['CIOG'],
    status: 'active',
    locations: [
      { address: 'Giftland Mall Food Court', area: 'East Coast Demerara' },
      { address: 'Movietowne, East Coast', area: 'East Coast Demerara' },
      { address: 'Amazonia Mall', area: 'East Bank Demerara' },
    ],
  },
  {
    id: 'jades-wok',
    name: "Jade's Wok Asian Cuisine",
    category: 'Restaurant',
    authorities: ['D.E.H.C.'],
    status: 'active',
    phone: '+592-608-0053',
    website: 'www.jadeswokgy.net',
    notes: 'Asian cuisine — chicken, beef, fish, prawn. Catering packages for Iftaar and Khana available. Contact: 608-0053 / 222-7111 / 709-9965.',
    locations: [
      { address: 'Giftland Mall, Pattensen, Turkeyen', area: 'East Coast Demerara' },
      { address: 'Amazonia Mall, Providence', area: 'East Bank Demerara' },
      { address: 'West Central Mall, Groenveldt, Leonora', area: 'West Coast Demerara' },
    ],
  },
  {
    id: 'bigs-baksh',
    name: "BIG B'S — Baksh Restaurant",
    category: 'Restaurant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [
      { address: "11D Edward Village, Rosignol", area: 'Berbice' },
      { address: 'Bath, W.C.B.', area: 'Berbice' },
      { address: 'Bushlot, W.C.B.', area: 'Berbice' },
      { address: 'New Amsterdam', area: 'Berbice' },
      { address: '321 Public Road North, Belvedere Village', area: 'Berbice' },
    ],
  },
  {
    id: 'cnb-delight',
    name: "Chicken 'N' Burger Delight",
    category: 'Fast Food',
    authorities: ['CIOG'],
    status: 'active',
    locations: [
      { address: 'Leonora, Groenveldt', area: 'West Coast Demerara' },
      { address: "Track 'A', Vreed-en-Hoop Junction", area: 'West Coast Demerara' },
    ],
  },
  {
    id: 'mezze',
    name: 'Mezze Inc.',
    category: 'Restaurant',
    authorities: ['CIOG'],
    status: 'active',
    notes: 'Mediterranean cuisine.',
    locations: [
      { address: 'Giftland Mall Food Court', area: 'East Coast Demerara' },
      { address: 'Amazonia Mall', area: 'East Bank Demerara' },
    ],
  },
  {
    id: 'marios-pizza',
    name: "Mario's Pizza",
    category: 'Restaurant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '231 Camp & Middle Street', area: 'Georgetown' }],
  },
  {
    id: 'hacks-halaal',
    name: 'Hacks Halaal',
    category: 'Restaurant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '5 Commerce Street', area: 'Georgetown' }],
  },
  {
    id: 'beacon-cafe',
    name: 'Beacon Café',
    category: 'Café',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '127 Quamina Street, South Cummingsburg', area: 'Georgetown' }],
  },
  {
    id: 'jerrys-juice',
    name: "Jerry's Juice Centre",
    category: 'Café',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '85 Robb Street, Bourda', area: 'Georgetown' }],
  },
  {
    id: 'global-fine-foods',
    name: 'Global Fine Foods Inc',
    category: 'Restaurant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '80 Duncan Street (back building), New Town Kitty', area: 'Georgetown' }],
  },
  {
    id: 'mm-snackette',
    name: 'M&M Snackette & Fastfood',
    category: 'Fast Food',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: "Track A, East Bank Public Road, Peter's Hall", area: 'East Bank Demerara' }],
  },
  // ── Meat Processing Plants & Butchers ────────────────────────────────────
  {
    id: 'toucan-poultry',
    name: 'Toucan Poultry Farm',
    category: 'Meat Plant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '9-12 Soesdyke', area: 'East Bank Demerara' }],
  },
  {
    id: 'royal-chicken',
    name: 'Royal Chicken',
    category: 'Meat Plant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '60 Garden-of-Eden', area: 'East Bank Demerara' }],
  },
  {
    id: 'bounty-farm',
    name: 'Bounty Farm Limited',
    category: 'Meat Plant',
    authorities: ['CIOG'],
    status: 'active',
    notes: 'POULTRY MEAT ONLY.',
    locations: [{ address: 'Public Road, Timehri', area: 'East Bank Demerara' }],
  },
  {
    id: 'az-butchery',
    name: 'A & Z Halal Butchery',
    category: 'Butcher',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '14 North Road, Lacytown', area: 'Georgetown' }],
  },
  {
    id: 'rising-sun',
    name: 'Rising Sun Farm',
    category: 'Meat Plant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '27 North Road', area: 'Georgetown' }],
  },
  {
    id: 'gorchum-farms',
    name: 'Gorchum Farms Inc.',
    category: 'Meat Plant',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '2 Gorchum, Mahaica', area: 'East Coast Demerara' }],
  },
  {
    id: 'madani-butcher',
    name: 'Madani Butcher Shop',
    category: 'Butcher',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '190 Lusignan', area: 'East Coast Demerara' }],
  },
  {
    id: 'rasheeds',
    name: "Rasheed's & Sons Halal Meat Centre",
    category: 'Butcher',
    authorities: ['CIOG'],
    status: 'active',
    locations: [{ address: '94 Grove Public Road', area: 'East Bank Demerara' }],
  },
  // ── Catering ─────────────────────────────────────────────────────────────
  {
    id: 'darul-uloom-store',
    name: 'Darul Uloom Islamic Store',
    category: 'Catering',
    authorities: ['D.E.H.C.'],
    status: 'active',
    phone: '+592 223-0370',
    notes: 'Islamic store + catering. Ramadan hours: Mon-Fri 8:30AM-6PM, Sun 9AM-6PM. Prayer rugs, perfumes, attars, Islamic books, clothing, black seed products, honey. Contact Ml. Badrudeen: 623-2780.',
    locations: [{ address: '310 East Street, South Cummingsburg', area: 'Georgetown' }],
  },
  // ── Revoked ──────────────────────────────────────────────────────────────
  {
    id: 'gangbao',
    name: 'Gangbao Restaurant',
    category: 'Restaurant',
    authorities: ['CIOG'],
    status: 'revoked',
    notes: 'CIOG revoked halal certificate October 21, 2025. CIOG inspectors confirmed use of non-halal chicken after granting certification. Certificate publicly revoked. Do NOT assume halal status.',
    locations: [{ address: 'Georgetown', area: 'Georgetown' }],
  },
]

// ─── Filters ──────────────────────────────────────────────────────────────────

const CATEGORY_FILTERS: (BizCategory | 'All')[] = ['All', 'Fast Food', 'Restaurant', 'Café', 'Catering', 'Meat Plant', 'Butcher']
const AREA_FILTERS: AreaFilter[] = ['All', 'Georgetown', 'East Coast Demerara', 'East Bank Demerara', 'West Coast Demerara', 'Berbice', 'Essequibo', 'Linden']
const AUTH_FILTERS: (Authority | 'All' | 'Both')[] = ['All', 'CIOG', 'D.E.H.C.', 'Both']

// ─── Sub-components ───────────────────────────────────────────────────────────

function AuthBadge({ authority }: { authority: Authority }) {
  if (authority === 'CIOG') return (
    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
      CIOG
    </span>
  )
  return (
    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20">
      D.E.H.C.
    </span>
  )
}

function CategoryIcon({ cat }: { cat: BizCategory }) {
  const map: Record<BizCategory, string> = {
    'Fast Food': '🍗',
    'Restaurant': '🍽️',
    'Café': '☕',
    'Catering': '🤝',
    'Meat Plant': '🏭',
    'Butcher': '🔪',
  }
  return <span>{map[cat] ?? '🏪'}</span>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HalalDirectoryPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<BizCategory | 'All'>('All')
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('All')
  const [authFilter, setAuthFilter] = useState<Authority | 'All' | 'Both'>('All')
  const [showRevoked, setShowRevoked] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // ── Submit modal ──────────────────────────────────────────────────────────
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitType, setSubmitType] = useState<'new_business' | 'revocation' | 'correction'>('new_business')
  const [submitBiz, setSubmitBiz] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitName, setSubmitName] = useState('')
  const [submitEmail, setSubmitEmail] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitDone, setSubmitDone] = useState(false)

  const openModal = () => { setSubmitDone(false); setSubmitBiz(''); setSubmitMessage(''); setSubmitName(''); setSubmitEmail(''); setSubmitType('new_business'); setShowSubmitModal(true) }

  const handleSubmit = async () => {
    if (!submitBiz.trim() || !submitMessage.trim()) return
    setSubmitLoading(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'halal_update',
          message: `[${submitType.replace('_', ' ').toUpperCase()}] Business: ${submitBiz}\n\n${submitMessage}`,
          name: submitName.trim() || null,
          email: submitEmail.trim() || null,
        }),
      })
      setSubmitDone(true)
    } finally {
      setSubmitLoading(false)
    }
  }

  const placeholderMap = {
    new_business: 'Certification authority (CIOG/D.E.H.C.), address, contact info…',
    revocation: 'Why you believe the certificate was revoked, source or evidence…',
    correction: 'What needs to be corrected in the current listing…',
  }

  const activeBiz = useMemo(() => BUSINESSES.filter(b => b.status === 'active'), [])
  const revokedBiz = useMemo(() => BUSINESSES.filter(b => b.status === 'revoked'), [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return activeBiz.filter(b => {
      if (categoryFilter !== 'All' && b.category !== categoryFilter) return false
      if (authFilter === 'Both' && b.authorities.length < 2) return false
      if (authFilter === 'CIOG' && !b.authorities.includes('CIOG')) return false
      if (authFilter === 'D.E.H.C.' && !b.authorities.includes('D.E.H.C.')) return false
      if (areaFilter !== 'All' && !b.locations.some(l => l.area === areaFilter)) return false
      if (q && !b.name.toLowerCase().includes(q) && !b.locations.some(l => l.address.toLowerCase().includes(q))) return false
      return true
    })
  }, [activeBiz, search, categoryFilter, areaFilter, authFilter])

  const filteredLocations = (b: Business) =>
    areaFilter === 'All' ? b.locations : b.locations.filter(l => l.area === areaFilter)

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={ShieldCheck}
        title="Halal Directory"
        subtitle="Certified businesses in Guyana"
        gradient="from-emerald-900 to-teal-900"
        showBack
      />

      <div className="px-4 pt-4 space-y-3">

        {/* ── Disclaimer ── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3 flex items-start gap-3">
          <Info className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Updated regularly from publicly available information. Always verify certification directly with CIOG or D.E.H.C. before dining.
            </p>
            <button onClick={openModal} className="mt-1 text-[11px] text-sky-400 underline underline-offset-2">
              Know of a new addition or revocation? Submit an update →
            </button>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants, areas…"
            className="w-full rounded-2xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-gray-600"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Filter: Authority ── */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {AUTH_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setAuthFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                authFilter === f
                  ? f === 'CIOG' ? 'bg-emerald-500 text-white'
                    : f === 'D.E.H.C.' ? 'bg-amber-500 text-white'
                    : f === 'Both' ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {f === 'All' ? '🔍 All' : f === 'Both' ? '✅ Dual Cert' : f}
            </button>
          ))}
        </div>

        {/* ── Filter: Category ── */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === f ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Filter: Area ── */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {AREA_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setAreaFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                areaFilter === f ? 'bg-teal-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        <p className="text-[11px] text-gray-500 px-1">
          {filtered.length} {filtered.length === 1 ? 'business' : 'businesses'} found
          {authFilter !== 'All' && <span className="ml-1 text-emerald-500">· {authFilter} certified</span>}
          {areaFilter !== 'All' && <span className="ml-1 text-teal-500">· {areaFilter}</span>}
        </p>

        {/* ── Business cards ── */}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-800 py-12 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-gray-500">No businesses match your filters</p>
            <button onClick={() => { setSearch(''); setCategoryFilter('All'); setAreaFilter('All'); setAuthFilter('All') }}
              className="mt-3 text-xs text-emerald-400 underline underline-offset-4">
              Clear all filters
            </button>
          </div>
        )}

        <div className="space-y-2">
          {filtered.map(biz => {
            const isExpanded = expandedId === biz.id
            const locs = filteredLocations(biz)
            return (
              <div key={biz.id} className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
                <button
                  className="w-full flex items-start gap-3 p-4 text-left active:bg-gray-800/40"
                  onClick={() => setExpandedId(isExpanded ? null : biz.id)}
                >
                  <span className="text-2xl mt-0.5 shrink-0">
                    <CategoryIcon cat={biz.category} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-snug">{biz.name}</p>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      {biz.authorities.map(a => <AuthBadge key={a} authority={a} />)}
                      <span className="text-[10px] text-gray-600 bg-gray-800 rounded-full px-2 py-0.5">{biz.category}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {locs.length === 1 ? locs[0].address : `${locs.length} location${locs.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-800 px-4 pb-4 pt-3 space-y-3">
                    {/* Locations list */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Locations</p>
                      <div className="space-y-1.5">
                        {locs.map((loc, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                            <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-teal-500" />
                            <span>{loc.address} <span className="text-gray-600">· {loc.area}</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Notes */}
                    {biz.notes && (
                      <p className="text-xs text-gray-400 leading-relaxed bg-gray-800/50 rounded-xl px-3 py-2">{biz.notes}</p>
                    )}
                    {/* Contact */}
                    <div className="flex gap-2 flex-wrap">
                      {biz.phone && (
                        <a href={`tel:${biz.phone}`} className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                          <Phone className="h-3 w-3" /> {biz.phone}
                        </a>
                      )}
                      {biz.website && (
                        <a href={`https://${biz.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl bg-sky-500/10 px-3 py-2 text-xs text-sky-400">
                          <Globe className="h-3 w-3" /> {biz.website}
                        </a>
                      )}
                    </div>
                    {/* Certifying bodies */}
                    <div className="flex gap-2">
                      {biz.authorities.map(a => (
                        <div key={a} className={`rounded-xl px-3 py-1.5 text-[10px] font-semibold ${a === 'CIOG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          Certified by {a}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Revoked section ── */}
        <div className="rounded-2xl border border-orange-800/30 bg-orange-950/10 overflow-hidden">
          <button
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            onClick={() => setShowRevoked(v => !v)}
          >
            <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-orange-400">Revoked Certifications ({revokedBiz.length})</p>
              <p className="text-[10px] text-gray-500">Businesses that had halal cert revoked</p>
            </div>
            {showRevoked ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
          </button>
          {showRevoked && (
            <div className="border-t border-orange-800/20 p-4 space-y-2">
              {revokedBiz.map(biz => (
                <div key={biz.id} className="rounded-xl border border-orange-800/20 bg-gray-900 p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <p className="text-sm font-bold text-orange-300">{biz.name}</p>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{biz.notes}</p>
                  <p className="mt-1 text-[10px] text-gray-600">
                    {biz.locations.map(l => l.address).join(' | ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Certification bodies note ── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 space-y-2 text-[11px] text-gray-500 leading-relaxed">
          <p><span className="font-semibold text-emerald-400">CIOG</span> — Central Islamic Organisation of Guyana. Woolford Ave, Thomas Lands. Tel: 225-6167 / 225-8654. Secretariat: 698-4123.</p>
          <p><span className="font-semibold text-amber-400">D.E.H.C.</span> — Darul Uloom East Street Halaal Committee. 310 East Street, Georgetown. Maulana Badrudeen Khan: 623-2780. Tel: 223-0579.</p>
          <p className="text-gray-600">Always verify certification status directly with the authority before dining, especially if some time has passed since this listing was updated.</p>
        </div>

      </div>

      {/* ── Submit modal ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowSubmitModal(false)} />
          <div className="relative rounded-t-3xl border-t border-gray-800 bg-gray-900 p-5 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-base font-bold text-white">Submit a Directory Update</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Help us keep this directory accurate</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="rounded-full bg-gray-800 p-1.5 text-gray-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitDone ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-3xl">🤲</p>
                <p className="text-sm font-bold text-white">JazakAllah Khair!</p>
                <p className="text-xs text-gray-400 leading-relaxed px-4">Your submission has been received. We&apos;ll review it and update the directory accordingly.</p>
                <button onClick={() => setShowSubmitModal(false)} className="mt-4 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white">Close</button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Type selector */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Type of update</p>
                  <div className="flex gap-2 flex-wrap">
                    {(['new_business', 'revocation', 'correction'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setSubmitType(t)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          submitType === t ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {t === 'new_business' ? '➕ New Business' : t === 'revocation' ? '⚠️ Revocation Report' : '✏️ Correction'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Business name */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Business name</p>
                  <input
                    value={submitBiz}
                    onChange={e => setSubmitBiz(e.target.value)}
                    placeholder="e.g. Church's Chicken"
                    className="w-full rounded-2xl border border-gray-800 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-600"
                  />
                </div>

                {/* Details */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Details</p>
                  <textarea
                    rows={3}
                    value={submitMessage}
                    onChange={e => setSubmitMessage(e.target.value)}
                    placeholder={placeholderMap[submitType]}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-600 resize-none"
                  />
                </div>

                {/* Optional contact */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Your name <span className="text-gray-700 normal-case font-normal">(optional)</span></p>
                    <input
                      value={submitName}
                      onChange={e => setSubmitName(e.target.value)}
                      placeholder="Anonymous"
                      className="w-full rounded-2xl border border-gray-800 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-600"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Contact <span className="text-gray-700 normal-case font-normal">(optional)</span></p>
                    <input
                      value={submitEmail}
                      onChange={e => setSubmitEmail(e.target.value)}
                      placeholder="Email or WhatsApp"
                      className="w-full rounded-2xl border border-gray-800 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-600"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitLoading || !submitBiz.trim() || !submitMessage.trim()}
                  className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-40 active:bg-emerald-700"
                >
                  {submitLoading ? 'Submitting…' : 'Submit Update'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
