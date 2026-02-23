# Task: 99 Names of Allah — Detail Panel

## Goal
When a user taps any name on the 99 Names page, show a bottom sheet with a full
explanation, Quranic/Hadith reference, and dhikr benefit for that name.

## Step 1 — Create `lib/asmaul-husna-detail.ts`

Create this file with a `NAMES_DETAIL` array of 99 objects. Each must have:
```ts
interface NameDetail {
  number: number
  arabic: string            // keep same as existing NAMES_OF_ALLAH
  transliteration: string   // keep same
  meaning: string           // keep same
  rootWord: string          // Arabic root and what it means
  explanation: string       // 2-3 sentences: what this name tells us about Allah
  quranRef: string          // e.g. "Al-Fatihah 1:1" or "Al-Hashr 59:23"
  quranText: string         // English translation of the verse mentioning this name
  benefit: string           // How reflecting on / making dua with this name benefits the believer
  category: 'mercy' | 'knowledge' | 'power' | 'creation' | 'sovereignty' | 'beauty' | 'justice' | 'uniqueness'
}
```

Write ALL 99 entries. Be theologically accurate — this is for a Muslim app. Use Sunni Ashari/Maturidi understanding. Do NOT copy incorrect info. Some guidance:

- Ar-Rahman (1): refers to vast mercy encompassing everything in this world; Bismillah ir-rahman ir-raheem
- Ar-Raheem (2): special mercy reserved for believers in the hereafter
- Al-Malik (3): absolute sovereignty, Malik yawm id-deen (Quran 1:4)
- Al-Quddus (4): free of all deficiency; purify one's heart when reflecting on this
- As-Salam (5): source of peace and safety; greeting As-salamu alaykum derives from this
- Al-Mu'min (6): grants security/protection; believers are called Mu'minoon from this root
- Al-Muhaymin (7): watches over, oversees, guards all affairs with meticulous care
- Al-Aziz (8): mighty in a way that cannot be overcome; honour belongs to Allah
- Al-Jabbar (9): compels/sets broken things right; also means restorer of broken hearts
- Al-Mutakabbir (10): supremely great, only He deserves this attribute — not creation
- Al-Khaliq (11): creates from nothing; Al-Hashr 59:24
- Al-Bari' (12): distinguishes and separates creation into unique forms
- Al-Musawwir (13): fashions each creation with a unique form; Al-Hashr 59:24
- Al-Ghaffar (14): covers sins repeatedly; root means to cover/conceal
- Al-Qahhar (15): overpowers all creation, none can resist His will
- Al-Wahhab (16): gives freely without measure or return; Ali Imran 3:8
- Ar-Razzaq (17): the one who provides ALL provision — physical and spiritual; Az-Zariyat 51:58
- Al-Fattah (18): the opener of all doors; Saba 34:26
- Al-Aleem (19): knows everything past present future hidden manifest; Al-Baqarah 2:29
- Al-Qabid (20): constricts/withholds by wisdom not harshness; paired with Al-Basit
- Al-Basit (21): expands provision and sustenance by His mercy
- Al-Khafid (22): lowers the arrogant and the enemies of truth; paired with Ar-Rafi'
- Ar-Rafi' (23): raises the righteous in rank; Al-Mujadila 58:11
- Al-Mu'izz (24): bestows honour on whom He wills
- Al-Mudhill (25): humiliates/disgraces the arrogant; Ali Imran 3:26
- As-Sami' (26): hears everything, even the whisper of leaves; Al-Baqarah 2:127
- Al-Basir (27): sees everything including what is hidden; Al-Isra 17:1
- Al-Hakam (28): the ultimate judge whose ruling is always correct; Al-An'am 6:114
- Al-Adl (29): perfectly just in all His decrees; no injustice, large or small
- Al-Latif (30): subtle, gentle, reaches the finest details; Al-Mulk 67:14
- Al-Khabir (31): aware of all inner states and hidden affairs; Al-Hujurat 49:13
- Al-Halim (32): forbears despite having power to punish; gives respite; Al-Baqarah 2:225
- Al-Azeem (33): magnificent greatness beyond comprehension; Al-Baqarah 2:255 (Ayat al-Kursi)
- Al-Ghafur (34): forgives completely, erasing the sin as if it never was; Az-Zumar 39:53
- Ash-Shakur (35): appreciates and greatly rewards even the smallest good deed; Fatir 35:30
- Al-Ali (36): most high in every sense — essence, attributes, power; Al-Baqarah 2:255
- Al-Kabir (37): greatness that encompasses all; Al-Hajj 22:62
- Al-Hafiz (38): preserves the Quran, the universe, the deeds of all; Hud 11:57
- Al-Muqit (39): nourishes and provides for every created thing precisely; An-Nisa 4:85
- Al-Hasib (40): takes account of all things, sufficient as a reckoner; An-Nisa 4:6
- Al-Jalil (41): majestic, possessing all attributes of greatness combined
- Al-Karim (42): generous in a way that gives without being asked; Al-Infitar 82:6
- Ar-Raqib (43): watches every action, thought, and intention; Al-Ahzab 33:52
- Al-Mujib (44): responds to every sincere dua; Hud 11:61
- Al-Wasi' (45): all-encompassing in mercy, knowledge, and forgiveness; Al-Baqarah 2:115
- Al-Hakim (46): wise in all His decrees and laws; everything He does has wisdom; Al-Baqarah 2:32
- Al-Wadud (47): loves with infinite love; this is the only name where Allah is described as the loving one; Al-Buruj 85:14
- Al-Majid (48): glorious in essence and attributes beyond limit; Hud 11:73
- Al-Ba'ith (49): resurrects the dead; establishes accountability; Al-Hajj 22:7
- Ash-Shahid (50): witness to all things at all times everywhere; Al-Ma'idah 5:117
- Al-Haqq (51): the absolute truth — His existence is necessary and eternal; Ta-Ha 20:114
- Al-Wakil (52): the trustee upon whom we rely completely; Az-Zumar 39:62
- Al-Qawiyy (53): strength that never diminishes; Al-Hajj 22:74
- Al-Matin (54): firm and steadfast with immovable strength; Az-Zariyat 51:58
- Al-Waliyy (55): the protecting friend who takes care of the believer's affairs; Al-Baqarah 2:257
- Al-Hamid (56): praiseworthy in all His attributes even if none praised Him; Ibrahim 14:8
- Al-Muhsi (57): counts and records everything with perfect precision; Maryam 19:94
- Al-Mubdi' (58): originates existence from nothing, first creation; Al-Buruj 85:13
- Al-Mu'id (59): returns and restores after death; Al-Buruj 85:13
- Al-Muhyi (60): gives life to the dead and to hearts; Ya-Sin 36:78-79
- Al-Mumit (61): causes death — a mercy as transition, not punishment; Al-A'raf 7:158
- Al-Hayy (62): eternally alive with life that had no beginning and has no end; Al-Baqarah 2:255
- Al-Qayyum (63): self-subsisting, sustains all existence; without Him nothing could exist; Al-Baqarah 2:255
- Al-Wajid (64): finds whatever He wills, nothing escapes Him; possesses infinite wealth
- Al-Majid (65): noble and generous; combines both glory and generosity; Al-Buruj 85:15
- Al-Wahid (66): one in His essence — no partner, no division; As-Saffat 37:4
- Al-Ahad (67): uniquely one — no equal, no comparison; Al-Ikhlas 112:1
- As-Samad (68): eternal refuge whom all creation depends on; Al-Ikhlas 112:2
- Al-Qadir (69): has power over everything absolutely; Al-Kahf 18:45
- Al-Muqtadir (70): all-encompassing power that cannot be challenged; Al-Qamar 54:42
- Al-Muqaddim (71): brings forward whom He wills in rank or in time; Qaf 50:28
- Al-Mu'akhkhir (72): delays what He wills by divine wisdom; Nuh 71:4
- Al-Awwal (73): the First — before all creation existed; Al-Hadid 57:3
- Al-Akhir (74): the Last — remains after all creation ceases; Al-Hadid 57:3
- Az-Zahir (75): the Manifest — evident through His signs in creation; Al-Hadid 57:3
- Al-Batin (76): the Hidden — His essence cannot be perceived by senses; Al-Hadid 57:3
- Al-Wali (77): the governing patron who manages all affairs; Ar-Ra'd 13:11
- Al-Muta'ali (78): transcendent above all — above attribute, description, place; Ar-Ra'd 13:9
- Al-Barr (79): the source of all goodness and righteousness; At-Tur 52:28
- At-Tawwab (80): accepts repentance repeatedly, always — at any time; At-Tawbah 9:104
- Al-Muntaqim (81): takes just retribution from oppressors; As-Sajdah 32:22
- Al-Afuww (82): pardons completely — not just forgives but erases; An-Nisa 4:99
- Ar-Ra'uf (83): extremely compassionate and tender; Al-Baqarah 2:143
- Malik-ul-Mulk (84): possessor of all dominion — gives and takes kingdoms; Ali Imran 3:26
- Dhul-Jalali wal-Ikram (85): possessor of majesty and honour; Ar-Rahman 55:27 — best dua
- Al-Muqsit (86): establishes equity and balance in all affairs; Al-Mumtahana 60:8
- Al-Jami' (87): gathers all of creation on Day of Judgment; Ali Imran 3:9
- Al-Ghani (88): completely independent, needs nothing; Al-Ankabut 29:6
- Al-Mughni (89): enriches from His own infinite treasure; At-Tawbah 9:28
- Al-Mani' (90): withholds by wisdom — protects believers from harm; paired with Al-Mu'ti
- Ad-Darr (91): the distresser — can afflict harm by His permission; Al-An'am 6:17
- An-Nafi' (92): the benefiter — all benefit comes only from Him; Al-An'am 6:17
- An-Nur (93): the light of the heavens and earth; An-Nur 24:35 — the Light verse
- Al-Hadi (94): guides whom He wills to truth and the straight path; Al-Furqan 25:31
- Al-Badi' (95): originator with no precedent or model; Al-Baqarah 2:117
- Al-Baqi (96): everlasting — everything perishes except His face; Al-Qasas 28:88
- Al-Warith (97): the true inheritor — everything returns to Him; Al-Hijr 15:23
- Ar-Rashid (98): the guide to the right and wise course; Al-Kahf 18:10 (related)
- As-Sabur (99): most patient — delays punishment out of mercy, not inability

