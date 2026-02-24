'use client'

/**
 * HeroAnimation — page-specific background SVG animations for PageHero.
 * All animations are CSS-only (no JS libs) and GPU-accelerated (transforms + opacity only).
 */

export type HeroTheme =
  | 'quran'       // Floating Arabic calligraphy letters
  | 'prayer'      // Mosque dome silhouette + crescent + stars
  | 'ramadan'     // Fanoos lantern + crescent moon
  | 'fiqh'        // Scales of justice rocking
  | 'explore'     // Compass rose with rotating needle
  | 'tasbih'      // Prayer beads ring with sequential shimmer
  | 'community'   // Network of pulsing connected nodes
  | 'duas'        // Raised hands + ascending particles
  | 'lectures'    // Sound wave equalizer bars
  | 'hadith'      // Scroll + quill pen
  | 'sisters'     // Crescent + arabesque geometry
  | 'kids'        // Shooting stars + playful moons
  | 'janazah'     // Peaceful flowing waves
  | 'zakat'       // Falling coins + sparkles
  | 'masjid'      // Masjid directory
  | 'map'         // Live map route + pulsing location beacons
  | 'names'       // Arabic calligraphy swirl (99 Names)
  | 'default'     // Fallback geometric stars

// ─── Individual animations ────────────────────────────────────────────────────

function QuranAnimation() {
  const chars = ['بِ', 'سْ', 'مِ', 'اللّٰ', 'هِ', 'الرَّ', 'حْ', 'مٰ', 'نِ', 'الرَّ', 'حِيمِ']
  const positions = [8, 18, 30, 42, 54, 65, 75, 85, 20, 50, 70]
  const delays = [0, 0.8, 1.6, 0.4, 2.1, 1.2, 0.2, 1.8, 2.5, 0.6, 1.4]
  const durations = [5, 6, 4.5, 5.5, 6, 4.8, 5.2, 4, 6.5, 5, 4.5]
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes qFloat {
          0%   { opacity: 0; transform: translateY(30px) scale(0.8); }
          25%  { opacity: 0.35; }
          75%  { opacity: 0.25; }
          100% { opacity: 0; transform: translateY(-50px) scale(1.1); }
        }
      `}</style>
      {chars.map((ch, i) => (
        <text
          key={i}
          x={`${positions[i]}%`}
          y="75%"
          textAnchor="middle"
          fontSize={14 + (i % 3) * 4}
          fill="rgba(255,255,255,0.6)"
          fontFamily="'Amiri', serif"
          style={{
            animationName: 'qFloat',
            animationDuration: `${durations[i]}s`,
            animationDelay: `${delays[i]}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        >{ch}</text>
      ))}
    </svg>
  )
}

function PrayerAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes crescentPulse { 0%,100%{opacity:0.18;transform:scale(1)} 50%{opacity:0.28;transform:scale(1.03)} }
        @keyframes starTwinkle { 0%,100%{opacity:0.1} 50%{opacity:0.45} }
        @keyframes domeGlow { 0%,100%{opacity:0.12} 50%{opacity:0.22} }
      `}</style>
      {/* Crescent moon */}
      <g style={{ animationName:'crescentPulse', animationDuration:'4s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <circle cx="310" cy="45" r="28" fill="rgba(253,224,71,0.22)" />
        <circle cx="322" cy="40" r="22" fill="#0a0b14" />
      </g>
      {/* Stars */}
      {[[280,25],[340,30],[260,55],[350,60],[295,68],[320,18],[270,38]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={1.5 + (i%2)*0.8}
          fill="rgba(255,255,255,0.7)"
          style={{ animationName:'starTwinkle', animationDuration:`${1.5+(i*0.4)%2}s`, animationDelay:`${i*0.3}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}
        />
      ))}
      {/* Mosque silhouette */}
      <g style={{ animationName:'domeGlow', animationDuration:'3s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        {/* Main dome */}
        <path d="M 160 155 Q 160 115 200 115 Q 240 115 240 155 Z" fill="rgba(255,255,255,0.14)" />
        {/* Dome top */}
        <path d="M 190 115 Q 200 95 210 115 Z" fill="rgba(255,255,255,0.12)" />
        {/* Left minaret */}
        <rect x="148" y="130" width="8" height="28" fill="rgba(255,255,255,0.10)" />
        <path d="M 148 130 Q 152 122 156 130 Z" fill="rgba(255,255,255,0.10)" />
        {/* Right minaret */}
        <rect x="244" y="130" width="8" height="28" fill="rgba(255,255,255,0.10)" />
        <path d="M 244 130 Q 248 122 252 130 Z" fill="rgba(255,255,255,0.10)" />
        {/* Base */}
        <rect x="140" y="153" width="120" height="6" fill="rgba(255,255,255,0.08)" />
      </g>
    </svg>
  )
}

function RamadanAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes lanternSway { 0%,100%{transform:rotate(-5deg) translateX(0)} 50%{transform:rotate(5deg) translateX(2px)} }
        @keyframes lanternGlow { 0%,100%{opacity:0.55} 50%{opacity:0.75} }
        @keyframes ramCrescent { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.32;transform:scale(1.04)} }
        @keyframes starFloat { 0%,100%{opacity:0.12} 50%{opacity:0.40} }
      `}</style>
      {/* Crescent */}
      <g style={{ animationName:'ramCrescent', animationDuration:'4.5s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <circle cx="60" cy="45" r="26" fill="rgba(253,224,71,0.22)" />
        <circle cx="72" cy="38" r="21" fill="#0a0b14" />
      </g>
      {/* Stars scattered */}
      {[[100,20],[120,50],[80,70],[40,65],[140,35],[30,30]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={1.5+(i%2)*0.7} fill="rgba(255,255,255,0.65)"
          style={{ animationName:'starFloat', animationDuration:`${1.8+(i*0.35)%2}s`, animationDelay:`${i*0.25}s`, animationIterationCount:'infinite' }} />
      ))}
      {/* Lantern 1 */}
      <g transform="translate(270, 20)" style={{ transformOrigin:'270px 20px', animationName:'lanternSway', animationDuration:'3s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(253,224,71,0.4)" strokeWidth="1.5"/>
        <path d="M-12 12 Q-14 30 -10 48 L 10 48 Q 14 30 12 12 Z" fill="rgba(253,224,71,0.18)" stroke="rgba(253,224,71,0.4)" strokeWidth="1"/>
        <ellipse cx="0" cy="12" rx="12" ry="4" fill="rgba(253,224,71,0.25)" />
        <ellipse cx="0" cy="48" rx="10" ry="3.5" fill="rgba(253,224,71,0.25)" />
        <rect x="-3" y="48" width="6" height="6" fill="rgba(253,224,71,0.35)" />
        <circle cx="0" cy="30" r="4" fill="rgba(253,224,71,0.6)"
          style={{ animationName:'lanternGlow', animationDuration:'2s', animationIterationCount:'infinite' }} />
      </g>
      {/* Lantern 2 — smaller, different timing */}
      <g transform="translate(320, 10)" style={{ transformOrigin:'320px 10px', animationName:'lanternSway', animationDuration:'2.5s', animationDelay:'0.8s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(253,224,71,0.35)" strokeWidth="1.2"/>
        <path d="M-9 10 Q-11 24 -8 38 L 8 38 Q 11 24 9 10 Z" fill="rgba(253,224,71,0.15)" stroke="rgba(253,224,71,0.35)" strokeWidth="0.8"/>
        <ellipse cx="0" cy="10" rx="9" ry="3" fill="rgba(253,224,71,0.2)" />
        <circle cx="0" cy="24" r="3" fill="rgba(253,224,71,0.5)"
          style={{ animationName:'lanternGlow', animationDuration:'2s', animationDelay:'0.5s', animationIterationCount:'infinite' }} />
      </g>
      {/* Decorative rope */}
      <path d="M 255 5 Q 295 0 320 10 Q 350 5 370 15" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" strokeDasharray="4 4"/>
    </svg>
  )
}

function FiqhAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes scalesRock { 0%{transform:rotate(0deg)} 25%{transform:rotate(-6deg)} 75%{transform:rotate(6deg)} 100%{transform:rotate(0deg)} }
        @keyframes panLeft { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-6px)} 75%{transform:translateY(6px)} }
        @keyframes panRight { 0%,100%{transform:translateY(0)} 25%{transform:translateY(6px)} 75%{transform:translateY(-6px)} }
        @keyframes geoPulse { 0%,100%{opacity:0.06} 50%{opacity:0.12} }
      `}</style>
      {/* Background geometric star */}
      <polygon points="200,30 212,62 248,62 220,82 230,114 200,94 170,114 180,82 152,62 188,62"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
        style={{ animationName:'geoPulse', animationDuration:'4s', animationIterationCount:'infinite' }} />
      {/* Scales */}
      <g transform="translate(200, 55)">
        {/* Pivot post */}
        <line x1="0" y1="60" x2="0" y2="-5" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
        <circle cx="0" cy="-5" r="4" fill="rgba(255,255,255,0.25)" />
        {/* Beam */}
        <g style={{ transformOrigin:'0 0', animationName:'scalesRock', animationDuration:'5s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
          <line x1="-55" y1="0" x2="55" y2="0" stroke="rgba(255,255,255,0.30)" strokeWidth="2"/>
          {/* Left pan chain + pan */}
          <g style={{ animationName:'panLeft', animationDuration:'5s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <line x1="-55" y1="0" x2="-55" y2="24" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"/>
            <ellipse cx="-55" cy="30" rx="18" ry="5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
          </g>
          {/* Right pan chain + pan */}
          <g style={{ animationName:'panRight', animationDuration:'5s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <line x1="55" y1="0" x2="55" y2="24" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"/>
            <ellipse cx="55" cy="30" rx="18" ry="5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
          </g>
        </g>
        {/* Base */}
        <line x1="-15" y1="60" x2="15" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
      </g>
    </svg>
  )
}

function ExploreAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes compassSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ringPulse { 0%,100%{opacity:0.08;r:55} 50%{opacity:0.15;r:60} }
      `}</style>
      <g transform="translate(320, 90)">
        {/* Outer ring */}
        <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="6 4"/>
        <circle cx="0" cy="0" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {/* Cardinal labels */}
        <text x="0" y="-50" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)" fontWeight="bold">N</text>
        <text x="50" y="4" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.20)">E</text>
        <text x="0" y="58" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.20)">S</text>
        <text x="-50" y="4" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.20)">W</text>
        {/* Rotating needle */}
        <g style={{ transformOrigin:'0 0', animationName:'compassSpin', animationDuration:'12s', animationIterationCount:'infinite', animationTimingFunction:'linear' }}>
          <polygon points="0,-36 4,0 0,12 -4,0" fill="rgba(239,68,68,0.6)" />
          <polygon points="0,36 4,0 0,12 -4,0" fill="rgba(255,255,255,0.25)" />
        </g>
        <circle cx="0" cy="0" r="4" fill="rgba(255,255,255,0.35)" />
      </g>
      {/* Makkah direction indicator */}
      <text x="280" y="160" fontSize="9" fill="rgba(255,255,255,0.2)" textAnchor="middle">Makkah ↑</text>
    </svg>
  )
}

function TasbihAnimation() {
  const beadCount = 33
  const radius = 55
  const cx = 320, cy = 90
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes beadShimmer { 0%,100%{opacity:0.12} 50%{opacity:0.50} }
      `}</style>
      {Array.from({ length: beadCount }, (_, i) => {
        const angle = (i / beadCount) * 2 * Math.PI - Math.PI / 2
        const x = cx + radius * Math.cos(angle)
        const y = cy + radius * Math.sin(angle)
        const delay = (i / beadCount) * 4
        return (
          <circle key={i} cx={x} cy={y} r={i % 11 === 0 ? 4 : 2.5}
            fill={i % 11 === 0 ? 'rgba(167,243,208,0.5)' : 'rgba(255,255,255,0.35)'}
            style={{ animationName:'beadShimmer', animationDuration:'4s', animationDelay:`${delay}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}
          />
        )
      })}
      {/* Center label */}
      <text x={cx} y={cy+4} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.2)" fontFamily="'Amiri',serif">ذِكر</text>
      {/* String circle */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
    </svg>
  )
}

function CommunityAnimation() {
  const nodes = [[80,50],[130,35],[170,70],[110,90],[60,100],[150,110],[200,45],[230,80],[280,50],[260,110]]
  const links = [[0,1],[1,2],[2,3],[3,4],[4,0],[2,6],[6,7],[7,8],[8,9],[3,5],[5,9],[1,6]]
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes nodePulse { 0%,100%{opacity:0.15;r:4} 50%{opacity:0.45;r:6} }
        @keyframes linkPulse { 0%,100%{opacity:0.05} 50%{opacity:0.18} }
      `}</style>
      {links.map(([a,b],i) => (
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="rgba(255,255,255,0.3)" strokeWidth="1"
          style={{ animationName:'linkPulse', animationDuration:`${2+i*0.3}s`, animationDelay:`${i*0.2}s`, animationIterationCount:'infinite' }}
        />
      ))}
      {nodes.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={4}
          fill={i<3 ? 'rgba(167,243,208,0.5)' : 'rgba(255,255,255,0.4)'}
          style={{ animationName:'nodePulse', animationDuration:`${1.5+(i*0.25)%2}s`, animationDelay:`${i*0.18}s`, animationIterationCount:'infinite' }}
        />
      ))}
    </svg>
  )
}

function DuasAnimation() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: 160 + (i - 6) * 12 + (i % 3) * 8,
    delay: i * 0.4,
    duration: 3 + (i % 4) * 0.5,
    size: 2 + (i % 3),
  }))
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes particleRise { 0%{opacity:0;transform:translateY(0) scale(1)} 30%{opacity:0.5} 70%{opacity:0.25} 100%{opacity:0;transform:translateY(-80px) scale(0.5)} }
        @keyframes handsGlow { 0%,100%{opacity:0.14} 50%{opacity:0.24} }
      `}</style>
      {/* Hands raised (simplified) */}
      <g style={{ animationName:'handsGlow', animationDuration:'3s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        {/* Left hand */}
        <path d="M 140 155 L 138 115 Q 137 108 142 108 L 142 98 Q 141 92 146 92 L 146 88 Q 145 82 150 82 L 150 78 Q 149 72 154 72 L 158 72 Q 163 72 162 78 L 162 88 Q 167 88 166 94 L 166 100 Q 171 100 170 106 L 170 115 L 168 155 Z"
          fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        {/* Right hand */}
        <path d="M 260 155 L 262 115 Q 263 108 258 108 L 258 98 Q 259 92 254 92 L 254 88 Q 255 82 250 82 L 246 82 Q 241 82 242 88 L 242 98 Q 237 98 238 104 L 238 110 Q 233 110 234 116 L 232 155 Z"
          fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </g>
      {/* Rising particles */}
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={145} r={p.size}
          fill="rgba(167,243,208,0.6)"
          style={{ animationName:'particleRise', animationDuration:`${p.duration}s`, animationDelay:`${p.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-out' }}
        />
      ))}
    </svg>
  )
}

