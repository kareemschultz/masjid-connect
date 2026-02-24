'use client'

/**
 * CardAnimation — subtle CSS-only background SVG animations for Explore cards.
 * GPU-accelerated (transforms + opacity only), low opacity (0.03-0.08).
 */

export type CardAnimationTheme = 
  | 'quran' | 'fiqh' | 'hadith' | 'madrasa' | 'lectures' 
  | 'hifz' | 'prophets' | 'arabic' | 'duas' | 'adhkar' | 'tasbih' 
  | 'qibla' | 'community' | 'halal' | 'sisters' | 'kids' | 'ramadan' 
  | 'zakat' | 'calendar' | 'jumuah' | 'names' | 'resources' | 'tafseer' | 'default'

interface CardAnimationProps {
  theme?: CardAnimationTheme
}

// ─── Individual animations ────────────────────────────────────────────────────

function RamadanAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="ramadanGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <style>{`
        @keyframes ramadanGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }
      `}</style>
      <path d="M70,20 Q40,20 40,50 Q40,80 70,80 Q55,70 55,50 Q55,30 70,20 Z" fill="url(#ramadanGradient)" style={{ animation: 'ramadanGlow 6s ease-in-out infinite' }} />
      {[[20,30], [30,15], [25,50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1" fill="#f59e0b" opacity="0.6" />
      ))}
    </svg>
  )
}


function QuranAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="quranGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes quranFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-10px) rotate(2deg); opacity: 0.9; }
        }
      `}</style>
      <path d="M20,30 Q50,20 80,30 L80,70 Q50,60 20,70 Z" fill="none" stroke="url(#quranGrad)" strokeWidth="1.5" style={{ animation: 'quranFloat 8s ease-in-out infinite' }} />
      <path d="M50,25 L50,65" fill="none" stroke="url(#quranGrad)" strokeWidth="0.8" style={{ animation: 'quranFloat 8s ease-in-out infinite' }} />
      <path d="M25,35 L45,32 M25,45 L45,42 M25,55 L45,52" fill="none" stroke="#a855f7" strokeWidth="0.4" opacity="0.6" />
      <path d="M55,32 L75,35 M55,42 L75,45 M55,52 L75,55" fill="none" stroke="#a855f7" strokeWidth="0.4" opacity="0.6" />
    </svg>
  )
}

function FiqhAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes scaleRock {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
      <g transform="translate(50, 40)" style={{ animation: 'scaleRock 6s ease-in-out infinite', transformOrigin: 'top center' }}>
        <line x1="-30" y1="0" x2="30" y2="0" stroke="#f59e0b" strokeWidth="2.5" />
        <path d="M-30,0 L-40,25 Q-30,30 -20,25 Z" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        <path d="M30,0 L20,25 Q30,30 40,25 Z" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
      </g>
      <line x1="50" y1="40" x2="50" y2="80" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="35" y1="80" x2="65" y2="80" stroke="#f59e0b" strokeWidth="2.5" />
    </svg>
  )
}

function HadithAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes scrollUnfurl {
          0%, 100% { transform: scaleX(0.95); }
          50% { transform: scaleX(1.05); }
        }
      `}</style>
      <rect x="25" y="20" width="50" height="60" rx="2" fill="none" stroke="#14b8a6" strokeWidth="1.5" style={{ animation: 'scrollUnfurl 10s ease-in-out infinite', transformOrigin: 'center' }} />
      <circle cx="25" cy="20" r="3" fill="none" stroke="#06b6d4" strokeWidth="1" />
      <circle cx="25" cy="80" r="3" fill="none" stroke="#06b6d4" strokeWidth="1" />
      <circle cx="75" cy="20" r="3" fill="none" stroke="#06b6d4" strokeWidth="1" />
      <circle cx="75" cy="80" r="3" fill="none" stroke="#06b6d4" strokeWidth="1" />
      <line x1="35" y1="35" x2="65" y2="35" stroke="#14b8a6" strokeWidth="0.6" opacity="0.6" />
      <line x1="35" y1="45" x2="60" y2="45" stroke="#14b8a6" strokeWidth="0.6" opacity="0.6" />
      <line x1="35" y1="55" x2="65" y2="55" stroke="#14b8a6" strokeWidth="0.6" opacity="0.6" />
    </svg>
  )
}

function MadrasaAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <g key={i} style={{ animation: `floatUp ${6 + i * 2}s linear infinite`, animationDelay: `${i * 2.5}s` }}>
          <path d="M40,50 L50,45 L60,50 L50,55 Z" fill="none" stroke="#6366f1" strokeWidth="1.5" transform={`translate(${10 + i * 20}, 0)`} />
          <path d="M50,55 L50,65" fill="none" stroke="#818cf8" strokeWidth="1.5" transform={`translate(${10 + i * 20}, 0)`} />
        </g>
      ))}
    </svg>
  )
}

function LecturesAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes pulseBar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
      <g transform="translate(50, 50)">
        {[-15, -7, 0, 7, 15].map((x, i) => (
          <rect key={i} x={x - 2} y="-20" width="4" height="40" rx="2" fill="#10b981"
            style={{ animation: `pulseBar ${0.8 + i * 0.2}s ease-in-out infinite`, transformOrigin: 'center' }} />
        ))}
      </g>
    </svg>
  )
}

function HifzAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes neuralPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
      <circle cx="50" cy="50" r="15" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const x = 50 + 30 * Math.cos((angle * Math.PI) / 180)
        const y = 50 + 30 * Math.sin((angle * Math.PI) / 180)
        return (
          <g key={i}>
            <line x1="50" y1="50" x2={x} y2={y} stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" />
            <circle cx={x} cy={y} r="4" fill="#3b82f6" style={{ animation: `neuralPulse 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }} />
          </g>
        )
      })}
    </svg>
  )
}

function ProphetsAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      {[[20,20], [80,30], [40,70], [70,80], [15,85], [85,15], [50,40]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="#f59e0b" style={{ animation: `starTwinkle ${2 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
      ))}
      <path d="M20,20 L50,40 L80,30 M40,70 L50,40 L70,80" fill="none" stroke="#fbbf24" strokeWidth="0.4" opacity="0.3" />
    </svg>
  )
}

function ArabicAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes charFloat {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.6; }
          100% { transform: translate(10px, -20px) rotate(10deg); opacity: 0; }
        }
      `}</style>
      {['ا', 'ب', 'ت', 'ث', 'ج'].map((char, i) => (
        <text key={i} x={20 + i * 15} y={70 - (i % 2) * 20} fontSize="18" fill="#06b6d4" fontWeight="bold" fontFamily="serif"
          style={{ animation: `charFloat 7s ease-in-out infinite`, animationDelay: `${i * 1.2}s` }}>
          {char}
        </text>
      ))}
    </svg>
  )
}

function DuasAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes handRadiate {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
      `}</style>
      <circle cx="50" cy="60" r="10" fill="none" stroke="#a855f7" strokeWidth="0.8" style={{ animation: 'handRadiate 4s ease-in-out infinite' }} />
      <circle cx="50" cy="60" r="20" fill="none" stroke="#d946ef" strokeWidth="0.8" style={{ animation: 'handRadiate 4s ease-in-out infinite', animationDelay: '1s' }} />
      <path d="M40,80 Q45,50 50,50 Q55,50 60,80" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
    </svg>
  )
}

function AdhkarAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.28]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes ringBreath {
          0%, 100% { opacity: 0.25; transform: scale(0.92); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes orbDrift {
          0%, 100% { transform: translateY(0px); opacity: 0.55; }
          50% { transform: translateY(-8px); opacity: 0.95; }
        }
      `}</style>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#14b8a6" strokeWidth="1.2" strokeDasharray="4 3" style={{ animation: 'ringBreath 5s ease-in-out infinite' }} />
      <circle cx="50" cy="50" r="17" fill="none" stroke="#2dd4bf" strokeWidth="1" style={{ animation: 'ringBreath 5s ease-in-out 0.4s infinite' }} />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={32 + i * 12}
          cy={64 - (i % 2) * 12}
          r="2.2"
          fill="#5eead4"
          style={{ animation: `orbDrift ${2.4 + i * 0.35}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  )
}

function TasbihAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes rotateBeads {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <g transform="translate(50, 50)" style={{ animation: 'rotateBeads 20s linear infinite' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle key={i} cx={30 * Math.cos((angle * Math.PI) / 180)} cy={30 * Math.sin((angle * Math.PI) / 180)} r="4" fill="#10b981" />
        ))}
        <circle cx="0" cy="0" r="30" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      </g>
    </svg>
  )
}

function QiblaAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes needleWobble {
          0%, 100% { transform: rotate(40deg); }
          50% { transform: rotate(50deg); }
        }
      `}</style>
      <circle cx="50" cy="50" r="35" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <g transform="translate(50, 50)" style={{ animation: 'needleWobble 4s ease-in-out infinite' }}>
        <path d="M0,-30 L5,0 L0,5 L-5,0 Z" fill="#3b82f6" opacity="0.9" />
        <path d="M0,30 L5,0 L0,-5 L-5,0 Z" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
      </g>
      <text x="50" y="25" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold">N</text>
    </svg>
  )
}

function CommunityAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes peoplePulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
      {[[30,60], [50,55], [70,60]].map(([x, y], i) => (
        <g key={i} style={{ animation: `peoplePulse ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`, transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y-8} r="6" fill="#8b5cf6" />
          <path d={`M${x-8},${y+5} Q${x},${y-5} ${x+8},${y+5} L${x+8},${y+15} L${x-8},${y+15} Z`} fill="#a78bfa" />
        </g>
      ))}
    </svg>
  )
}

function HalalAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes checkFade {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 3" />
      <path d="M35,50 L45,60 L65,40" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: 'checkFade 5s ease-in-out infinite' }} />
    </svg>
  )
}

function SistersAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes petalFloat {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.6; }
          100% { transform: translate(20px, 40px) rotate(90deg); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d="M10,0 Q15,10 10,20 Q5,10 10,0" fill={i % 2 === 0 ? "#f43f5e" : "#fb7185"}
          style={{ animation: `petalFloat ${8 + i * 2}s linear infinite`, animationDelay: `${i * 3}s`, position: 'absolute' }}
          transform={`translate(${20 + i * 20}, ${10 + (i % 2) * 20})`} />
      ))}
    </svg>
  )
}

function KidsAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
      <circle cx="30" cy="50" r="6" fill="#facc15" style={{ animation: 'bounce 3s ease-in-out infinite' }} />
      <rect x="60" y="45" width="10" height="10" rx="2" fill="#3b82f6" style={{ animation: 'bounce 3s ease-in-out infinite', animationDelay: '0.5s' }} />
      <path d="M45,30 L52,42 L38,42 Z" fill="#ef4444" style={{ animation: 'bounce 3s ease-in-out infinite', animationDelay: '1s' }} />
    </svg>
  )
}

function ZakatAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes coinFloat {
          0% { transform: translateY(20px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-50px); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} style={{ animation: `coinFloat ${5 + i}s linear infinite`, animationDelay: `${i * 1.5}s` }}>
          <circle cx={20 + i * 15} cy="60" r="4" fill="#10b981" />
          <text x={20 + i * 15} y="62" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">$</text>
        </g>
      ))}
    </svg>
  )
}

function CalendarAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes moonCycle {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
      <circle cx="50" cy="50" r="25" fill="#f59e0b" style={{ animation: 'moonCycle 10s ease-in-out infinite' }} />
      <circle cx="65" cy="50" r="25" fill="#000000" fillOpacity="0.2" style={{ animation: 'moonCycle 10s ease-in-out infinite' }} />
      <path d="M70,20 Q40,20 40,50 Q40,80 70,80 Q55,70 55,50 Q55,30 70,20 Z" fill="#fb923c" opacity="0.6" transform="translate(-10, -5) scale(0.6)" />
    </svg>
  )
}

function JumuahAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sunRay" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <style>{`
        @keyframes rotateRays {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes beamPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <g transform="translate(50, 50)" style={{ animation: 'rotateRays 30s linear infinite' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path key={i} d="M0,0 L-10,-60 L10,-60 Z" fill="url(#sunRay)" transform={`rotate(${angle})`}
            style={{ animation: `beamPulse ${2 + i * 0.5}s ease-in-out infinite` }} />
        ))}
      </g>
      <circle cx="50" cy="50" r="10" fill="#10b981" />
    </svg>
  )
}

function NamesAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes particleFly {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
        }
      `}</style>
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx="50" cy="50" r="1.5" fill="#f59e0b"
          style={{ 
            animation: `particleFly ${4 + Math.random() * 4}s ease-out infinite`,
            animationDelay: `${i * 0.5}s`,
            '--tx': `${(Math.random() - 0.5) * 80}px`,
            '--ty': `${(Math.random() - 0.5) * 80}px`
          } as any} 
        />
      ))}
      <text x="50" y="55" textAnchor="middle" fontSize="24" fill="#fbbf24" fontWeight="bold" opacity="0.4" fontFamily="serif">الله</text>
    </svg>
  )
}

function ResourcesAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.30]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes bookOpen {
          0% { transform: scale(0.8) translateY(10px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: scale(1.1) translateY(-10px); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <g key={i} style={{ animation: `bookOpen 6s ease-in-out infinite`, animationDelay: `${i * 2}s` }}>
          <path d="M30,40 Q50,30 70,40 L70,60 Q50,50 30,60 Z" fill="none" stroke="#0ea5e9" strokeWidth="1.5" transform={`translate(${i * 5 - 5}, ${i * 5 - 5})`} />
          <path d="M50,35 L50,55" fill="none" stroke="#38bdf8" strokeWidth="1" transform={`translate(${i * 5 - 5}, ${i * 5 - 5})`} />
        </g>
      ))}
    </svg>
  )
}

function TafseerAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.26]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes pageLift {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.45; }
          50% { transform: translateY(-6px) scale(1.03); opacity: 0.9; }
        }
        @keyframes beamSweep {
          0%, 100% { opacity: 0.15; transform: rotate(-14deg); }
          50% { opacity: 0.45; transform: rotate(14deg); }
        }
      `}</style>
      <path d="M25,30 Q50,20 75,30 L75,72 Q50,62 25,72 Z" fill="none" stroke="#22d3ee" strokeWidth="1.5" style={{ animation: 'pageLift 6s ease-in-out infinite' }} />
      <path d="M50,26 L50,66" fill="none" stroke="#67e8f9" strokeWidth="1" style={{ animation: 'pageLift 6s ease-in-out 0.3s infinite' }} />
      <path d="M35,40 L45,38 M35,48 L45,46 M55,38 L66,40 M55,46 L66,48" fill="none" stroke="#0891b2" strokeWidth="0.8" opacity="0.7" />
      <path d="M48,16 L54,16 L69,5 L74,10 Z" fill="#22d3ee" opacity="0.6" style={{ animation: 'beamSweep 4.5s ease-in-out infinite' }} />
    </svg>
  )
}

function DefaultAnimation() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.20]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes gradientShift {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
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
          case 'adhkar':    return <AdhkarAnimation />
          case 'tasbih':    return <TasbihAnimation />
          case 'qibla':     return <QiblaAnimation />
          case 'community': return <CommunityAnimation />
          case 'halal':     return <HalalAnimation />
          case 'sisters':   return <SistersAnimation />
          case 'kids':      return <KidsAnimation />
          case 'ramadan':   return <RamadanAnimation />
          case 'zakat':     return <ZakatAnimation />
          case 'calendar':  return <CalendarAnimation />
          case 'jumuah':    return <JumuahAnimation />
          case 'names':     return <NamesAnimation />
          case 'resources': return <ResourcesAnimation />
          case 'tafseer':   return <TafseerAnimation />
          default:          return <DefaultAnimation />
        }
      })()}
    </div>
  )
}
