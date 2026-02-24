import { NextRequest } from 'next/server'
import { POST as createFriendRequest } from '../route'

// Compatibility route for older clients.
// Remove after 2026-06-30 once legacy app versions are sunset.

export async function POST(request: NextRequest) {
  return createFriendRequest(request)
}
