'use client'

import { useState } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { ChevronDown, ChevronRight, CheckCircle2, BookOpen, Star } from 'lucide-react'
import { SUNNAH_PRAYERS, NAWAFIL_PRAYERS } from '@/lib/prayer-types'

// ─── SVG Prayer Position Icons ──────────────────────────────────────────────

function QiyamIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="40" cy="12" r="9" stroke="#34d399" strokeWidth="2.5" fill="none" />
      {/* Body */}
      <line x1="40" y1="21" x2="40" y2="68" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Folded arms */}
      <path d="M40 35 L25 42 L32 48 L40 44 L48 48 L55 42 L40 35Z" stroke="#34d399" strokeWidth="2" fill="#34d399" fillOpacity="0.15" strokeLinejoin="round" />
      {/* Legs */}
      <line x1="40" y1="68" x2="30" y2="100" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="68" x2="50" y2="100" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <line x1="30" y1="100" x2="22" y2="108" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="100" x2="58" y2="108" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function RukuIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="18" cy="35" r="9" stroke="#34d399" strokeWidth="2.5" fill="none" />
      {/* Back (horizontal) */}
      <line x1="27" y1="35" x2="80" y2="35" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Spine down to legs */}
      <line x1="80" y1="35" x2="80" y2="80" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hands on knees */}
      <circle cx="50" cy="70" r="4" stroke="#34d399" strokeWidth="2" fill="none" />
      <line x1="27" y1="35" x2="50" y2="65" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <line x1="80" y1="80" x2="65" y2="100" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="80" x2="95" y2="100" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function SujoodIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground line */}
      <line x1="5" y1="72" x2="115" y2="72" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Head on ground */}
      <circle cx="20" cy="62" r="8" stroke="#34d399" strokeWidth="2.5" fill="none" />
      {/* Body arched */}
      <path d="M28 62 Q50 40 75 50" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Hips up */}
      <line x1="75" y1="50" x2="85" y2="30" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs down */}
      <line x1="85" y1="30" x2="90" y2="65" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="85" y1="30" x2="100" y2="65" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms on ground */}
      <line x1="28" y1="62" x2="10" y2="70" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="62" x2="45" y2="70" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SittingIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground line */}
      <line x1="5" y1="100" x2="95" y2="100" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Head */}
      <circle cx="50" cy="12" r="9" stroke="#34d399" strokeWidth="2.5" fill="none" />
      {/* Body */}
      <line x1="50" y1="21" x2="50" y2="60" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms resting on thighs */}
      <line x1="50" y1="40" x2="30" y2="72" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="40" x2="70" y2="72" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      {/* Left leg folded */}
      <path d="M50 60 Q35 75 25 82 Q20 90 30 98" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Right leg folded */}
      <path d="M50 60 Q65 75 75 82 Q80 90 70 98" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function TakbirIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="40" cy="12" r="9" stroke="#34d399" strokeWidth="2.5" fill="none" />
      {/* Body */}
      <line x1="40" y1="21" x2="40" y2="68" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms raised to ears */}
      <line x1="40" y1="32" x2="20" y2="22" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="32" x2="60" y2="22" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hands near ears */}
      <circle cx="20" cy="22" r="3" stroke="#34d399" strokeWidth="2" fill="none" />
      <circle cx="60" cy="22" r="3" stroke="#34d399" strokeWidth="2" fill="none" />
      {/* Legs */}
      <line x1="40" y1="68" x2="30" y2="100" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="68" x2="50" y2="100" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="100" x2="22" y2="108" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="100" x2="58" y2="108" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WUDU_STEPS = [
  {
    num: 1, emoji: '🤲', title: 'Niyyah (Intention)', arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah', meaning: 'In the name of Allah',
    desc: 'Make intention in your heart to purify yourself for prayer. Say Bismillah.',
  },
  {
    num: 2, emoji: '👐', title: 'Wash Hands', arabic: null, transliteration: null, meaning: null,
    desc: 'Wash both hands up to the wrists, 3 times. Start with the right hand.',
  },
  {
    num: 3, emoji: '💧', title: 'Rinse Mouth (Madmadah)', arabic: null, transliteration: null, meaning: null,
    desc: 'Take water into your mouth, swirl it around, then spit it out. Repeat 3 times.',
  },
  {
    num: 4, emoji: '👃', title: 'Rinse Nose (Istinshaq)', arabic: null, transliteration: null, meaning: null,
    desc: 'Sniff water gently into your nostrils with your right hand, blow it out with your left. Repeat 3 times.',
  },
  {
    num: 5, emoji: '😊', title: 'Wash Face', arabic: null, transliteration: null, meaning: null,
    desc: 'Wash your entire face 3 times — from hairline to chin, and from ear to ear.',
  },
  {
    num: 6, emoji: '💪', title: 'Wash Arms to Elbows', arabic: null, transliteration: null, meaning: null,
    desc: 'Wash your right arm from fingertips to elbow 3 times, then your left arm 3 times.',
  },
  {
    num: 7, emoji: '🙆', title: 'Wipe Head (Masah)', arabic: null, transliteration: null, meaning: null,
    desc: 'Pass your wet hands over your head once — from forehead to the back of your neck, then back. Include the ears.',
  },
  {
    num: 8, emoji: '🦶', title: 'Wash Feet to Ankles', arabic: null, transliteration: null, meaning: null,
    desc: 'Wash your right foot up to and including the ankle 3 times, then your left foot 3 times. Pass fingers between toes.',
  },
]

