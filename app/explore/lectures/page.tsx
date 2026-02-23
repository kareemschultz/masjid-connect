'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  Headphones, Play, Pause, SkipBack, SkipForward,
  Loader2, ChevronDown, ChevronUp, Search, X, Filter, Check
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

// ─── Data Model ───────────────────────────────────────────────────────────────

export type Category = 'All' | 'Seerah' | 'Eschatology' | 'Prophets' | 'Standalone' | 'Fiqh' | 'Tazkiyah' | 'Companions'

interface Lecture {
  title: string
  file: string
}

interface Series {
  id: string
  title: string
  subtitle?: string
  archiveId: string
  category: Category
  lectures: Lecture[]
  color: string        // tailwind gradient
  accent: string      // colour key
}

interface Scholar {
  id: string
  name: string           // Full formal name
  shortName: string      // Short display name for pills
  bio: string            // One-liner for compact view
  fullBio: string        // Expanded bio paragraph
  origin: string         // Nationality / background
  specialty: string      // Main area of scholarship
  avatar: string         // emoji fallback
  color: string          // card gradient
  series: Series[]
}

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<Category, string> = {
  All:          'bg-gray-700 text-gray-200',
  Seerah:       'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Eschatology:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Prophets:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Standalone:   'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Fiqh:         'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Tazkiyah:     'bg-teal-500/20 text-teal-300 border-teal-500/30',
  Companions:   'bg-sky-500/20 text-sky-300 border-sky-500/30',
}