function LecturesAnimation() {
  const bars = [30, 60, 45, 80, 55, 70, 40, 90, 50, 65, 35, 75, 45, 85, 60]
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes barAnim0 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
        @keyframes barAnim1 { 0%,100%{transform:scaleY(0.6)} 50%{transform:scaleY(0.25)} }
        @keyframes barAnim2 { 0%,100%{transform:scaleY(0.45)} 50%{transform:scaleY(0.9)} }
      `}</style>
      {/* Sound wave bars */}
      <g transform="translate(200, 90)">
        {bars.map((h, i) => (
          <rect key={i}
            x={-bars.length * 8 / 2 + i * 8 + 2} y={-h/2} width="6" height={h}
            fill={`rgba(255,255,255,${0.08 + (i%3)*0.05})`}
            rx="3"
            style={{
              transformOrigin: '0 0',
              animationName: `barAnim${i%3}`,
              animationDuration: `${0.6 + (i%5)*0.15}s`,
              animationDelay: `${i*0.06}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            }}
          />
        ))}
      </g>
      {/* Microphone icon hint */}
      <g transform="translate(340, 70)" opacity="0.15">
        <rect x="-8" y="-20" width="16" height="30" rx="8" fill="white" />
        <path d="M -14 10 Q -14 28 0 28 Q 14 28 14 10" fill="none" stroke="white" strokeWidth="2.5"/>
        <line x1="0" y1="28" x2="0" y2="38" stroke="white" strokeWidth="2.5"/>
        <line x1="-8" y1="38" x2="8" y2="38" stroke="white" strokeWidth="2.5"/>
      </g>
    </svg>
  )
}

function HadithAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes scrollUnfurl { 0%,100%{transform:scaleX(0.9) scaleY(0.95)} 50%{transform:scaleX(1) scaleY(1)} }
        @keyframes quillWrite { 0%{transform:rotate(-15deg) translateX(0)} 50%{transform:rotate(-10deg) translateX(6px)} 100%{transform:rotate(-15deg) translateX(0)} }
        @keyframes lineAppear { 0%,100%{opacity:0.08} 50%{opacity:0.18} }
      `}</style>
      {/* Scroll */}
      <g transform="translate(200, 90)" style={{ animationName:'scrollUnfurl', animationDuration:'5s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <rect x="-70" y="-45" width="140" height="90" rx="4" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
        {/* Top roll */}
        <ellipse cx="0" cy="-45" rx="70" ry="8" fill="rgba(255,255,255,0.10)" />
        {/* Bottom roll */}
        <ellipse cx="0" cy="45" rx="70" ry="8" fill="rgba(255,255,255,0.10)" />
        {/* Text lines */}
        {[-28,-18,-8,2,12,22].map((y,i) => (
          <line key={i} x1={-50+(i%2)*5} y1={y} x2={50-(i%3)*4} y2={y}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
            style={{ animationName:'lineAppear', animationDuration:`${2+i*0.3}s`, animationDelay:`${i*0.2}s`, animationIterationCount:'infinite' }}
          />
        ))}
      </g>
      {/* Quill */}
      <g transform="translate(300, 80)" style={{ transformOrigin:'300px 80px', animationName:'quillWrite', animationDuration:'3s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <path d="M 0 0 Q 15 -30 30 -50 Q 25 -20 20 0 Q 15 15 0 20 Q 5 10 0 0 Z" fill="rgba(255,255,255,0.18)"/>
        <line x1="0" y1="0" x2="-8" y2="18" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
      </g>
    </svg>
  )
}

function SistersAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes petalRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sisCrescent { 0%,100%{opacity:0.18;transform:scale(1)} 50%{opacity:0.28;transform:scale(1.03)} }
        @keyframes petStar { 0%,100%{opacity:0.10} 50%{opacity:0.35} }
      `}</style>
      {/* Arabesque flower */}
      <g transform="translate(320, 90)" style={{ transformOrigin:'0 0', animationName:'petalRotate', animationDuration:'25s', animationIterationCount:'infinite', animationTimingFunction:'linear' }}>
        {Array.from({length:8}, (_,i) => {
          const angle = (i/8)*360
          return <ellipse key={i} cx={0} cy={-38} rx="8" ry="20"
            fill="rgba(255,192,203,0.12)"
            transform={`rotate(${angle})`}/>
        })}
        <circle cx="0" cy="0" r="8" fill="rgba(255,192,203,0.15)"/>
      </g>
      {/* Crescent */}
      <g style={{ animationName:'sisCrescent', animationDuration:'4s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <circle cx="80" cy="45" r="24" fill="rgba(253,224,71,0.18)" />
        <circle cx="92" cy="38" r="19" fill="#0a0b14" />
      </g>
      {/* Stars */}
      {[[55,30],[110,25],[65,65],[45,55],[120,50]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={1.4+(i%2)*0.6} fill="rgba(255,255,255,0.55)"
          style={{ animationName:'petStar', animationDuration:`${1.6+i*0.35}s`, animationDelay:`${i*0.3}s`, animationIterationCount:'infinite' }} />
      ))}
    </svg>
  )
}