const SALAH_STEPS = [
  {
    num: 1, position: 'Niyyah', arabic: null, transliteration: null, meaning: null,
    positionArabic: 'النية',
    desc: 'Make intention in your heart for the specific prayer you are about to perform (e.g., "I intend to pray 2 rakats of Fajr"). It need not be spoken aloud.',
    Icon: QiyamIcon, note: null,
  },
  {
    num: 2, position: 'Takbiratul Ihram', positionArabic: 'تكبيرة الإحرام',
    arabic: 'اللَّهُ أَكْبَر', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest',
    desc: 'Raise both hands to your earlobes, palms forward. Say "Allahu Akbar" and then fold your right hand over your left on your chest.',
    Icon: TakbirIcon, note: null,
  },
  {
    num: 3, position: 'Qiyam (Standing)', positionArabic: 'القيام',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۞ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۞ الرَّحْمَٰنِ الرَّحِيمِ ۞ مَالِكِ يَوْمِ الدِّينِ ۞ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۞ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۞ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration: 'Bismillah ir-Rahman ir-Raheem. Al-hamdu lillahi rabbil-alameen. Ar-rahmanir-raheem. Maliki yawmid-deen. Iyyaka nabudu wa iyyaka nastaeen. Ihdinas-siratal mustaqeem. Siratal-ladhina anamta alayhim, ghayril-maghdubi alayhim wa lad-dalleen.',
    meaning: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is for Allah, Lord of all worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. You alone we worship and You alone we ask for help. Guide us to the straight path — the path of those You have blessed, not those who have earned anger, nor those who are astray.',
    desc: 'Recite Surah Al-Fatiha quietly (or aloud in Fajr, Maghrib, Isha — follow your imam). Then recite another short surah or verses.',
    Icon: QiyamIcon, note: 'Al-Fatiha is obligatory. A short surah like Al-Ikhlas (Qul huwallahu ahad...) follows.',
  },
  {
    num: 4, position: 'Ruku (Bowing)', positionArabic: 'الركوع',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', transliteration: 'Subhana Rabbiyal Adheem',
    meaning: 'Glory be to my Lord, the Magnificent',
    desc: 'Say "Allahu Akbar" and bow with your back flat, hands on knees. Say the dhikr at least 3 times.',
    Icon: RukuIcon, note: null,
  },
  {
    num: 5, position: "I'tidal (Rising)", positionArabic: 'الاعتدال',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۞ رَبَّنَا لَكَ الْحَمْدُ',
    transliteration: "Sami'Allahu liman hamidah. Rabbana lakal hamd.",
    meaning: 'Allah hears those who praise Him. Our Lord, all praise belongs to You.',
    desc: 'Rise back to standing, saying "Sami Allahu liman hamidah" while rising, then "Rabbana lakal hamd" when upright.',
    Icon: QiyamIcon, note: null,
  },
  {
    num: 6, position: 'Sujood (Prostration)', positionArabic: 'السجود',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', transliteration: "Subhana Rabbiyal A'la",
    meaning: 'Glory be to my Lord, the Most High',
    desc: 'Say "Allahu Akbar" and prostrate. 7 body parts touch the ground: forehead + nose, both palms, both knees, both sets of toes. Say the dhikr at least 3 times.',
    Icon: SujoodIcon, note: '7 body parts on the ground: forehead, nose, both hands, both knees, both feet.',
  },
  {
    num: 7, position: 'Sitting Between Sujoods', positionArabic: 'الجلوس بين السجدتين',
    arabic: 'رَبِّ اغْفِرْ لِي', transliteration: 'Rabbighfirli',
    meaning: 'My Lord, forgive me',
    desc: 'Say "Allahu Akbar" and sit briefly between the two prostrations. Repeat this supplication.',
    Icon: SittingIcon, note: null,
  },
  {
    num: 8, position: 'Second Sujood', positionArabic: 'السجدة الثانية',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', transliteration: "Subhana Rabbiyal A'la",
    meaning: 'Glory be to my Lord, the Most High',
    desc: 'Say "Allahu Akbar" and prostrate again for the second time. Same as the first Sujood.',
    Icon: SujoodIcon, note: 'After this, say "Allahu Akbar" and rise to begin the second rakat (from step 3).',
  },
  {
    num: 9, position: 'Tashahhud (After 2nd Rakat)', positionArabic: 'التشهد',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۞ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۞ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۞ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu alayna wa ala ibadillahis-saliheen. Ash-hadu an la ilaha illallah wa ash-hadu anna Muhammadan abduhu wa rasuluh.",
    meaning: 'All greetings, prayers and good things belong to Allah. Peace be upon you, O Prophet, and the mercy and blessings of Allah. Peace be upon us and upon all the righteous servants of Allah. I bear witness that there is no god but Allah and I bear witness that Muhammad is His servant and messenger.',
    desc: 'Sit after completing 2 rakats and recite At-Tahiyyat. Raise your right index finger when saying "la ilaha".',
    Icon: SittingIcon, note: 'For Fajr (2 rakats), proceed to Salam after this. For longer prayers, rise for more rakats.',
  },
  {
    num: 10, position: 'Salam (Ending the Prayer)', positionArabic: 'السلام',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    transliteration: 'As-salamu alaykum wa rahmatullah',
    meaning: 'Peace and mercy of Allah be upon you',
    desc: 'Turn your head to the right and say the Salam. Then turn to the left and say it again. The prayer is complete.',
    Icon: QiyamIcon, note: null,
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function WuduStep({ step, viewed, onView }: {
  step: typeof WUDU_STEPS[0]; viewed: boolean; onView: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      onClick={() => { setOpen(o => !o); if (!viewed) onView() }}
      className="w-full text-left rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-colors active:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-xl">
          {step.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400">Step {step.num}</span>
            {viewed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </div>
          <p className="text-sm font-semibold text-[#f9fafb]">{step.title}</p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
          <p className="text-sm text-gray-300">{step.desc}</p>
          {step.arabic && (
            <div className="rounded-xl bg-gray-800 p-3 text-center">
              <p className="font-arabic text-2xl text-emerald-300 leading-relaxed">{step.arabic}</p>
              <p className="mt-1 text-xs text-gray-400 italic">{step.transliteration}</p>
              <p className="mt-0.5 text-xs text-gray-500">{step.meaning}</p>
            </div>
          )}
        </div>
      )}
    </button>
  )
}

function SalahStep({ step, viewed, onView }: {
  step: typeof SALAH_STEPS[0]; viewed: boolean; onView: () => void
}) {
  const [open, setOpen] = useState(false)
  const Icon = step.Icon
  return (
    <button
      type="button"
      onClick={() => { setOpen(o => !o); if (!viewed) onView() }}
      className="w-full text-left rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-colors active:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-xs font-bold text-emerald-400">
          {step.num}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">{step.positionArabic}</span>
            {viewed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </div>
          <p className="text-sm font-semibold text-[#f9fafb]">{step.position}</p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
          {/* Position icon */}
          <div className="flex justify-center">
            <Icon className="w-24 h-24" />
          </div>
          <p className="text-sm text-gray-300">{step.desc}</p>
          {step.arabic && (
            <div className="rounded-xl bg-gray-800 p-3 space-y-2">
              <p className="font-arabic text-xl text-emerald-300 leading-relaxed text-center" dir="rtl">{step.arabic}</p>
              <p className="text-xs text-gray-400 italic text-center">{step.transliteration}</p>
              <p className="text-xs text-gray-500 text-center">{step.meaning}</p>
            </div>
          )}
          {step.note && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
              <span className="text-amber-400 text-sm">💡</span>
              <p className="text-xs text-amber-300">{step.note}</p>
            </div>
          )}
        </div>
      )}
    </button>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LearnToPrayPage() {
  const [tab, setTab] = useState<'wudu' | 'salah' | 'nawafil'>('wudu')
  const [viewedWudu, setViewedWudu] = useState<Set<number>>(new Set())
  const [viewedSalah, setViewedSalah] = useState<Set<number>>(new Set())

  const wuduProgress = viewedWudu.size
  const salahProgress = viewedSalah.size

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={BookOpen}
        title="How to Pray"
        subtitle="Wudu & Salah Guide"
        gradient="from-blue-950 to-indigo-900"
        showBack
        heroTheme="prayer"
      />

      {/* Tab switcher */}
      <div className="sticky top-0 z-20 bg-[#0a0b14]/95 px-4 py-3 backdrop-blur-sm border-b border-gray-800/50">
        <div className="flex gap-2 p-1 rounded-xl bg-gray-900 border border-gray-800">
          <button
            onClick={() => setTab('wudu')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === 'wudu' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 active:bg-gray-800'
            }`}
          >
            💧 Wudu
          </button>
          <button
            onClick={() => setTab('salah')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === 'salah' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 active:bg-gray-800'
            }`}
          >
            🕌 Salah
          </button>
          <button
            onClick={() => setTab('nawafil')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === 'nawafil' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 active:bg-gray-800'
            }`}
          >
            🌙 Nawafil
          </button>
        </div>
        {/* Progress */}
        {tab !== 'nawafil' && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${tab === 'wudu' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                style={{ width: `${tab === 'wudu' ? (wuduProgress / WUDU_STEPS.length) * 100 : (salahProgress / SALAH_STEPS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {tab === 'wudu' ? `${wuduProgress}/${WUDU_STEPS.length}` : `${salahProgress}/${SALAH_STEPS.length}`} steps viewed
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-4 space-y-3">
        {tab === 'wudu' && (
          <>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="text-sm font-semibold text-blue-300">💧 Wudu — Ritual Purification</p>
              <p className="mt-1 text-xs text-gray-400">Wudu is required before prayer. It purifies you physically and spiritually. Tap each step to learn more.</p>
            </div>
            {WUDU_STEPS.map(step => (
              <WuduStep
                key={step.num}
                step={step}
                viewed={viewedWudu.has(step.num)}
                onView={() => setViewedWudu(prev => new Set([...prev, step.num]))}
              />
            ))}
            {wuduProgress === WUDU_STEPS.length && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                <p className="text-2xl mb-1">✅</p>
                <p className="text-sm font-semibold text-emerald-300">Wudu steps complete!</p>
                <p className="text-xs text-gray-400 mt-1">Now proceed to learn the Salah steps</p>
                <button onClick={() => setTab('salah')} className="mt-3 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white flex items-center gap-1 mx-auto">
                  Learn Salah <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
        {tab === 'salah' && (
          <>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm font-semibold text-emerald-300">🕌 Salah — The Prayer</p>
              <p className="mt-1 text-xs text-gray-400">The steps below describe a complete 2-rakat prayer (like Fajr). Tap each step to see the Arabic, transliteration, and meaning.</p>
            </div>
            {SALAH_STEPS.map(step => (
              <SalahStep
                key={step.num}
                step={step}
                viewed={viewedSalah.has(step.num)}
                onView={() => setViewedSalah(prev => new Set([...prev, step.num]))}
              />
            ))}
            {/* Extending to more rakats */}
            <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-300">📖 Praying More Than 2 Rakats?</p>
              <p className="text-xs text-gray-400">After step 8 (Second Sujood), instead of sitting for Tashahhud, rise and repeat steps 3–8 for each additional rakat.</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { name: 'Fajr', rakats: 2, emoji: '🌅' },
                  { name: 'Dhuhr', rakats: 4, emoji: '☀️' },
                  { name: 'Asr', rakats: 4, emoji: '🌤️' },
                  { name: 'Maghrib', rakats: 3, emoji: '🌇' },
                  { name: 'Isha', rakats: 4, emoji: '🌙' },
                  { name: 'Jumu\'ah', rakats: 2, emoji: '🕌' },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-2 rounded-xl bg-gray-800 px-3 py-2">
                    <span className="text-lg">{p.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#f9fafb]">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.rakats} rakats</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {salahProgress === SALAH_STEPS.length && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                <p className="text-2xl mb-1">🎉</p>
                <p className="text-sm font-semibold text-emerald-300">MashaAllah! All steps reviewed.</p>
                <p className="text-xs text-gray-400 mt-1">May Allah accept your prayers. The key is practice — start with Fajr (2 rakats).</p>
              </div>
            )}
          </>
        )}
        {tab === 'nawafil' && (
          <>
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <p className="text-sm font-semibold text-indigo-300">🌙 Sunnah &amp; Nawafil Prayers</p>
              <p className="mt-1 text-xs text-gray-400">Beyond the 5 daily prayers, the Prophet ﷺ prayed many optional prayers. These bring extra reward and strengthen the connection with Allah.</p>
            </div>

            {/* Sunnah Mu'akkadah */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gray-900 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-bold text-emerald-400">Sunnah Mu&apos;akkadah (Confirmed)</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Regularly prayed by the Prophet ﷺ — strongly recommended</p>
              </div>
              <div className="divide-y divide-gray-800">
                {SUNNAH_PRAYERS.filter(p => p.category === 'sunnah_muakkadah').map(prayer => (
                  <div key={prayer.key} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-arabic text-base text-emerald-300">{prayer.arabic}</span>
                        <p className="text-sm font-semibold text-gray-200 mt-0.5">{prayer.label}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">{prayer.rakat} rak&apos;at</span>
                        {prayer.importance === 'highest' && (
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <Star className="h-3 w-3 text-amber-400" />
                            <span className="text-[9px] text-amber-400 font-medium">Never missed</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500">{prayer.timing}</p>
                    <p className="text-[11px] text-gray-400 italic leading-relaxed">{prayer.reward}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Witr — Wajib */}
            {SUNNAH_PRAYERS.filter(p => p.category === 'wajib').map(prayer => (
              <div key={prayer.key} className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">WAJIB</span>
                  <span className="font-arabic text-base text-amber-300">{prayer.arabic}</span>
                </div>
                <p className="text-sm font-bold text-gray-200">{prayer.label} — {prayer.rakat} rak&apos;at</p>
                <p className="text-[11px] text-gray-500">{prayer.timing}</p>
                <p className="text-[11px] text-gray-400 italic leading-relaxed">{prayer.reward}</p>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2 mt-2">
                  <p className="text-xs text-amber-300 font-medium">Witr is Wajib in the Hanafi school — treat it like a 6th prayer.</p>
                  <p className="text-[10px] text-gray-500 mt-1">{prayer.note}</p>
                </div>
              </div>
            ))}

            {/* Nawafil */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gray-900 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-bold text-indigo-400">Special Nawafil Prayers</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Optional prayers with immense reward</p>
              </div>
              <div className="divide-y divide-gray-800">
                {NAWAFIL_PRAYERS.map(prayer => (
                  <div key={prayer.key} className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{prayer.icon}</span>
                      <div className="flex-1">
                        <span className="font-arabic text-base text-indigo-300">{prayer.arabic}</span>
                        <p className="text-sm font-semibold text-gray-200">{prayer.label}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">{prayer.rakat} rak&apos;at</span>
                        {prayer.ramadanOnly && (
                          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-400">Ramadan</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500">{prayer.timing}</p>
                    <p className="text-[11px] text-gray-400 italic leading-relaxed">{prayer.reward}</p>
                    <p className="text-[10px] text-gray-600">Source: {prayer.source}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tahajjud callout */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌙</span>
                <p className="text-sm font-bold text-indigo-300">The Night Prayer (Tahajjud)</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">&quot;The night prayer is the most virtuous after the obligatory prayers.&quot; — Muslim</p>
              <p className="text-[11px] text-gray-500 mt-2">Pray in the last third of the night, after sleeping and before Fajr. Even 2 rak&apos;at count.</p>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
