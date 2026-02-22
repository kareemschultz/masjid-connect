import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { ramadanStart, asrMadhab, displayName, community, phoneNumber } = await request.json()
    const allowed: Record<string, string> = {}
    if (ramadanStart) allowed.ramadanStart = ramadanStart
    if (asrMadhab) allowed.asrMadhab = asrMadhab
    if (displayName !== undefined) allowed.displayName = displayName
    if (community !== undefined) allowed.community = community
    if (phoneNumber !== undefined) allowed.phoneNumber = phoneNumber

    await auth.api.updateUser({ body: allowed, headers: request.headers })
    return Response.json({ success: true, updated: allowed })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
