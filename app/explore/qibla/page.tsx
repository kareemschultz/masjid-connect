'use client'

import { useState, useEffect } from 'react'
import { Navigation2 } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// Qibla bearing from Georgetown, Guyana to Mecca
const QIBLA_BEARING = 57

export default function QiblaPage() {
  const [heading, setHeading] = useState(0)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHeading(e.alpha)
        setPermissionGranted(true)
      }
    }

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<string>
      }
      if (typeof DOE.requestPermission === 'function') {
        DOE.requestPermission()
          .then((perm: string) => {
            if (perm === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation)
            } else {
              setError('Permission denied for compass')
            }
          })
          .catch(() => setError('Could not access compass'))
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
        setTimeout(() => {
          if (!permissionGranted) {
            setPermissionGranted(true)
          }
        }, 1000)
      }
    } else {
      setError('Compass not available on this device')
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rotation = QIBLA_BEARING - heading

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Navigation2}
        title="Qibla"
        subtitle="Direction to Mecca"
        gradient="from-blue-900 to-indigo-900"
        showBack
      />

      <div className="flex flex-col items-center px-4 pt-10">
        <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
          Georgetown, Guyana
        </p>
        <p className="mb-8 text-sm text-emerald-400">
          Qibla bearing: {QIBLA_BEARING} NE
        </p>

        {/* Compass */}
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* Outer ring */}
          <div className="absolute h-full w-full rounded-full border-2 border-gray-800" />

          {/* Cardinal directions */}
          <div
            className="absolute h-full w-full transition-transform duration-200"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-400">N</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">E</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">S</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">W</span>
          </div>

          {/* Qibla needle */}
          <div
            className="absolute h-full w-full transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute top-4 left-1/2 flex -translate-x-1/2 flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                <span className="text-xs font-bold text-white">Ka</span>
              </div>
              <div className="h-24 w-0.5 bg-gradient-to-b from-emerald-500 to-transparent" />
            </div>
          </div>

          {/* Center */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 border-2 border-gray-800">
            <Navigation2 className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-red-400">{error}</p>
        )}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p className="text-xs text-gray-400">
            Point your phone towards the green marker to face the Qibla direction.
            For best results, hold your phone flat and calibrate by moving it in a figure-8 pattern.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