**IMPORTANT for each entry:**
- `quranRef` must be a real reference. If the name isn't in Quran directly, cite closest related verse.
- `benefit` should be practical — e.g. "When in need, call upon Allah as Ar-Razzaq knowing He is the true Provider of all provision..."
- `category` should be the most fitting single category
- `explanation` must be 2-3 substantive sentences, not just a restatement of the meaning

## Step 2 — Update `app/explore/names/page.tsx`

1. Import `NAMES_DETAIL` from `@/lib/asmaul-husna-detail`
2. Add `useState<NameDetail | null>(null)` for `selectedName`
3. Change the grid cards from `<div>` to `<button onClick={() => setSelectedName(name)}>` 
4. Add visual tap affordance: `active:scale-95 cursor-pointer` on the card
5. Add a small "→" indicator or subtle tap hint on the card

**Detail bottom sheet** (fixed inset-0, same pattern as Noorani Qaida sheet):

Sheet structure:
- Drag handle bar
- **Header**: large Arabic name, transliteration, meaning, category badge, number
- **Scrollable body** with sections:

  **① What This Name Means**
  Explanation text

  **② In the Quran**
  Reference pill + quoted verse text in a teal-tinted box

  **③ Reflect & Benefit**
  The benefit text with a dua icon

- Body scroll lock when open (same pattern as Qaida page)

