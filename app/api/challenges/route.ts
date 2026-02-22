import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { challenges, challengeParticipants, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/challenges?userId=<uuid>
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    // Get challenges user participates in
    const participations = await db.select({
      challengeId: challengeParticipants.challengeId,
      progress: challengeParticipants.progress,
      title: challenges.title,
      description: challenges.description,
      type: challenges.type,
      targetValue: challenges.targetValue,
      startDate: challenges.startDate,
      endDate: challenges.endDate,
      creatorName: users.username,
    })
    .from(challengeParticipants)
    .innerJoin(challenges, eq(challengeParticipants.challengeId, challenges.id))
    .innerJoin(users, eq(challenges.creatorId, users.id))
    .where(eq(challengeParticipants.userId, userId))

    return NextResponse.json(participations)
  } catch (err) {
    console.error('[API] GET /api/challenges error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST /api/challenges — create challenge
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { creatorId, title, description, type, targetValue, startDate, endDate } = body

    if (!creatorId || !title || !type || !targetValue || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [challenge] = await db.insert(challenges)
      .values({ creatorId, title, description, type, targetValue, startDate, endDate })
      .returning()

    // Auto-add creator as participant
    await db.insert(challengeParticipants).values({
      challengeId: challenge.id,
      userId: creatorId,
      progress: 0,
    })

    return NextResponse.json(challenge, { status: 201 })
  } catch (err) {
    console.error('[API] POST /api/challenges error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
