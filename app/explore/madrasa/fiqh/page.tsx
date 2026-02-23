"use client"

import { useState } from "react"
import { Scale, ChevronDown, ChevronUp } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { BottomNav } from "@/components/bottom-nav"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FiqhTopic {
  id: string
  chapter: string
  title: string
  rulingType?: "fard" | "wajib" | "sunnah" | "haram" | "makruh" | "mubah" | "info"
  madhab?: string
  points: string[]
  note?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOPICS: FiqhTopic[] = [
  // ── Chapter: Tahara ─────────────────────────────────────────────────────────
  {
    id: "wudu-breakers",
    chapter: "Tahara",
    title: "What Breaks Wudu",
    rulingType: "fard",
    madhab: "All madhabs (notes where differs)",
    points: [
      "Any discharge from the private parts — urine, stool, wind/gas",
      "Flowing blood or pus from a wound (Hanafi: breaks wudu; Shafi'i/Hanbali: does not)",
      "Vomiting a mouthful (Hanafi: breaks wudu; Shafi'i: does not)",
      "Deep sleep lying down or leaning — if body goes limp",
      "Loss of consciousness (fainting, anaesthesia, intoxication)",
      "Laughing aloud during Salah (Hanafi: breaks wudu AND Salah; Shafi'i/Maliki: breaks Salah only)",
      "Touching private parts directly (Shafi'i/Hanbali: breaks wudu; Hanafi: does not)",
      "Skin contact between non-mahram man and woman (Shafi'i: breaks wudu; Hanafi/Maliki: does not unless with desire)",
    ],
    note: "Hanafi is the predominant madhab in Guyana. When in doubt, renew wudu.",
  },
  {
    id: "ghusl-required",
    chapter: "Tahara",
    title: "When Ghusl (Major Bath) is Required",
    rulingType: "fard",
    madhab: "All madhabs",
    points: [
      "Ejaculation (even without intercourse)",
      "Sexual intercourse (even without ejaculation)",
      "End of menstruation (hayd)",
      "End of post-natal bleeding (nifas)",
      "Upon becoming Muslim (Hanafi: wajib; others: recommended)",
      "Death — ghusl performed by others (fard kifayah on community)",
    ],
  },
  {
    id: "tayammum",
    chapter: "Tahara",
    title: "Tayammum (Dry Ablution)",
    rulingType: "fard",
    madhab: "All madhabs",
    points: [
      "Permitted when water unavailable or its use would cause harm",
      "Use pure earth, sand, stone, or clay — any natural ground surface",
      "Intention + strike hands on earth once, wipe face + hands to wrists (Hanafi)",
      "Invalidated when water becomes available or wudu would normally be broken",
      "One tayammum per fard prayer — renew for each fard (Hanafi)",
    ],
  },
  {
    id: "najaasah",
    chapter: "Tahara",
    title: "Najaasah (Impurities)",
    rulingType: "info",
    madhab: "Hanafi (primary)",
    points: [
      "Heavy (ghaleeza): dog saliva, pig and by-products. Must wash 3x + scrub.",
      "Medium (mutawassita): human urine, stool, blood (flowing), wine/alcohol, vomit. Wash until trace removed.",
      "Light (khafeefa — Hanafi only): urine of halal meat animals. Excuse if less than a quarter of garment.",
      "Place, body, and clothing must all be free of impurity for Salah",
      "A small drop of blood (smaller than inner palm) is excused for Salah (Hanafi)",
    ],
    note: "Other madhabs do not distinguish light impurity — all najaasah treated equally.",
  },

  // ── Chapter: Salah ──────────────────────────────────────────────────────────
  {
    id: "salah-conditions",
    chapter: "Salah",
    title: "Conditions for Valid Salah (Shurut)",
    rulingType: "fard",
    madhab: "All madhabs",
    points: [
      "Muslim, sane, and having reached puberty (mukallaf)",
      "Purity from hadath — valid wudu or ghusl where required",
      "Purity of body, clothing, and place from najaasah",
      "Awrah covered — men: navel to knee; women: entire body except face and hands",
      "Facing the Qibla — permissible to face general direction if exact unknown",
      "Correct prayer time — salah outside its time is invalid (must be qada)",
    ],
  },
  {
    id: "salah-pillars",
    chapter: "Salah",
    title: "Pillars (Faraa'id) of Salah",
    rulingType: "fard",
    madhab: "General consensus",
    points: [
      "Takbeer al-Ihram — opening Allahu Akbar",
      "Qiyam — standing (obligatory for fard prayer if physically able)",
      "Recitation of Surah al-Fatihah in every rakah",
      "Ruku — bowing",
      "I'tidal — rising fully upright from ruku",
      "Sujud — prostration, twice per rakah",
      "Julus — sitting between the two prostrations",
      "Final Tashahhud and Tasleem to conclude",
    ],
    note: "Omitting a pillar invalidates the entire salah — cannot be compensated by Sujud al-Sahw.",
  },
  {
    id: "salah-wajibat",
    chapter: "Salah",
    title: "Wajibat of Salah (Hanafi)",
    rulingType: "wajib",
    madhab: "Hanafi",
    points: [
      "Reciting al-Fatihah — obligatory in first 2 rakat of fard, all rakat of nafl",
      "Adding a Surah or 3 verses after al-Fatihah — in first 2 rakat of fard",
      "Minimum 3x tasbih in ruku and sujud (Subhana Rabbiyal Adheem/A'la)",
      "Qawmah — fully standing upright between ruku and sujud",
      "Jalsah — sitting between the two sujud",
      "First Tashahhud (qa'da al-oola) in 3 and 4 rakah prayers",
      "Qunoot in Witr — Hanafi: Wajib; other madhabs: Sunnah",
      "Tasleem to both directions (Hanafi: both wajib; Shafi'i: right only fard)",
    ],
    note: "Omitting a wajib act intentionally invalidates salah. If forgetful, Sujud al-Sahw is required.",
  },
  {
    id: "salah-invalidators",
    chapter: "Salah",
    title: "What Invalidates Salah",
    rulingType: "haram",
    madhab: "All madhabs",
    points: [
      "Speaking intentionally (even one word outside prayer dhikr)",
      "Laughing aloud — even one letter audible to yourself",
      "Eating or drinking anything, even a tiny amount",
      "Turning the chest away from Qibla without necessity",
      "Excessive continuous movement (3+ actions in a row) without need",
      "Breaking wudu — exit salah, re-make wudu, restart",
      "Uncovering awrah unless immediately corrected",
    ],
  },
  {
    id: "qada-prayers",
    chapter: "Salah",
    title: "Makeup Prayers (Qada)",
    rulingType: "fard",
    madhab: "All madhabs",
    points: [
      "Any missed fard prayer must be made up as soon as possible",
      "Making up missed prayers is obligatory — does not expire",
      "If many prayers owed, permissible to pray current first then qada",
      "Jumu'ah cannot be made up — pray 4 rakat Dhuhr as qada instead",
      "Nafl prayers not made up unless one was started and broken",
    ],
    note: "Deliberately missing salah without valid excuse is a major sin. Repent and make it up immediately.",
  },
  {
    id: "witr",
    chapter: "Salah",
    title: "Witr Prayer",
    rulingType: "wajib",
    madhab: "Hanafi: Wajib | Shafi'i/Maliki/Hanbali: Sunnah Mu'akkadah",
    points: [
      "3 rakat — prayed after Isha, before Fajr",
      "Hanafi: 2 rakat with tashahhud, stand for 3rd, add surah, raise hands and recite Dua al-Qunoot before ruku",
      "Shafi'i: 1 rakah only, or 3 with one tasleem",
      'Dua al-Qunoot: "Allahumma ihdina feeman hadayt..."',
      "If missed, Hanafi: must make qada; other madhabs: make it up as even number",
      "Do not sleep without praying Witr — make it last prayer of the night",
    ],
    note: "Hanafi considers Witr Wajib — between Fard and Sunnah in obligation. Never call it optional.",
  },

  // ── Chapter: Sawm ──────────────────────────────────────────────────────────
  {
    id: "fasting-breaks-kaffarah",
    chapter: "Sawm",
    title: "What Breaks Fast: Qada + Kaffarah Required",
    rulingType: "haram",
    madhab: "All madhabs",
    points: [
      "Intentional eating or drinking while knowing it is Ramadan and the fast is in progress",
      "Intentional sexual intercourse during the fast",
      "Kaffarah: free a slave, OR fast 60 consecutive days, OR feed 60 poor people — in that order",
      "Both Qada AND Kaffarah are required",
    ],
    note: "Applies to Ramadan fard fast only. Voluntary fasts broken intentionally require Qada only.",
  },
  {
    id: "fasting-breaks-qada",
    chapter: "Sawm",
    title: "What Breaks Fast: Qada Only",
    rulingType: "info",
    madhab: "Hanafi (primary)",
    points: [
      "Accidentally eating/drinking thinking it is still night — Qada only (Hanafi); Shafi'i: fast not broken at all",
      "Eating due to genuine necessity (severe illness)",
      "Intentional vomiting of a mouthful",
      "Water entering throat while swimming or bathing",
      "Taking medication orally or as suppository",
      "Eating after Suhoor thinking Fajr had not entered when it had",
    ],
  },
  {
    id: "fasting-does-not-break",
    chapter: "Sawm",
    title: "What Does NOT Break the Fast",
    rulingType: "info",
    madhab: "Consensus with notes",
    points: [
      "Forgetfully eating or drinking — fast is valid; Hanafi: spit it out when remembered",
      "Non-nutritional injections (insulin, anaesthetic) — majority: does not break fast",
      "Eye drops and ear drops — Hanafi: breaks if reaches throat; Shafi'i: does not",
      "Tasting food with tip of tongue without swallowing",
      "Brushing teeth or miswak — permissible; avoid swallowing toothpaste",
      "Kissing spouse without intercourse — valid fast; disliked for those with low self-control",
      "Swimming — permissible; be careful water does not enter throat",
    ],
  },
  {
    id: "fasting-exemptions",
    chapter: "Sawm",
    title: "Who is Exempt from Fasting",
    rulingType: "info",
    madhab: "All madhabs",
    points: [
      "Traveller — may break fast and make up later (distance 77+ km)",
      "Ill person — if fasting causes genuine harm, break and make up",
      "Pregnant or nursing woman — if fasting harms self or child; Qada required; some scholars add Fidya",
      "Menstruating woman (hayd) or post-natal bleeding (nifas) — fasting FORBIDDEN; Qada required",
      "Elderly unable to fast without severe hardship — Fidya only (feed one poor person per missed fast)",
    ],
    note: "Fidya 2026: GYD $60,000 per missed fast (D.E.H.C.). Sadaqatul Fitr: GYD $2,000 per person.",
  },

  // ── Chapter: Nikah ─────────────────────────────────────────────────────────
  {
    id: "nikah-conditions",
    chapter: "Nikah",
    title: "Conditions for a Valid Nikah",
    rulingType: "fard",
    madhab: "All madhabs (with notes)",
    points: [
      "Offer (Ijab) and acceptance (Qabool) — in one sitting",
      "Two Muslim male witnesses of good character (Hanafi allows female witnesses; Shafi'i requires 2 males)",
      "Wali (guardian) for the bride — obligatory per Shafi'i/Hanbali/Maliki; Hanafi: adult woman can contract own but Wali still recommended",
      "Mahr (dowry) — must be specified; even a small amount is valid",
      "Free and willing consent of both parties — forced marriage is invalid",
    ],
    note: "Islamic nikah without civil registration has no legal standing in Guyana. Register with the Registrar-General.",
  },
  {
    id: "nikah-prohibited",
    chapter: "Nikah",
    title: "Prohibited Marriages",
    rulingType: "haram",
    madhab: "All madhabs",
    points: [
      "Mother, grandmother, daughter, granddaughter (permanently prohibited)",
      "Sister (full, half, or foster), aunt, niece",
      "Foster mother and foster sister",
      "Wife's mother and wife's daughter (from consummated marriage)",
      "Father's wife and son's wife",
      "Being simultaneously married to two sisters or a woman and her aunt/niece",
      "Non-Muslim men cannot marry Muslim women. Muslim men may marry chaste Christian or Jewish women only.",
      "A woman must complete her iddah before remarrying",
    ],
  },

  // ── Chapter: Common Questions ──────────────────────────────────────────────
  {
    id: "faq-salah-english",
    chapter: "Common Questions",
    title: "Can I pray in English?",
    rulingType: "info",
    points: [
      "No — fard recitation of al-Fatihah and dhikr within Salah must be in Arabic",
      "If a new Muslim truly cannot learn Arabic yet, Hanafi: may recite the meaning temporarily while learning",
      "Du'a (personal supplication) in sujud and after salah may be in any language",
      "Niyyah (intention) may be in any language — it is a matter of the heart",
    ],
  },
  {
    id: "faq-sitting-salah",
    chapter: "Common Questions",
    title: "Can I pray sitting if I cannot stand?",
    rulingType: "info",
    points: [
      "Yes — if standing causes genuine harm or is impossible, sitting is valid with full reward",
      "Pray as much of the salah in correct posture as possible",
      "If unable to sit, pray lying on right side facing Qibla",
      "If unable to bow/prostrate, indicate positions with head movements (sujud deeper than ruku)",
      '"Pray standing; if unable, sitting; if unable, on your side." (Prophet \uFDFA, Bukhari)',
    ],
  },
  {
    id: "faq-women-hayd",
    chapter: "Common Questions",
    title: "Salah and fasting during menstruation (hayd)",
    rulingType: "info",
    points: [
      "Salah is FORBIDDEN during hayd and nifas",
      "Missed salah during hayd is NOT made up — obligation is completely lifted",
      "Missed Ramadan fasts MUST be made up after hayd ends before the next Ramadan",
      "Reciting Quran from memory — Hanafi: impermissible; Shafi'i: permissible without touching mushaf",
      "Touching the Quran physically is impermissible during hayd by all madhabs",
      "Du'a, dhikr, and listening to Quran are all permitted during hayd",
    ],
  },
  {
    id: "faq-witr-optional",
    chapter: "Common Questions",
    title: "Is Witr optional?",
    rulingType: "wajib",
    points: [
      "Hanafi: Witr is Wajib — between Fard and Sunnah in obligation",
      "Shafi'i/Maliki/Hanbali: Sunnah Mu'akkadah (highly emphasised sunnah)",
      "All scholars agree: never neglect Witr",
      "The Prophet \uFDFA never left Witr whether travelling or at home",
      '"Make Witr the last of your night prayers." (Bukhari & Muslim)',
    ],
    note: "In Guyana (predominantly Hanafi), Witr should be treated as obligatory.",
  },
  {
    id: "faq-beard",
    chapter: "Common Questions",
    title: "Ruling on the beard",
    rulingType: "wajib",
    madhab: "Hanafi/Maliki/Hanbali: Wajib | Shafi'i: Sunnah Mu'akkadah",
    points: [
      "Growing the beard is Wajib per Hanafi, Maliki, Hanbali schools",
      "Minimum length (Hanafi): one fist-length — shaving below this is impermissible",
      "Trimming to fist-length is permissible; shaving shorter is haram (Hanafi)",
      '"Trim the moustache and let the beard grow." (Bukhari/Muslim)',
      "Shaping/grooming within bounds is permissible",
    ],
  },
]

const CHAPTERS = [...new Set(TOPICS.map((t) => t.chapter))]

const RULING_BADGE: Record<string, string> = {
  fard: "bg-red-500/15 text-red-400 border border-red-500/20",
  wajib: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  sunnah: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  haram: "bg-rose-700/15 text-rose-400 border border-rose-700/20",
  makruh: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  mubah: "bg-gray-500/15 text-gray-400 border border-gray-500/20",
  info: "bg-gray-700/30 text-gray-400 border border-gray-700/20",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FiqhPage() {
  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  const [openTopic, setOpenTopic] = useState<string | null>(null)

  const filtered = activeChapter ? TOPICS.filter((t) => t.chapter === activeChapter) : TOPICS

  // Group filtered topics by chapter
  const grouped = filtered.reduce<Record<string, FiqhTopic[]>>((acc, t) => {
    if (!acc[t.chapter]) acc[t.chapter] = []
    acc[t.chapter].push(t)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Scale}
        title="Fiqh Guide"
        subtitle="Islamic Rulings & Jurisprudence"
        gradient="from-violet-900 to-purple-900"
        showBack
      />

      {/* ── Chapter filter pills ─────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0a0b14]/95 backdrop-blur border-b border-gray-800/50 px-4 py-2.5">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveChapter(null)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              !activeChapter ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-500"
            }`}
          >
            All
          </button>
          {CHAPTERS.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChapter(activeChapter === ch ? null : ch)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeChapter === ch ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-500"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* ── Topics ───────────────────────────────────── */}
      <div className="px-4 pt-4 space-y-1">
        {Object.entries(grouped).map(([chapter, topics]) => (
          <div key={chapter}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600 mt-4 mb-2">
              {chapter}
            </h2>

            <div className="space-y-2">
              {topics.map((topic) => {
                const isOpen = openTopic === topic.id
                return (
                  <div
                    key={topic.id}
                    className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden"
                  >
                    {/* Header — always visible */}
                    <button
                      onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                      className="flex w-full items-center gap-3 p-4 text-left active:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-[#f9fafb]">{topic.title}</h3>
                          {topic.rulingType && (
                            <span
                              className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${RULING_BADGE[topic.rulingType]}`}
                            >
                              {topic.rulingType}
                            </span>
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

                        {topic.note && (
                          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
                            <p className="text-[11px] leading-relaxed text-amber-400">
                              ✦ {topic.note}
                            </p>
                          </div>
                        )}

                        {topic.madhab && (
                          <p className="text-[10px] text-gray-600">{topic.madhab}</p>
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

      {/* ── Disclaimer ───────────────────────────────── */}
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
