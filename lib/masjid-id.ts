const LEGACY_TO_CANONICAL_ID: Record<string, string> = {
  queenstown: '1',
  woolford: '3',
  turkeyen: '8',
  kitty: '21',
  darul_uloom: '22',
  masjid_an_najm: '23',
  mcdoom: '24',
  masjid_an_nur: '25',
  sunnatul: '26',
  anjuman_lahore: '27',
  baitul_noor: '28',
  old_mosque: '29',
  providence: '30',
  mandela_masjid: '31',
  alexander_old: '2',
  alexander_new: '2',
}

const CANONICAL_TO_LEGACY_IDS = Object.entries(LEGACY_TO_CANONICAL_ID).reduce<Record<string, string[]>>(
  (acc, [legacyId, canonicalId]) => {
    if (!acc[canonicalId]) acc[canonicalId] = []
    acc[canonicalId].push(legacyId)
    return acc
  },
  {}
)

export function canonicalMasjidId(id: unknown): string {
  const normalized = String(id ?? '').trim()
  if (!normalized) return ''
  return LEGACY_TO_CANONICAL_ID[normalized] ?? normalized
}

export function masjidIdAliases(id: unknown): string[] {
  const normalized = String(id ?? '').trim()
  if (!normalized) return []
  const canonicalId = canonicalMasjidId(normalized)
  return Array.from(
    new Set([canonicalId, ...(CANONICAL_TO_LEGACY_IDS[canonicalId] || []), normalized])
  )
}

export function masjidIdsMatch(a: unknown, b: unknown): boolean {
  const left = canonicalMasjidId(a)
  const right = canonicalMasjidId(b)
  return !!left && left === right
}
