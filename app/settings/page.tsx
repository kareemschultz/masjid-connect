'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Settings, Clock, BookOpen, Bell, Moon, Globe,
  Info, FileText, RotateCcw, Volume2, MessageSquarePlus,
  Sun, Sunset, CloudSun, MoonStar, Shield, LogOut, User
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { SettingRow } from '@/components/setting-row'
import { IOSToggle } from '@/components/ios-toggle'
import { SelectModal } from '@/components/select-modal'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { CALCULATION_METHODS, MADHABS, RECITERS } from '@/lib/prayer-times'
import { requestNotificationPermission } from '@/lib/notifications'
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
  const [method, setMethod] = useState('Egyptian')
  const [madhab, setMadhab] = useState('Shafi')
  const [reciter, setReciter] = useState('ar.alafasy')
  const [notifs, setNotifs] = useState(false)
  const [enabledPrayers, setEnabledPrayers] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [adminTaps, setAdminTaps] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [session, setSession] = useState<{ user?: { name?: string; email?: string; image?: string } } | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    setMethod(getItem(KEYS.CALCULATION_METHOD, 'Egyptian'))
    setMadhab(getItem(KEYS.MADHAB, 'Shafi'))
    setReciter(getItem(KEYS.RECITER, 'ar.alafasy'))
    setNotifs(getItem(KEYS.NOTIFICATIONS_ENABLED, false))
    setEnabledPrayers(getItem(KEYS.NOTIF_PRAYERS, ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']))
    setIsAdmin(getItem(KEYS.IS_ADMIN, false))
    // Check auth session
    fetch('/api/auth/get-session', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setSession(data) })
      .catch(() => {})
  }, [])

  const updateMethod = (val: string) => { setMethod(val); setItem(KEYS.CALCULATION_METHOD, val) }
  const updateMadhab = (val: string) => { setMadhab(val); setItem(KEYS.MADHAB, val) }
  const updateReciter = (val: string) => { setReciter(val); setItem(KEYS.RECITER, val) }

  const toggleNotifs = useCallback(async (val: boolean) => {
    if (val) {
      const granted = await requestNotificationPermission()
      if (!granted) return
    }
    setNotifs(val)
    setItem(KEYS.NOTIFICATIONS_ENABLED, val)
  }, [])

  const togglePrayerNotif = (key: string) => {
    const updated = enabledPrayers.includes(key)
      ? enabledPrayers.filter(p => p !== key)
      : [...enabledPrayers, key]
    setEnabledPrayers(updated)
    setItem(KEYS.NOTIF_PRAYERS, updated)
  }

  const disableAllNotifs = () => {
    setNotifs(false)
    setItem(KEYS.NOTIFICATIONS_ENABLED, false)
    setEnabledPrayers([])
    setItem(KEYS.NOTIF_PRAYERS, [])
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

  const resetAllData = () => { localStorage.clear(); window.location.reload() }

  const methodLabel = CALCULATION_METHODS.find(m => m.key === method)?.label || method
  const madhabLabel = MADHABS.find(m => m.key === madhab)?.label || madhab
  const reciterLabel = RECITERS.find(r => r.key === reciter)?.label || reciter

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={Settings} title="Settings" subtitle="Customize Your Experience" gradient="from-gray-800 to-gray-900" showBack />

      <div className="space-y-5 px-4 pt-5">
        {/* Account */}
        <SettingGroup label="Account" accentColor="bg-blue-500">
          {session?.user ? (
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
                  <p className="text-sm font-semibold text-[#f9fafb] truncate">{session.user.name || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-gray-800 px-3 text-xs font-medium text-gray-300 active:bg-gray-700"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <p className="mb-3 text-xs text-gray-400">Sign in with Google to sync your data, streaks, and prayer log across devices.</p>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-700 bg-gray-800 py-3 text-sm font-semibold text-gray-200 transition-all active:bg-gray-700 disabled:opacity-50"
              >
                <GoogleIcon />
                {signingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          )}
        </SettingGroup>

        {/* Prayer Settings */}
        <SettingGroup label="Prayer Times" accentColor="bg-emerald-500">
          <SettingRow icon={Clock} iconColor="bg-emerald-600" label="Calculation Method" value={methodLabel.split(',')[0].split('(')[0].trim()} onClick={() => setModalOpen('method')} />
          <SettingRow icon={Moon} iconColor="bg-indigo-600" label="Madhab" value={madhabLabel.split('/')[0].trim()} onClick={() => setModalOpen('madhab')} isLast />
        </SettingGroup>

        {/* Notifications */}
        <SettingGroup label="Notifications" accentColor="bg-amber-500">
          <SettingRow icon={Bell} iconColor="bg-amber-600" label="Enable Notifications" rightElement={
            <div className="flex items-center gap-2">
              {notifs && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
              <IOSToggle checked={notifs} onChange={toggleNotifs} />
            </div>
          } />
          {notifs && (
            <>
              {PRAYER_NOTIF_CONFIG.map((p, i) => (
                <SettingRow
                  key={p.key}
                  icon={p.icon}
                  iconColor={p.color}
                  label={p.label}
                  isLast={i === PRAYER_NOTIF_CONFIG.length - 1}
                  rightElement={<IOSToggle checked={enabledPrayers.includes(p.key)} onChange={() => togglePrayerNotif(p.key)} />}
                />
              ))}
              <button onClick={disableAllNotifs} className="w-full border-t border-gray-800 px-4 py-3 text-center text-xs font-semibold text-red-400 active:bg-gray-800/50">Disable All Notifications</button>
            </>
          )}
        </SettingGroup>

        {/* Adhan Sound */}
        <SettingGroup label="Adhan Sound" accentColor="bg-purple-500">
          <SettingRow icon={Volume2} iconColor="bg-purple-600" label="Default Reciter" value={reciterLabel.split(' ').slice(-1)[0]} onClick={() => setModalOpen('reciter')} isLast />
        </SettingGroup>

        {/* Display */}
        <SettingGroup label="Display" accentColor="bg-blue-500">
          <SettingRow icon={BookOpen} iconColor="bg-violet-600" label="Quran Font" value="Default" onClick={() => {}} isLast />
        </SettingGroup>

        {/* App */}
        <SettingGroup label="About" accentColor="bg-teal-500">
          <SettingRow icon={Globe} iconColor="bg-teal-600" label="Language" value="English" onClick={() => {}} />
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
          <p className="mt-1.5 text-[10px] text-gray-600">No ads. No data collection. Community first.</p>
        </div>
      </div>

      {/* Modals */}
      <SelectModal open={modalOpen === 'method'} onClose={() => setModalOpen(null)} title="Calculation Method" options={CALCULATION_METHODS.map(m => ({ key: m.key, label: m.label }))} selected={method} onSelect={updateMethod} />
      <SelectModal open={modalOpen === 'madhab'} onClose={() => setModalOpen(null)} title="Madhab" options={MADHABS.map(m => ({ key: m.key, label: m.label }))} selected={madhab} onSelect={updateMadhab} />
      <SelectModal open={modalOpen === 'reciter'} onClose={() => setModalOpen(null)} title="Default Reciter" options={RECITERS.map(r => ({ key: r.key, label: r.label }))} selected={reciter} onSelect={updateReciter} />

      {resetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setResetConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-800 bg-gray-900 p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15">
              <RotateCcw className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Reset All Data?</h3>
            <p className="mt-2 text-sm text-gray-400">This will erase all your prayer logs, bookmarks, streaks, and settings. This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setResetConfirm(false)} className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300 active:bg-gray-700">Cancel</button>
              <button onClick={resetAllData} className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white active:bg-red-600">Reset</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
