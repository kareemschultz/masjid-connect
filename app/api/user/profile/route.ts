import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, email, name, displayName, community, ramadanStart, asrMadhab, phoneNumber } = session.user as any
    return Response.json({ id, email, name, displayName, community, ramadanStart, asrMadhab, phoneNumber })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
