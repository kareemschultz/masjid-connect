'use client'

import { useSyncExternalStore } from 'react'
import { getItem, setItem, KEYS } from '@/lib/storage'

type Listener = () => void
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

export function getSelectedMasjidId(): string {
  if (typeof window === 'undefined') return ''
  return getItem<string>(KEYS.SELECTED_MASJID, '')
}

export function setSelectedMasjidId(id: string) {
  if (typeof window === 'undefined') return
  setItem(KEYS.SELECTED_MASJID, id)
  emit()
}

export function useSelectedMasjidId() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      const onStorage = (e: StorageEvent) => {
        if (e.key === KEYS.SELECTED_MASJID) listener()
      }
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
      }
    },
    getSelectedMasjidId,
    () => ''
  )
}
