/**
 * Client-safe point utilities — pure functions only, no DB imports.
 * Import from here in client components instead of lib/points.
 */

export const LEVELS = [
  { min: 4000, level: 5, label: 'Champion', arabic: 'البطل' },
  { min: 2500, level: 4, label: 'Illuminated', arabic: 'المنير' },
  { min: 1000, level: 3, label: 'Steadfast', arabic: 'الصابر' },
  { min: 300, level: 2, label: 'Devoted', arabic: 'المحسن' },
  { min: 0, level: 1, label: 'Seeker', arabic: 'المبتدئ' },
]

export function getLevel(pts: number) {
  return LEVELS.find((l) => pts >= l.min) || LEVELS[LEVELS.length - 1]
}

export function getNextLevel(pts: number) {
  const idx = LEVELS.findIndex((l) => pts >= l.min)
  return idx > 0 ? LEVELS[idx - 1] : null
}

export type Level = (typeof LEVELS)[number]
