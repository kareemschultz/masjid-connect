import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('notification install status helper exists', () => {
  const src = fs.readFileSync('lib/push-notifications.js', 'utf8')
  assert.match(src, /shouldShowEnableNotificationsCta/)
  assert.match(src, /getInstallStatus/)
})

test('settings page uses notification install status helper', () => {
  const src = fs.readFileSync('app/settings/page.tsx', 'utf8')
  assert.match(src, /showNotifCta/)
  assert.match(src, /Install this app to your home screen/)
})
