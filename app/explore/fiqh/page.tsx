'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Scale, ChevronDown, ChevronUp } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FiqhTopic {
  id: string
  chapter: string
  title: string
  rulingType?: 'fard' | 'wajib' | 'sunnah' | 'haram' | 'makruh' | 'info' | 'halal'
  madhab?: string
  sistersRelevant?: boolean
  points: string[]
  note?: string
  table?: { col1: string; col2: string; rows: [string, string][] }
}

// ─── Badge styles ─────────────────────────────────────────────────────────────

const BADGE: Record<string, string> = {
  fard:   'bg-red-500/15 text-red-400 border border-red-500/20',
  wajib:  'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  sunnah: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  haram:  'bg-rose-700/15 text-rose-400 border border-rose-700/20',
  makruh: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  info:   'bg-gray-700/30 text-gray-400 border border-gray-700/20',
  halal:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
}

// ─── Chapter labels (in display order) ────────────────────────────────────────

const CHAPTER_ORDER = [
  'Tahara', 'Salah', 'Sawm', 'Zakah', 'Hajj', 'Nikah', 'Divorce',
  'Inheritance', 'Muamalaat', 'Halal & Haram', "Women's Fiqh",
  'Udhiyyah', 'Funeral', 'Q&A',
]

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOPICS: FiqhTopic[] = [
  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Tahara (Purification)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'water-types',
    chapter: 'Tahara',
    title: 'Types of Water for Purification',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Taahir mutahhir (pure and purifying) — rainwater, river water, sea water, well water, spring water, snow/ice. Valid for wudu and ghusl.',
      'Taahir ghayr mutahhir (pure but not purifying) — used water (water that has already been used for wudu/ghusl), fruit juice, rose water. Cannot be used for wudu.',
      'Naajis (impure) — water contaminated by impurity that has changed its colour, taste, or smell. Cannot be used for purification.',
      'Makruh water — water that has been sitting in the sun in a metal container (Hanafi: disliked for health reasons; not religiously impure).',
    ],
  },
  {
    id: 'wudu-steps',
    chapter: 'Tahara',
    title: 'Wudu — Steps and Faraa\'id',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      '4 Fard of Wudu: (1) Washing face once from hairline to chin, ear to ear. (2) Washing both arms including elbows once. (3) Wiping at least one quarter of the head (mash). (4) Washing both feet including ankles once.',
      'Sunnah acts: Niyyah (intention), saying Bismillah, washing hands to wrists, rinsing mouth (madmadah), sniffing water into nose (istinshaq), wiping entire head, wiping ears, washing 3 times, performing in order, wiping neck.',
      'Tartib (order) — Hanafi: sunnah only; Shafi\'i/Hanbali: fard.',
      'Muwalat (continuity) — Hanafi: sunnah; Shafi\'i: wajib (must not dry before completing).',
    ],
  },
  {
    id: 'wudu-breakers',
    chapter: 'Tahara',
    title: 'What Breaks Wudu',
    rulingType: 'fard',
    points: [
      'Any discharge from private parts — urine, stool, wind, wadi (thick white discharge after urination), mazi (pre-seminal fluid — Hanafi: does not break wudu per some; majority: does)',
      'Flowing blood or pus from a wound in enough quantity to flow (Hanafi: breaks wudu; Shafi\'i/Hanbali: does not)',
      'Vomiting a mouthful (Hanafi: breaks wudu; Shafi\'i: does not)',
      'Deep sleep lying down or leaning — body goes limp. Sleeping sitting upright: Hanafi: does not break wudu',
      'Loss of consciousness, fainting, intoxication, anaesthesia',
      'Laughing aloud during Salah (Hanafi: breaks both wudu and Salah; Shafi\'i/Maliki: breaks Salah only)',
      'Touching private parts directly with palm (Shafi\'i/Hanbali: breaks wudu; Hanafi: does not)',
    ],
    note: 'Hanafi is predominant in Guyana. When uncertain, renew wudu.',
  },
  {
    id: 'ghusl',
    chapter: 'Tahara',
    title: 'Ghusl — When Required & How to Perform',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Required after: (1) Ejaculation with desire. (2) Sexual intercourse even without ejaculation. (3) End of hayd (menstruation). (4) End of nifas (post-natal bleeding). (5) At death — ghusl of deceased is fard kifayah.',
      '3 Fard of Ghusl (Hanafi): Rinsing the mouth thoroughly (madmadah). Sniffing water into nose (istinshaq). Washing the entire body — no dry spot permitted.',
      'IMPORTANT: Remove any barrier before ghusl — nail polish, wax, dried glue, oil-based paint. These prevent water reaching skin.',
      'Sunnah: niyyah, Bismillah, wash hands first, make wudu, pour water over head 3x, wash right side then left.',
      'Ghusl is also recommended (sunnah/mustahabb) before: Jumu\'ah, Eid prayers, Ihram, entering Makkah.',
    ],
    note: 'For women after hayd: ensure all hair is wet to the roots. Unbraiding thick plaits is not required per Hanafi — water must reach roots but hair need not be unbraided.',
  },
  {
    id: 'tayammum',
    chapter: 'Tahara',
    title: 'Tayammum — Dry Ablution',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Valid when: water is genuinely unavailable, water is present but using it would cause harm to health, water is needed for drinking (life-saving need), or due to severe cold with no means of heating water.',
      'Strike both palms on clean earth/sand/stone (anything from the ground — Hanafi allows wall, stone, clay).',
      'Wipe the face once with both hands.',
      'Strike again, wipe both arms to and including elbows.',
      'Niyyah is required before striking.',
      'Tayammum is invalidated when: water becomes available, reason for tayammum disappears, or anything that breaks wudu occurs.',
      'Hanafi: one tayammum per fard prayer. A new tayammum is needed for each fard.',
    ],
  },
  {
    id: 'najaasah',
    chapter: 'Tahara',
    title: 'Types of Impurity (Najaasah)',
    rulingType: 'info',
    points: [
      'Ghaleeza (Heavy impurity — Hanafi): dog, pig and their by-products, wine/alcohol (Hanafi: treated as ghaleeza). Must be washed 3 times with squeezing.',
      'Mutawassita (Medium impurity): human urine and stool, flowing blood, vomit (mouthful), animal dung of non-halal animals. Wash until trace is removed.',
      'Khafeefa (Light impurity — Hanafi only): urine of halal meat animals. Excused if less than quarter of the garment or body area. Other madhabs: no such category — all impurity treated equally.',
      'The prayer place, body, and clothing must all be free of impurity for Salah.',
    ],
    note: 'A small amount of blood smaller than the inner circle of the palm is excused per Hanafi.',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Salah (Prayer)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'salah-conditions',
    chapter: 'Salah',
    title: 'Conditions for Valid Salah',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Islam, sanity, and having reached puberty (mukallaf — legally responsible)',
      'Ritual purity — valid wudu or ghusl where required',
      'Freedom from najaasah on body, clothing, and place of prayer',
      'Awrah covered — Men: navel to knee. Women: entire body except face and hands (Hanafi); face also exposed when no unrelated men present.',
      'Facing the Qibla — face the general direction if exact direction unknown',
      'Correct time — Salah before or after its time is invalid (must be qada)',
    ],
  },
  {
    id: 'salah-pillars',
    chapter: 'Salah',
    title: 'Pillars (Faraa\'id) of Salah',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Takbeer al-Ihram — opening Allahu Akbar with specific intention',
      'Qiyam — standing upright (obligatory for fard if physically able)',
      'Recitation of Surah al-Fatihah (in every rakah per Shafi\'i/Hanbali; first 2 fard rakat per Hanafi)',
      'Ruku — bowing until back is flat and hands reach knees',
      'I\'tidal — rising fully upright from ruku (remaining still momentarily)',
      'Sujud — prostration on 7 bones: forehead+nose, both palms, both knees, both feet toes',
      'Julsah — sitting between the two prostrations (with stillness)',
      'Final Tashahhud in last sitting',
      'Tasleem — salaam to right and left to exit Salah',
    ],
    note: 'Omitting a pillar invalidates the entire Salah — cannot be compensated by Sujud al-Sahw.',
  },
  {
    id: 'salah-women',
    chapter: 'Salah',
    title: 'Differences in Women\'s Salah',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Awrah: Entire body must be covered except face and both hands. Feet must also be covered during Salah (Hanafi).',
      'Voice: Women do not raise their voice in Salah when men are present or could hear. When praying alone, quiet recitation.',
      'Ruku: Hands on knees, arms closer to body — do not spread elbows wide.',
      'Sujud: Body kept compact — stomach closer to thighs, arms flat against sides (not raised).',
      'Qiyam: Hands folded on chest (Hanafi), not on navel. Some scholars: below chest.',
      'Adhan and Iqamah: Not obligatory for women — may make iqamah quietly for themselves, not required.',
      'Leading prayer: A woman may lead other women in prayer. She stands in the middle of the first row, not in front.',
      'Jumu\'ah: Not obligatory for women; they are welcome to attend. If they attend, they pray with the congregation.',
    ],
  },
  {
    id: 'salah-invalidators',
    chapter: 'Salah',
    title: 'What Invalidates Salah',
    rulingType: 'haram',
    points: [
      'Speaking intentionally — even one word, even in Arabic if not dhikr',
      'Laughing aloud — even if one letter audible',
      'Eating or drinking anything',
      'Turning the chest away from Qibla without necessity',
      'Excessive continuous movement — 3+ sequential actions without need',
      'Wudu breaking — exit Salah, renew wudu, restart from beginning',
      'Uncovering awrah unless corrected immediately',
      'Intentional action contradicting posture (e.g., bowing in ruku while thinking of something and moving oddly)',
    ],
  },
  {
    id: 'witr',
    chapter: 'Salah',
    title: 'Witr Prayer',
    rulingType: 'wajib',
    sistersRelevant: true,
    points: [
      '3 rakat — prayed after Isha, before Fajr (Hanafi). 1 rakat per Shafi\'i/Maliki/Hanbali.',
      'Hanafi method: Pray 2 rakat with sitting and tashahhud. Rise for 3rd rakat. Recite Fatiha + surah. Raise hands to earlobes, say Allahu Akbar, recite Dua Qunoot, then complete rakat normally.',
      'Dua Qunoot is Wajib in Witr per Hanafi — never call Witr optional.',
      'If Witr is missed: Hanafi: must make qada. Other madhabs: pray even number as compensation.',
      'The Prophet \uFDFA never neglected Witr — not while travelling, not at home. "Make Witr the last of your night prayers." (Bukhari, Muslim)',
    ],
  },
  {
    id: 'qada-prayers',
    chapter: 'Salah',
    title: 'Makeup Prayers (Qada)',
    rulingType: 'fard',
    points: [
      'Every missed fard prayer must be made up — the obligation never expires',
      'It is sinful to deliberately miss Salah. Repent and begin making them up immediately.',
      'If many prayers owed: permissible to pray current fard first, then follow with qada',
      'Jumu\'ah cannot be made up — pray 4 rakat Dhuhr as qada',
      'Menstruating women: do NOT make up missed Salah — obligation is completely lifted for hayd/nifas. Fasts must still be made up.',
    ],
    note: 'Deliberately missing Salah without valid excuse is a major sin in all madhabs.',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Sawm (Fasting)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'fasting-pillars',
    chapter: 'Sawm',
    title: 'Conditions for a Valid Fast',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Niyyah (intention) made before Fajr for each fard fast. For voluntary fasts, niyyah before midday is valid (Hanafi).',
      'Free from hayd and nifas — a woman must not fast while menstruating or in nifas. It is forbidden, not just excused.',
      'Fasting time: from true Fajr (Subh Sadiq) until Maghrib (sunset).',
      'Suhoor: eating before Fajr is sunnah, not fard. One may fast without suhoor.',
    ],
  },
  {
    id: 'fasting-breaks-kaffarah',
    chapter: 'Sawm',
    title: 'What Breaks Fast: Qada + Kaffarah',
    rulingType: 'haram',
    points: [
      'Intentional eating or drinking while knowing it is Ramadan and the fast is in progress',
      'Intentional sexual intercourse during the fast',
      'Deliberately inhaling smoke (e.g., smoking cigarettes — Hanafi: breaks fast)',
      'Kaffarah (expiation): In order — (1) Free a slave [not applicable today]. (2) Fast 60 consecutive days. (3) Feed 60 poor people.',
      'Both Qada (make up the day) AND Kaffarah are required.',
    ],
    note: 'Kaffarah applies to the Ramadan fard fast only. Voluntary fasts broken intentionally require Qada only, no kaffarah.',
  },
  {
    id: 'fasting-breaks-qada',
    chapter: 'Sawm',
    title: 'What Breaks Fast: Qada Only',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Accidentally eating/drinking while thinking it is still night or already Maghrib (Hanafi: Qada required; Shafi\'i: fast not broken at all)',
      'Taking oral medication, drops, or suppositories (Hanafi: breaks fast; many scholars of other madhabs: does not)',
      'Water entering throat while swimming, bathing, or rinsing the mouth',
      'Intentional vomiting of a mouthful',
      'Eating after suhoor thinking Fajr had not entered when it had',
      'Cupping/blood donation — majority: does not break fast; some scholars: breaks it out of caution',
    ],
  },
  {
    id: 'fasting-does-not-break',
    chapter: 'Sawm',
    title: 'What Does NOT Break the Fast',
    rulingType: 'halal',
    sistersRelevant: true,
    points: [
      'Forgetfully eating or drinking — fast remains valid; stop immediately when remembered',
      'Non-nutritional injections (insulin, anaesthetic, vitamin B12) — majority: does not break fast',
      'Eye drops — Hanafi: breaks if reaches throat by taste; Shafi\'i: does not break',
      'Ear drops — Hanafi: breaks fast; Shafi\'i: does not',
      'Tasting food with tip of tongue without swallowing — makruh but does not break fast',
      'Brushing teeth or using miswak — permissible; avoid swallowing toothpaste',
      'Rinsing mouth for wudu without swallowing',
      'Kissing one\'s spouse without intercourse — permissible for those with self-control; disliked for others',
      'Swimming with care not to swallow water',
      'Applying kohl (eyeliner) — Hanafi: permissible; no effect on fast',
    ],
  },
  {
    id: 'fasting-exemptions',
    chapter: 'Sawm',
    title: 'Who is Exempt from Fasting',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Traveller — travelling 77+ km may break fast and make up later; sunnah to fast if easy',
      'Ill person — genuine fear of harm from fasting: break and make up; if chronic: Fidya',
      'Pregnant woman — if fasting harms herself or the baby: break and make up; some scholars add Fidya',
      'Nursing mother — if fasting harms the nursing child: break and make up; some add Fidya',
      'Menstruating woman — FASTING FORBIDDEN during hayd. MUST make up after Ramadan.',
      'Post-natal bleeding (nifas) — same as hayd: forbidden, must make up',
      'Elderly who cannot fast without severe hardship — Fidya only (feed one poor person per missed day; no qada required)',
      'Children — not obligated; encouraged to fast as training from around age 10',
    ],
    note: 'Fidya 2026 (Guyana): GYD $60,000 per missed fast. Source: D.E.H.C. / Darul Uloom East Street.',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Zakah
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'zakah-conditions',
    chapter: 'Zakah',
    title: 'Who Must Pay Zakah',
    rulingType: 'fard',
    points: [
      'Muslim, free, adult, sane',
      'Owns wealth equal to or above nisab for one full lunar year (hawl)',
      'The wealth must be in excess of basic needs and free of debt',
      'Nisab (2026 Guyana): GYD $547,298 (gold nisab equivalent) — source: Darul Uloom East Street',
      'Rate: 2.5% of zakatable wealth above nisab',
    ],
  },
  {
    id: 'zakah-wealth',
    chapter: 'Zakah',
    title: 'What Wealth is Zakatable',
    rulingType: 'fard',
    points: [
      'Gold and silver — at nisab threshold (85g gold / 595g silver — use the lower: silver nisab benefits the poor more)',
      'Cash savings and bank balances above nisab held for one year',
      'Trade goods (inventory) — valued at market price at time of payment',
      'Agricultural produce — 10% if rain-irrigated; 5% if irrigated by effort/cost',
      'Livestock — camels, cows, goats (specific thresholds apply)',
      'Investment properties generating rental income — on the income received',
      'Shares and stocks — on market value of zakatable assets within the company',
      'NOT zakatable: personal home, personal car, clothing, household furniture, tools of trade',
    ],
  },
  {
    id: 'zakah-asnaf',
    chapter: 'Zakah',
    title: 'The 8 Categories (Asnaf) of Zakah Recipients',
    rulingType: 'fard',
    points: [
      'Fuqara (the poor) — those with less than nisab',
      'Masakeen (the destitute) — those with nothing at all',
      '\'Amileen (Zakah administrators) — those who collect and distribute on behalf of the community',
      'Mu\'allafatul Quloob (those whose hearts are being reconciled) — new Muslims or those being drawn to Islam',
      'Riqab (freeing slaves) — not applicable in modern times; some scholars apply to debt bondage',
      'Gharimeen (the indebted) — those overwhelmed by permissible debt',
      'Fi Sabilillah (in the way of Allah) — Islamic education, da\'wah, community projects (Hanafi: restricted to specific fighters; Shafi\'i: broad)',
      'Ibn al-Sabil (the stranded traveller) — one far from home without access to wealth',
    ],
  },
  {
    id: 'zakat-fitr',
    chapter: 'Zakah',
    title: 'Zakat al-Fitr (Sadaqatul Fitr)',
    rulingType: 'wajib',
    points: [
      'Wajib (Hanafi) / Fard (Shafi\'i/Maliki) on every Muslim who has more than their day\'s needs on Eid day',
      'Must be paid before Eid prayer — paying after is sinful (still accepted but loses Eid timing reward)',
      'Rate 2026 (Guyana): GYD $2,000 per person — pay on behalf of yourself and all dependants',
      'Paid in food staples (originally) or cash equivalent of local staple food',
      'Goes to the fuqara and masakeen of the local community',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Hajj & Umrah
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'hajj-obligation',
    chapter: 'Hajj',
    title: 'Hajj — Obligation and Conditions',
    rulingType: 'fard',
    points: [
      'Fard once in a lifetime for every adult Muslim who is: physically able, financially able (after debts and family provision), safe route available',
      'Fard immediately when conditions are met — delaying without excuse is sinful',
      'A woman must have a mahram (husband or close male relative) for Hajj travel — Hanafi: required; Shafi\'i: safe group of women sufficient',
      'If a person dies without performing Hajj, it may be performed on their behalf (Hajj al-Badal) from their estate',
    ],
  },
  {
    id: 'hajj-pillars',
    chapter: 'Hajj',
    title: 'Pillars of Hajj',
    rulingType: 'fard',
    points: [
      'Ihram — entering the state of consecration with niyyah at the miqat',
      'Wuquf at Arafah — standing/being present at Arafah on 9 Dhul Hijjah, even for a moment after Dhuhr until Fajr of 10th',
      'Tawaf al-Ifadah (Tawaf al-Ziyarah) — 7 circuits of the Ka\'bah after returning from Arafah',
      'Sa\'i — walking between Safa and Marwah 7 times',
    ],
    note: 'Missing Wuquf at Arafah invalidates the Hajj entirely — it is the very core of Hajj.',
  },
  {
    id: 'hajj-prohibited',
    chapter: 'Hajj',
    title: 'Prohibited Acts in Ihram',
    rulingType: 'haram',
    sistersRelevant: true,
    points: [
      'Men: covering the head, wearing sewn clothing, using fragrance/perfume',
      'Women: covering the face (niqab) and hands with gloves — though modesty is required; face veil not allowed in ihram',
      'Both genders: cutting hair or nails, sexual intercourse or foreplay, hunting land animals, cutting trees/plants of the haram',
      'Penalty (dam — sacrifice of an animal) required for violations unless done out of genuine necessity',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Nikah (Marriage)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'nikah-conditions',
    chapter: 'Nikah',
    title: 'Conditions for a Valid Nikah',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Offer (Ijab) and Acceptance (Qabool) — in one sitting, in the same or near-same words',
      'Two adult Muslim male witnesses of good character (Hanafi allows female witnesses; Shafi\'i requires 2 male witnesses)',
      'Wali (guardian) — Shafi\'i/Hanbali/Maliki: wali is a pillar; without him nikah is invalid. Hanafi: an adult sane woman of free status may contract her own nikah but a wali is still strongly recommended.',
      'Mahr (dowry) — must be specified; even a small amount is valid. Must be paid to the bride — not her family.',
      'Free and genuine consent of both parties — forced marriage is haram and invalid in all madhabs',
    ],
    note: 'Islamic nikah without civil registration has no legal standing in Guyana. Register with the Registrar-General\'s Department.',
  },
  {
    id: 'nikah-mahr',
    chapter: 'Nikah',
    title: 'Mahr (Dowry)',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Mahr is the wife\'s right — not a payment to the family',
      'Must be specified in the nikah contract; if omitted, mahr al-mithl (standard equivalent dowry) is assigned',
      'Minimum mahr (Hanafi): 10 Dirhams (silver) equivalent in value',
      'Prompt mahr (mu\'ajjal): paid at time of nikah. Deferred mahr (mu\'ajjal): paid on demand or upon divorce/death.',
      'A wife may waive her mahr of her own free will — but this must be genuine, not coerced',
      'Mahr is hers alone — her husband has no right to it without her consent',
    ],
  },
  {
    id: 'nikah-rights',
    chapter: 'Nikah',
    title: 'Rights and Duties in Marriage',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Husband\'s duties: financial provision (nafaqah) — food, clothing, shelter according to his means; kindness, justice',
      'Wife\'s rights: mahr, provision, respectful treatment, fair sharing of time if polygamous',
      'Wife\'s duties: maintaining the home (with reasonable assistance), caring for children, allowing husband intimate access, seeking permission to leave home (Hanafi: required; other madhabs: more flexible)',
      'Neither spouse may harm the other physically, emotionally, or financially',
      'Polygamy: maximum 4 wives simultaneously, with absolute financial and time-sharing equality — if unable to be just, Quran says marry only one (Quran 4:3, 4:129)',
    ],
  },
  {
    id: 'nikah-prohibited',
    chapter: 'Nikah',
    title: 'Prohibited Marriages',
    rulingType: 'haram',
    sistersRelevant: true,
    points: [
      'Permanently prohibited (mahram relatives): mother, grandmother, daughter, granddaughter, sister, aunt, niece; foster mother and foster sister; wife\'s mother; son\'s wife; father\'s wife',
      'Temporarily prohibited: being simultaneously married to two sisters or to a woman and her aunt/niece',
      'A Muslim woman may NOT marry a non-Muslim man — consensus of all madhabs',
      'A Muslim man may marry a chaste Jewish or Christian woman — but NOT a polytheist, atheist, or woman of other religions',
      'A divorcee or widow must complete her iddah before remarrying',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Divorce
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'talaq-types',
    chapter: 'Divorce',
    title: 'Types of Talaq',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Talaq Raj\'i (Revocable Divorce) — 1st or 2nd divorce. Husband may revoke during iddah without a new nikah. After iddah expires without revocation, becomes irrevocable.',
      'Talaq Ba\'in Sughra (Minor Irrevocable) — divorce where iddah has passed, or divorce by khul\', or conditional divorce. Remarriage requires a new nikah contract with new mahr.',
      'Talaq Ba\'in Kubra / Mughallazah (Triple Divorce) — 3rd divorce. Marriage is permanently dissolved until the wife genuinely marries another man, that marriage is consummated, and that husband genuinely divorces her (tahleel). Arranged tahleel (halala) is haram and the nikah involved is invalid.',
      'Talaq al-Bidah (innovated — 3 in one sitting): Hanafi position: counts as final irrevocable divorce (though the act itself is sinful). This is the strictest position and most relevant to Guyana community.',
    ],
    note: 'Pronouncing talaq 3 times in one sitting is sinful and was not the practice of the Prophet \uFDFA. It carries the maximum consequence. Consult a scholar before acting.',
  },
  {
    id: 'iddah',
    chapter: 'Divorce',
    title: 'Iddah (Waiting Period)',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'After talaq or death of husband — wife must observe iddah before remarrying',
      'Divorced woman who menstruates: 3 complete menstrual cycles (Quru\')',
      'Divorced woman who does not menstruate (post-menopausal or young): 3 calendar months',
      'Divorced pregnant woman: until she gives birth — regardless of how long this takes',
      'Widow: 4 months and 10 days (unless pregnant — then until birth)',
      'During iddah (divorced): wife remains in the marital home; husband must provide maintenance',
      'During iddah (widowed): wife must observe ihdad (mourning) — no perfume, adornment, or going out unnecessarily; may leave for necessity',
      'Iddah starts from the moment of divorce/death — not when she is informed',
    ],
    note: 'A woman in iddah may not leave the marital home except for genuine necessity (Hanafi).',
  },
  {
    id: 'khul',
    chapter: 'Divorce',
    title: 'Khul\' (Wife-Initiated Dissolution)',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'A wife may seek dissolution of marriage by returning the mahr to her husband',
      'Valid without husband\'s willingness if taken through an Islamic court or Qadi',
      'If husband agrees: khul\' is effected immediately as one ba\'in (irrevocable) divorce',
      'Husband may not refuse khul\' if there is genuine harm or incompatibility — the Prophet \uFDFA granted khul\' to the wife of Thabit ibn Qays',
      'After khul\': she observes iddah of one menstrual cycle (Hanafi) — not 3 cycles',
      'A wife cannot be pressured into returning mahr unless the khul\' is her own choice',
    ],
  },
  {
    id: 'faskh',
    chapter: 'Divorce',
    title: 'Faskh (Annulment by Court)',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Faskh is annulment granted by an Islamic judge (qadi) or scholarly panel',
      'Valid grounds: husband\'s impotence, husband\'s failure to provide maintenance, husband\'s prolonged unknown absence, harm or cruelty from the husband, husband\'s apostasy',
      'In Guyana: seek resolution through CIOG or GII scholars',
      'Faskh counts as one irrevocable divorce — she may remarry (including the same man with new nikah)',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Inheritance
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'inheritance-shares',
    chapter: 'Inheritance',
    title: 'Fixed Shares (Ashab al-Faraid)',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Wife: 1/4 if no children; 1/8 if there are children',
      'Husband: 1/2 if no children; 1/4 if there are children',
      'Daughter: 1/2 if only daughter with no son; 2/3 if two+ daughters with no son; reduced with sons present (takes half of son\'s share — Quran 4:11)',
      'Mother: 1/3 if no children or siblings; 1/6 if children present; 1/3 of residue if husband/wife inherits',
      'Father: 1/6 if son is present; takes residue if only daughters; excluded by father\'s father only',
      'Uterine siblings (different father): 1/6 each or 1/3 shared if multiple',
      'Granddaughter: inherits as daughter if no son/daughter present; may inherit 1/6 to complete the 2/3',
    ],
    note: 'Muslim inheritance law applies to Muslims. Non-Muslims cannot inherit from a Muslim and vice versa in Islamic law. Consult a scholar or registered Islamic body for estate matters.',
  },
  {
    id: 'inheritance-blockers',
    chapter: 'Inheritance',
    title: 'What Prevents Inheritance',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Murder — a person who kills the deceased (intentionally) cannot inherit from them',
      'Difference of religion — a non-Muslim cannot inherit from a Muslim; a Muslim cannot inherit from a non-Muslim (under Islamic law)',
      'Slavery (not applicable today)',
      '\'Aul (proportional reduction): if the sum of all shares exceeds the estate, all shares are reduced proportionally',
      'Radd (return): if total shares are less than the estate, the excess is redistributed to heirs in proportion — excluding husband/wife (Hanafi: husband and wife excluded from radd)',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Muamalaat (Transactions & Business)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'muamalaat-trade',
    chapter: 'Muamalaat',
    title: 'Conditions for a Valid Sale',
    rulingType: 'info',
    points: [
      'Offer and acceptance (Ijab and Qabool) — verbal, written, or by clear mutual conduct',
      'The item sold must: exist, be owned by the seller, be deliverable, have a specified price',
      'The price must be known at time of sale — deferred payment is valid if amount is fixed',
      'Bay\' al-Gharar (excessive uncertainty) is invalid — do not sell "the fish still in the sea" or "the fruit not yet grown"',
      'Bay\' al-Salam (forward sale): permissible if full price paid upfront and item fully specified',
      'Both parties must transact by mutual consent — no coercion',
    ],
  },
  {
    id: 'riba',
    chapter: 'Muamalaat',
    title: 'Riba (Interest) — Strictly Prohibited',
    rulingType: 'haram',
    points: [
      'Riba is absolutely prohibited — "Allah has permitted trade and forbidden riba." (Quran 2:275)',
      'Riba al-Nasi\'ah (delay riba): charging extra for deferred payment on a loan. Bank interest, credit card interest — all fall here.',
      'Riba al-Fadl (excess riba): exchanging the same commodity in unequal amounts (e.g., 1kg gold for 1.2kg gold). Must exchange gold-for-gold hand to hand in equal amounts.',
      'A loan must be repaid in exactly the same amount — any increase stipulated is riba',
      'Conventional mortgages with interest: haram. Islamic alternatives (Murabaha, Ijara) are available from Islamic finance providers.',
      'Penalty for riba: one of the gravest major sins in Islam. "Whoever consumes riba — it is as if he has made war against Allah and His Messenger." (Quran 2:279)',
    ],
    note: 'Taking out an interest-bearing loan for genuine necessity (no Islamic alternative available, life necessity) is debated. Some scholars permit under duress. Consult a Mufti for your specific situation.',
  },
  {
    id: 'halal-business',
    chapter: 'Muamalaat',
    title: 'Halal Business Practices',
    rulingType: 'info',
    points: [
      'Honesty in weights and measures — giving short measure is a major sin (Quran 83:1–3)',
      'Prohibition of price manipulation, hoarding (ihtikaar) of necessities to drive up prices',
      'Prohibition of bribery, fraud, deception, misrepresentation of goods',
      'Prohibition of monopolistic control over necessities',
      'Bay\' al-Najash (fake bidding to inflate price) is haram',
      'Contracts must be honoured — breaking agreements without valid reason is haram',
      'Business dealings with non-Muslims are valid and permissible',
    ],
  },
  {
    id: 'qard',
    chapter: 'Muamalaat',
    title: 'Loans (Qard) and Debt',
    rulingType: 'info',
    points: [
      'Lending money without interest (Qard Hasan) is a highly recommended act of charity',
      'The borrower must repay the exact amount — any increase stipulated is riba',
      'Voluntary extra payment by the borrower (without prior agreement) is permissible and praiseworthy',
      'Document loans in writing — Quran 2:282 commands writing debts',
      'Dying with unpaid debt is a serious matter — the Prophet \uFDFA refused to lead janazah for the indebted until debt was settled by others',
      'The debtor must prioritise repayment; the lender should give grace to those in difficulty (Quran 2:280)',
    ],
  },
  {
    id: 'employment',
    chapter: 'Muamalaat',
    title: 'Employment Rights in Islam',
    rulingType: 'info',
    points: [
      'Worker\'s wage must be agreed before the work begins — "Pay the worker his wages before his sweat dries." (Ibn Majah)',
      'An employee must perform the agreed work faithfully — theft and shirking from work is haram',
      'An employer must not overwork an employee beyond their capacity',
      'Taking a wage for haram work (interest banking, selling alcohol) is not permissible',
      'Business partnerships (Musharakah) are valid — profit shared by agreed ratio; loss shared by capital ratio',
    ],
  },
  {
    id: 'waqf',
    chapter: 'Muamalaat',
    title: 'Waqf (Endowment)',
    rulingType: 'info',
    points: [
      'Waqf: dedicating an asset perpetually for charitable/Islamic purposes — it cannot be sold, inherited, or given away',
      'Examples: masjid land, Islamic school buildings, wells, medical facilities',
      'The founder specifies the purpose and conditions — must be a permissible Islamic purpose',
      'Income from the waqf property is used for the specified purpose',
      'Sadaqah Jariyah — continuous charity whose reward continues after death (Waqf is a classic form)',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Halal & Haram
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'halal-food',
    chapter: 'Halal & Haram',
    title: 'Halal and Haram Food',
    rulingType: 'haram',
    points: [
      'Animals that are halal to eat: cattle (cow, buffalo), sheep, goat, camel, chicken, turkey, duck, deer, rabbit, fish (all types per Shafi\'i/Hanbali; only scaled fish per Hanafi)',
      'Seafood: Hanafi — only fish (with scales) are halal; other sea creatures (shrimp, lobster, crab, oysters) are makruh or haram. Shafi\'i/Maliki — all seafood is halal.',
      'Haram animals: pig (all its by-products), blood, carrion (dead without proper slaughter), donkey, mule, every beast of prey with fangs (lion, wolf, dog, cat), every bird of prey with talons (eagle, vulture), rats, insects (except locusts — halal)',
      'Alcohol is haram to consume, trade, or handle with the intention of selling for drinking',
    ],
  },
  {
    id: 'slaughter',
    chapter: 'Halal & Haram',
    title: 'Islamic Slaughter (Dhabh)',
    rulingType: 'fard',
    points: [
      'Conditions for halal slaughter: Muslim (or Jewish/Christian) slaughterer, Bismillah said at time of slaughter, cut the jugular vein/windpipe/oesophagus in one swift motion, animal must be alive at time of slaughter, blood must flow out',
      'Machine slaughter: halal if a Muslim says Bismillah continuously, the blade is sharp, and each animal is individually slaughtered (debate exists for large-scale poultry lines)',
      'Stunning before slaughter: permissible only if stunning does not kill the animal before slaughter (Hanafi/Maliki consensus)',
      'Meat from non-Muslim countries: check for proper halal certification from a recognised authority',
      'In Guyana: GHA, CIOG, and D.E.H.C. are recognised halal certifying bodies',
    ],
  },
  {
    id: 'haram-ingredients',
    chapter: 'Halal & Haram',
    title: 'Hidden Haram Ingredients',
    rulingType: 'haram',
    points: [
      'Gelatin: haram if from pig or non-halal animal; halal if from fish or halal-slaughtered animal. Avoid if source unspecified.',
      'Lard and shortening: from pork fat — check labels on baked goods',
      'Carmine / cochineal (E120): red colouring from beetles — haram (Hanafi); some scholars permit',
      'Rennet: halal if microbial/plant-based; potentially haram if from pig stomach lining',
      'Alcohol in flavourings and vanilla extract: Hanafi — small trace amounts in food (not intoxicating) are tolerated by some scholars; stricter position: avoid. Shafi\'i: stricter.',
      'L-Cysteine (E920): often derived from human hair or pig bristle — in commercial bread; check source',
      'Mono and diglycerides (E471): can be pork-derived — animal source must be specified as halal',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Women's Fiqh
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'hayd',
    chapter: "Women's Fiqh",
    title: 'Hayd (Menstruation) — Rules',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Minimum duration: 3 days (Hanafi); 1 day + 1 night (Shafi\'i)',
      'Maximum duration: 10 days (Hanafi); 15 days (Shafi\'i)',
      'Colours of hayd blood: black, red, brown, yellow, green — all count as hayd during the hayd days',
      'Clean (tuhr) period between two cycles: minimum 15 days per all madhabs',
      'FORBIDDEN during hayd: Salah (do not make qada — obligation lifted), fasting Ramadan (MUST make qada), sexual intercourse (haram — kaffarah if done deliberately), Tawaf, entering the masjid (Hanafi: forbidden; Shafi\'i: passing through briefly permitted), reciting Quran from memory (Hanafi: forbidden; Shafi\'i: permitted without touching mushaf), touching the physical mushaf',
      'PERMITTED during hayd: all dhikr, dua, listening to Quran, reading Quranic translations/tafseer, Islamic books, charity, istighfar, teaching, learning',
      'When hayd ends: make ghusl immediately and resume prayers. Do not delay.',
    ],
    note: 'If blood continues beyond the maximum (10 days Hanafi), it becomes istihadah — irregular bleeding. Resume salah on day 11.',
  },
  {
    id: 'nifas',
    chapter: "Women's Fiqh",
    title: 'Nifas (Post-Natal Bleeding)',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Nifas is bleeding after childbirth',
      'Maximum duration: 40 days (Hanafi/Hanbali); 60 days (Shafi\'i/Maliki)',
      'Minimum: no minimum — some women stop in days. When it stops, make ghusl and resume ibadah.',
      'Rulings: same as hayd — no Salah, no fasting, no intercourse until ghusl is made',
      'Missed Ramadan fasts during nifas: must be made up',
      'Missed Salah during nifas: NOT made up',
      'If bleeding stops before 40 days: make ghusl and resume immediately. Do not wait for 40 days.',
    ],
  },
  {
    id: 'istihadah',
    chapter: "Women's Fiqh",
    title: 'Istihadah (Irregular/Abnormal Bleeding)',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Istihadah is bleeding outside the hayd or nifas period — it is NOT hayd. It is treated as an ongoing impurity (like a nosebleed).',
      'A woman in istihadah: MUST continue Salah and fasting. She is not exempt from any ibadah.',
      'She makes a fresh wudu for each fard Salah — the bleeding invalidates wudu but not more.',
      'She washes and uses a pad/cloth to prevent spreading of impurity, makes wudu, and prays.',
      'How to identify hayd vs istihadah: use her established pattern (habit/\'adah). If bleeding exceeds her normal cycle length or exceeds 10 days (Hanafi), the extra is istihadah.',
      'A new Muslim woman or young girl without established pattern: if blood continues beyond 10 days (Hanafi), the excess is istihadah.',
    ],
    note: 'Istihadah is one of the more complex areas of women\'s fiqh. Consult a female scholar or Mufti if you are unsure whether your situation is hayd or istihadah.',
  },
  {
    id: 'women-ghusl',
    chapter: "Women's Fiqh",
    title: 'Ghusl After Hayd/Nifas — Step by Step',
    rulingType: 'fard',
    sistersRelevant: true,
    points: [
      'Make intention (niyyah) for ghusl from hayd/nifas',
      'Remove any barrier from the skin: nail polish, acrylic nails, wax, dried paint, thick cream',
      'Wash both hands first',
      'Wash away any impurity (blood) from the body',
      'Perform full wudu (rinse mouth, sniff water into nose, wash face, arms, wipe head, wash feet)',
      'Pour water over entire body 3 times — start with right side, then left',
      'Ensure every part of the body is wet — hairline, behind ears, under arms, between fingers and toes, navel, backs of knees',
      'For women with thick or braided hair: Hanafi — water must reach the roots of the hair, but unbraiding is NOT required if water can reach roots. If in doubt, unbraid.',
      'After ghusl: put on clean clothes and resume Salah',
    ],
  },
  {
    id: 'women-quran',
    chapter: "Women's Fiqh",
    title: 'Women and the Quran During Hayd',
    rulingType: 'info',
    sistersRelevant: true,
    points: [
      'Touching the physical Mushaf (Quran): FORBIDDEN during hayd — by consensus of all 4 madhabs',
      'Reciting Quran from memory (without a purpose other than recitation): Hanafi — forbidden; Shafi\'i/Maliki — permitted without touching mushaf',
      'Reading Quran from phone/screen: Hanafi scholars differ — many permit since a phone is not a mushaf; check with a local scholar',
      'Reciting for the purpose of dua (e.g., Ayat al-Kursi for protection, Surah Fatiha as dua): Hanafi — permitted if intended as dua, not recitation',
      'Listening to Quran recitation: FULLY PERMITTED — all madhabs',
      'Reading translation/tafseer: PERMITTED — all madhabs',
    ],
    note: 'The safest position (Hanafi): refrain from reciting Quran from memory during hayd. Use the time for dhikr, dua, and listening.',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Udhiyyah (Sacrifice / Qurbani)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'qurbani-obligation',
    chapter: 'Udhiyyah',
    title: 'Udhiyyah — Ruling and Conditions',
    rulingType: 'wajib',
    points: [
      'Wajib (Hanafi) on every adult Muslim who possesses nisab on 10–12 Dhul Hijjah',
      'Sunnah Mu\'akkadah per Shafi\'i/Maliki/Hanbali',
      'Performed from after Eid prayer on 10 Dhul Hijjah until sunset of 12 Dhul Hijjah (3 days)',
      'One sheep/goat per person. One cow/buffalo serves 7 people. One camel serves 7 people.',
      'Animals must be: goat/sheep (1+ year old), cow/buffalo (2+ years), camel (5+ years)',
      'Must be free of major defects: not blind, not severely lame, not missing a third or more of ear/horn',
      'The person performing Udhiyyah should not cut their hair or nails from 1 Dhul Hijjah until after slaughter',
    ],
  },
  {
    id: 'qurbani-distribution',
    chapter: 'Udhiyyah',
    title: 'Distribution of Qurbani Meat',
    rulingType: 'info',
    points: [
      'Recommended: divide into 3 equal parts — one third for self and family, one third for relatives and friends, one third for the poor',
      'Obligatory: at least some must be given to the poor',
      'The entire animal may be given away — keeping all for oneself is disliked',
      'May not sell the meat, hide, or any part of the animal for personal benefit',
      'The butcher may not be paid from the animal itself — pay separately in cash',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Funeral Rites (Janazah)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'janazah-ghusl',
    chapter: 'Funeral',
    title: 'Ghusl of the Deceased',
    rulingType: 'fard',
    points: [
      'Fard kifayah (communal obligation) — if some perform it, obligation is lifted from all',
      'Performed by: same gender; husband may wash wife; wife may wash husband',
      'Method: niyyah, wash private areas, make wudu, wash entire body 3 times (right side first)',
      'Use soap or lotus leaves (sidr) if available; camphor in final wash',
      'Women: hair washed and braided into 3 plaits, placed behind the back',
      'Martyrs (killed in battle by disbelievers): do NOT wash — buried in their clothes as they fell',
    ],
  },
  {
    id: 'janazah-kafan',
    chapter: 'Funeral',
    title: 'Kafan (Shroud)',
    rulingType: 'fard',
    points: [
      'Men: 3 white sheets (Izar, Lifafah, Qamees). No collar, no sleeves — just cloths.',
      'Women: 5 pieces — Izar (lower wrap), Lifafah (outer), Qamees (shirt), Khimar (head cover), Khumar (chest piece to tie hair/chest)',
      'White is sunnah. Any clean fabric permitted.',
      'Must cover entire body. Perfume (musk/camphor) applied to joints and forehead.',
    ],
  },
  {
    id: 'janazah-salah',
    chapter: 'Funeral',
    title: 'Janazah Salah',
    rulingType: 'fard',
    points: [
      '4 Takbeeraat (Allahu Akbar said 4 times — no ruku, no sujud)',
      'After 1st takbeer: recite Thana (Subhanakallahumma...) quietly',
      'After 2nd takbeer: recite Durood Ibrahim (as in Tashahhud)',
      'After 3rd takbeer: recite the Janazah dua (Allahummaghfir lihayyina wa mayyitina...)',
      'After 4th takbeer: Tasleem to right only (some madhabs: both sides)',
      'Fard kifayah — community obligation; valid with minimum 1 imam + 1 follower',
    ],
  },
  {
    id: 'janazah-burial',
    chapter: 'Funeral',
    title: 'Burial Rulings',
    rulingType: 'fard',
    points: [
      'Burial should be done quickly — do not delay without necessity',
      'Muslims must be buried in Muslim cemeteries — not cremated (cremation is haram)',
      'Laid on the right side facing the Qibla',
      'Grave should be deep enough to contain smell and protect from animals',
      'Grave markings: a simple raised mound (the height of a hand span) is sunnah — elaborate monuments, tombstone writing is disliked (Hanafi: disliked if for recognition; permitted for ID purposes)',
      'Recite Surah Yaseen while carrying the bier and at graveside (recommended)',
      'Taziyah (condolence) to the family is sunnah for 3 days',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CHAPTER: Common Questions (Q&A)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'faq-prayer-english',
    chapter: 'Q&A',
    title: 'Can I pray in English?',
    rulingType: 'info',
    points: [
      'The fard recitation of al-Fatihah and all dhikr within Salah must be in Arabic — consensus of all madhabs',
      'If a new Muslim genuinely cannot learn Arabic yet (Hanafi): may recite the meaning temporarily, but must learn Arabic as soon as possible',
      'Personal dua (supplication) in sujud and after Salah: any language is valid',
      'Niyyah (intention) is a matter of the heart — may be in any language',
    ],
  },
  {
    id: 'faq-sitting',
    chapter: 'Q&A',
    title: 'Can I pray sitting if I cannot stand?',
    rulingType: 'info',
    points: [
      'Yes — standing is waived if it causes genuine harm or is impossible',
      'Pray as much of the salah correctly as possible; indicate ruku and sujud with head movements if unable (sujud deeper than ruku)',
      'If unable to sit: pray lying on the right side facing Qibla',
      'Full reward applies — Allah does not burden a soul beyond its capacity',
      '"Pray standing; if unable, sitting; if unable, on your side." (Bukhari)',
    ],
  },
  {
    id: 'faq-combining',
    chapter: 'Q&A',
    title: 'Can I combine prayers?',
    rulingType: 'info',
    points: [
      'Combining prayers (Jam\'): Hanafi — NOT generally permitted except during Hajj (Arafah and Muzdalifah only)',
      'Shafi\'i/Maliki/Hanbali: permitted during travel, rain, illness (specific conditions apply)',
      'Qasr (shortening 4-rakat prayers to 2): permitted during travel of 77+ km by all madhabs',
      'Hanafi position on combining is the stricter position followed in Guyana',
    ],
  },
  {
    id: 'faq-makeup-years',
    chapter: 'Q&A',
    title: 'I have years of missed prayers — what do I do?',
    rulingType: 'fard',
    points: [
      'All missed fard prayers are a debt to Allah — they must be made up',
      'Begin immediately — do not delay. Even praying 1 extra qada per day is a start.',
      'The most practical method: after every fard salah, pray the same fard salah as qada for the oldest debt',
      'You do NOT need to know the exact number — estimate generously and continue making it up',
      'Allah is the Most Merciful — sincere repentance + consistent effort is the path',
      'Dying with missed prayers is a serious concern — make it a priority before death',
    ],
  },
  {
    id: 'faq-witr-optional',
    chapter: 'Q&A',
    title: 'Is Witr optional?',
    rulingType: 'wajib',
    points: [
      'Hanafi: Witr is Wajib — between Fard and Sunnah in level of obligation. Never call it optional.',
      'Shafi\'i/Maliki/Hanbali: Sunnah Mu\'akkadah — highly emphasised, almost obligatory in practice',
      'The Prophet \uFDFA never once left Witr — travelling or at home. This alone tells you its importance.',
      '"Make Witr the last of your night prayers." (Bukhari, Muslim)',
    ],
  },
  {
    id: 'faq-beard',
    chapter: 'Q&A',
    title: 'Ruling on growing the beard',
    rulingType: 'wajib',
    points: [
      'Growing the beard: Wajib (Hanafi/Maliki/Hanbali); Sunnah Mu\'akkadah (Shafi\'i)',
      'Minimum length: one fist-length — shaving or trimming below this is haram (Hanafi)',
      'Trimming to exactly one fist-length is permitted; keeping it longer is mustahabb',
      '"Trim the moustache and let the beard grow, be different from the polytheists." (Bukhari, Muslim)',
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

function FiqhHubContent() {
  const searchParams = useSearchParams()

  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  const [sistersMode, setSistersMode] = useState(false)
  const [openTopic, setOpenTopic] = useState<string | null>(null)

  // Read URL params on mount
  useEffect(() => {
    const sisters = searchParams.get('sisters')
    const chapter = searchParams.get('chapter')
    if (sisters === 'true') setSistersMode(true)
    if (chapter) {
      const match = CHAPTER_ORDER.find(
        c => c.toLowerCase() === chapter.toLowerCase()
      )
      if (match) setActiveChapter(match)
    }
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = TOPICS
    if (activeChapter) list = list.filter(t => t.chapter === activeChapter)
    if (sistersMode) list = list.filter(t => t.sistersRelevant)
    return list
  }, [activeChapter, sistersMode])

  // Group by chapter (preserving order)
  const grouped = useMemo(() => {
    const map: Record<string, FiqhTopic[]> = {}
    for (const t of filtered) {
      if (!map[t.chapter]) map[t.chapter] = []
      map[t.chapter].push(t)
    }
    return CHAPTER_ORDER
      .filter(ch => map[ch])
      .map(ch => ({ chapter: ch, topics: map[ch] }))
  }, [filtered])

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Scale}
        title="Fiqh Guide"
        subtitle="Islamic Law & Jurisprudence"
        gradient="from-violet-950 to-purple-900"
        showBack
      />

      {/* ── Sticky filter bar ──────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0a0b14]/95 backdrop-blur border-b border-gray-800/50 px-4 py-2.5 space-y-2">
        {/* Row 1: Chapter pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveChapter(null)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              !activeChapter ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-500'
            }`}
          >
            All
          </button>
          {CHAPTER_ORDER.map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChapter(activeChapter === ch ? null : ch)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeChapter === ch ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Row 2: Sisters filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSistersMode(!sistersMode)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              sistersMode
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-gray-800 text-gray-500'
            }`}
          >
            🌸 Sisters Filter
          </button>
          {sistersMode && (
            <span className="text-[10px] text-rose-400/60">
              Showing sisters-relevant topics only
            </span>
          )}
        </div>
      </div>

      {/* ── Topics ─────────────────────────────────────── */}
      <div className="px-4 pt-4 space-y-1">
        {grouped.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-800 py-12 text-center">
            <p className="text-3xl mb-2">📖</p>
            <p className="text-sm text-gray-500">No topics match the current filters</p>
          </div>
        )}

        {grouped.map(({ chapter, topics }) => (
          <div key={chapter}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600 mt-4 mb-2">
              {chapter}
            </h2>

            <div className="space-y-2 animate-stagger">
              {topics.map(topic => {
                const isOpen = openTopic === topic.id
                return (
                  <div
                    key={topic.id}
                    className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden"
                  >
                    {/* Header */}
                    <button
                      onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                      className="flex w-full items-center gap-3 p-4 text-left active:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-[#f9fafb]">{topic.title}</h3>
                          {topic.rulingType && (
                            <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${BADGE[topic.rulingType]}`}>
                              {topic.rulingType}
                            </span>
                          )}
                          {topic.sistersRelevant && (
                            <span className="shrink-0 text-[10px] text-rose-400/60">🌸</span>
                          )}
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-600" />
                      )}
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3">
                        <ul className="space-y-2">
                          {topic.points.map((point, i) => (
                            <li key={i} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>

                        {topic.table && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-gray-300">
                              <thead>
                                <tr className="border-b border-gray-800">
                                  <th className="py-2 pr-4 text-left text-gray-500 font-semibold">{topic.table.col1}</th>
                                  <th className="py-2 text-left text-gray-500 font-semibold">{topic.table.col2}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {topic.table.rows.map(([c1, c2], i) => (
                                  <tr key={i} className="border-b border-gray-800/50">
                                    <td className="py-1.5 pr-4">{c1}</td>
                                    <td className="py-1.5">{c2}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {topic.note && (
                          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
                            <p className="text-[11px] leading-relaxed text-amber-400">
                              ✦ {topic.note}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Disclaimer ─────────────────────────────────── */}
      <div className="px-4 pt-6 pb-4">
        <p className="text-[10px] leading-relaxed text-gray-600 text-center">
          This guide presents the Hanafi position as primary (predominant madhab in Guyana) with notes
          on other schools. For specific personal rulings, consult a qualified scholar (Mufti/Aalim).
        </p>
      </div>

      <BottomNav />
    </div>
  )
}

export default function FiqhHubPage() {
  return (
    <Suspense>
      <FiqhHubContent />
    </Suspense>
  )
}
