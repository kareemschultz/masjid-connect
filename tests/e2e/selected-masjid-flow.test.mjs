import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('selected masjid key exists in storage constants', () => {
  const src = fs.readFileSync('lib/storage.ts', 'utf8')
  assert.match(src, /SELECTED_MASJID/) 
})

test('iftaar page uses global selected masjid store hook', () => {
  const src = fs.readFileSync('app/iftaar/page.jsx', 'utf8')
  assert.match(src, /useSelectedMasjidId/)
  assert.match(src, /setSelectedMasjidId/)
})
