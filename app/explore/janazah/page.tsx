'use client'

import { useState } from 'react'
import { Heart, ChevronDown, ChevronUp, Phone } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface JanazahSection {
  id: string
  title: string
  icon: string
  content: React.ReactNode
}

const SECTIONS: JanazahSection[] = [
  {
    id: 'ihtidar',
    title: '1. When Death Approaches (Ihtidar)',
    icon: '🤲',
    content: (
      <ul className="space-y-2">
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Lay the dying person facing Qibla (right side, face toward Makkah)</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Encourage them to say the Shahada: <span className="font-arabic text-teal-300" dir="rtl">لا إله إلا الله</span> (La ilaha illallah)</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Recite Surah Yasin near the dying person</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Close the eyes after death and make dua:</span>
        </li>
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 space-y-1.5 ml-4">
          <p className="font-arabic text-sm text-teal-300 leading-loose" dir="rtl">
            اللَّهُمَّ اغْفِرْ لَهُ وَارْفَعْ دَرَجَتَهُ فِي الْمَهْدِيِّينَ
          </p>
          <p className="text-[11px] text-teal-400/70 italic">
            Allahummaghfir lahu warfa&apos; darajatahu fil mahdiyyina...
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            O Allah, forgive him and raise his rank among the rightly guided...
          </p>
        </div>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Cover the body with a clean cloth</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'ghusl',
    title: '2. Ghusl (Washing the Body)',
    icon: '💧',
    content: (
      <div className="space-y-3">
        <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-2.5 py-1.5 inline-block">
          <p className="text-[10px] font-bold text-violet-400">Fard Kifayah</p>
          <p className="text-[10px] text-muted-foreground">Community obligation — if some fulfil it, the rest are absolved</p>
        </div>
        <ul className="space-y-2">
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Performed by Muslims of the same gender (or spouse for each other)</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">Minimum:</strong> wash the entire body once</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">Sunnah:</strong> wash 3, 5, or 7 times (odd number)</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Use soap/sidr (lotus leaves) in first washing, camphor in last</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Wudu is performed first on the body</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Those performing ghusl should be in a state of wudu</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">Women:</strong> hair braided into 3 braids, placed behind the back</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Private parts covered throughout</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">Hanafi:</strong> ghusl is obligatory; martyrs (shaheed) are NOT washed</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Say &quot;Allahu Akbar&quot; upon completing ghusl</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'kafan',
    title: '3. Kafan (Shrouding)',
    icon: '🤍',
    content: (
      <ul className="space-y-2">
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Men — 3 white sheets:</strong> Lifafah (outer sheet), Izar (lower body), Qamis (upper body)</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Women — 5 pieces:</strong> Lifafah, Izar, Qamis, Khimar (head covering), Khirqa (chest wrap)</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Should be simple and white, no silk</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Sunnah:</strong> scent the kafan with incense (oud/bakhoor)</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Make dua: <span className="text-teal-400 italic">&quot;Bismillah wa &apos;ala sunnati Rasulillah&quot;</span></span>
        </li>
      </ul>
    ),
  },
  {
    id: 'salah',
    title: '4. Salat al-Janazah (Funeral Prayer)',
    icon: '🕌',
    content: (
      <div className="space-y-3">
        <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-2.5 py-1.5 inline-block">
          <p className="text-[10px] font-bold text-violet-400">Fard Kifayah</p>
          <p className="text-[10px] text-muted-foreground">Community obligation</p>
        </div>
        <ul className="space-y-2">
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">4 Takbeers</strong> (Allahu Akbar) — no ruku or sujood</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">After 1st Takbeer:</strong> recite Surah Al-Fatihah</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">After 2nd Takbeer:</strong> recite Salawat (Durood Ibrahim — the one recited in tashahud)</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">After 3rd Takbeer:</strong> dua for the deceased (see next section)</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">After 4th Takbeer:</strong> make Salaam on both sides</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">Imam stands:</strong> at chest level for men, at hip level for women (Hanafi position)</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>If you missed Takbeers, join and complete after the imam&apos;s salaam</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Valid for: any Muslim who has died, even a sinful Muslim; NOT valid for a non-Muslim</span>
          </li>
        </ul>
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-teal-400 font-semibold">Hadith:</span> &quot;Pray over everyone who says La ilaha illallah&quot;
          </p>
          <p className="text-[10px] text-teal-500/60 font-semibold mt-1">Abu Dawud</p>
        </div>
      </div>
    ),
  },
  {
    id: 'dua-janazah',
    title: '5. Dua During Salat al-Janazah (3rd Takbeer)',
    icon: '📖',
    content: (
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">For Adults</p>
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 space-y-2">
          <p className="font-arabic text-sm text-teal-300 leading-loose" dir="rtl">
            اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ وَنَقِّهِ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ
          </p>
          <p className="text-[11px] text-teal-400/70 italic">
            Allahummaghfir lahu warhamhu wa &apos;afihi wa&apos;fu &apos;anhu, wa akrim nuzulahu, wa wassi&apos; madkhalahu, waghsilhu bil-ma&apos;i wath-thalji wal-baradi, wa naqqihi minal-khataya kama yunaqqa ath-thawbul-abyadu minad-danas.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            O Allah, forgive him, have mercy on him, grant him well-being, pardon him, make his hospitality generous, widen his entrance (grave), wash him with water, snow and hail, and purify him of sins as a white garment is purified of filth.
          </p>
          <p className="text-[10px] text-teal-500/60 font-semibold">Muslim 963</p>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">For a Child</p>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            O Allah, make him a forerunner for his parents, a stored treasure, an intercessor whose intercession is accepted. O Allah, make him a source of weight in their scales and increase through him their rewards. O Allah, place him among the righteous believers, under the care of Ibrahim (AS), and protect him by Your mercy from the torment of the Hellfire.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'burial',
    title: '6. Burial',
    icon: '⚱️',
    content: (
      <ul className="space-y-2">
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Bury as soon as possible</strong> — do not delay unnecessarily</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Grave depth:</strong> sufficient to prevent smell and animals</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Lahd</strong> (niche on the Qibla side) preferred; <strong className="text-foreground">Shaq</strong> (straight trench) allowed in necessity</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Body placed on right side, facing Qibla</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Sunnah:</strong> 3 handfuls of dirt thrown by each person</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Recite: <span className="text-teal-400 italic">&quot;Minha khalaqnakum wa fiha nu&apos;idukum wa minha nukhrijukum taratan ukhra&quot;</span></span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>(From it We created you, to it We shall return you, and from it We shall bring you out again — Quran 20:55)</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span>Place a simple marker — no elaborate tombstone (Sunnah is simplicity)</span>
        </li>
        <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
          <span><strong className="text-foreground">Not permissible:</strong> elaborate tombstones, building structures over graves, planting flowers (Hanafi: makruh; other madhhabs: prohibited)</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'after-burial',
    title: '7. After Burial',
    icon: '🌿',
    content: (
      <div className="space-y-3">
        <ul className="space-y-2">
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Recite Surah Al-Fatiha</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Make dua for the deceased</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">Talqin</strong> (Hanafi: permissible) — remind the deceased of their testimony of faith while at graveside</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span>Express condolences (<strong className="text-foreground">Ta&apos;ziyah</strong>) to the family: 3 days maximum</span>
          </li>
          <li className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
            <span><strong className="text-foreground">Preparing food for the bereaved family</strong> — NOT the family preparing food for visitors (that is from Jahiliyyah)</span>
          </li>
        </ul>
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 space-y-1.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-teal-400 font-semibold">Visit the graves:</span> &quot;I used to forbid you from visiting graves, but visit them, for they remind you of the Hereafter.&quot;
          </p>
          <p className="text-[10px] text-teal-500/60 font-semibold">Muslim</p>
        </div>
      </div>
    ),
  },
  {
    id: 'local-resources',
    title: '8. Local Resources in Guyana',
    icon: '🇬🇾',
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          Contact your local Masjid first — most will coordinate the entire Janazah process.
        </p>
        <div className="space-y-2">
          {[
            { name: 'CIOG (Central Islamic Organisation of Guyana)', phone: '(592) 226-2510' },
            { name: 'GIT (Guyana Islamic Trust)', phone: null },
            { name: "Jam'iyyatul Ulamaa — Fatwa Dept", phone: '(592) 622-3948' },
          ].map((org) => (
            <div key={org.name} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 px-3 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{org.name}</p>
              </div>
              {org.phone && (
                <a
                  href={`tel:${org.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-1.5 shrink-0 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-[10px] font-bold text-emerald-400"
                >
                  <Phone className="h-3 w-3" />
                  {org.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function JanazahGuidePage() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Heart}
        title="Janazah Guide"
        subtitle="Islamic Funeral Rites"
        gradient="from-gray-900 to-slate-900"
        showBack
      
        heroTheme="janazah"
      />

      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2">
          <span className="shrink-0 rounded-lg bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-400 border border-violet-500/20">
            Hanafi Fiqh
          </span>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Based on the <span className="text-violet-300">Hanafi madhab</span> (predominant in Guyana). Differences noted where applicable.
          </p>
        </div>
      </div>

      <div className="px-4 pt-2 space-y-2">
        {SECTIONS.map((section) => {
          const isOpen = openSection === section.id
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="flex w-full items-center gap-3 p-4 text-left active:bg-secondary/50 transition-colors"
              >
                <span className="text-lg">{section.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  {section.content}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
