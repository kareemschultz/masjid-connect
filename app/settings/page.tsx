'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Clock, BookOpen, Bell, Moon, Globe,
  Info, FileText, RotateCcw, ChevronRight, Volume2
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { SettingRow } from '@/components/setting-row'
import { IOSToggle } from '@/components/ios-toggle'
import { SelectModal } from '@/components/select-modal'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { CALCULATION_METHODS, MADHABS, RECITERS } from '@/lib/prayer-times'
import Link from 'next/link'

export default function SettingsPage() {
  const [method, setMethod] = useState('Egyptian')
  const [madhab, setMadhab] = useState('Shafi')
  const [reciter, setReciter] = useState('ar.alafasy')
  const [notifs, setNotifs] = useState(false)
  const [modalOpen, setModalOpen] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState(false)

  useEffect(() => {
    setMethod(getItem(KEYS.CALCULATION_METHOD, 'Egyptian'))
    setMadhab(getItem(KEYS.MADHAB, 'Shafi'))
    setReciter(getItem(KEYS.RECITER, 'ar.alafasy'))
    setNotifs(getItem(KEYS.NOTIFICATIONS_ENABLED, false))
  }, [])

  const updateMethod = (val: string) => {
    setMethod(val)
    setItem(KEYS.CALCULATION_METHOD, val)
  }

  const updateMadhab = (val: string) => {
    setMadhab(val)
    setItem(KEYS.MADHAB, val)
  }

  const updateReciter = (val: string) => {
    setReciter(val)
    setItem(KEYS.RECITER, val)
  }

  const toggleNotifs = (val: boolean) => {
    setNotifs(val)
    setItem(KEYS.NOTIFICATIONS_ENABLED, val)
  }

  const resetAllData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const methodLabel = CALCULATION_METHODS.find(m => m.key === method)?.label || method
  const madhabLabel = MADHABS.find(m => m.key === madhab)?.label || madhab
  const reciterLabel = RECITERS.find(r => r.key === reciter)?.label || reciter

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={Settings}
        title="Settings"
        subtitle="Customize Your Experience"
        gradient="from-gray-800 to-gray-900"
        showBack
      />

      <div className="space-y-5 px-4 pt-5">
        {/* Prayer Settings */}
        <SettingGroup label="Prayer Settings" accentColor="bg-emerald-500">
          <SettingRow
            icon={Clock}
            iconColor="bg-emerald-600"
            label="Calculation Method"
            value={methodLabel.split(',')[0].split('(')[0].trim()}
            onClick={() => setModalOpen('method')}
          />
          <SettingRow
            icon={Moon}
            iconColor="bg-indigo-600"
            label="Madhab"
            value={madhabLabel.split('/')[0].trim()}
            onClick={() => setModalOpen('madhab')}
          />
          <SettingRow
            icon={Bell}
            iconColor="bg-amber-600"
            label="Prayer Notifications"
            isLast
            rightElement={
              <IOSToggle checked={notifs} onChange={toggleNotifs} />
            }
          />
        </SettingGroup>

        {/* Quran Settings */}
        <SettingGroup label="Quran Settings" accentColor="bg-purple-500">
          <SettingRow
            icon={Volume2}
            iconColor="bg-purple-600"
            label="Default Reciter"
            value={reciterLabel.split(' ').slice(-1)[0]}
            onClick={() => setModalOpen('reciter')}
          />
          <SettingRow
            icon={BookOpen}
            iconColor="bg-violet-600"
            label="Font Size"
            value="Large"
            isLast
            onClick={() => {}}
          />
        </SettingGroup>

        {/* App Settings */}
        <SettingGroup label="App" accentColor="bg-teal-500">
          <SettingRow
            icon={Globe}
            iconColor="bg-teal-600"
            label="Language"
            value="English"
            onClick={() => {}}
          />
          <Link href="/changelog">
            <SettingRow
              icon={FileText}
              iconColor="bg-blue-600"
              label="Changelog"
              onClick={() => {}}
            />
          </Link>
          <Link href="/about">
            <SettingRow
              icon={Info}
              iconColor="bg-gray-600"
              label="About"
              onClick={() => {}}
            />
          </Link>
          <SettingRow
            icon={RotateCcw}
            iconColor="bg-red-600"
            label="Reset All Data"
            isLast
            onClick={() => setResetConfirm(true)}
          />
        </SettingGroup>

        {/* App info */}
        <div className="pb-4 text-center">
          <p className="text-xs text-gray-500">MasjidConnect GY v1.0.0</p>
          <p className="mt-0.5 text-[10px] text-gray-600">Linking Faith and Community</p>
        </div>
      </div>

      {/* Modals */}
      <SelectModal
        open={modalOpen === 'method'}
        onClose={() => setModalOpen(null)}
        title="Calculation Method"
        options={CALCULATION_METHODS.map(m => ({ key: m.key, label: m.label }))}
        selected={method}
        onSelect={updateMethod}
      />
      <SelectModal
        open={modalOpen === 'madhab'}
        onClose={() => setModalOpen(null)}
        title="Madhab"
        options={MADHABS.map(m => ({ key: m.key, label: m.label }))}
        selected={madhab}
        onSelect={updateMadhab}
      />
      <SelectModal
        open={modalOpen === 'reciter'}
        onClose={() => setModalOpen(null)}
        title="Default Reciter"
        options={RECITERS.map(r => ({ key: r.key, label: r.label }))}
        selected={reciter}
        onSelect={updateReciter}
      />

      {/* Reset confirmation */}
      {resetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setResetConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-800 bg-gray-900 p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15">
              <RotateCcw className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Reset All Data?</h3>
            <p className="mt-2 text-sm text-gray-400">
              This will erase all your prayer logs, bookmarks, streaks, and settings. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setResetConfirm(false)}
                className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300 active:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={resetAllData}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white active:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
