import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('onboarding wizard includes iOS install walkthrough copy', () => {
  const src = fs.readFileSync('components/onboarding-wizard.tsx', 'utf8')
  assert.match(src, /Add to Home Screen/)
  assert.match(src, /Tap the Share button/)
  assert.match(src, /Must be opened in/)
})

test('onboarding wizard includes notification and install steps', () => {
  const src = fs.readFileSync('components/onboarding-wizard.tsx', 'utf8')
  assert.match(src, /Never Miss Salah/)
  assert.match(src, /Enable Prayer Notifications/)
  assert.match(src, /Install App Now/)
})

test('onboarding wizard includes premium finish CTA and buddy mention', () => {
  const src = fs.readFileSync('components/onboarding-wizard.tsx', 'utf8')
  assert.match(src, /Take the App Tour/)
  assert.match(src, /Add Faith Buddies/)
  assert.match(src, /Jump straight to what matters/)
})
