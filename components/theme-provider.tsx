'use client'

import { useEffect } from 'react'
import { getItem, KEYS } from '@/lib/storage'

export function ThemeProvider() {
  useEffect(() => {
    const apply = () => {
      const theme = getItem<string>(KEYS.THEME, 'dark')
      const html = document.documentElement
      if (theme === 'light') {
        html.setAttribute('data-theme', 'light')
      } else {
        html.removeAttribute('data-theme')
      }
    }
    apply()
    // Re-apply if storage changes (e.g. user switches in settings)
    window.addEventListener('theme-change', apply)
    return () => window.removeEventListener('theme-change', apply)
  }, [])

  return null
}

// Call this whenever the theme changes so all instances update
export function applyTheme(theme: 'dark' | 'light') {
  if (typeof window === 'undefined') return
  const html = document.documentElement
  if (theme === 'light') {
    html.setAttribute('data-theme', 'light')
  } else {
    html.removeAttribute('data-theme')
  }
  window.dispatchEvent(new Event('theme-change'))
}
