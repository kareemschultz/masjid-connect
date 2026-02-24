'use client'

import { useMemo, useState } from 'react'
import { MoonStar, RotateCcw, ShieldCheck, Star, Sunrise } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PremiumAtmosphere } from '@/components/premium-atmosphere'

interface DhikrItem {
  arabic: string
  transliteration: string
  meaning: string
  repeat: number
  source: string
  note?: string
}

interface AdhkarSet {
  id: string
  label: string
  period: 'morning' | 'evening' | 'any'
  summary: string
  items: DhikrItem[]
}

const MORNING_SET_ID = 'morning-fortress'
const EVENING_SET_ID = 'evening-fortress'

const ADHKAR_SETS: AdhkarSet[] = [
  {
    id: MORNING_SET_ID,
    label: 'Morning Fortress',
    period: 'morning',
    summary: 'Daily opening remembrances from the GII practical essentials flow.',
    items: [
      {
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Asbahna wa asbahal mulku lillah walhamdu lillah',
        meaning: 'We have entered the morning and dominion belongs to Allah, and all praise belongs to Allah.',
        repeat: 1,
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur',
        meaning: 'By You we enter the morning and evening, by You we live and die, and to You is resurrection.',
        repeat: 1,
        source: 'Tirmidhi',
      },
      {
        arabic: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ',
        transliteration: 'Allahumma ma asbaha bi min nimatin aw bi ahadin min khalqika faminka wahdaka',
        meaning: 'Whatever blessing I or anyone has this morning is from You alone.',
        repeat: 1,
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ ... أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ',
        transliteration: 'Allahumma inni asbahtu ushhiduka ... annaka antal-lah la ilaha illa ant',
        meaning: 'O Allah, I call You, Your angels, and creation to witness that You alone are Allah.',
        repeat: 4,
        source: 'Abu Dawud',
      },
      {
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
        transliteration: 'Bismillahil-ladhi la yadurru maasmihi shay',
        meaning: "In Allah's Name with which nothing can harm on earth or in heaven.",
        repeat: 3,
        source: 'Abu Dawud, Tirmidhi',
      },
      {
        arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
        transliteration: 'Raditu billahi rabban wa bil-islami dinan wa bi Muhammadin nabiyyan',
        meaning: 'I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.',
        repeat: 3,
        source: 'Abu Dawud',
      },
      {
        arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
        transliteration: 'Ya Hayyu Ya Qayyum birahmatika astaghith',
        meaning: 'O Ever-Living, O Sustainer, by Your mercy I seek relief.',
        repeat: 1,
        source: 'Hakim',
      },
      {
        arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ',
        transliteration: 'Hasbiyallahu la ilaha illa huwa alayhi tawakkaltu',
        meaning: 'Allah is enough for me; none has right to be worshipped but Him.',
        repeat: 7,
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ',
        transliteration: 'Allahumma anta rabbi la ilaha illa ant khalaqtani wa ana abduk',
        meaning: 'O Allah, You are my Lord; none is worthy of worship but You. You created me.',
        repeat: 1,
        source: 'Bukhari',
        note: 'Sayyidul Istighfar (best formula of repentance).',
      },
      {
        arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        transliteration: 'Astaghfirullaha wa atubu ilayh',
        meaning: "I seek Allah's forgiveness and repent to Him.",
        repeat: 100,
        source: 'Bukhari',
      },
    ],
  },
  {
    id: EVENING_SET_ID,
    label: 'Evening Fortress',
    period: 'evening',
    summary: 'Protective remembrance sequence for sunset onward.',
    items: [
      {
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Amsayna wa amsal mulku lillah walhamdu lillah',
        meaning: 'We have entered the evening and dominion belongs to Allah, and all praise belongs to Allah.',
        repeat: 1,
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        transliteration: 'Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir',
        meaning: 'By You we enter evening and morning, by You we live and die, and to You is the final return.',
        repeat: 1,
        source: 'Tirmidhi',
      },
      {
        arabic: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ',
        transliteration: 'Allahumma ma amsa bi min nimatin aw bi ahadin min khalqika faminka wahdaka',
        meaning: 'Whatever blessing I or anyone has this evening is from You alone.',
        repeat: 1,
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ ... أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ',
        transliteration: 'Allahumma inni amsaytu ushhiduka ... annaka antal-lah la ilaha illa ant',
        meaning: 'O Allah, I call You and all creation to witness Your Oneness this evening.',
        repeat: 4,
        source: 'Abu Dawud',
      },
      {
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: 'Audhu bikalimatillahit-tammati min sharri ma khalaq',
        meaning: "I seek refuge in Allah's perfect words from the evil of what He created.",
        repeat: 3,
        source: 'Muslim',
      },
      {
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
        transliteration: 'Bismillahil-ladhi la yadurru maasmihi shay',
        meaning: "In Allah's Name with which no harm can strike.",
        repeat: 3,
        source: 'Abu Dawud, Tirmidhi',
      },
      {
        arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
        transliteration: 'Raditu billahi rabban wa bil-islami dinan wa bi Muhammadin nabiyyan',
        meaning: 'I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.',
        repeat: 3,
        source: 'Abu Dawud',
      },
      {
        arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
        transliteration: 'Ya Hayyu Ya Qayyum birahmatika astaghith',
        meaning: 'O Ever-Living, O Sustainer, by Your mercy I seek relief.',
        repeat: 1,
        source: 'Hakim',
      },
      {
        arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ',
        transliteration: 'Hasbiyallahu la ilaha illa huwa alayhi tawakkaltu',
        meaning: 'Allah is sufficient for me; I rely upon Him.',
        repeat: 7,
        source: 'Abu Dawud',
      },
      {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliteration: 'Subhanallahi wa bihamdih',
        meaning: 'Glory and praise belong to Allah.',
        repeat: 100,
        source: 'Muslim',
      },
    ],
  },
  {
    id: 'sleep-lights-out',
    label: 'Sleep & Wind Down',
    period: 'any',
    summary: 'Night adhkar sequence before sleeping.',
    items: [
      {
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        meaning: 'In Your Name, O Allah, I die and I live.',
        repeat: 1,
        source: 'Bukhari',
      },
      {
        arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ... (آيَةُ الْكُرْسِي)',
        transliteration: 'Allahu la ilaha illa huwal-Hayyul-Qayyum ...',
        meaning: 'Ayat al-Kursi before sleep for protection through the night.',
        repeat: 1,
        source: 'Bukhari',
      },
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ / قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ / قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: 'Qul Huwa Allahu Ahad / Qul Audhu bi Rabbil Falaq / Qul Audhu bi Rabbin Nas',
        meaning: 'Recite the three Quls and wipe over the body for protection.',
        repeat: 3,
        source: 'Bukhari',
      },
      {
        arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ',
        transliteration: 'Allahumma aslamtu nafsi ilayk wa fawwadtu amri ilayk',
        meaning: 'O Allah, I submit myself to You and entrust my affairs to You.',
        repeat: 1,
        source: 'Bukhari',
      },
      {
        arabic: 'سُبْحَانَ اللَّهِ / الْحَمْدُ لِلَّهِ / اللَّهُ أَكْبَرُ',
        transliteration: 'SubhanAllah / Alhamdulillah / Allahu Akbar',
        meaning: 'Tasbih before sleep taught to Fatimah (RA).',
        repeat: 100,
        source: 'Bukhari',
        note: '33, 33, 34 format.',
      },
    ],
  },
  {
    id: 'hardship-shield',
    label: 'Hardship & Healing',
    period: 'any',
    summary: 'Supplications for anxiety, pain, and distress from the practical essentials text.',
    items: [
      {
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
        transliteration: 'Allahumma inni audhu bika minal-hammi wal-hazan',
        meaning: 'O Allah, I seek refuge in You from anxiety and grief.',
        repeat: 1,
        source: 'Bukhari',
      },
      {
        arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
        transliteration: 'Asalullahal-azim rabbal-arshil-azim an yashfiyak',
        meaning: 'I ask Allah, Lord of the Mighty Throne, to heal you.',
        repeat: 7,
        source: 'Tirmidhi',
      },
      {
        arabic: 'بِسْمِ اللَّهِ ... أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
        transliteration: 'Bismillah ... Audhu billahi wa qudratihi min sharri ma ajidu wa uhadhir',
        meaning: 'Place your hand on pain and seek refuge in Allah and His power.',
        repeat: 7,
        source: 'Muslim',
      },
      {
        arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ...',
        transliteration: 'Inna lillahi wa inna ilayhi rajiun',
        meaning: 'At calamity: We belong to Allah and to Him we return.',
        repeat: 1,
        source: 'Muslim',
      },
      {
        arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        transliteration: 'Hasbunallahu wa nimal-wakil',
        meaning: 'Allah is sufficient for us and the best disposer of affairs.',
        repeat: 7,
        source: 'Quran 3:173',
      },
    ],
  },
]

