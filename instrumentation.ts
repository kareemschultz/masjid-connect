export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Force external DNS — Docker's embedded resolver can fail for external domains
    const dns = await import('dns')
    dns.setDefaultResultOrder('ipv4first')
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
    console.log('[Instrumentation] DNS override applied')
    const { startPrayerScheduler } = await import('./lib/prayer-scheduler')
    startPrayerScheduler()
    console.log('[Instrumentation] Prayer scheduler started')

    const { runMigrations } = await import('./lib/db-migrate')
    await runMigrations()
    console.log('[Instrumentation] DB migrations complete')
  }
}