**Card update** — make cards feel tappable:
```tsx
<button
  key={name.number}
  onClick={() => setSelectedName(detail)}
  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 px-3 py-5 transition-all active:scale-95 active:bg-gray-800 w-full"
>
  {/* existing card contents */}
  {/* add subtle "tap" hint */}
  <span className="text-[9px] text-gray-700">tap for detail</span>
</button>
```

**Color map for categories:**
```ts
const CATEGORY_COLORS = {
  mercy: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  knowledge: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  power: 'bg-red-500/15 text-red-400 border-red-500/25',
  creation: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
  sovereignty: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  beauty: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  justice: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  uniqueness: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
}
```

**Remember:**
- App is permanently dark: bg-[#0a0b14] base, bg-gray-900 cards
- Arabic text uses `font-arabic` class
- Sheet should use same body scroll lock as qaida page (position:fixed on body, restore scrollY)
- Quranic verse text in the detail sheet should use `font-arabic` for Arabic if included, plain text for English

## Step 3 — After Changes

1. `npm run build` in `/home/karetech/v0-masjid-connect-gy` — fix TypeScript errors
2. If build passes, rebuild Docker:
```bash
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . && \
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && \
docker run -d --name kt-masjidconnect-prod --restart always \
  --network pangolin --ip 172.20.0.24 \
  --env-file .env.local \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && \
docker network connect kt-net-apps kt-masjidconnect-prod && \
docker network connect kt-net-databases kt-masjidconnect-prod
```
3. `git add -A && git commit -m "feat: 99 Names detail panel — explanation, Quranic reference, dhikr benefit for each name"`
4. `openclaw --profile alfred system event --text "Done: 99 Names of Allah detail panel deployed" --mode now`
