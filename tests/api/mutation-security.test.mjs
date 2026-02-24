import test from 'node:test'
import assert from 'node:assert/strict'

const base = process.env.TEST_BASE_URL

test('POST /api/submissions rejects forged/invalid masjidId', async () => {
  const res = await fetch(`${base}/api/submissions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ masjidId: '../../other-masjid', menu: 'Rice', submittedBy: 'QA User' }),
  })
  assert.ok([400, 429].includes(res.status), `unexpected ${res.status}`)
})

test('POST /api/submissions rejects oversized notes payload', async () => {
  const res = await fetch(`${base}/api/submissions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      masjidId: 'central-masjid',
      menu: 'Rice',
      submittedBy: 'QA User',
      notes: 'x'.repeat(401),
    }),
  })
  assert.ok([400, 429].includes(res.status), `unexpected ${res.status}`)
})

test('POST /api/community/feed rejects oversized message payload', async () => {
  const res = await fetch(`${base}/api/community/feed`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'x'.repeat(601) }),
  })
  assert.equal(res.status, 400)
})

test('POST /api/community/dua-board rejects oversized message payload', async () => {
  const res = await fetch(`${base}/api/community/dua-board`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'x'.repeat(601), anonymous: true }),
  })
  assert.equal(res.status, 400)
})
