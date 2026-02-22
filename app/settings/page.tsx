'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Settings, Clock, BookOpen, Bell, Moon, Globe,
  Info, FileText, RotateCcw, Volume2, MessageSquarePlus,
  Sun, Sunset, CloudSun, MoonStar, Shield
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
  { key: 'Suhoor', label: 'Suhoor Reminder', icon: MoonStar, color: 'bg-yellow-800' },
  { key: 'Iftaar', label: 'Iftaar Alert', icon: Sunset, color: 'bg-emerald-600' },
]

export default function SettingsPage() {
  const [method, setMethod] = useState('Egyptian')
  const [madhab, setMadhab] = useState('Shafi')
  const [reciter, setReciter] = useState('ar.alafasy')
  const [notifs, setNotifs] = useState(false)
  const [enabledPrayers, setEnabledPrayers] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [adminTaps, setAdminTaps] = useState(0)

  useEffect(() => {
    setMethod(getItem(KEYS.CALCULATION_METHOD, 'Egyptian'))
    setMadhab(getItem(KEYS.MADHAB, 'Shafi'))
    setReciter(getItem(KEYS.RECITER, 'ar.alafasy'))
    setNotifs(getItem(KEYS.NOTIFICATIONS_ENABLED, false))
    setEnabledPrayers(getItem(KEYS.NOTIF_PRAYERS, ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']))
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
      const isAdmin = getItem(KEYS.IS_ADMIN, false)
      setItem(KEYS.IS_ADMIN, !isAdmin)
      setAdminTaps(0)
    }
  }

  const resetAllData = () => { localStorage.clear(); window.location.reload() }

  const methodLabel = CALCULATION_METHODS.find(m => m.key === method)?.label || method
  const madhabLabel = MADHABS.find(m => m.key === madhab)?.label || madhab
  const reciterLabel = RECITERS.find(r => r.key === reciter)?.label || reciter

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero icon={Settings} title="Settings" subtitle="Customize Your Experience" gradient="from-gray-800 to-gray-900" showBack />

      <div className="space-y-5 px-4 pt-5">
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
          {getItem(KEYS.IS_ADMIN, false) && (
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
