import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { createMockPortal } from '@/lib/stripe-billing'

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  return Response.json(createMockPortal(session.user.id))
}
