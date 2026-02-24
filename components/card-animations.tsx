'use client'

/**
 * CardAnimation — subtle CSS-only background SVG animations for Explore cards.
 * GPU-accelerated (transforms + opacity only), low opacity (0.03-0.08).
 */

export type CardAnimationTheme = 
  | 'quran' | 'fiqh' | 'hadith' | 'madrasa' | 'lectures' 
  | 'hifz' | 'prophets' | 'arabic' | 'duas' | 'tasbih' 
  | 'qibla' | 'community' | 'halal' | 'sisters' | 'kids' | 'ramadan' | 'default'

interface CardAnimationProps {
  theme?: CardAnimationTheme
}

// ─── Individual animations ────────────────────────────────────────────────────

function RamadanAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes ramadanGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
      <path d="M70,20 Q40,20 40,50 Q40,80 70,80 Q55,70 55,50 Q55,30 70,20 Z" fill="currentColor" style={{ animation: 'ramadanGlow 6s ease-in-out infinite' }} />
      {[[20,30], [30,15], [25,50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1" fill="currentColor" opacity="0.4" />
      ))}
    </svg>
  )
}


function QuranAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes quranFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-10px) rotate(2deg); opacity: 0.8; }
        }
      `}</style>
      <path d="M20,30 Q50,20 80,30 L80,70 Q50,60 20,70 Z" fill="none" stroke="currentColor" strokeWidth="1" style={{ animation: 'quranFloat 8s ease-in-out infinite' }} />
      <path d="M50,25 L50,65" fill="none" stroke="currentColor" strokeWidth="0.5" style={{ animation: 'quranFloat 8s ease-in-out infinite' }} />
      <path d="M25,35 L45,32 M25,45 L45,42 M25,55 L45,52" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
      <path d="M55,32 L75,35 M55,42 L75,45 M55,52 L75,55" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
    </svg>
  )
}

function FiqhAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes scaleRock {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
      <g transform="translate(50, 40)" style={{ animation: 'scaleRock 6s ease-in-out infinite', transformOrigin: 'top center' }}>
        <line x1="-30" y1="0" x2="30" y2="0" stroke="currentColor" strokeWidth="2" />
        <path d="M-30,0 L-40,25 Q-30,30 -20,25 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M30,0 L20,25 Q30,30 40,25 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </g>
      <line x1="50" y1="40" x2="50" y2="80" stroke="currentColor" strokeWidth="2" />
      <line x1="35" y1="80" x2="65" y2="80" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function HadithAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes scrollUnfurl {
          0%, 100% { transform: scaleX(0.95); }
          50% { transform: scaleX(1.05); }
        }
      `}</style>
      <rect x="25" y="20" width="50" height="60" rx="2" fill="none" stroke="currentColor" strokeWidth="1" style={{ animation: 'scrollUnfurl 10s ease-in-out infinite', transformOrigin: 'center' }} />
      <circle cx="25" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="25" cy="80" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="75" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="75" cy="80" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="35" y1="35" x2="65" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="35" y1="45" x2="60" y2="45" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="35" y1="55" x2="65" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  )
}

function MadrasaAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <g key={i} style={{ animation: `floatUp ${6 + i * 2}s linear infinite`, animationDelay: `${i * 2.5}s` }}>
          <path d="M40,50 L50,45 L60,50 L50,55 Z" fill="none" stroke="currentColor" strokeWidth="1" transform={`translate(${10 + i * 20}, 0)`} />
          <path d="M50,55 L50,65" fill="none" stroke="currentColor" strokeWidth="1" transform={`translate(${10 + i * 20}, 0)`} />
        </g>
      ))}
    </svg>
  )
}

function LecturesAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes pulseBar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
      <g transform="translate(50, 50)">
        {[-15, -7, 0, 7, 15].map((x, i) => (
          <rect key={i} x={x - 2} y="-20" width="4" height="40" rx="2" fill="currentColor"
            style={{ animation: `pulseBar ${0.8 + i * 0.2}s ease-in-out infinite`, transformOrigin: 'center' }} />
        ))}
      </g>
    </svg>
  )
}

function HifzAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes neuralPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const x = 50 + 30 * Math.cos((angle * Math.PI) / 180)
        const y = 50 + 30 * Math.sin((angle * Math.PI) / 180)
        return (
          <g key={i}>
            <line x1="50" y1="50" x2={x} y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx={x} cy={y} r="4" fill="currentColor" style={{ animation: `neuralPulse 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }} />
          </g>
        )
      })}
    </svg>
  )
}

function ProphetsAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      {[[20,20], [80,30], [40,70], [70,80], [15,85], [85,15], [50,40]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="currentColor" style={{ animation: `starTwinkle ${2 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
      ))}
      <path d="M20,20 L50,40 L80,30 M40,70 L50,40 L70,80" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
    </svg>
  )
}

function ArabicAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes charFloat {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { transform: translate(10px, -20px) rotate(10deg); opacity: 0; }
        }
      `}</style>
      {['ا', 'ب', 'ت', 'ث', 'ج'].map((char, i) => (
        <text key={i} x={20 + i * 15} y={70 - (i % 2) * 20} fontSize="16" fill="currentColor" fontFamily="serif"
          style={{ animation: `charFloat 7s ease-in-out infinite`, animationDelay: `${i * 1.2}s` }}>
          {char}
        </text>
      ))}
    </svg>
  )
}

function DuasAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes handRadiate {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
      <circle cx="50" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" style={{ animation: 'handRadiate 4s ease-in-out infinite' }} />
      <circle cx="50" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" style={{ animation: 'handRadiate 4s ease-in-out infinite', animationDelay: '1s' }} />
      <path d="M40,80 Q45,50 50,50 Q55,50 60,80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

function TasbihAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes rotateBeads {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <g transform="translate(50, 50)" style={{ animation: 'rotateBeads 20s linear infinite' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle key={i} cx={30 * Math.cos((angle * Math.PI) / 180)} cy={30 * Math.sin((angle * Math.PI) / 180)} r="3" fill="currentColor" />
        ))}
        <circle cx="0" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
      </g>
    </svg>
  )
}

function QiblaAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes needleWobble {
          0%, 100% { transform: rotate(40deg); }
          50% { transform: rotate(50deg); }
        }
      `}</style>
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
      <g transform="translate(50, 50)" style={{ animation: 'needleWobble 4s ease-in-out infinite' }}>
        <path d="M0,-30 L5,0 L0,5 L-5,0 Z" fill="currentColor" opacity="0.8" />
        <path d="M0,30 L5,0 L0,-5 L-5,0 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </g>
      <text x="50" y="25" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="bold">N</text>
    </svg>
  )
}

function CommunityAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes peoplePulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
      `}</style>
      {[[30,60], [50,55], [70,60]].map(([x, y], i) => (
        <g key={i} style={{ animation: `peoplePulse ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`, transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y-8} r="5" fill="currentColor" />
          <path d={`M${x-8},${y+5} Q${x},${y-5} ${x+8},${y+5} L${x+8},${y+15} L${x-8},${y+15} Z`} fill="currentColor" />
        </g>
      ))}
    </svg>
  )
}

function HalalAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes checkFade {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
      <path d="M35,50 L45,60 L65,40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: 'checkFade 5s ease-in-out infinite' }} />
    </svg>
  )
}

function SistersAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes petalFloat {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { transform: translate(20px, 40px) rotate(90deg); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d="M10,0 Q15,10 10,20 Q5,10 10,0" fill="currentColor"
          style={{ animation: `petalFloat ${8 + i * 2}s linear infinite`, animationDelay: `${i * 3}s`, position: 'absolute' }}
          transform={`translate(${20 + i * 20}, ${10 + (i % 2) * 20})`} />
      ))}
    </svg>
  )
}

function KidsAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
      <circle cx="30" cy="50" r="5" fill="currentColor" style={{ animation: 'bounce 3s ease-in-out infinite' }} />
      <rect x="60" y="45" width="8" height="8" rx="2" fill="currentColor" style={{ animation: 'bounce 3s ease-in-out infinite', animationDelay: '0.5s' }} />
      <path d="M45,30 L50,40 L40,40 Z" fill="currentColor" style={{ animation: 'bounce 3s ease-in-out infinite', animationDelay: '1s' }} />
    </svg>
  )
}

function DefaultAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.04]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes gradientShift {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <circle cx="50" cy="50" r="40" fill="currentColor" style={{ animation: 'gradientShift 12s ease-in-out infinite' }} />
      <circle cx="20" cy="20" r="20" fill="currentColor" style={{ animation: 'gradientShift 15s ease-in-out infinite', animationDelay: '2s' }} />
    </svg>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CardAnimation({ theme = 'default' }: CardAnimationProps) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {(() => {
        switch (theme) {
          case 'quran':     return <QuranAnimation />
          case 'fiqh':      return <FiqhAnimation />
          case 'hadith':    return <HadithAnimation />
          case 'madrasa':   return <MadrasaAnimation />
          case 'lectures':  return <LecturesAnimation />
          case 'hifz':      return <HifzAnimation />
          case 'prophets':  return <ProphetsAnimation />
          case 'arabic':    return <ArabicAnimation />
          case 'duas':      return <DuasAnimation />
          case 'tasbih':    return <TasbihAnimation />
          case 'qibla':     return <QiblaAnimation />
          case 'community': return <CommunityAnimation />
          case 'halal':     return <HalalAnimation />
          case 'sisters':   return <SistersAnimation />
          case 'kids':      return <KidsAnimation />
          case 'ramadan':   return <RamadanAnimation />
          default:          return <DefaultAnimation />
        }
      })()}
    </div>
  )
}