function KidsAnimation() {
  const stars = Array.from({length:10}, (_,i) => ({
    x: 20 + (i*37)%360, y: 20 + (i*23)%120,
    delay: i*0.5, size: 3+(i%3)*2
  }))
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes shootStar { 0%{opacity:0;transform:translate(0,0)} 20%{opacity:0.7} 80%{opacity:0.5} 100%{opacity:0;transform:translate(60px,30px)} }
        @keyframes moonWobble { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
        @keyframes starKids { 0%,100%{opacity:0.15;transform:scale(0.8)} 50%{opacity:0.6;transform:scale(1.2)} }
      `}</style>
      {/* Moon */}
      <g transform="translate(50, 45)" style={{ animationName:'moonWobble', animationDuration:'3s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
        <circle cx="0" cy="0" r="22" fill="rgba(253,224,71,0.25)" />
        <circle cx="10" cy="-6" r="17" fill="#0a0b14" />
        <circle cx="-5" cy="5" r="3" fill="rgba(253,224,71,0.15)"/>
        <circle cx="3" cy="-2" r="2" fill="rgba(253,224,71,0.10)"/>
      </g>
      {/* Shooting stars */}
      {stars.slice(0,4).map((s,i)=>(
        <g key={i} style={{ animationName:'shootStar', animationDuration:`${2+i*0.6}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite' }}>
          <circle cx={s.x} cy={s.y} r={2} fill="rgba(255,255,255,0.7)" />
          <line x1={s.x} y1={s.y} x2={s.x-20} y2={s.y-10} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        </g>
      ))}
      {/* Twinkling stars */}
      {stars.map((s,i)=>(
        <polygon key={`star-${i}`}
          points={`${s.x},${s.y-s.size} ${s.x+s.size*0.35},${s.y-s.size*0.35} ${s.x+s.size},${s.y} ${s.x+s.size*0.35},${s.y+s.size*0.35} ${s.x},${s.y+s.size} ${s.x-s.size*0.35},${s.y+s.size*0.35} ${s.x-s.size},${s.y} ${s.x-s.size*0.35},${s.y-s.size*0.35}`}
          fill="rgba(255,255,255,0.35)"
          style={{ animationName:'starKids', animationDuration:`${1+(i*0.3)%2}s`, animationDelay:`${i*0.22}s`, animationIterationCount:'infinite' }}
        />
      ))}
    </svg>
  )
}

function JanazahAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes waveFlow { 0%{transform:translateX(-30px)} 100%{transform:translateX(30px)} }
        @keyframes janGlow { 0%,100%{opacity:0.05} 50%{opacity:0.14} }
      `}</style>
      {/* Gentle flowing waves */}
      {[0,1,2,3].map(i=>(
        <path key={i}
          d={`M -50 ${60+i*25} Q 100 ${45+i*25} 200 ${60+i*25} Q 300 ${75+i*25} 450 ${60+i*25}`}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"
          style={{ animationName:'waveFlow', animationDuration:`${6+i*1.2}s`, animationDelay:`${i*0.6}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', animationDirection: i%2===0 ? 'alternate' : 'alternate-reverse' }}
        />
      ))}
      {/* Arabic text: إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ */}
      <text x="200" y="95" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.15)"
        fontFamily="'Amiri',serif"
        style={{ animationName:'janGlow', animationDuration:'4s', animationIterationCount:'infinite' }}>
        إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
      </text>
      {/* Geometric circles */}
      {[60,80,100].map((r,i)=>(
        <circle key={i} cx="200" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}
    </svg>
  )
}

function ZakatAnimation() {
  const coins = Array.from({length:8}, (_,i) => ({
    x: 80 + i*32 + (i%3)*10, delay: i*0.4, duration: 3+(i%3)*0.5
  }))
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes coinFall { 0%{opacity:0;transform:translateY(-30px) rotate(0deg)} 20%{opacity:0.6} 80%{opacity:0.4;transform:translateY(60px) rotate(180deg)} 100%{opacity:0;transform:translateY(80px) rotate(240deg)} }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:0.6;transform:scale(1)} }
      `}</style>
      {/* Falling coins */}
      {coins.map((c,i)=>(
        <g key={i} style={{ animationName:'coinFall', animationDuration:`${c.duration}s`, animationDelay:`${c.delay}s`, animationIterationCount:'infinite' }}>
          <ellipse cx={c.x} cy={20} rx="7" ry="4" fill="rgba(253,224,71,0.35)" stroke="rgba(253,224,71,0.5)" strokeWidth="0.8"/>
          <text x={c.x} y={23} textAnchor="middle" fontSize="5" fill="rgba(253,224,71,0.6)">$</text>
        </g>
      ))}
      {/* Sparkles */}
      {[[100,80],[180,60],[260,90],[340,70],[140,110],[300,100]].map(([x,y],i)=>(
        <g key={i} style={{ animationName:'sparkle', animationDuration:`${1.2+i*0.3}s`, animationDelay:`${i*0.4}s`, animationIterationCount:'infinite' }}>
          <line x1={x-5} y1={y} x2={x+5} y2={y} stroke="rgba(253,224,71,0.5)" strokeWidth="1.5"/>
          <line x1={x} y1={y-5} x2={x} y2={y+5} stroke="rgba(253,224,71,0.5)" strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
  )
}

function MasjidAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes masjidGlow { 0%,100%{opacity:0.13} 50%{opacity:0.22} }
        @keyframes pinPulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
      `}</style>
      {/* Large mosque silhouette */}
      <g style={{ animationName:'masjidGlow', animationDuration:'4s', animationIterationCount:'infinite' }}>
        <path d="M 100 160 Q 100 110 150 110 Q 200 110 200 160 Z" fill="rgba(255,255,255,0.14)" />
        <path d="M 150 110 Q 150 85 165 85 Q 180 85 180 110 Q 165 105 150 110 Z" fill="rgba(255,255,255,0.12)" />
        <rect x="82" y="120" width="14" height="42" fill="rgba(255,255,255,0.09)" />
        <path d="M 82 120 Q 89 105 96 120 Z" fill="rgba(255,255,255,0.09)" />
        <rect x="204" y="120" width="14" height="42" fill="rgba(255,255,255,0.09)" />
        <path d="M 204 120 Q 211 105 218 120 Z" fill="rgba(255,255,255,0.09)" />
        <rect x="70" y="160" width="160" height="6" fill="rgba(255,255,255,0.07)" />
      </g>
      {/* Map pins for masjid locations */}
      {[[300,50],[340,80],[280,100],[360,45],[320,115]].map(([x,y],i)=>(
        <g key={i} style={{ animationName:'pinPulse', animationDuration:`${1.8+i*0.3}s`, animationDelay:`${i*0.4}s`, animationIterationCount:'infinite' }}>
          <circle cx={x} cy={y} r="5" fill="rgba(16,185,129,0.4)" />
          <circle cx={x} cy={y} r="2.5" fill="rgba(16,185,129,0.7)" />
        </g>
      ))}
      {/* Connection lines between pins */}
      <polyline points="300,50 340,80 360,45" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="1" strokeDasharray="4 3"/>
      <polyline points="280,100 320,115 340,80" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="1" strokeDasharray="4 3"/>
    </svg>
  )
}

function MapAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes mapRoutePulse { 0%,100%{opacity:0.12} 50%{opacity:0.35} }
        @keyframes beaconPulse { 0%{opacity:0.2;transform:scale(0.75)} 70%{opacity:0.45;transform:scale(1.2)} 100%{opacity:0;transform:scale(1.45)} }
        @keyframes nodeGlow { 0%,100%{opacity:0.28} 50%{opacity:0.62} }
      `}</style>

      {/* Route overlays */}
      <path
        d="M 22 146 Q 86 116 136 124 Q 176 130 214 102 Q 244 82 282 90 Q 318 98 372 66"
        fill="none"
        stroke="rgba(45,212,191,0.35)"
        strokeWidth="2"
        strokeDasharray="6 6"
        style={{ animationName: 'mapRoutePulse', animationDuration: '2.8s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }}
      />
      <path
        d="M 40 64 Q 96 44 146 62 Q 194 80 246 58 Q 292 40 354 54"
        fill="none"
        stroke="rgba(110,231,183,0.24)"
        strokeWidth="1.4"
        strokeDasharray="4 7"
        style={{ animationName: 'mapRoutePulse', animationDuration: '3.4s', animationDelay: '0.4s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }}
      />

      {/* Active location beacons */}
      {[
        [80, 120, 0],
        [178, 108, 0.5],
        [286, 86, 1.1],
        [336, 72, 1.5],
      ].map(([x, y, delay], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="5"
            fill="rgba(16,185,129,0.68)"
            style={{ animationName: 'nodeGlow', animationDuration: '1.8s', animationDelay: `${delay}s`, animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }}
          />
          <circle
            cx={x}
            cy={y}
            r="8"
            fill="none"
            stroke="rgba(45,212,191,0.65)"
            strokeWidth="1.2"
            style={{ transformOrigin: `${x}px ${y}px`, animationName: 'beaconPulse', animationDuration: '2.2s', animationDelay: `${delay}s`, animationIterationCount: 'infinite', animationTimingFunction: 'ease-out' }}
          />
        </g>
      ))}

      {/* Compass hint */}
      <g transform="translate(348, 126)">
        <circle cx="0" cy="0" r="16" fill="rgba(15,23,42,0.28)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M 0 -10 L 3 0 L 0 4 L -3 0 Z" fill="rgba(52,211,153,0.8)" />
        <path d="M 0 10 L 3 0 L 0 4 L -3 0 Z" fill="rgba(255,255,255,0.32)" />
        <text x="0" y="-19" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontWeight="bold">N</text>
      </g>
    </svg>
  )
}

function NamesAnimation() {
  const names99 = ['اللّٰه', 'الرَّحْمٰن', 'الرَّحِيم', 'الْمَلِك', 'الْقُدُّوس', 'السَّلَام', 'الْعَزِيز', 'الْجَبَّار']
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes nameFloat { 0%{opacity:0;transform:translateY(20px)} 20%{opacity:0.30} 80%{opacity:0.20} 100%{opacity:0;transform:translateY(-40px)} }
        @keyframes innerRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes outerRing { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
      `}</style>
      {/* Rotating rings */}
      <g transform="translate(320, 90)">
        <g style={{ transformOrigin:'0 0', animationName:'outerRing', animationDuration:'30s', animationIterationCount:'infinite', animationTimingFunction:'linear' }}>
          <circle cx="0" cy="0" r="55" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 6"/>
        </g>
        <g style={{ transformOrigin:'0 0', animationName:'innerRing', animationDuration:'20s', animationIterationCount:'infinite', animationTimingFunction:'linear' }}>
          <circle cx="0" cy="0" r="35" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="5 4"/>
        </g>
        <text x="0" y="6" textAnchor="middle" fontSize="18" fontFamily="'Amiri',serif" fill="rgba(255,255,255,0.25)">اللّٰه</text>
      </g>
      {/* Floating divine names */}
      {names99.slice(1).map((name, i) => (
        <text key={i}
          x={`${12 + (i*10)%70}%`} y="80%"
          textAnchor="middle" fontSize={10+(i%2)*3}
          fontFamily="'Amiri',serif" fill="rgba(255,255,255,0.45)"
          style={{ animationName:'nameFloat', animationDuration:`${4+i*0.6}s`, animationDelay:`${i*0.7}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}
        >{name}</text>
      ))}
    </svg>
  )
}

function DefaultAnimation() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes geoSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes geoPulse2 { 0%,100%{opacity:0.05} 50%{opacity:0.12} }
      `}</style>
      <g transform="translate(320, 90)" style={{ transformOrigin:'0 0', animationName:'geoSpin', animationDuration:'40s', animationIterationCount:'infinite', animationTimingFunction:'linear' }}>
        {[30,50,70].map((r,i) => (
          <polygon key={i} points={Array.from({length:8},(_,j)=>{const a=j/8*2*Math.PI-Math.PI/8; return `${r*Math.cos(a)},${r*Math.sin(a)}`}).join(' ')}
            fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        ))}
      </g>
    </svg>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HeroAnimation({ theme }: { theme: HeroTheme }) {
  switch (theme) {
    case 'quran':      return <QuranAnimation />
    case 'prayer':     return <PrayerAnimation />
    case 'ramadan':    return <RamadanAnimation />
    case 'fiqh':       return <FiqhAnimation />
    case 'explore':    return <ExploreAnimation />
    case 'tasbih':     return <TasbihAnimation />
    case 'community':  return <CommunityAnimation />
    case 'duas':       return <DuasAnimation />
    case 'lectures':   return <LecturesAnimation />
    case 'hadith':     return <HadithAnimation />
    case 'sisters':    return <SistersAnimation />
    case 'kids':       return <KidsAnimation />
    case 'janazah':    return <JanazahAnimation />
    case 'zakat':      return <ZakatAnimation />
    case 'masjid':     return <MasjidAnimation />
    case 'map':        return <MapAnimation />
    case 'names':      return <NamesAnimation />
    default:           return <DefaultAnimation />
  }
}
