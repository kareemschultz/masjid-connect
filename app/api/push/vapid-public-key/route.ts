export async function GET() {
  const key = process.env.VAPID_PUBLIC_KEY
  if (!key) return Response.json({ error: 'Push not configured' }, { status: 503 })
  return Response.json({ publicKey: key })
}
