import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('onboarding wizard includes iOS visual install guide', () => {
  const src = fs.readFileSync('components/onboarding-wizard.tsx', 'utf8')
  assert.match(src, /Visual install guide/)
  assert.match(src, /Add to Home Screen/)
})

test('onboarding wizard includes settings navigation helper map', () => {
  const src = fs.readFileSync('components/onboarding-wizard.tsx', 'utf8')
  assert.match(src, /Where to find key settings/)
  assert.match(src, /Settings › Notifications/)
  assert.match(src, /Settings › Prayer Times/)
})

test('onboarding wizard includes explore and buddy guide slides in the step flow', () => {
  const src = fs.readFileSync('components/onboarding-wizard.tsx', 'utf8')
  assert.match(src, /'explore'/)
  assert.match(src, /'buddy'/)
  assert.match(src, /Explore page map/)
  assert.match(src, /Buddy system setup/)
  assert.match(src, /Explore › Buddy/)
})
