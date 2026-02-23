'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navigation2, Compass } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// Qibla bearing from Georgetown, Guyana to Mecca
const QIBLA_BEARING = 57

type PermState = 'unknown' | 'needs-tap' | 'granted' | 'denied' | 'unavailable'

export default function QiblaPage() {
  const [heading, setHeading] = useState(0)
  const [permState, setPermState] = useState<PermState>('unknown')
  const [error, setError] = useState('')

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.alpha !== null) {
      setHeading(e.alpha)
      setPermState('granted')
    }
  }, [])

  // On mount — detect whether we need a tap (iOS) or can wire up directly (Android/desktop)
  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      setPermState('unavailable')
      setError('Compass not available on this device')
      return
    }
    const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>
    }
    if (typeof DOE.requestPermission === 'function') {
      // iOS 13+ — permission must come from a user gesture, so just show the button
      setPermState('needs-tap')
    } else {
      // Android / desktop — wire up immediately
      window.addEventListener('deviceorientation', handleOrientation, true)
      setPermState('granted')
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
    }
  }, [handleOrientation])

  // Called when user taps the "Enable Compass" button (iOS only)
  const requestIOSPermission = useCallback(async () => {
    const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>
    }
    try {
      const perm = await DOE.requestPermission!()
      if (perm === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true)
        setPermState('granted')
      } else {
        setPermState('denied')
        setError('Compass permission denied. Please allow Motion & Orientation access in your browser settings.')
      }
    } catch {
      setPermState('denied')
      setError('Could not access compass. Try reopening the page.')
    }
  }, [handleOrientation])

  const rotation = QIBLA_BEARING - heading

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Navigation2}
        title="Qibla"
        subtitle="Direction to Mecca"
        gradient="from-blue-900 to-indigo-900"
        showBack
        heroTheme="prayer"
      />

      <div className="flex flex-col items-center px-4 pt-10">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Georgetown, Guyana</p>
        <p className="mb-8 text-sm text-emerald-400">Qibla bearing: {QIBLA_BEARING}° NE</p>

        {/* iOS permission tap gate */}
        {permState === 'needs-tap' && (
          <div className="flex flex-col items-center gap-5 py-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/15 ring-2 ring-blue-500/30">
              <Compass className="h-12 w-12 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">Enable Compass</p>
              <p className="mt-1 text-sm text-muted-foreground">Tap below to allow motion &amp; orientation access</p>
            </div>
            <button
              onClick={requestIOSPermission}
              className="rounded-2xl bg-blue-500 px-8 py-4 text-sm font-bold text-foreground shadow-lg shadow-blue-500/25 active:scale-[0.97] transition-all"
            >
              Enable Compass
            </button>
            <p className="text-[11px] text-muted-foreground/80 text-center max-w-[260px]">
              iOS requires your permission to use the device compass. Your location is never sent anywhere.
            </p>
          </div>
        )}

        {/* Compass (shown when granted or unknown/Android) */}
        {(permState === 'granted' || permState === 'unknown') && (
          <div className="relative flex h-64 w-64 items-center justify-center">
            <div className="absolute h-full w-full rounded-full border-2 border-border" />
            {/* Cardinal directions — rotate opposite to phone heading */}
            <div
              className="absolute h-full w-full transition-transform duration-200"
              style={{ transform: `rotate(${-heading}deg)` }}
            >
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-400">N</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/80">E</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground/80">S</span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/80">W</span>
            </div>
            {/* Qibla needle — always points toward Mecca */}
            <div
              className="absolute h-full w-full transition-transform duration-200"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="absolute top-4 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40">
                  <span className="text-xs font-bold text-foreground">Ka</span>
                </div>
                <div className="h-24 w-0.5 bg-gradient-to-b from-emerald-500 to-transparent" />
              </div>
            </div>
            {/* Center */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card border-2 border-border">
              <Navigation2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Error state */}
        {(permState === 'denied' || permState === 'unavailable') && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
              <Compass className="h-10 w-10 text-red-400" />
            </div>
            <p className="text-center text-sm text-red-400 max-w-[280px]">{error}</p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-card p-4 text-center mx-4 w-full max-w-sm">
          <p className="text-xs text-muted-foreground">
            Point your phone towards the green marker to face the Qibla direction.
            Hold your phone flat and calibrate by moving it in a figure-8 pattern.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
