'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Settings, Clock, BookOpen, Bell, Moon, Globe,
  Info, FileText, RotateCcw, Volume2, MessageSquarePlus,
  Sun, Sunset, CloudSun, MoonStar, Shield, LogOut, User, ChevronRight, MapPin
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { SettingRow } from '@/components/setting-row'
import { IOSToggle } from '@/components/ios-toggle'
import { SelectModal } from '@/components/select-modal'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { applyTheme } from '@/components/theme-provider'
import { CALCULATION_METHODS, MADHABS, RECITERS } from '@/lib/prayer-times'
import { QURAN_TRANSLATIONS } from '@/lib/quran-settings'
import { requestNotificationPermission } from '@/lib/notifications'
import { detectLocation, reverseGeocode, getRecommendedMethod } from '@/lib/location'
import { DEFAULT_OFFSETS, OFFSET_OPTIONS, offsetLabel, type PrayerOffsets } from '@/lib/prayer-offsets'
import { isPushSupported, subscribeToPush, unsubscribeFromPush, updatePushPreferences } from '@/lib/push-notifications'
import Link from 'next/link'

const PRAYER_NOTIF_CONFIG = [
  { key: 'Fajr', label: 'Fajr', icon: MoonStar, color: 'bg-blue-600' },
  { key: 'Dhuhr', label: 'Dhuhr', icon: Sun, color: 'bg-amber-600' },
  { key: 'Asr', label: 'Asr', icon: CloudSun, color: 'bg-orange-600' },
  { key: 'Maghrib', label: 'Maghrib', icon: Sunset, color: 'bg-red-600' },
  { key: 'Isha', label: 'Isha', icon: Moon, color: 'bg-indigo-600' },
  { key: 'Jumuah', label: 'Jumu\'ah Reminder', icon: Sun, color: 'bg-emerald-600' },
  { key: 'Suhoor', label: 'Suhoor Reminder', icon: MoonStar, color: 'bg-yellow-800' },
  { key: 'Iftaar', label: 'Iftaar Alert', icon: Sunset, color: 'bg-emerald-600' },
  // Nawafil & Reminders
  { key: 'Ishraq', label: 'Ishraq (Sunrise +20)', icon: Sun, color: 'bg-yellow-600' },
  { key: 'Duha', label: 'Duha (Mid-morning)', icon: CloudSun, color: 'bg-orange-500' },
  { key: 'Awabeen', label: 'Awabeen (Post-Maghrib)', icon: Sunset, color: 'bg-rose-600' },
  { key: 'Tahajjud', label: 'Tahajjud (Last Third)', icon: MoonStar, color: 'bg-violet-700' },
  { key: 'FastingMonThu', label: 'Mon/Thu Fasting Reminder', icon: Moon, color: 'bg-teal-700' },
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.1 29.1 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.7 39.7 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.6-2.4 4.7-4.6 6.2l6.2 5.2c3.6-3.4 5.8-8.3 5.8-13.4 0-1.3-.1-2.7-.4-4z"/>
    </svg>
  )
}

