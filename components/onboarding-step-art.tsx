'use client'

export type OnboardingStepKey =
  | 'welcome'
  | 'features'
  | 'install'
  | 'theme'
  | 'profile'
  | 'prayer'
  | 'ramadan'
  | 'notifications'
  | 'done'

interface ArtProps {
  reducedMotion?: boolean
}

const motionGuard = (reducedMotion?: boolean) =>
  reducedMotion ? '* { animation: none !important; }' : ''

function WelcomeArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizWelcomeFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes wizWelcomeTwinkle { 0%,100% { opacity: 0.12; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
        @keyframes wizWelcomeOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <g transform="translate(320,72)">
        <circle cx="0" cy="0" r="30" fill="rgba(250,204,21,0.18)" />
        <circle cx="11" cy="-7" r="24" fill="rgba(3,7,18,0.95)" />
      </g>
      <g style={{ transformOrigin: '210px 150px', animation: 'wizWelcomeOrbit 16s linear infinite' }}>
        <circle cx="210" cy="58" r="2.5" fill="rgba(255,255,255,0.35)" />
        <circle cx="333" cy="165" r="2.5" fill="rgba(255,255,255,0.28)" />
        <circle cx="128" cy="222" r="2.2" fill="rgba(255,255,255,0.24)" />
      </g>
      {[ [66,64], [108,94], [184,78], [264,58], [354,108], [302,210], [112,182], [208,232] ].map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={1.7 + ((i + 1) % 2)}
          fill="rgba(236,253,245,0.75)"
          style={{ animation: `wizWelcomeTwinkle ${1.5 + i * 0.27}s ease-in-out ${i * 0.12}s infinite` }}
        />
      ))}
      <g style={{ animation: 'wizWelcomeFloat 7s ease-in-out infinite' }}>
        <path d="M78 236 Q210 182 344 236" fill="none" stroke="rgba(16,185,129,0.26)" strokeWidth="1.5" strokeDasharray="4 6" />
        <path d="M66 248 Q210 192 356 248" fill="none" stroke="rgba(20,184,166,0.2)" strokeWidth="1.1" strokeDasharray="2 7" />
      </g>
    </svg>
  )
}

function FeaturesArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizFeatDriftA { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-9px); } }
        @keyframes wizFeatDriftB { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(11px); } }
        @keyframes wizFeatPulse { 0%,100% { opacity: 0.1; } 50% { opacity: 0.35; } }
      `}</style>
      <g style={{ animation: 'wizFeatDriftA 6s ease-in-out infinite' }}>
        {[ [86,76], [160,92], [238,76], [312,92], [122,154], [210,166], [298,154] ].map((p, i) => (
          <rect
            key={i}
            x={p[0]}
            y={p[1]}
            width="32"
            height="32"
            rx="10"
            fill={i % 2 === 0 ? 'rgba(34,211,238,0.16)' : 'rgba(244,114,182,0.16)'}
            stroke="rgba(236,254,255,0.25)"
          />
        ))}
      </g>
      <g style={{ animation: 'wizFeatDriftB 8s ease-in-out infinite' }}>
        {[
          [102,92,138,154], [176,108,226,166], [254,92,282,154], [138,154,194,108], [226,166,282,154]
        ].map((l, i) => (
          <line
            key={i}
            x1={l[0]}
            y1={l[1]}
            x2={l[2]}
            y2={l[3]}
            stroke="rgba(224,231,255,0.24)"
            strokeWidth="1.4"
            style={{ animation: `wizFeatPulse ${2 + i * 0.3}s ease-in-out ${i * 0.1}s infinite` }}
          />
        ))}
      </g>
      <circle cx="334" cy="44" r="42" fill="rgba(249,168,212,0.08)" />
      <circle cx="72" cy="246" r="56" fill="rgba(34,211,238,0.08)" />
    </svg>
  )
}

function InstallArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizInstallPulse { 0%,100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.08); } }
        @keyframes wizInstallFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes wizInstallPing { 0% { opacity: 0.35; } 100% { opacity: 0; } }
      `}</style>
      <g transform="translate(300,64)" style={{ animation: 'wizInstallFloat 5.4s ease-in-out infinite' }}>
        <rect x="-30" y="-26" width="60" height="106" rx="14" fill="rgba(15,23,42,0.65)" stroke="rgba(209,250,229,0.35)" />
        <rect x="-20" y="-10" width="40" height="56" rx="9" fill="rgba(16,185,129,0.2)" />
        <rect x="-12" y="56" width="24" height="5" rx="2.5" fill="rgba(203,213,225,0.4)" />
      </g>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M 76 ${178 - i * 16} Q 142 ${126 - i * 20} 214 ${178 - i * 16}`}
          fill="none"
          stroke="rgba(45,212,191,0.32)"
          strokeWidth="1.8"
          style={{ animation: `wizInstallPing ${2.1 + i * 0.5}s ease-out ${i * 0.35}s infinite` }}
        />
      ))}
      {[ [88,208], [126,218], [168,208], [208,220] ].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="rgba(236,253,245,0.55)" style={{ animation: `wizInstallPulse ${1.6 + i * 0.3}s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </svg>
  )
}

function ThemeArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizThemeShift { 0%,100% { transform: translateX(0px); } 50% { transform: translateX(8px); } }
        @keyframes wizThemePulse { 0%,100% { opacity: 0.12; } 50% { opacity: 0.32; } }
      `}</style>
      <rect x="0" y="0" width="210" height="300" fill="rgba(2,132,199,0.16)" />
      <rect x="210" y="0" width="210" height="300" fill="rgba(30,41,59,0.34)" />
      <g transform="translate(210,136)" style={{ animation: 'wizThemeShift 6s ease-in-out infinite' }}>
        <circle cx="-36" cy="0" r="34" fill="rgba(250,204,21,0.2)" />
        <circle cx="32" cy="0" r="34" fill="rgba(15,23,42,0.8)" stroke="rgba(148,163,184,0.42)" />
        <circle cx="44" cy="-8" r="28" fill="rgba(8,47,73,0.72)" />
      </g>
      {[58, 100, 142, 184, 226, 268, 310, 352].map((x, i) => (
        <line key={i} x1={x} y1="220" x2={x + (i % 2 === 0 ? 14 : -14)} y2="252" stroke="rgba(203,213,225,0.18)" style={{ animation: `wizThemePulse ${2 + i * 0.2}s ease-in-out ${i * 0.1}s infinite` }} />
      ))}
    </svg>
  )
}

function ProfileArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizProfilePulse { 0%,100% { opacity: 0.22; transform: scale(1); } 50% { opacity: 0.48; transform: scale(1.28); } }
        @keyframes wizProfileFlow { 0%,100% { opacity: 0.1; } 50% { opacity: 0.35; } }
      `}</style>
      {[
        [96, 104, 24], [196, 78, 22], [296, 112, 24], [154, 182, 22], [258, 196, 24]
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n[0]} cy={n[1]} r={n[2]} fill="rgba(20,184,166,0.14)" />
          <circle
            cx={n[0]}
            cy={n[1]}
            r="20"
            fill="none"
            stroke="rgba(236,253,245,0.25)"
            style={{
              transformOrigin: `${n[0]}px ${n[1]}px`,
              animation: `wizProfilePulse ${2.1 + i * 0.35}s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        </g>
      ))}
      {[
        [96,104,196,78], [196,78,296,112], [96,104,154,182], [196,78,154,182], [196,78,258,196], [296,112,258,196]
      ].map((l, i) => (
        <line
          key={i}
          x1={l[0]}
          y1={l[1]}
          x2={l[2]}
          y2={l[3]}
          stroke="rgba(125,211,252,0.28)"
          strokeWidth="1.6"
          style={{ animation: `wizProfileFlow ${2 + i * 0.25}s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </svg>
  )
}

function PrayerArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizPrayerSpinA { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes wizPrayerSpinB { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes wizPrayerSweep { 0% { opacity: 0.1; transform: rotate(0deg); } 50% { opacity: 0.35; } 100% { opacity: 0.1; transform: rotate(360deg); } }
      `}</style>
      <g transform="translate(306,132)">
        <circle cx="0" cy="0" r="56" fill="none" stroke="rgba(16,185,129,0.26)" strokeDasharray="6 6" style={{ transformOrigin: '0px 0px', animation: 'wizPrayerSpinA 14s linear infinite' }} />
        <circle cx="0" cy="0" r="40" fill="none" stroke="rgba(45,212,191,0.2)" strokeDasharray="3 5" style={{ transformOrigin: '0px 0px', animation: 'wizPrayerSpinB 10s linear infinite' }} />
        <g style={{ transformOrigin: '0px 0px', animation: 'wizPrayerSweep 8s linear infinite' }}>
          <path d="M 0 0 L 0 -48 A 48 48 0 0 1 33 -35 Z" fill="rgba(16,185,129,0.22)" />
        </g>
      </g>
      <path d="M 66 230 Q 150 196 228 230" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
      <path d="M 78 240 Q 148 214 218 240" fill="none" stroke="rgba(167,243,208,0.22)" strokeWidth="1.1" />
    </svg>
  )
}

function RamadanArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizRamadanSway { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @keyframes wizRamadanGlow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.65; } }
        @keyframes wizRamadanTwinkle { 0%,100% { opacity: 0.08; transform: scale(1); } 50% { opacity: 0.42; transform: scale(1.3); } }
      `}</style>
      <g transform="translate(82,72)">
        <circle cx="0" cy="0" r="30" fill="rgba(252,211,77,0.2)" />
        <circle cx="12" cy="-7" r="25" fill="rgba(30,27,75,0.95)" />
      </g>
      <path d="M 246 24 Q 286 4 324 28" fill="none" stroke="rgba(251,191,36,0.24)" strokeWidth="1" strokeDasharray="5 4" />
      {[ [266,32,1.1], [304,30,1.6] ].map((l, i) => (
        <g key={i} transform={`translate(${l[0]},${l[1]})`} style={{ transformOrigin: `${l[0]}px ${l[1]}px`, animation: `wizRamadanSway ${3 + i * 0.4}s ease-in-out ${i * 0.2}s infinite` }}>
          <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(251,191,36,0.32)" />
          <rect x="-10" y="16" width="20" height="30" rx="7" fill="rgba(251,191,36,0.18)" stroke="rgba(254,240,138,0.3)" />
          <circle cx="0" cy="32" r="3.5" fill="rgba(253,224,71,0.8)" style={{ animation: `wizRamadanGlow ${1.8 + i * 0.3}s ease-in-out infinite` }} />
        </g>
      ))}
      {[ [38,34], [122,52], [174,66], [348,94], [312,128], [144,200] ].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={1.7 + (i % 2)} fill="rgba(254,240,138,0.8)" style={{ animation: `wizRamadanTwinkle ${1.6 + i * 0.25}s ease-in-out ${i * 0.12}s infinite` }} />
      ))}
    </svg>
  )
}

function NotificationsArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizNotifRing { 0% { opacity: 0.38; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.4); } }
        @keyframes wizNotifPulse { 0%,100% { opacity: 0.16; } 50% { opacity: 0.45; } }
      `}</style>
      <g transform="translate(302,88)">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="0" cy="0" r={20 + i * 16} fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="1.8" style={{ animation: `wizNotifRing ${2.4 + i * 0.45}s ease-out ${i * 0.35}s infinite` }} />
        ))}
        <path d="M -10 10 L 10 10 L 6 -8 Q 6 -16 0 -18 Q -6 -16 -6 -8 Z" fill="rgba(251,191,36,0.3)" stroke="rgba(254,243,199,0.45)" />
        <circle cx="0" cy="12" r="2.6" fill="rgba(253,224,71,0.72)" />
      </g>
      {[ [68,70], [110,130], [160,82], [206,150], [254,190], [342,204] ].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill="rgba(253,230,138,0.62)" style={{ animation: `wizNotifPulse ${1.6 + i * 0.3}s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </svg>
  )
}

function DoneArt({ reducedMotion }: ArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <style>{`
        ${motionGuard(reducedMotion)}
        @keyframes wizDoneRise { 0% { opacity: 0; transform: translateY(26px) rotate(0deg); } 25% { opacity: 0.52; } 100% { opacity: 0; transform: translateY(-70px) rotate(180deg); } }
        @keyframes wizDoneSweep { 0%,100% { opacity: 0.12; } 50% { opacity: 0.32; } }
      `}</style>
      {[ [64,246], [102,232], [148,252], [194,236], [242,250], [286,234], [334,246], [372,232] ].map((p, i) => (
        <rect
          key={i}
          x={p[0]}
          y={p[1]}
          width="8"
          height="8"
          rx="2"
          fill={i % 3 === 0 ? 'rgba(52,211,153,0.7)' : i % 3 === 1 ? 'rgba(45,212,191,0.7)' : 'rgba(251,191,36,0.74)'}
          style={{ animation: `wizDoneRise ${2.8 + i * 0.25}s ease-in-out ${i * 0.14}s infinite` }}
        />
      ))}
      <path d="M 38 248 Q 210 178 382 248" fill="none" stroke="rgba(45,212,191,0.24)" strokeWidth="1.8" style={{ animation: 'wizDoneSweep 4s ease-in-out infinite' }} />
      <path d="M 22 264 Q 210 202 398 264" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="1.2" style={{ animation: 'wizDoneSweep 5s ease-in-out 0.2s infinite' }} />
    </svg>
  )
}

export function OnboardingStepArt({ step, reducedMotion = false }: { step: OnboardingStepKey; reducedMotion?: boolean }) {
  if (step === 'welcome') return <WelcomeArt reducedMotion={reducedMotion} />
  if (step === 'features') return <FeaturesArt reducedMotion={reducedMotion} />
  if (step === 'install') return <InstallArt reducedMotion={reducedMotion} />
  if (step === 'theme') return <ThemeArt reducedMotion={reducedMotion} />
  if (step === 'profile') return <ProfileArt reducedMotion={reducedMotion} />
  if (step === 'prayer') return <PrayerArt reducedMotion={reducedMotion} />
  if (step === 'ramadan') return <RamadanArt reducedMotion={reducedMotion} />
  if (step === 'notifications') return <NotificationsArt reducedMotion={reducedMotion} />
  return <DoneArt reducedMotion={reducedMotion} />
}
