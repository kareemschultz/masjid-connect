export async function GET() {
  return Response.json({
    googleAuthEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  })
}
