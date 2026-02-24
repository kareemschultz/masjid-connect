'use client'

import { useCallback, useEffect, useState } from 'react'
import { AppTour } from '@/components/app-tour'
import { getItem, setItem, KEYS } from '@/lib/storage'

const TOUR_START_EVENT = 'app-tour:start'

export function AppTourHost() {
  const [showTour, setShowTour] = useState(false)

  const beginTour = useCallback(() => {
    setItem(KEYS.TOUR_PENDING, true)
    setShowTour(true)
  }, [])

  useEffect(() => {
    if (getItem(KEYS.TOUR_PENDING, false)) {
      setShowTour(true)
    }

    const handleStart = () => beginTour()
    window.addEventListener(TOUR_START_EVENT, handleStart as EventListener)
    return () => window.removeEventListener(TOUR_START_EVENT, handleStart as EventListener)
  }, [beginTour])

  const handleComplete = useCallback(() => {
    setItem(KEYS.TOUR_PENDING, false)
    setShowTour(false)
  }, [])

  if (!showTour) return null
  return <AppTour onComplete={handleComplete} />
}