export default function SettingsPage() {
  const [method, setMethod] = useState('MuslimWorldLeague')
  const [madhab, setMadhab] = useState('Shafi')
  const [moonSighting, setMoonSighting] = useState('ciog')
  const [reciter, setReciter] = useState('ar.alafasy')
  const [quranTranslation, setQuranTranslation] = useState('en.sahih')
  const [notifs, setNotifs] = useState(false)
  const [enabledPrayers, setEnabledPrayers] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [adminTaps, setAdminTaps] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [session, setSession] = useState<{ user?: { name?: string; email?: string; image?: string } } | null>(null)
  const [signingIn, setSigningIn] = useState(false)
  const [username, setUsername] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [usernameMsg, setUsernameMsg] = useState('')
  const [prayerOffset, setPrayerOffset] = useState(0)
  const [prayerOffsets, setPrayerOffsets] = useState<PrayerOffsets>(DEFAULT_OFFSETS)
  const [phone, setPhone] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneSaving, setPhoneSaving] = useState(false)
  const [phoneMsg, setPhoneMsg] = useState('')
  const [userCity, setUserCity] = useState('')
  const [userCountry, setUserCountry] = useState('')
  const [quranFont, setQuranFont] = useState('default')
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationMsg, setLocationMsg] = useState('')

  // Expanded sections state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    account: true,
    prayer: false,
    quran: false,
    notifications: false,
    app: false,
    about: false
  })

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  useEffect(() => {
    setMethod(getItem(KEYS.CALCULATION_METHOD, 'MuslimWorldLeague'))
    setMadhab(getItem(KEYS.MADHAB, 'Shafi'))
    setMoonSighting(getItem<string>('moon_sighting', 'ciog'))
    setReciter(getItem(KEYS.RECITER, 'ar.alafasy'))
    setQuranTranslation(getItem(KEYS.QURAN_TRANSLATION, 'en.sahih'))
    setNotifs(getItem(KEYS.NOTIFICATIONS_ENABLED, false))
    setEnabledPrayers(getItem(KEYS.NOTIF_PRAYERS, ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']))
    setIsAdmin(getItem(KEYS.IS_ADMIN, false))
    setPrayerOffset(getItem(KEYS.PRAYER_OFFSET, 0))
    setPrayerOffsets(getItem(KEYS.PRAYER_OFFSETS, DEFAULT_OFFSETS))
    setTheme(getItem<'dark' | 'light'>(KEYS.THEME, 'dark'))
    setUserCity(getItem(KEYS.USER_CITY, ''))
    setUserCountry(getItem(KEYS.USER_COUNTRY, ''))
    setQuranFont(getItem(KEYS.QURAN_FONT, 'default'))
    // Check auth session
    fetch('/api/auth/get-session', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setSession(data) })
      .catch(() => {})
    // Load username + phone from profile
    fetch('/api/user/profile', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.username) {
          setUsername(data.username)
          setUsernameInput(data.username)
        }
        if (data?.phoneNumber) {
          setPhone(data.phoneNumber)
          setPhoneInput(data.phoneNumber)
        }
      })
      .catch(() => {})
  }, [])

  const updateMethod = (val: string) => { setMethod(val); setItem(KEYS.CALCULATION_METHOD, val) }
  const updateMadhab = (val: string) => { setMadhab(val); setItem(KEYS.MADHAB, val) }
  const updatePrayerOffset = (prayer: keyof PrayerOffsets, value: number) => {
    const updated = { ...prayerOffsets, [prayer]: value }
    setPrayerOffsets(updated)
    setItem(KEYS.PRAYER_OFFSETS, updated)
  }
  const updateMoonSighting = (val: string) => {
    setMoonSighting(val)
    setItem('moon_sighting', val)
    // Update ramadan_start to match the selected sighting (per GIT official timetable 1447)
    const DATES: Record<string, string> = { saudi: '2026-02-18', ciog: '2026-02-19' }
    setItem('ramadan_start', DATES[val] || '2026-02-19')
  }
  const updateReciter = (val: string) => { setReciter(val); setItem(KEYS.RECITER, val) }
  const updateQuranTranslation = (val: string) => { setQuranTranslation(val); setItem(KEYS.QURAN_TRANSLATION, val) }

  /** Convert array of enabled prayer keys → notification_prefs object for push API */
  const prefsToObject = (prayers: string[]) =>
    PRAYER_NOTIF_CONFIG.reduce<Record<string, boolean>>(
      (obj, p) => ({ ...obj, [p.key]: prayers.includes(p.key) }), {}
    )

  const toggleNotifs = useCallback(async (val: boolean) => {
    if (val) {
      const granted = await requestNotificationPermission()
      if (!granted) return
      setNotifs(true)
      setItem(KEYS.NOTIFICATIONS_ENABLED, true)
      // Subscribe to VAPID push so notifications work when app is closed
      if (isPushSupported()) {
        const currentPrayers = getItem<string[]>(KEYS.NOTIF_PRAYERS, ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'])
        const notificationPrefs = prefsToObject(currentPrayers)
        localStorage.setItem('notification_prefs', JSON.stringify(notificationPrefs))
        subscribeToPush({ notificationPrefs }).catch(console.error)
      }
    } else {
      setNotifs(false)
      setItem(KEYS.NOTIFICATIONS_ENABLED, false)
      if (isPushSupported()) unsubscribeFromPush().catch(console.error)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePrayerNotif = (key: string) => {
    const updated = enabledPrayers.includes(key)
      ? enabledPrayers.filter(p => p !== key)
      : [...enabledPrayers, key]
    setEnabledPrayers(updated)
    setItem(KEYS.NOTIF_PRAYERS, updated)
    // Sync to VAPID push subscription so server-side pushes respect per-prayer prefs
    const notificationPrefs = prefsToObject(updated)
    localStorage.setItem('notification_prefs', JSON.stringify(notificationPrefs))
    if (isPushSupported()) updatePushPreferences({ notificationPrefs }).catch(console.error)
  }

  const disableAllNotifs = () => {
    setNotifs(false)
    setItem(KEYS.NOTIFICATIONS_ENABLED, false)
    setEnabledPrayers([])
    setItem(KEYS.NOTIF_PRAYERS, [])
    localStorage.setItem('notification_prefs', JSON.stringify({}))
    if (isPushSupported()) unsubscribeFromPush().catch(console.error)
  }

  const handleVersionTap = () => {
    const next = adminTaps + 1
    setAdminTaps(next)
    if (next >= 7) {
      const newAdmin = !isAdmin
      setItem(KEYS.IS_ADMIN, newAdmin)
      setIsAdmin(newAdmin)
      setAdminTaps(0)
    }
  }

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    try {
      const { signIn } = await import('@/lib/auth-client')
      await signIn.social({ provider: 'google', callbackURL: '/settings' })
    } catch {
      setSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { signOut } = await import('@/lib/auth-client')
      await signOut()
      setSession(null)
    } catch {}
  }

  const saveUsername = async () => {
    if (!usernameInput.trim()) return
    const val = usernameInput.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsernameSaving(true)
    setUsernameMsg('')
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: val })
      })
      const data = await res.json()
      if (res.ok) {
        setUsername(val)
        setUsernameInput(val)
        setUsernameMsg('Username saved!')
      } else {
        setUsernameMsg(data.error || 'Failed to save')
      }
    } catch {
      setUsernameMsg('Error saving username')
    } finally {
      setUsernameSaving(false)
      setTimeout(() => setUsernameMsg(''), 3000)
    }
  }

  const savePhone = async () => {
    const val = phoneInput.trim().replace(/[\s-]/g, '')
    if (!val) return
    setPhoneSaving(true)
    setPhoneMsg('')
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phoneNumber: val })
      })
      const data = await res.json()
      if (res.ok) {
        setPhone(val)
        setPhoneInput(val)
        setPhoneMsg('Phone number saved!')
      } else {
        setPhoneMsg(data.error || 'Failed to save')
      }
    } catch {
      setPhoneMsg('Error saving phone number')
    } finally {
      setPhoneSaving(false)
      setTimeout(() => setPhoneMsg(''), 3000)
    }
  }

  const handleDetectLocation = async () => {
    setLocationLoading(true)
    setLocationMsg('')
    try {
      const coords = await detectLocation()
      const geo = await reverseGeocode(coords.latitude, coords.longitude)
      setItem(KEYS.USER_LAT, coords.latitude)
      setItem(KEYS.USER_LNG, coords.longitude)
      setItem(KEYS.USER_CITY, geo.city)
      setItem(KEYS.USER_COUNTRY, geo.country)
      setItem(KEYS.USER_COUNTRY_CODE, geo.countryCode)
      const rec = getRecommendedMethod(coords.latitude, coords.longitude, geo.countryCode)
      setItem(KEYS.CALCULATION_METHOD, rec.method)
      setMethod(rec.method)
      setUserCity(geo.city)
      setUserCountry(geo.country)
      setLocationMsg(`Updated to ${geo.city}, ${geo.country}`)
    } catch {
      setLocationMsg('Could not detect location. Please allow location access in your browser settings.')
    } finally {
      setLocationLoading(false)
    }
  }

  const handleResetLocation = () => {
    setItem(KEYS.USER_LAT, 6.8013)
    setItem(KEYS.USER_LNG, -58.1551)
    setItem(KEYS.USER_CITY, 'Georgetown')
    setItem(KEYS.USER_COUNTRY, 'Guyana')
    setItem(KEYS.USER_COUNTRY_CODE, 'GY')
    setItem(KEYS.CALCULATION_METHOD, 'MuslimWorldLeague')
    setMethod('MuslimWorldLeague')
    setUserCity('Georgetown')
    setUserCountry('Guyana')
    setLocationMsg('Reset to Georgetown, Guyana')
  }

  const resetAllData = () => { localStorage.clear(); window.location.reload() }

  const methodLabel = CALCULATION_METHODS.find(m => m.key === method)?.label || method
  const madhabLabel = MADHABS.find(m => m.key === madhab)?.label || madhab
  const reciterLabel = RECITERS.find(r => r.key === reciter)?.label || reciter
  const quranTranslationLabel = QURAN_TRANSLATIONS.find(t => t.key === quranTranslation)?.label || 'Sahih International'

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={Settings} title="Settings" subtitle="Customize Your Experience" gradient="from-gray-800 to-gray-900" showBack heroTheme="explore" />

      <div className="space-y-5 px-4 pt-5">
        {/* Account & Profile */}
        <SettingGroup 
          label="Account & Profile" 
          accentColor="bg-blue-500"
          icon={User}
          isCollapsible
          isExpanded={expanded.account}
          onToggle={() => toggleSection('account')}
        >
          {session?.user ? (
            <>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="h-12 w-12 rounded-full" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                      <User className="h-5 w-5 text-emerald-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{session.user.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex h-9 items-center gap-1.5 rounded-xl bg-secondary px-3 text-xs font-medium text-muted-foreground active:bg-muted"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>

              {/* Username Handle */}
              <div className="border-t border-border/50 p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Profile Handle</p>
                <p className="text-xs text-muted-foreground">
                  Set a @username so Faith Buddies can find you.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-400">@</span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value.replace(/[^a-z0-9_]/gi, '').toLowerCase())}
                      placeholder="your_username"
                      maxLength={30}
                      className="w-full rounded-xl border border-border bg-secondary pl-7 pr-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <button
                    onClick={saveUsername}
                    disabled={usernameSaving || !usernameInput.trim() || usernameInput === username}
                    className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-40"
                  >
                    {usernameSaving ? '...' : 'Save'}
                  </button>
                </div>
                {usernameMsg && (
                  <p className={`text-xs ${usernameMsg.includes('saved') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {usernameMsg}
                  </p>
                )}

                {/* Phone number */}
                <div className="border-t border-border/50 pt-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">WhatsApp Discovery</p>
                  <p className="text-xs text-muted-foreground">
                    Add your phone number so buddies can find you.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+5926123456"
                      className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={savePhone}
                      disabled={phoneSaving || !phoneInput.trim() || phoneInput === phone}
                      className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-40"
                    >
                      {phoneSaving ? '...' : 'Save'}
                    </button>
                  </div>
                  {phoneMsg && (
                    <p className={`text-xs ${phoneMsg.includes('saved') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {phoneMsg}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="mb-3 text-xs text-muted-foreground">Sign in with Google to sync your data, streaks, and prayer log across devices.</p>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-secondary py-3 text-sm font-semibold text-foreground/80 transition-all active:bg-muted disabled:opacity-50"
              >
                <GoogleIcon />
                {signingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          )}
        </SettingGroup>

        {/* Prayer & Location */}
        <SettingGroup 
          label="Prayer & Location" 
          accentColor="bg-emerald-500"
          icon={MapPin}
          isCollapsible
          isExpanded={expanded.prayer}
          onToggle={() => toggleSection('prayer')}
        >
          {/* Current Location Display */}
          <div className="p-4 bg-emerald-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {userCity || 'Georgetown'}
                </p>
                <p className="text-xs text-muted-foreground">{userCountry || 'Guyana (default)'}</p>
              </div>
            </div>
            <button
              onClick={handleDetectLocation}
              disabled={locationLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-foreground transition-opacity disabled:opacity-60 active:scale-[0.98]"
            >
              {locationLoading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Detecting...</>
              ) : (
                <><MapPin className="h-4 w-4" />Detect My Location</>
              )}
            </button>
            {locationMsg && (
              <p className={`mt-2 text-center text-xs ${locationMsg.startsWith('Could not') ? 'text-red-400' : 'text-emerald-400'}`}>
                {locationMsg}
              </p>
            )}
            <button
              onClick={handleResetLocation}
              className="mt-2 w-full text-center text-[10px] text-muted-foreground/60 underline active:text-muted-foreground"
            >
              Reset to Georgetown, Guyana
            </button>
          </div>

          <div className="border-t border-border/50">
            <SettingRow icon={Clock} iconColor="bg-emerald-600" label="Fajr & Isha Calculation" value={methodLabel.split('—')[0].split(',')[0].split('(')[0].trim()} onClick={() => setModalOpen('method')} />
            <SettingRow icon={Moon} iconColor="bg-indigo-600" label="Asr Prayer Time" value={madhab === 'Hanafi' ? 'Hanafi (later)' : 'Standard (earlier)'} onClick={() => setModalOpen('madhab')} />
            <SettingRow icon={Clock} iconColor="bg-teal-600" label="Global Time Adjustment" value={prayerOffset === 0 ? 'None' : `${prayerOffset > 0 ? '+' : ''}${prayerOffset} min`} onClick={() => setModalOpen('prayerOffset')} />
            <SettingRow icon={MoonStar} iconColor="bg-orange-700" label="Ramadan Moon Sighting" value={moonSighting === 'ciog' ? 'Local Guyana (GIT / CIOG)' : 'Saudi / International'} onClick={() => setModalOpen('moon')} />
          </div>

          {/* Per-Prayer Time Adjustment */}
          <div className="border-t border-border/50 bg-secondary/30">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
                <Clock className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Fine-tune Individual Times</p>
              </div>
            </div>
            <div className="divide-y divide-border/40">
              {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((prayer, i) => (
                <div key={prayer} className={`flex items-center justify-between px-4 py-3 ${i === 4 ? 'pb-4' : ''}`}>
                  <span className="text-xs font-medium text-foreground w-16">{prayer}</span>
                  <select
                    value={prayerOffsets[prayer] ?? 0}
                    onChange={(e) => updatePrayerOffset(prayer, Number(e.target.value))}
                    className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:outline-none focus:border-teal-500"
                  >
                    {OFFSET_OPTIONS.map((min) => (
                      <option key={min} value={min}>{offsetLabel(min)}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </SettingGroup>

        {/* Notifications */}
        <SettingGroup 
          label="Notifications" 
          accentColor="bg-amber-500"
          icon={Bell}
          isCollapsible
          isExpanded={expanded.notifications}
          onToggle={() => toggleSection('notifications')}
        >
          <SettingRow icon={Bell} iconColor="bg-amber-600" label="Enable Notifications" rightElement={
            <div className="flex items-center gap-2">
              {notifs && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
              <IOSToggle checked={notifs} onChange={toggleNotifs} />
            </div>
          } />
          {notifs && (
            <>
              {PRAYER_NOTIF_CONFIG.map((p, i) => (
                <div key={p.key}>
                  {i === 8 && (
                    <div className="border-t border-border px-4 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Nawafil & Reminders</p>
                    </div>
                  )}
                  <SettingRow
                    icon={p.icon}
                    iconColor={p.color}
                    label={p.label}
                    isLast={i === PRAYER_NOTIF_CONFIG.length - 1}
                    rightElement={<IOSToggle checked={enabledPrayers.includes(p.key)} onChange={() => togglePrayerNotif(p.key)} />}
                  />
                </div>
              ))}
              <button onClick={disableAllNotifs} className="w-full border-t border-border px-4 py-3 text-center text-xs font-semibold text-red-400 active:bg-secondary/50">Disable All Notifications</button>
            </>
          )}
        </SettingGroup>

        {/* Quran & Content */}
        <SettingGroup 
          label="Quran & Recitation" 
          accentColor="bg-violet-500"
          icon={BookOpen}
          isCollapsible
          isExpanded={expanded.quran}
          onToggle={() => toggleSection('quran')}
        >
          <SettingRow icon={Volume2} iconColor="bg-purple-600" label="Default Adhan Reciter" value={reciterLabel.split(' ').slice(-1)[0]} onClick={() => setModalOpen('reciter')} />
          <SettingRow icon={BookOpen} iconColor="bg-violet-600" label="Quran Translation" value={quranTranslationLabel} onClick={() => setModalOpen('quranTranslation')} />
          <SettingRow icon={BookOpen} iconColor="bg-violet-600" label="Quran Font" value={quranFont === 'indopak' ? 'IndoPak Nastaliq' : quranFont === 'amiri' ? 'Amiri' : 'Default'} onClick={() => setModalOpen('quranFont')} isLast />
        </SettingGroup>

        {/* App Preferences */}
        <SettingGroup 
          label="App Preferences" 
          accentColor="bg-blue-500"
          icon={Settings}
          isCollapsible
          isExpanded={expanded.app}
          onToggle={() => toggleSection('app')}
        >
          <SettingRow
            icon={theme === 'light' ? Sun : Moon}
            iconColor={theme === 'light' ? 'bg-amber-500' : 'bg-slate-700'}
            label="App Theme"
            value={theme === 'light' ? 'Light' : 'Dark'}
            onClick={() => {
              const next: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark'
              setTheme(next)
              setItem(KEYS.THEME, next)
              applyTheme(next)
            }}
          />
          <SettingRow icon={Globe} iconColor="bg-teal-600" label="Language" value="English" onClick={() => setModalOpen('language')} isLast />
        </SettingGroup>

        {/* About & Support */}
        <SettingGroup 
          label="About & Support" 
          accentColor="bg-teal-500"
          icon={Info}
          isCollapsible
          isExpanded={expanded.about}
          onToggle={() => toggleSection('about')}
        >
          <Link href="/support" className="flex items-center justify-between px-4 py-4 bg-amber-500/5 active:bg-amber-500/10 transition-colors border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-xl">🤲</div>
              <div>
                <p className="text-sm font-semibold text-foreground">Support the App</p>
                <p className="text-xs text-muted-foreground">Built fisabilillah — donate to help</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
          </Link>

          <Link href="/feedback"><SettingRow icon={MessageSquarePlus} iconColor="bg-rose-600" label="Send Feedback" onClick={() => {}} /></Link>
          <Link href="/changelog"><SettingRow icon={FileText} iconColor="bg-blue-600" label="Changelog" onClick={() => {}} /></Link>
          <Link href="/about"><SettingRow icon={Info} iconColor="bg-gray-600" label="About" onClick={() => {}} /></Link>
          {isAdmin && (
            <Link href="/admin"><SettingRow icon={Shield} iconColor="bg-red-600" label="Admin Panel" onClick={() => {}} /></Link>
          )}
          <SettingRow icon={RotateCcw} iconColor="bg-red-600" label="Reset All Data" isLast onClick={() => setResetConfirm(true)} />
        </SettingGroup>

        <div className="pb-4 text-center">
          <button onClick={handleVersionTap} className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            v1.0.0
          </button>
          <p className="mt-1.5 text-[10px] text-muted-foreground/60">No ads. No data collection. Community first.</p>
        </div>
      </div>

      {/* Modals */}
      <SelectModal open={modalOpen === 'method'} onClose={() => setModalOpen(null)} title="Fajr & Isha Calculation" subtitle="These settings adjust when Fajr and Isha begin. Most Guyanese Masjids follow the Standard (MWL) setting. If your local Masjid's timetable is slightly different, adjust here." options={CALCULATION_METHODS.map(m => ({ key: m.key, label: m.label, note: m.note }))} selected={method} onSelect={updateMethod} />
      <SelectModal open={modalOpen === 'madhab'} onClose={() => setModalOpen(null)} title="Asr Prayer Time" options={MADHABS.map(m => ({ key: m.key, label: m.key === 'Hanafi' ? 'Hanafi — later Asr time' : "Standard (earlier) — Shafi\u2019i / Hanbali / Maliki" }))} selected={madhab} onSelect={updateMadhab} />
      <SelectModal open={modalOpen === 'reciter'} onClose={() => setModalOpen(null)} title="Default Reciter" options={RECITERS.map(r => ({ key: r.key, label: r.label }))} selected={reciter} onSelect={updateReciter} />
      <SelectModal open={modalOpen === 'quranTranslation'} onClose={() => setModalOpen(null)} title="Quran Translation" subtitle="Choose the English translation shown alongside the Arabic text in the Quran reader." options={QURAN_TRANSLATIONS.map(t => ({ key: t.key, label: t.label, note: t.note }))} selected={quranTranslation} onSelect={updateQuranTranslation} />
      <SelectModal
        open={modalOpen === 'quranFont'}
        onClose={() => setModalOpen(null)}
        title="Quran Font"
        options={[
          { key: 'default', label: 'Default (System Arabic)' },
          { key: 'amiri', label: 'Amiri' },
          { key: 'indopak', label: 'IndoPak Nastaliq (Noto)' }
        ]}
        selected={quranFont}
        onSelect={(val) => {
          setQuranFont(val)
          setItem(KEYS.QURAN_FONT, val)
          setModalOpen(null)
        }}
      />
      <SelectModal
        open={modalOpen === 'language'}
        onClose={() => setModalOpen(null)}
        title="Language"
        options={[
          { key: 'en', label: 'English', note: 'More languages coming soon' }
        ]}
        selected="en"
        onSelect={() => setModalOpen(null)}
      />
      <SelectModal
        open={modalOpen === 'prayerOffset'}
        onClose={() => setModalOpen(null)}
        title="Prayer Time Adjustment"
        subtitle="Adjusts all displayed prayer times by the selected amount. Use +2 to +3 min to match Masjid timetables that add a safety buffer."
        options={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(n => ({
          key: String(n),
          label: n === 0 ? 'No adjustment' : `${n > 0 ? '+' : ''}${n} minutes`,
        }))}
        selected={String(prayerOffset)}
        onSelect={(val) => {
          const num = parseInt(val)
          setPrayerOffset(num)
          setItem(KEYS.PRAYER_OFFSET, num)
        }}
      />
      <SelectModal
        open={modalOpen === 'moon'}
        onClose={() => setModalOpen(null)}
        title="Ramadan Moon Sighting"
        options={[
          { key: 'ciog', label: 'Local Guyana Sighting — GIT, CIOG & Central Moon Sighting Committee' },
          { key: 'saudi', label: 'Saudi Arabia / International Sighting' },
        ]}
        selected={moonSighting}
        onSelect={val => { updateMoonSighting(val); setModalOpen(null) }}
      />

      {resetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setResetConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15">
              <RotateCcw className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Reset All Data?</h3>
            <p className="mt-2 text-sm text-muted-foreground">This will erase all your prayer logs, bookmarks, streaks, and settings. This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setResetConfirm(false)} className="flex-1 rounded-xl bg-secondary py-3 text-sm font-medium text-muted-foreground active:bg-muted">Cancel</button>
              <button onClick={resetAllData} className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-foreground active:bg-red-600">Reset</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
