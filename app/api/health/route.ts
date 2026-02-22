export async function GET() {
  return Response.json({ status: 'ok', service: 'masjidconnect-api', ts: new Date().toISOString() })
}
