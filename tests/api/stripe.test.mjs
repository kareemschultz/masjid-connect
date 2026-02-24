import test from 'node:test'
import assert from 'node:assert/strict'

const base = process.env.TEST_BASE_URL

test('stripe checkout requires auth', async () => {
  const res = await fetch(`${base}/api/stripe/checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId: 'price_test', masjidId: 'queenstown' }),
  })
  assert.equal(res.status, 401)
})

test('stripe portal requires auth', async () => {
  const res = await fetch(`${base}/api/stripe/customer-portal`, { method: 'POST' })
  assert.equal(res.status, 401)
})

test('stripe subscription status requires auth', async () => {
  const res = await fetch(`${base}/api/stripe/subscription-status`)
  assert.equal(res.status, 401)
})

test('stripe webhook rejects invalid signature', async () => {
  const res = await fetch(`${base}/api/stripe/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'stripe-signature': 't=1,v1=bad' },
    body: JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed', data: { object: { metadata: { userId: 'u1' } } } }),
  })
  assert.ok([400, 503].includes(res.status))
})
