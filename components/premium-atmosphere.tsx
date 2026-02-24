'use client'

type AtmosphereTone = 'masjid' | 'iftaar' | 'community'

interface PremiumAtmosphereProps {
  tone?: AtmosphereTone
}

const TONES: Record<
  AtmosphereTone,
  {
    topOverlay: string
    bottomOverlay: string
    meshOverlay: string
    blobA: string
    blobB: string
    blobC: string
    lineStroke: string
    dotColor: string
  }
> = {
  masjid: {
    topOverlay: 'radial-gradient(120% 90% at 50% -18%, rgba(16,185,129,0.16), transparent 58%)',
    bottomOverlay: 'radial-gradient(90% 72% at 50% 120%, rgba(8,47,73,0.36), transparent 62%)',
    meshOverlay: 'radial-gradient(80% 70% at 18% 24%, rgba(20,184,166,0.10), transparent 65%)',
    blobA: 'from-emerald-500/24 via-teal-500/12 to-transparent',
    blobB: 'from-cyan-400/18 via-sky-500/10 to-transparent',
    blobC: 'from-emerald-400/14 via-teal-500/6 to-transparent',
    lineStroke: 'rgba(20,184,166,0.2)',
    dotColor: 'rgba(110,231,183,0.25)',
  },
  iftaar: {
    topOverlay: 'radial-gradient(120% 90% at 50% -18%, rgba(251,191,36,0.17), transparent 58%)',
    bottomOverlay: 'radial-gradient(92% 75% at 50% 120%, rgba(120,53,15,0.36), transparent 62%)',
    meshOverlay: 'radial-gradient(80% 70% at 20% 24%, rgba(249,115,22,0.10), transparent 65%)',
    blobA: 'from-amber-400/26 via-orange-500/10 to-transparent',
    blobB: 'from-orange-400/18 via-amber-500/10 to-transparent',
    blobC: 'from-yellow-400/14 via-amber-500/8 to-transparent',
    lineStroke: 'rgba(251,191,36,0.22)',
    dotColor: 'rgba(253,224,71,0.27)',
  },
  community: {
    topOverlay: 'radial-gradient(120% 90% at 50% -18%, rgba(59,130,246,0.16), transparent 58%)',
    bottomOverlay: 'radial-gradient(92% 72% at 50% 120%, rgba(30,64,175,0.34), transparent 62%)',
    meshOverlay: 'radial-gradient(80% 70% at 18% 24%, rgba(56,189,248,0.11), transparent 65%)',
    blobA: 'from-blue-500/24 via-cyan-500/12 to-transparent',
    blobB: 'from-indigo-400/16 via-blue-500/10 to-transparent',
    blobC: 'from-cyan-400/14 via-sky-500/8 to-transparent',
    lineStroke: 'rgba(56,189,248,0.2)',
    dotColor: 'rgba(125,211,252,0.26)',
  },
}

export function PremiumAtmosphere({ tone = 'masjid' }: PremiumAtmosphereProps) {
  const config = TONES[tone]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes premiumDrift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -16px, 0) scale(1.04); }
        }
        @keyframes premiumDriftSlow {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(10px, 10px, 0) scale(1.06); }
        }
        @keyframes premiumSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="absolute inset-0" style={{ background: config.topOverlay }} />
      <div className="absolute inset-0" style={{ background: config.bottomOverlay }} />
      <div className="absolute inset-0" style={{ background: config.meshOverlay }} />

      <div
        className={`absolute -right-24 -top-28 h-72 w-72 rounded-full bg-gradient-to-br ${config.blobA} blur-3xl`}
        style={{ animation: 'premiumDrift 14s ease-in-out infinite' }}
      />
      <div
        className={`absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-gradient-to-br ${config.blobB} blur-3xl`}
        style={{ animation: 'premiumDriftSlow 18s ease-in-out infinite' }}
      />
      <div
        className={`absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-gradient-to-tr ${config.blobC} blur-3xl`}
        style={{ animation: 'premiumDrift 20s ease-in-out 0.4s infinite' }}
      />

      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 420 900" preserveAspectRatio="none">
        <path d="M20 190 Q 178 120 402 180" fill="none" stroke={config.lineStroke} strokeWidth="1.1" strokeDasharray="6 7" />
        <path d="M-16 610 Q 180 540 436 620" fill="none" stroke={config.lineStroke} strokeWidth="1" strokeDasharray="3 7" />
      </svg>

      {[10, 20, 32, 44, 58, 70, 84, 94].map((x, idx) => (
        <span
          key={idx}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${x}%`,
            top: `${12 + (idx % 4) * 21}%`,
            backgroundColor: config.dotColor,
            animation: `premiumSpin ${20 + idx * 2}s linear infinite`,
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  )
}
