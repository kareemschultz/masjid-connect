'use client'

import { useState, useEffect } from 'react'

export function OfflineBadge() {
  const [status, setStatus] = useState<'online' | 'offline' | 'reconnected' | null>(null)

  useEffect(() => {
    if (!navigator.onLine) setStatus('offline')

    const handleOffline = () => setStatus('offline')
    const handleOnline = () => {
      setStatus('reconnected')
      setTimeout(() => setStatus(null), 2000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!status || status === 'online') return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-center py-1.5 text-xs font-medium transition-all duration-300 ${
        status === 'offline'
          ? 'bg-amber-600/90 text-amber-50'
          : 'bg-emerald-600/90 text-emerald-50'
      }`}
      style={{ paddingTop: 'max(0.375rem, env(safe-area-inset-top))' }}
    >
      {status === 'offline' ? 'Offline — showing cached data' : 'Back online \u2713'}
    </div>
  )
}
