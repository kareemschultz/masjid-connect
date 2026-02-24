import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { createMockCheckout } from '@/lib/stripe-billing'

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceId, masjidId, mode } = await request.json()
  if (!priceId || !masjidId) return Response.json({ error: 'priceId and masjidId required' }, { status: 400 })
  if (!['subscription', 'payment'].includes(mode || 'subscription')) {
    return Response.json({ error: 'Invalid mode' }, { status: 400 })
  }

  const created = createMockCheckout({ userId: session.user.id, masjidId, priceId, mode: mode || 'subscription' })
  return Response.json(created, { status: 201 })
}
