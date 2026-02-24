export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-20%,rgba(16,185,129,0.2),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(92%_72%_at_50%_120%,rgba(8,47,73,0.34),transparent_62%)]" />
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-500/24 via-teal-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/16 via-sky-500/8 to-transparent blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xs rounded-3xl border border-border/80 bg-card/78 p-5 backdrop-blur-md shadow-[0_20px_50px_-35px_rgba(20,184,166,0.45)]">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/12">
              <span className="absolute inset-[3px] rounded-lg border border-emerald-500/30 animate-pulse" />
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Masjid Directory</p>
              <p className="text-sm text-muted-foreground">Loading nearby masjids...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
