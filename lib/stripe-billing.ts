import crypto from 'node:crypto'

type CheckoutMeta = { userId: string; masjidId: string; priceId: string; mode: 'subscription' | 'payment' }

const checkoutSessions = new Map<string, CheckoutMeta>()
const subscriptions = new Map<string, { status: string; masjidId: string }>()
const processedEvents = new Set<string>()

export function createMockCheckout(meta: CheckoutMeta) {
  const id = `cs_test_${crypto.randomBytes(8).toString('hex')}`
  checkoutSessions.set(id, meta)
  return { id, url: `/billing/mock-checkout?session_id=${id}` }
}

export function createMockPortal(userId: string) {
  return { url: `/billing/mock-portal?user_id=${encodeURIComponent(userId)}` }
}

export function getSubscriptionStatus(userId: string) {
  return subscriptions.get(userId) || { status: 'inactive', masjidId: '' }
}

export function verifyStripeSignature(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader) return false
  const parts = Object.fromEntries(signatureHeader.split(',').map((p) => p.split('=')))
  const t = parts.t
  const v1 = parts.v1
  if (!t || !v1) return false
  const signedPayload = `${t}.${rawBody}`
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
}

export function processWebhookEvent(event: any) {
  if (!event?.id) return { ignored: true, reason: 'missing_id' }
  if (processedEvents.has(event.id)) return { ignored: true, reason: 'duplicate' }
  processedEvents.add(event.id)

  if (event.type === 'checkout.session.completed') {
    const userId = event.data?.object?.metadata?.userId
    const masjidId = event.data?.object?.metadata?.masjidId || ''
    if (userId) subscriptions.set(userId, { status: 'active', masjidId })
  }

  if (event.type === 'customer.subscription.deleted') {
    const userId = event.data?.object?.metadata?.userId
    if (userId) subscriptions.set(userId, { status: 'canceled', masjidId: event.data?.object?.metadata?.masjidId || '' })
  }

  return { processed: true }
}