const ACCENT: Record<string, { tab: string; ring: string; text: string; dot: string; bg: string }> = {
  emerald: { tab: 'bg-emerald-500 text-white', ring: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
  blue:    { tab: 'bg-blue-500 text-white',    ring: 'border-blue-500/30',    text: 'text-blue-400',    dot: 'bg-blue-500',    bg: 'bg-blue-500/10'    },
  amber:   { tab: 'bg-amber-500 text-white',   ring: 'border-amber-500/30',   text: 'text-amber-400',   dot: 'bg-amber-500',   bg: 'bg-amber-500/10'   },
  purple:  { tab: 'bg-purple-500 text-white',  ring: 'border-purple-500/30',  text: 'text-purple-400',  dot: 'bg-purple-500',  bg: 'bg-purple-500/10'  },
  rose:    { tab: 'bg-rose-500 text-white',    ring: 'border-rose-500/30',    text: 'text-rose-400',    dot: 'bg-rose-500',    bg: 'bg-rose-500/10'    },
  teal:    { tab: 'bg-teal-500 text-white',    ring: 'border-teal-500/30',    text: 'text-teal-400',    dot: 'bg-teal-500',    bg: 'bg-teal-500/10'    },
  sky:     { tab: 'bg-sky-500 text-white',     ring: 'border-sky-500/30',     text: 'text-sky-400',     dot: 'bg-sky-500',     bg: 'bg-sky-500/10'     },
}

// ─── Scholars & Series Data ───────────────────────────────────────────────────

const SCHOLARS: Scholar[] = [
  {
    id: 'awlaki',
    name: 'Imam Anwar al-Awlaki',
    shortName: 'Anwar al-Awlaki',
    bio: 'American-Yemeni Imam. Renowned for deep, narrative-style Seerah lectures in English.',
    fullBio: 'Imam Anwar al-Awlaki (1971–2011) was an American-born scholar of Yemeni descent. He studied Islamic Education at San Diego State University and later at Iman University, Sana\'a. He served as an Imam in Denver and San Diego before becoming one of the most widely-listened-to English-language scholars of the early 2000s. His lecture series on the Life of the Prophet ﷺ and the Lives of the Prophets are considered among the finest available in English — praised for their depth, storytelling quality, and accessibility to Western-raised Muslims.',
    origin: 'American-Yemeni',
    specialty: 'Seerah (Prophetic Biography) · Islamic History',
    avatar: '🎙',
    color: 'from-emerald-900/60 to-teal-900/60',
    series: [
      {
        id: 'makkah',
        title: 'Life of the Prophet — Makkan Period',
        subtitle: '16 lectures',
        archiveId: 'lifeofmuhammadmakkah',
        category: 'Seerah',
        accent: 'emerald',
        color: 'from-emerald-900 to-teal-900',
        lectures: [
          { title: 'Introduction', file: 'CD1Introduction.mp3' },
          { title: 'Background History', file: 'CD2BackgroundHistory.mp3' },
          { title: 'The Religious Situation of Pre-Islamic Arabia', file: 'CD3TheReligiousSitautionOfPreIslamicArabia.mp3' },
          { title: 'Early Life', file: 'CD4EarlyLife.mp3' },
          { title: 'Important Events', file: 'CD5ImportantEvents.mp3' },
          { title: 'In Pursuit of the Truth', file: 'CD6InPursuitOfTheTruth.mp3' },
          { title: 'The Glad Tidings', file: 'CD7TheGladTidings.mp3' },
          { title: 'The Revelation', file: 'CD8TheRevelation.mp3' },
          { title: 'The Reaction — Part 1', file: 'CD9TheReactionPart1.mp3' },
          { title: 'The Reaction — Part 2', file: 'CD10TheReactionPart2.mp3' },
          { title: 'The Early Immigrants — Part I', file: 'CD11TheEarlyImmigrantsPartI.mp3' },
          { title: 'The Early Immigrants — Part II', file: 'CD12TheEarlyImmigrantsPartII.mp3' },
          { title: 'Major Events', file: 'CD13MajorEvents.mp3' },
          { title: 'The Later Years of Makkah', file: 'CD14TheLaterYearsOfMakkah.mp3' },
          { title: 'In Search of a Base', file: 'CD15InSearchOfABase.mp3' },
          { title: 'The Road to Madinah', file: 'CD16TheRoadToMadinah.mp3' },
        ],
      },
      {
        id: 'medina',
        title: 'Life of the Prophet — Madinan Period',
        subtitle: '18 lectures',
        archiveId: 'TheLifeOfTheProphetMuhammadMedinahPeriod-Part1ByImamAnwarAl-Awlaki',
        category: 'Seerah',
        accent: 'blue',
        color: 'from-blue-900 to-indigo-900',
        lectures: [
          { title: 'Introduction & Hijrah', file: '01 - Introduction and Hijarah.mp3' },
          { title: 'Establishment of the State — Part 1', file: '02 - Establishment Of The State 1.mp3' },
          { title: 'Establishment of the State — Part 2', file: '03 - Establishment Of The State 2.mp3' },
          { title: 'Establishment of the State — Part 3', file: '04 - Establishment Of The State 3.mp3' },
          { title: 'Battle of Badr — Part 1', file: '05 - Battle Of Badr 1.mp3' },
          { title: 'Battle of Badr — Part 2', file: '06 - Battle Of Badr 2.mp3' },
          { title: 'Battle of Badr — Part 3', file: '07 - Battle Of Badr 3.mp3' },
          { title: 'Events Between Badr and Uhud', file: '08 - Events Between Badr and Uhud.mp3' },
          { title: 'Battle of Uhud — Part 1', file: '09 - Battle Of Uhud 1.mp3' },
          { title: 'Battle of Uhud — Part 2', file: '10 - Battle Of Uhud 2.mp3' },
          { title: 'Battle of Uhud — Part 3', file: '11 - Battle Of Uhud 3.mp3' },
          { title: 'Battle of Uhud — Part 4', file: '12 - Battle Of Uhud 4.mp3' },
          { title: 'Battle of Uhud — Part 5', file: '13 - Battle Of Uhud 5.mp3' },
          { title: 'Events Between Battles — Part 1', file: '14 - Events Between ... 1.mp3' },
          { title: 'Events Between Battles — Part 2', file: '15 - Events Between ... 2.mp3' },
          { title: 'Banu Al-Mustalaq & Battle of the Trench', file: '16 - Banu Al-Mustalaq - Battle Of The Trench.mp3' },
          { title: 'Battle of the Trench', file: '17 - Battle Of The Trench.mp3' },
          { title: 'Banu Quraydah', file: '18 - Banu Quraydah.mp3' },
        ],
      },
      {
        id: 'prophets',
        title: 'Lives of the Prophets',
        subtitle: '21 lectures · Adam to Isa (AS)',
        archiveId: 'TheLivesOfTheProphetsByAnwarAl-Awlaki',
        category: 'Prophets',
        accent: 'amber',
        color: 'from-amber-900 to-orange-900',
        lectures: [
          { title: 'Introduction — Story of Creation', file: '01 - Introduction - Story Of Creation.mp3' },
          { title: 'Adam (AS) — Idris, Sheeth, Hud', file: '02 - Adam (Cont.) - Idris - Sheeth - Hud A.S..mp3' },
          { title: 'Hud (AS) — Saleh, Ibrahim (AS)', file: '03 - Hud (cont.) - Saleh - Ibrahim A.S..mp3' },
          { title: "Da'wah of Ibrahim — His Hijrah", file: '04 - The Dawah Of Ibrahim - Hijrah Of Ibrahim A.S..mp3' },
          { title: "Al-Ka'bah — Virtues of Ibrahim — Lut (AS)", file: '05 - Al-Kabah - Virtues Of Ibrahim - Lut A.S..mp3' },
          { title: "Shu'aib — Yusuf (AS)", file: '06 - Shuaib - Yusuf A.S..mp3' },
          { title: 'Yusuf (AS) — Part 2', file: '07 - Yusuf A.S. (Cont.).mp3' },
          { title: 'Yusuf (AS) — Part 3', file: '08 - Yusuf A.S. (Cont.).mp3' },
          { title: 'Yusuf cont. — Ayyub, Yunus (AS)', file: '09 - Yusuf (Cont.) - Ayub - Yunus A.S..mp3' },
          { title: 'Musa (AS) and Pharaoh — Part 1', file: '10 - Musa A.S. And Pharaoh.mp3' },
          { title: 'Musa (AS) and Pharaoh — Part 2', file: '11 - Musa A.S. And Pharaoh 2.mp3' },
          { title: 'Musa (AS) and Pharaoh — Part 3', file: '12 - Musa A.S. And Pharaoh 3.mp3' },
          { title: 'Musa (AS) and Bani Israeel', file: '13 - Musa A.S. And Bani Israeel.mp3' },
          { title: 'Musa & Bani Israeel — Part 2', file: '14 - Musa A.S. And Bani Israeel (Cont.).mp3' },
          { title: 'Musa & Bani Israeel — Part 3', file: '15 - Musa A.S. And Bani Israeel (Cont.).mp3' },
          { title: 'Yusha (AS) and Dawud (AS)', file: '16 - Yusha And Dawood A.S..mp3' },
          { title: 'Dawud cont. — Sulaiman (AS)', file: '17 - Dawood (Cont.) - Sulaiman A.S..mp3' },
          { title: 'Sulaiman cont. — Kingdom of Sheba', file: '18 - Sulaiman (Cont.) - Kingdom Of Sheba.mp3' },
          { title: 'The Family of Imran — Part 1', file: '19 - The Family Of Imran.mp3' },
          { title: 'The Family of Imran — Part 2', file: '20 - The Family Of Imran 2.mp3' },
          { title: 'The Family of Imran — Part 3', file: '21 - The Family Of Imran 3.mp3' },
        ],
      },
      {
        id: 'hereafter',
        title: 'The Hereafter',
        subtitle: '22 lectures · Death to Paradise',
        archiveId: 'hereafter-anwar-al-awlaki_202505',
        category: 'Eschatology',
        accent: 'purple',
        color: 'from-purple-900 to-violet-900',
        lectures: [
          { title: 'Introduction — Importance of the Afterlife & Death', file: '01. Introduction, The Importance of After Life, Death.mp3' },
          { title: "Death (cont'd) — Reasons of Evil Ending", file: "02. Death (cont'd), Reasons of Evil Ending.mp3" },
          { title: 'The Journey of the Soul & The Grave', file: '03. The Journey of the Soul, The Grave, The trials of the Grave.mp3' },
          { title: 'Minor Signs — Signs 1–7', file: '04. The Minor Signs of the Day of Judgement - Signs 1-7.mp3' },
          { title: 'Minor Signs — Signs 8–18', file: '05. The Minor Signs of the Day of Judgement - Signs 8-18.mp3' },
          { title: 'Minor Signs — Signs 19–38', file: '06. The Minor Signs of the Day of Judgement - Signs 19-38.mp3' },
          { title: 'Minor Signs — Signs 39–52', file: '07. The Minor Signs of the Day of Judgement - Signs 39-52.mp3' },
          { title: 'Major Signs — Al-Dajjal', file: '08. The Major Signs of the Day of Judgement - First Sign - Al-Dajjal.mp3' },
          { title: "Al-Dajjal (cont'd) — Return of Isa (AS)", file: "09. The Major Signs of the Day of Judgement - Al-Dajjal (cont'd), Second Sign - The Second Comin.mp3" },
          { title: 'Major Signs — Signs 3–10', file: '10. The Major Signs of the Day of Judgement - Signs 3-10, Closing Comments.mp3' },
          { title: 'The Resurrection, Assembly & The Horrors', file: '11. The Resurrection, Assembly Land, The Horrors, Universe Dismantling.mp3' },
          { title: 'The Non-Believers & Voiding of Deeds', file: '12. The Non-Believers, The Voiding of Deeds, The Disputes, Allah and Jesus Conversation.mp3' },
          { title: 'Sins of Believers & The Seven Under Shade', file: '13. The Sins of the Believers, The Righteous on the Hereafter, The Seven under the Shade of Alla.mp3' },
          { title: "The Righteous (cont'd) & Intercession", file: "14. The Righteous (cont'd), Intercession.mp3" },
          { title: 'Questioning, Interrogation & The Names of Hereafter', file: '15. Names of the Hereafter, Rules of the Hereafter, Questoining and Interrogation.mp3' },
          { title: 'The Scale (Al-Mizan) & The Pool', file: '16. Accountability, Book of Deeds, Settlement of the Accounts, The Scale (Al-Mizan), The Pool.mp3' },
          { title: 'Hellfire — May Allah Save Us', file: '17. Hellfire and its life (may Allah save us from it).mp3' },
          { title: 'Actions Leading to Hellfire — Gates of Paradise', file: '18. Actions that lead to Hellfire, First to enter Paradise, Gates of Paradise.mp3' },
          { title: 'A Tour of Paradise — The Levels', file: '19. A Tour of Paradise - The Levels of Paradise.mp3' },
          { title: "A Tour of Paradise (cont'd)", file: "20. A Tour of Paradise (cont'd), Issues pertaining to the Muslim Sisters.mp3" },
          { title: 'Socialization in Paradise', file: '21. Socialization In Paradise.mp3' },
          { title: 'The People of Paradise', file: '22. The People Of Paradise.mp3' },
        ],
      },
    ],
  },
  {
    id: 'hamza-yusuf',
    name: 'Shaykh Hamza Yusuf Hanson',
    shortName: 'Hamza Yusuf',
    bio: 'American Islamic scholar and co-founder of Zaytuna College, the first accredited Muslim liberal arts college in the USA.',
    fullBio: 'Shaykh Hamza Yusuf (born Mark Hanson, 1958) is one of the most influential Islamic scholars in the Western world. He converted to Islam after a near-fatal accident at age 18. He studied Islamic sciences for nearly a decade in the UAE, Algeria, Mauritania, and Morocco under some of the greatest scholars of the 20th century. In 2009, he co-founded Zaytuna College in California — the first accredited Muslim liberal arts college in the United States. He is fluent in classical Arabic and grounded in the Maliki tradition. His lectures on classical Islamic spirituality, the purification of the heart, and Islamic ethics are among the most intellectually rich available in English.',
    origin: 'American (convert)',
    specialty: 'Islamic Spirituality · Classical Arabic · Maliki Fiqh',
    avatar: '🎓',
    color: 'from-teal-900/60 to-cyan-900/60',
    series: [
      {
        id: 'hy-purification',
        title: 'Purification of the Heart',
        subtitle: 'Matharat al-Qulub — 41 sessions',
        archiveId: 'Sheikh_Hamza_Yusuf_Hanson_-_Purification_Of_The_Heart_CD_Audio_MP3',
        category: 'Tazkiyah' as Category,
        accent: 'teal',
        color: 'from-teal-900 to-cyan-900',
        lectures: Array.from({ length: 41 }, (_, i) => ({
          title: `Session ${String(i + 1).padStart(2, '0')}`,
          file: `Sheikh_Hamza_Yusuf_-_Purification_Of_The_Heart_-_${String(i + 1).padStart(2, '0')}.mp3`,
        })),
      },
      {
        id: 'hy-vision',
        title: 'The Vision of Islam',
        subtitle: 'Islam, Iman & Ihsan — 24 sessions',
        archiveId: 'TheVisionOfIslamByHamzaYusuf',
        category: 'Standalone' as Category,
        accent: 'emerald',
        color: 'from-emerald-900 to-teal-900',
        lectures: Array.from({ length: 24 }, (_, i) => ({
          title: `Part ${i + 1}`,
          file: `Vision of Islam - Part - ${i + 1}.mp3`,
        })),
      },
    ],
  },
  {
    id: 'bilal-philips',
    name: 'Dr. Abu Ameenah Bilal Philips',
    shortName: 'Dr. Bilal Philips',
    bio: 'Canadian-Jamaican Islamic scholar. Founder of Islamic Online University, author of 50+ books on Aqeedah and Islamic studies.',
    fullBio: 'Dr. Abu Ameenah Bilal Philips (born Dennis Bradley Philips, 1947) is a Canadian convert to Islam of Jamaican origin. He holds a BA in Islamic Studies from the Islamic University of Madinah, an MA from the University of Riyadh, and a PhD in Islamic Theology from the University of Wales. He is the founder of Islamic Online University (IOU), which has provided free and affordable Islamic education to over 200,000 students in 226 countries. He has authored over 50 books on Islamic theology, jurisprudence, and education. His lectures on the Foundations of Islamic Studies — covering Aqeedah, Fiqh, and the Sunnah — are among the most systematic and widely-used for new Muslims and students of knowledge.',
    origin: 'Canadian-Jamaican (convert)',
    specialty: "Aqeedah (Islamic Theology) · Usool al-Fiqh · Da'wah",
    avatar: '📚',
    color: 'from-blue-900/60 to-indigo-900/60',
    series: [
      {
        id: 'bp-foundations',
        title: 'Foundations of Islamic Studies',
        subtitle: '10 sessions — Islam from the ground up',
        archiveId: 'Dr.BilalPhilipsCollection',
        category: 'Standalone' as Category,
        accent: 'blue',
        color: 'from-blue-900 to-indigo-900',
        lectures: [
          { title: 'Part 1 — Introduction', file: 'FoundationsOfIslamicStudies-Pt1.mp3' },
          { title: 'Part 2 — Aqeedah', file: 'FoundationsOfIslamicStudies-Pt2.mp3' },
          { title: 'Part 3 — Tawheed', file: 'FoundationsOfIslamicStudies-Pt3.mp3' },
          { title: 'Part 4 — Prophethood', file: 'FoundationsOfIslamicStudies-Pt4.mp3' },
          { title: 'Part 5 — The Quran', file: 'FoundationsOfIslamicStudies-Pt5.mp3' },
          { title: 'Part 6 — The Sunnah', file: 'FoundationsOfIslamicStudies-Pt6.mp3' },
          { title: 'Part 7 — The Pillars of Islam', file: 'FoundationsOfIslamicStudies-Pt7.mp3' },
          { title: 'Part 8 — Islamic Law (Shariah)', file: 'FoundationsOfIslamicStudies-Pt8.mp3' },
          { title: 'Part 9 — Islamic History', file: 'FoundationsOfIslamicStudies-Pt9.mp3' },
          { title: 'Part 10 — Conclusion', file: 'FoundationsOfIslamicStudies-Pt10.mp3' },
        ],
      },
      {
        id: 'bp-qadar',
        title: 'Al-Qada Wal-Qadar',
        subtitle: 'Divine Decree — 9 sessions',
        archiveId: 'Dr.BilalPhilipsCollection',
        category: 'Standalone' as Category,
        accent: 'blue',
        color: 'from-indigo-900 to-blue-900',
        lectures: Array.from({ length: 9 }, (_, i) => ({
          title: `Session ${i + 1}`,
          file: `Al-qadaWal-qadar-${i + 1}.mp3`,
        })),
      },
    ],
  },
  {
    id: 'yasmin-mogahed',
    name: 'Ustadha Yasmin Mogahed',
    shortName: 'Yasmin Mogahed',
    bio: 'Egyptian-American speaker and author of "Reclaim Your Heart". Known for her spiritually rich approach to the heart, loss, and closeness to Allah.',
    fullBio: "Ustadha Yasmin Mogahed is an Egyptian-American Muslim speaker, author, and counsellor. She studied Psychology and Journalism at the University of Wisconsin-Madison and later studied Islam under several prominent scholars. She is the author of the internationally bestselling book \"Reclaim Your Heart\" (2012), which has been translated into multiple languages. She is widely known for her unique ability to speak about spiritual and emotional healing through an Islamic lens — addressing topics such as attachment, grief, toxic love, and finding peace through connection with Allah ﷻ. Her lectures resonate particularly with young Muslims navigating modern life, relationships, and personal struggles.",
    origin: 'Egyptian-American',
    specialty: 'Tazkiyah (Spiritual Purification) · Muslim Psychology · Heart & Soul',
    avatar: '💫',
    color: 'from-rose-900/60 to-pink-900/60',
    series: [
      {
        id: 'ym-reclaim',
        title: 'Reclaim Your Heart',
        subtitle: '3 sessions — Detaching from dunya',
        archiveId: 'AJourneyToAllah',
        category: 'Tazkiyah' as Category,
        accent: 'rose',
        color: 'from-rose-900 to-pink-900',
        lectures: [
          { title: 'Reclaim Your Heart — Part 1', file: 'ReclaimYourHeart01.mp3' },
          { title: 'Reclaim Your Heart — Part 2', file: 'ReclaimYourHeart02.mp3' },
          { title: 'Reclaim Your Heart — Part 3', file: 'ReclaimYourHeart03.mp3' },
        ],
      },
      {
        id: 'ym-standalone',
        title: 'Spiritual Gems',
        subtitle: '12 selected talks',
        archiveId: 'AJourneyToAllah',
        category: 'Tazkiyah' as Category,
        accent: 'rose',
        color: 'from-pink-900 to-rose-900',
        lectures: [
          { title: 'Inner Peace', file: 'InnerPeace.mp3' },
          { title: 'Searching for Inner Peace', file: 'SearchingForInnerPeace.mp3' },
          { title: 'Path to the Most Merciful', file: 'PathToTheMostMerciful.mp3' },
          { title: 'Healing a Broken Heart', file: 'HealingABrokenHeart.mp3' },
          { title: 'Love of Allah', file: 'LoveOfAllah.mp3' },
          { title: 'Breaking Through the Illusion of Dunya', file: 'BreakingThroughTheIllusionOfDunya.mp3' },
          { title: 'A Secret Path to Happiness', file: 'ASecretPathToHappiness.mp3' },
          { title: 'The Attribute of Patience', file: 'TheAttributeOfPatience.mp3' },
          { title: 'When Allah Comes to You', file: 'WhenAllahComesToYou.mp3' },
          { title: 'How to Forgive and Heal', file: 'HowToForgiveAndHeal.mp3' },
          { title: 'Why Am I Empty?', file: 'WhyAmIEmpty.mp3' },
          { title: 'Beauty of the Beloved', file: 'BeautyOfTheBeloved.mp3' },
        ],
      },
    ],
  },
  {
    id: 'jabbar',
    name: 'Br. Muhammad Abdul Jabbar',
    shortName: 'Abdul Jabbar',
    bio: 'British Islamic lecturer known for his direct, no-nonsense style on Aqeedah, Shaitan, and the dangers facing Muslim youth.',
    fullBio: "Br. Muhammad Abdul Jabbar is a British-born Muslim lecturer known for his bold, straightforward style and his focus on practical Islamic guidance for Western Muslims. His series 'Beware! He's Your Enemy' addresses the methods and traps of Shaitan (Satan) in detail — a highly relevant topic for young Muslims living in the West. His lectures are known for being direct, relatable, and grounded in Quran and authentic hadith. He is particularly popular among Muslim youth seeking no-nonsense Islamic guidance on faith, temptation, and staying firm on the Deen.",
    origin: 'British',
    specialty: 'Aqeedah · Muslim Youth · Practical Guidance',
    avatar: '🎤',
    color: 'from-rose-900/60 to-pink-900/60',
    series: [
      {
        id: 'jabbar-standalone',
        title: 'Standalone Lectures',
        subtitle: '10 lectures',
        archiveId: 'BewareHesYourEnemy',
        category: 'Standalone',
        accent: 'rose',
        color: 'from-rose-900 to-pink-900',
        lectures: [
          { title: "Beware — He's Your Enemy", file: "Beware He's Your Enemy.mp3" },
          { title: 'Death', file: 'Death.mp3' },
          { title: 'Fitna of Ad-Dajjal', file: 'FitnaOfAd-dajjal.mp3' },
          { title: 'Legacy of Khalid Ibn Al Walid (RA)', file: 'LegacyOfKhalidIbnAlWalidRa.mp3' },
          { title: 'Power and Greatness of Allah (SWT)', file: 'PowerAndGreatnessOfAllahSwt.mp3' },
          { title: 'Soul of a Believer', file: 'SoulOfABeliever.mp3' },
          { title: 'The King of All Kings', file: 'TheKingOfAllKings.mp3' },
          { title: 'The Reckoning', file: 'TheReckoning.mp3' },
          { title: 'The Seal of All the Prophets — Muhammad (PBUH)', file: 'TheSealOfAllTheProphetsMuhammadPbuh.mp3' },
          { title: 'This Is the Day of Reckoning', file: 'ThisIsTheDayOfReckoning.mp3' },
        ],
      },
    ],
  },
  {
    id: 'suleiman',
    name: 'Dr. Omar Suleiman',
    shortName: 'Omar Suleiman',
    bio: 'American-Muslim scholar. Founder of Yaqeen Institute. Known for "The Firsts" — stories of the early Companions.',
    fullBio: 'Dr. Omar Suleiman (born 1986) is an American Muslim scholar, civil rights activist, and theologian. He is the founder and president of the Yaqeen Institute for Islamic Research and an adjunct professor of Islamic studies at Southern Methodist University. He holds a PhD in Islamic Studies from the International Islamic University Malaysia. Dr. Suleiman is widely recognised for making Islamic scholarship accessible and relevant to contemporary Western Muslims. His lecture series "The Firsts" — covering the lives of the earliest companions of the Prophet ﷺ — is one of the most watched Islamic lecture series on social media, combining academic rigour with emotional depth and storytelling mastery.',
    origin: 'American (New Orleans)',
    specialty: 'Companions of the Prophet ﷺ · Fiqh · Civil Rights',
    avatar: '🕌',
    color: 'from-sky-900/60 to-blue-900/60',
    series: [
      {
        id: 'firsts',
        title: 'The Firsts — Stories of the Companions',
        subtitle: '60 episodes · The earliest believers',
        archiveId: 'the-firsts-dr.-omar-suleiman',
        category: 'Companions' as Category,
        accent: 'sky',
        color: 'from-sky-900 to-blue-900',
        lectures: [
          { title: 'Trendsetters, Revivers & Strangers', file: 'Ep001_Trendsetters, Revivers, and Strangers _ The Firsts _ Dr. Omar Suleiman [vJH3-g-h3ak].mp3' },
          { title: 'Zaid Ibn Amr (ra) — A One Man Ummah', file: 'Ep002_Zaid Ibn Amr (ra)_ A One Man Ummah _ The Firsts _ Dr. Omar Suleiman.mp3' },
          { title: 'Waraqa Ibn Nawfal (ra) — The First to Confirm Prophethood', file: 'Ep003_Waraqa Ibn Nawfal (ra)_ The First to Confirm Prophethood _ The Firsts _ Dr. Omar Suleiman.mp3' },
          { title: 'Khadijah (ra) — His First Love, Our First Mother', file: 'Ep004_Khadijah (ra)_ His First Love, Our First Mother _ The Firsts _ Dr. Omar Suleiman.mp3' },
          { title: 'Umm Ayman (ra) — The Woman Who Never Stopped Caring', file: 'Ep005_Umm Ayman (ra)_ The Woman Who Never Stopped Caring _ The Firsts _ Dr. Omar Suleiman [QrrIdK5AjgI].mp3' },
          { title: 'Ali ibn Abi Talib (ra) — Courageous & Steadfast', file: 'Ep006_Ali ibn Abi Talib (ra)_ Courageous & Steadfast _ The Firsts _ Dr. Omar Suleiman.mp3' },
          { title: 'The First Family — Ali (ra) and Fatima (ra)', file: 'Ep007_The First Family_ Ali (ra) and Fatima (ra) _ The Firsts _ Dr. Omar Suleiman [RbwnRZ30TVE].mp3' },
          { title: 'Ali (ra) and Fatima (ra) — From Love to the Pain of Death', file: 'Ep008_Ali (ra) and Fatima (ra)： From Love to the Pain of Death ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abu Bakr (ra) Part 1 — Second to None in the Pursuit of God', file: 'Ep009_Abu Bakr (ra) - Part 1： Second to None in the Pursuit of God ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abu Bakr (ra) Part 2 — Setting His Own Standards', file: 'Ep010_Abu Bakr (ra) - Part 2： Setting His Own Standards ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abu Bakr (ra) Part 3 — There Will Never Be Another One', file: 'Ep011_Abu Bakr (ra)  - Part 3： There Will Never Be Another One ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Zayd Ibn Al Haritha (ra) — Loved and Liberated', file: 'Ep012_Zayd Ibn Al Haritha (ra)： Loved and Liberated ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Sumayyah (ra) — The First Martyr', file: 'Ep013_Sumayyah (ra)： The First Martyr ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Khabbab Ibn Al Aratt (ra) — Under Burning Hot Coals', file: 'Ep014_Khabbab Ibn Al Aratt (ra)： Under Burning Hot Coals ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Bilal Ibn Rabah (ra) — The Voice of Certainty', file: 'Ep015_Bilal Ibn Rabah (ra)： The Voice of Certainty ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Suhaib Ibn Sinan Al Rumi (ra) — From Persia, to Rome, to Paradise', file: 'Ep016_Suhaib Ibn Sinan Al Rumi (ra)： From Persia, to Rome, to Paradise ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Al-Arqam Ibn Abil Arqam (ra) — The House of Islam', file: 'Ep017_Al-Arqam Ibn Abil Arqam (ra)： The House of Islam ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Lubaba Bint Al-Harith (ra) — The First Woman After Khadijah (ra)', file: 'Ep018_Lubaba Bint Al-Harith (ra)： The First Woman After Khadijah (ra) ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Zaynab (ra) Bint Muhammad ﷺ — The First Daughter', file: 'Ep019_Zaynab (ra) Bint Muhammad ﷺ： The First Daughter ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Uthman Ibn Affan (ra) Part 1 — The Possessor of Two Lights', file: 'Ep020_Uthman Ibn Affan (ra) - Part 1： The Possessor of Two Lights ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Uthman Ibn Affan (ra) Part 2 — Selfless Even When Slandered', file: 'Ep021_Uthman Ibn Affan (ra) - Part 2： Selfless Even When Slandered ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Saad Ibn Abi Waqqas (ra) — His Prayers Always Answered', file: 'Ep022_Saad Ibn Abi Waqqas (ra)： His Prayers Always Answered ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abdullah Ibn Masood (ra) — A Mighty Legacy of Quran', file: 'Ep023_Abdullah Ibn Masood (ra)： A Mighty Legacy of Qur\'an ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abu Dharr Al Ghifari (ra) — Living and Dying Alone', file: 'Ep024_Abu Dharr Al Ghifari (ra)： Living and Dying Alone ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: "Saeed Ibn Zaid (ra) — An Answer to His Father's Prayer", file: 'Ep025_Saeed Ibn Zaid (ra)： An Answer to His Father\'s Prayer ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Jafar Ibn Abi Talib (ra) — Flying In Paradise', file: 'Ep026_Jafar Ibn Abi Talib (ra)： Flying In Paradise ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Najashi — Ashama Ibn Abjar (ra) — The Righteous King', file: 'Ep027_Najashi - Ashama Ibn Abjar (ra)： The Righteous King ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Umm Salama (ra) Part 1 — A Separated Family', file: 'Ep028_Umm Salama (ra) - Part 1： A Separated Family  ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Umm Salama (ra) Part 2 — A Legacy of Wisdom', file: 'Ep029_Umm Salama (ra) - Part 2： A Legacy of Wisdom ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Umm Habiba (ra) Part 1 — A Dream Come True', file: 'Ep030_Umm Habiba (ra) - Part 1： A Dream Come True ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Umm Habiba (ra) Part 2 — Royalty Redefined', file: 'Ep031_Umm Habiba (ra) - Part 2： Royalty Redefined ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Saffiyah Bint Abdul Mutallib (ra) — A Warrior Aunt', file: 'Ep032_Saffiyah Bint Abdul Mutallib (ra)： A Warrior Aunt ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Zubayr Ibn Awwam (ra) — The Disciple', file: 'Ep033_Zubayr Ibn Awwam (ra)： The Disciple ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Asma Bint Abi Bakr (ra) — The Possessor of Two Waist Belts', file: 'Ep034_Asma Bint Abi Bakr (ra)： The Possessor of Two Waist Belts ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Talha Ibn Ubaydillah (ra) — The Living Martyr', file: 'Ep035_Talha Ibn Ubaydillah (ra)： The Living Martyr ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abu Hudhaifa Ibn Utbah (ra) — Seeking Another Status', file: 'Ep036_Abu Hudhaifa Ibn Utbah (ra)： Seeking Another Status ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Saalim Mawla Abu Hudhaifa (ra) — The Imam of the People of Quran', file: 'Ep037_Saalim Mawla Abu Hudhaifa (ra)： The Imam of the People of Quran ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: "Sawda Bint Zama'a (ra) — The Prophet's Joy", file: 'Ep038_Sawda Bint Zama\'a (ra)： The Prophet\'s Joy ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abu Ubaydah Ibn Al Jarrah (ra) — The Trustworthy One', file: 'Ep039_Abu Ubaydah Ibn Al Jarrah (ra)： The Trustworthy One ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abdurrahman Ibn Awf (ra) — A Generous Soul', file: 'Ep040_Abdurrahman Ibn Awf (ra)： A Generous Soul ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Hamza Ibn Abdulmuttalib (ra) — The Lion of Allah', file: 'Ep041_Hamza Ibn Abdulmuttalib (ra)： The Lion of Allah ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Miqdad Ibn Aswad (ra) — Better Than A Thousand Men', file: 'Ep042_Miqdad Ibn Aswad (ra)： Better Than A Thousand Men ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Khawla Bint Hakim & Uthman Ibn Madhun (ra) — The Righteous Couple', file: 'Ep043_Khawla Bint Hakim & Uthman Ibn Madhun (ra)： The Righteous Couple ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Omar Ibn Al Khattab (ra) — The Convert Who Changed The World', file: 'Ep044_Omar Ibn Al Khattab (ra)： The Convert Who Changed The World ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Omar Ibn Al Khattab (ra) — 10 Unique Virtues', file: 'Ep045_Omar Ibn Al Khattab (ra)： 10 Unique Virtues ｜ The Firsts with Dr. Omar Suleiman.mp3' },
          { title: 'Omar Ibn Al Khattab (ra) — The Opening of Jerusalem', file: 'Ep046_Omar Ibn Al Khattab (ra)： The Opening of Jerusalem ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Omar Ibn Al Khattab (ra) — His Leadership, Legacy & Death', file: 'Ep047_Omar Ibn Al Khattab (ra)： His Leadership, His Legacy, His Death ｜ The Firsts - Dr. Omar Suleiman.mp3' },
          { title: 'Abu Jandal, Abdullah & Suhayl Ibn Amr (ra) — Switching Sides', file: 'Ep048_Abu Jandal, Abdullah, & Suhayl Ibn Amr (ra)： Switching Sides ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abdullah Ibn Umm Maktum (ra) — After Abasa', file: 'Ep049_Abdullah Ibn Umm Maktum (ra)： After Abasa ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Musab Ibn Umair (ra) — The Man Who Gave It All', file: 'Ep050_Musab Ibn Umair (ra)： The Man Who Gave It All ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Al-Shifa bint Abdullah (ra) — The Healer and Scholar', file: 'Ep051_Al-Shifa bint Abdullah (ra)： The Healer and Scholar ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Khunais ibn Hudhafah (ra) — The First Husband of Hafsa (ra)', file: 'Ep052_Khunais ibn Hudhafah (ra)： The First Husband of Hafsa (ra) ｜ The Firsts with Dr. Omar Suleiman.mp3' },
          { title: "Abdullah ibn Hudhafah (ra) — The Man Who Wouldn't Flinch", file: 'Ep053_Abdullah ibn Hudhafah (ra)： The Man Who Wouldn\'t Flinch ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Atika bint Zayd (ra) — The Wife of Many Martyrs', file: 'Ep054_Atika bint Zayd (ra)： The Wife of Many Martyrs ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Ayyash ibn Abi Rabiah (ra) — The Guilt Trip That Led To Captivity', file: 'Ep055_Ayyash ibn Abi Rabiah (ra)： The Guilt Trip That Led To Captivity ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Utbah ibn Ghazwan (ra) — The Humble Governor', file: 'Ep056_Utbah ibn Ghazwan (ra)： The Humble Governor ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Shurahbil Ibn Hasana (ra) — The Scribe and Commander', file: 'Ep057_Shurahbil Ibn Hasana (ra)： The Scribe and Commander ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abdullah ibn Jahsh (ra) — An Accepted Prayer', file: 'Ep058_Abdullah ibn Jahsh (ra)： An Accepted Prayer ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Abu Ahmad Abd Ibn Jahsh (ra) — The Other Blind Companion', file: 'Ep059_Abu Ahmad Abd Ibn Jahsh (ra)： The Other Blind Companion ｜ The Firsts  ｜ Dr. Omar Suleiman.mp3' },
          { title: 'Zaynab Bint Khuzayma (ra) — The Mother of the Poor', file: 'Ep060_Zaynab Bint Khuzayma (ra)： The Mother of the Poor ｜ The Firsts ｜ Dr. Omar Suleiman.mp3' },
        ],
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(s: number) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function audioUrl(archiveId: string, file: string) {
  return `https://archive.org/download/${archiveId}/${encodeURIComponent(file)}`
}

// Collect all categories present in data
const ALL_CATEGORIES: Category[] = ['All', ...Array.from(
  new Set(SCHOLARS.flatMap(s => s.series.map(r => r.category)))
) as Category[]]

// ─── Component ────────────────────────────────────────────────────────────────

export default function LecturesPage() {
  // View state
  const [activeScholar, setActiveScholar] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null)
  const [expandedBioId, setExpandedBioId] = useState<string | null>(null)

  // Player state
  const [playingScholarId, setPlayingScholarId] = useState<string | null>(null)
  const [playingSeriesId, setPlayingSeriesId] = useState<string | null>(null)
  const [playingIdx, setPlayingIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [completedLectures, setCompletedLectures] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastSaveRef = useRef(0)

  // Restore last played + completed lectures
  useEffect(() => {
    const saved = getItem<{ scholarId: string; seriesId: string; idx: number } | null>('last_lecture_v2', null)
    if (saved) {
      setPlayingScholarId(saved.scholarId)
      setPlayingSeriesId(saved.seriesId)
      setPlayingIdx(saved.idx)
    }
    // Load completed lectures
    const completed: Record<string, boolean> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('lecture_done_') && localStorage.getItem(key) === '1') {
        completed[key] = true
      }
    }
    setCompletedLectures(completed)
  }, [])

  // Audio setup
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
      // Save position every 5 seconds
      const now = Date.now()
      if (now - lastSaveRef.current > 5000 && audio.currentTime > 10) {
        lastSaveRef.current = now
        const saved = getItem<{ scholarId: string; seriesId: string; idx: number } | null>('last_lecture_v2', null)
        if (saved) {
          localStorage.setItem(`lecture_pos_${saved.scholarId}_${saved.seriesId}_${saved.idx}`, String(audio.currentTime))
        }
      }
    }
    audio.ondurationchange = () => setDuration(audio.duration)
    audio.onplay = () => { setIsPlaying(true); setIsLoading(false) }
    audio.onpause = () => setIsPlaying(false)
    audio.onwaiting = () => setIsLoading(true)
    audio.oncanplay = () => setIsLoading(false)
    audio.onended = () => {
      // Mark current lecture as completed
      const saved = getItem<{ scholarId: string; seriesId: string; idx: number } | null>('last_lecture_v2', null)
      if (saved) {
        const doneKey = `lecture_done_${saved.scholarId}_${saved.seriesId}_${saved.idx}`
        localStorage.setItem(doneKey, '1')
        setCompletedLectures(prev => ({ ...prev, [doneKey]: true }))
        // Clear saved position
        localStorage.removeItem(`lecture_pos_${saved.scholarId}_${saved.seriesId}_${saved.idx}`)
      }

      const series = getPlayingSeries()
      if (series && playingIdx < series.lectures.length - 1) {
        playLecture(playingScholarId!, playingSeriesId!, playingIdx + 1)
      } else {
        setIsPlaying(false)
        setToast('Series Complete \uD83C\uDF89')
        setTimeout(() => setToast(null), 3000)
      }
    }
    return () => { audio.pause(); audio.src = '' }
  }, []) // eslint-disable-line

  const getPlayingSeries = useCallback((): Series | null => {
    if (!playingScholarId || !playingSeriesId) return null
    return SCHOLARS.find(s => s.id === playingScholarId)?.series.find(r => r.id === playingSeriesId) ?? null
  }, [playingScholarId, playingSeriesId])

  const playLecture = useCallback((scholarId: string, seriesId: string, idx: number) => {
    const scholar = SCHOLARS.find(s => s.id === scholarId)
    const series = scholar?.series.find(r => r.id === seriesId)
    if (!series || !audioRef.current) return
    const lec = series.lectures[idx]
    if (!lec) return

    audioRef.current.pause()
    audioRef.current.src = audioUrl(series.archiveId, lec.file)
    audioRef.current.playbackRate = speed
    audioRef.current.load()

    // Restore saved position
    const savedPos = localStorage.getItem(`lecture_pos_${scholarId}_${seriesId}_${idx}`)
    if (savedPos) {
      audioRef.current.currentTime = parseFloat(savedPos)
    }

    audioRef.current.play().catch(() => {})

    setPlayingScholarId(scholarId)
    setPlayingSeriesId(seriesId)
    setPlayingIdx(idx)
    setIsLoading(true)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(true)
    setItem('last_lecture_v2', { scholarId, seriesId, idx })
  }, [speed])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else if (playingSeriesId) {
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        playLecture(playingScholarId!, playingSeriesId!, playingIdx)
      } else {
        audioRef.current.play().catch(() => {})
      }
    }
  }

  const seekTo = (pct: number) => {
    if (!audioRef.current || !duration) return
    audioRef.current.currentTime = (pct / 100) * duration
  }

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75]
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length]
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  // Computed filtered view
  const filteredScholars = useMemo(() => {
    return SCHOLARS
      .filter(sch => !activeScholar || sch.id === activeScholar)
      .map(sch => ({
        ...sch,
        series: sch.series.filter(ser => {
          const catOk = activeCategory === 'All' || ser.category === activeCategory
          const searchOk = !search || ser.title.toLowerCase().includes(search.toLowerCase()) ||
            ser.lectures.some(l => l.title.toLowerCase().includes(search.toLowerCase()))
          return catOk && searchOk
        }),
      }))
      .filter(sch => sch.series.length > 0)
  }, [activeScholar, activeCategory, search])

  // Player data
  const playingSeries = getPlayingSeries()
  const playingScholar = SCHOLARS.find(s => s.id === playingScholarId)
  const playingLecture = playingSeries?.lectures[playingIdx]
  const playingAccent = playingSeries ? ACCENT[playingSeries.accent] : null

  // Total lecture count
  const totalLectures = SCHOLARS.flatMap(s => s.series).reduce((n, s) => n + s.lectures.length, 0)

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-44">
      <PageHero
        icon={Headphones}
        title="Islamic Lectures"
        subtitle={`${SCHOLARS.length} scholars · ${totalLectures} lectures`}
        gradient="from-teal-900 to-emerald-900"
        showBack
      />

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#0a0b14]/95 backdrop-blur border-b border-gray-800/50 px-4 py-3 space-y-3">
        {/* Scholar filter pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveScholar(null)}
            className={`flex-shrink-0 rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              !activeScholar ? 'bg-white text-gray-950' : 'bg-gray-800 text-gray-400'
            }`}
          >
            All Scholars
          </button>
          {SCHOLARS.map(sch => (
            <button
              key={sch.id}
              onClick={() => setActiveScholar(activeScholar === sch.id ? null : sch.id)}
              className={`flex-shrink-0 rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                activeScholar === sch.id ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {sch.avatar} {sch.shortName}
            </button>
          ))}

          {/* Search toggle */}
          <button
            onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearch('') }}
            className={`ml-auto flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
              showSearch ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        {/* Search input */}
        {showSearch && (
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lectures or series..."
            autoFocus
            className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500/50"
          />
        )}

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 rounded-xl border px-3 py-1 text-[11px] font-bold transition-all ${
                activeCategory === cat
                  ? (cat === 'All' ? 'bg-white text-gray-950 border-transparent' : CATEGORY_COLORS[cat])
                  : 'border-gray-800 bg-transparent text-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="px-4 pt-4 space-y-6">
        {filteredScholars.length === 0 && (
          <div className="pt-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400 text-sm">No lectures found</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setActiveScholar(null) }}
              className="mt-3 text-xs text-emerald-400 underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}

        {filteredScholars.map(scholar => (
          <div key={scholar.id}>
            {/* Scholar Header — tap to expand bio */}
            {(!activeScholar || filteredScholars.length > 1) && (
              <div className={`mb-3 rounded-2xl bg-gradient-to-r ${scholar.color} border border-gray-700/50 overflow-hidden`}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setExpandedBioId(expandedBioId === scholar.id ? null : scholar.id)}
                >
                  <span className="text-3xl shrink-0">{scholar.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-snug">{scholar.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{scholar.origin} · {scholar.specialty}</p>
                    <p className="text-[11px] text-gray-300 mt-1 leading-snug line-clamp-2">{scholar.bio}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] font-bold text-gray-400">
                      {scholar.series.reduce((n, s) => n + s.lectures.length, 0)} lectures
                    </span>
                    {expandedBioId === scholar.id
                      ? <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                      : <ChevronDown className="h-3.5 w-3.5 text-gray-500" />}
                  </div>
                </button>
                {expandedBioId === scholar.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-700/40">
                    <p className="text-xs text-gray-300 leading-relaxed mt-3">{scholar.fullBio}</p>
                  </div>
                )}
              </div>
            )}

            {/* Series list */}
            <div className="space-y-2">
              {scholar.series.map(series => {
                const acc = ACCENT[series.accent]
                const isExpanded = expandedSeries === series.id
                const isThisPlaying = playingScholarId === scholar.id && playingSeriesId === series.id

                return (
                  <div
                    key={series.id}
                    className={`rounded-2xl border overflow-hidden transition-all ${
                      isThisPlaying ? `${acc.bg} ${acc.ring} border` : 'border-gray-800 bg-gray-900/50'
                    }`}
                  >
                    {/* Series Header Row */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      onClick={() => setExpandedSeries(isExpanded ? null : series.id)}
                    >
                      {/* Category badge */}
                      <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-bold ${CATEGORY_COLORS[series.category] ?? 'bg-gray-700 text-gray-300'}`}>
                        {series.category}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${isThisPlaying ? acc.text : 'text-gray-200'}`}>
                          {series.title}
                        </p>
                        <p className="text-[10px] text-gray-500">{series.subtitle ?? `${series.lectures.length} lectures`}</p>
                      </div>

                      {/* Play first lecture shortcut */}
                      <button
                        onClick={e => { e.stopPropagation(); playLecture(scholar.id, series.id, isThisPlaying ? playingIdx : 0) }}
                        className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all ${acc.bg}`}
                      >
                        {isThisPlaying && isLoading ? (
                          <Loader2 className={`h-3.5 w-3.5 animate-spin ${acc.text}`} />
                        ) : isThisPlaying && isPlaying ? (
                          <Pause className={`h-3.5 w-3.5 ${acc.text}`} />
                        ) : (
                          <Play className={`h-3.5 w-3.5 ${acc.text}`} />
                        )}
                      </button>

                      {isExpanded
                        ? <ChevronUp className="h-4 w-4 shrink-0 text-gray-600" />
                        : <ChevronDown className="h-4 w-4 shrink-0 text-gray-600" />
                      }
                    </button>

                    {/* Expanded lecture list */}
                    {isExpanded && (
                      <div className="border-t border-gray-800/50 pb-1">
                        {series.lectures.map((lec, i) => {
                          const isCurrent = isThisPlaying && playingIdx === i
                          const doneKey = `lecture_done_${scholar.id}_${series.id}_${i}`
                          const isDone = completedLectures[doneKey]
                          const savedPos = typeof window !== 'undefined' ? localStorage.getItem(`lecture_pos_${scholar.id}_${series.id}_${i}`) : null
                          return (
                            <button
                              key={i}
                              onClick={() => playLecture(scholar.id, series.id, i)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                                isCurrent ? acc.bg : 'active:bg-white/5'
                              }`}
                            >
                              <span className={`text-[11px] font-bold w-5 text-right shrink-0 ${isDone ? 'text-emerald-500' : isCurrent ? acc.text : 'text-gray-600'}`}>
                                {isDone ? <Check className="h-3.5 w-3.5 inline" /> : i + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs truncate ${isCurrent ? acc.text + ' font-semibold' : isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                                  {lec.title}
                                </p>
                                {savedPos && !isCurrent && (
                                  <p className="text-[10px] text-amber-400 mt-0.5">Resume {fmt(parseFloat(savedPos))}</p>
                                )}
                              </div>
                              {isCurrent && isLoading && (
                                <Loader2 className={`h-3 w-3 animate-spin shrink-0 ${acc.text}`} />
                              )}
                              {isCurrent && isPlaying && !isLoading && (
                                <span className={`text-[9px] font-black shrink-0 ${acc.text}`}>{'\u25B6'}</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Sticky Player ──────────────────────────────────────────── */}
      {playingLecture && (
        <div
          className="fixed left-0 right-0 z-[55] bg-gray-950/98 backdrop-blur border-t border-gray-800 px-4 py-3"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 20px))' }}
        >
          {/* Seek bar */}
          <div
            className="w-full h-1 bg-gray-800 rounded-full mb-3 cursor-pointer"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              seekTo(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <div
              className={`h-full rounded-full transition-all ${playingAccent?.dot ?? 'bg-emerald-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{playingLecture.title}</p>
              <p className="text-[10px] text-gray-500 truncate">
                {playingScholar?.name} · {fmt(currentTime)} / {fmt(duration)}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={changeSpeed}
                className="rounded-lg bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-400 min-w-[34px] text-center"
              >
                {speed}x
              </button>
              <button
                onClick={() => playingIdx > 0 && playLecture(playingScholarId!, playingSeriesId!, playingIdx - 1)}
                disabled={playingIdx === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 disabled:opacity-30"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlay}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${playingAccent?.bg ?? 'bg-emerald-500/20'}`}
              >
                {isLoading
                  ? <Loader2 className={`h-5 w-5 animate-spin ${playingAccent?.text ?? 'text-emerald-400'}`} />
                  : isPlaying
                  ? <Pause className={`h-5 w-5 ${playingAccent?.text ?? 'text-emerald-400'}`} />
                  : <Play className={`h-5 w-5 ${playingAccent?.text ?? 'text-emerald-400'}`} />
                }
              </button>
              <button
                onClick={() => {
                  if (playingSeries && playingIdx < playingSeries.lectures.length - 1)
                    playLecture(playingScholarId!, playingSeriesId!, playingIdx + 1)
                }}
                disabled={!playingSeries || playingIdx === playingSeries.lectures.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 disabled:opacity-30"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] rounded-xl bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <BottomNav />
    </div>
  )
}