export default function AdhkarPage() {
  const [activeSet, setActiveSet] = useState(MORNING_SET_ID)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [period, setPeriod] = useState<'morning' | 'evening'>('morning')
  const [showCompletedOnly, setShowCompletedOnly] = useState(false)

  const setMeta = useMemo(() => {
    return ADHKAR_SETS.find((set) => set.id === activeSet) || ADHKAR_SETS[0]
  }, [activeSet])

  const completeCount = useMemo(() => {
    return setMeta.items.filter((_, i) => {
      const key = `${setMeta.id}-${i}`
      return (counts[key] || 0) >= setMeta.items[i].repeat
    }).length
  }, [counts, setMeta])

  const progressPct = setMeta.items.length === 0 ? 0 : (completeCount / setMeta.items.length) * 100

  const visibleItems = useMemo(() => {
    if (!showCompletedOnly) return setMeta.items
    return setMeta.items.filter((_, i) => {
      const key = `${setMeta.id}-${i}`
      return (counts[key] || 0) >= setMeta.items[i].repeat
    })
  }, [counts, setMeta, showCompletedOnly])

  const openPeriod = (next: 'morning' | 'evening') => {
    setPeriod(next)
    setShowCompletedOnly(false)
    setActiveSet(next === 'morning' ? MORNING_SET_ID : EVENING_SET_ID)
  }

  const increment = (key: string, max: number) => {
    const current = counts[key] || 0
    if (current >= max) return

    setCounts((prev) => ({ ...prev, [key]: current + 1 }))
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(18)
    }
  }

  const resetCurrentSet = () => {
    const next = { ...counts }
    setMeta.items.forEach((_, i) => {
      delete next[`${setMeta.id}-${i}`]
    })
    setCounts(next)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
      <PremiumAtmosphere tone="community" />

      <PageHero
        icon={Star}
        title="Adhkar"
        subtitle="Fortress For Day & Night"
        gradient="from-emerald-950 via-teal-950 to-cyan-950"
        showBack
        heroTheme="adhkar"
      />

      <div className="relative z-10 space-y-3 px-4 pt-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openPeriod('morning')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                period === 'morning'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Sunrise className="h-4 w-4" />
              Morning Flow
            </button>
            <button
              onClick={() => openPeriod('evening')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                period === 'evening'
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <MoonStar className="h-4 w-4" />
              Evening Flow
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {ADHKAR_SETS.map((set) => (
            <button
              key={set.id}
              onClick={() => {
                setActiveSet(set.id)
                setShowCompletedOnly(false)
              }}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeSet === set.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {set.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/90 p-3">
          <p className="text-xs font-semibold text-foreground">{setMeta.label}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{setMeta.summary}</p>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">
              {completeCount}/{setMeta.items.length} complete
            </span>
            <span className="text-emerald-300">{Math.round(progressPct)}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              onClick={() => setShowCompletedOnly((v) => !v)}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all ${
                showCompletedOnly
                  ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {showCompletedOnly ? 'Show All' : 'Completed Only'}
            </button>
            <button
              onClick={resetCurrentSet}
              className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Set
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-3 px-4 pt-4 animate-stagger">
        {visibleItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted-foreground">No completed items yet in this set.</p>
          </div>
        )}

        {visibleItems.map((item, i) => {
          const realIndex = setMeta.items.indexOf(item)
          const key = `${setMeta.id}-${realIndex}`
          const current = counts[key] || 0
          const done = current >= item.repeat
          return (
            <button
              key={key}
              onClick={() => increment(key, item.repeat)}
              disabled={done}
              className={`w-full rounded-2xl border p-4 text-left transition-all active:scale-[0.985] ${
                done
                  ? 'border-emerald-500/30 bg-emerald-500/8'
                  : 'border-border/70 bg-card/95'
              }`}
            >
              <p className="text-right font-arabic text-xl leading-loose text-foreground" dir="rtl">
                {item.arabic}
              </p>
              <p className="mt-2 text-xs font-semibold italic text-emerald-300">{item.transliteration}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.meaning}</p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.source}
                </span>
                <span className={`text-[11px] font-bold ${done ? 'text-emerald-300' : 'text-muted-foreground'}`}>
                  {current}/{item.repeat}
                </span>
              </div>

              {item.note && (
                <div className="mt-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1.5 text-[10px] text-cyan-200">
                  {item.note}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {setMeta.items.length > 0 && completeCount === setMeta.items.length && (
        <div className="relative z-10 mx-4 mt-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 p-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-200">Set completed</p>
          <p className="mt-1 text-xs text-emerald-100/75">May Allah accept your remembrance and protect your day.</p>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
