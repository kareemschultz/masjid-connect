# Fiqh & Duas Task

Build a comprehensive Fiqh section and expand the Duas page with Adab-sourced content.

## RULES
- Permanently dark: bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800. NEVER dark: prefixes.
- All pages: showBack on PageHero + BottomNav + pb-nav
- Arabic text: className="font-arabic"
- Islamic accuracy is critical

---

## TASK 1: Create /app/explore/madrasa/fiqh/page.tsx

```tsx
"use client"
import { useState } from "react"
import { Scale, ChevronDown, ChevronUp } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { BottomNav } from "@/components/bottom-nav"
```

### Data structure:
```ts
interface FiqhTopic {
  id: string
  chapter: string
  title: string
  rulingType?: "fard" | "wajib" | "sunnah" | "haram" | "makruh" | "mubah" | "info"
  madhab?: string
  points: string[]
  note?: string
}
```

### Data (const TOPICS outside component):

Chapter: "Tahara"
1. id: "wudu-breakers", title: "What Breaks Wudu"
   rulingType: "fard", madhab: "All madhabs (notes where differs)"
   points:
   - Any discharge from the private parts — urine, stool, wind/gas
   - Flowing blood or pus from a wound (Hanafi: breaks wudu; Shafi'i/Hanbali: does not)
   - Vomiting a mouthful (Hanafi: breaks wudu; Shafi'i: does not)
   - Deep sleep lying down or leaning — if body goes limp
   - Loss of consciousness (fainting, anaesthesia, intoxication)
   - Laughing aloud during Salah (Hanafi: breaks wudu AND Salah; Shafi'i/Maliki: breaks Salah only)
   - Touching private parts directly (Shafi'i/Hanbali: breaks wudu; Hanafi: does not)
   - Skin contact between non-mahram man and woman (Shafi'i: breaks wudu; Hanafi/Maliki: does not unless with desire)
   note: "Hanafi is the predominant madhab in Guyana. When in doubt, renew wudu."

2. id: "ghusl-required", title: "When Ghusl (Major Bath) is Required"
   rulingType: "fard", madhab: "All madhabs"
   points:
   - Ejaculation (even without intercourse)
   - Sexual intercourse (even without ejaculation)
   - End of menstruation (hayd)
   - End of post-natal bleeding (nifas)
   - Upon becoming Muslim (Hanafi: wajib; others: recommended)
   - Death — ghusl performed by others (fard kifayah on community)

3. id: "tayammum", title: "Tayammum (Dry Ablution)"
   rulingType: "fard", madhab: "All madhabs"
   points:
   - Permitted when water unavailable or its use would cause harm
   - Use pure earth, sand, stone, or clay — any natural ground surface
   - Intention + strike hands on earth once, wipe face + hands to wrists (Hanafi)
   - Invalidated when water becomes available or wudu would normally be broken
   - One tayammum per fard prayer — renew for each fard (Hanafi)

4. id: "najaasah", title: "Najaasah (Impurities)"
   rulingType: "info", madhab: "Hanafi (primary)"
   points:
   - Heavy (ghaleeza): dog saliva, pig and by-products. Must wash 3x + scrub.
   - Medium (mutawassita): human urine, stool, blood (flowing), wine/alcohol, vomit. Wash until trace removed.
   - Light (khafeefa — Hanafi only): urine of halal meat animals. Excuse if less than a quarter of garment.
   - Place, body, and clothing must all be free of impurity for Salah
   - A small drop of blood (smaller than inner palm) is excused for Salah (Hanafi)
   note: "Other madhabs do not distinguish light impurity — all najaasah treated equally."

Chapter: "Salah"
5. id: "salah-conditions", title: "Conditions for Valid Salah (Shurut)"
   rulingType: "fard", madhab: "All madhabs"
   points:
   - Muslim, sane, and having reached puberty (mukallaf)
   - Purity from hadath — valid wudu or ghusl where required
   - Purity of body, clothing, and place from najaasah
   - Awrah covered — men: navel to knee; women: entire body except face and hands
   - Facing the Qibla — permissible to face general direction if exact unknown
   - Correct prayer time — salah outside its time is invalid (must be qada)

6. id: "salah-pillars", title: "Pillars (Faraa'id) of Salah"
   rulingType: "fard", madhab: "General consensus"
   points:
   - Takbeer al-Ihram — opening Allahu Akbar
   - Qiyam — standing (obligatory for fard prayer if physically able)
   - Recitation of Surah al-Fatihah in every rakah
   - Ruku — bowing
   - I'tidal — rising fully upright from ruku
   - Sujud — prostration, twice per rakah
   - Julus — sitting between the two prostrations
   - Final Tashahhud and Tasleem to conclude
   note: "Omitting a pillar invalidates the entire salah — cannot be compensated by Sujud al-Sahw."

7. id: "salah-wajibat", title: "Wajibat of Salah (Hanafi)"
   rulingType: "wajib", madhab: "Hanafi"
   points:
   - Reciting al-Fatihah — obligatory in first 2 rakat of fard, all rakat of nafl
   - Adding a Surah or 3 verses after al-Fatihah — in first 2 rakat of fard
   - Minimum 3x tasbih in ruku and sujud (Subhana Rabbiyal Adheem/A'la)
   - Qawmah — fully standing upright between ruku and sujud
   - Jalsah — sitting between the two sujud
   - First Tashahhud (qa'da al-oola) in 3 and 4 rakah prayers
   - Qunoot in Witr — Hanafi: Wajib; other madhabs: Sunnah
   - Tasleem to both directions (Hanafi: both wajib; Shafi'i: right only fard)
   note: "Omitting a wajib act intentionally invalidates salah. If forgetful, Sujud al-Sahw is required."

8. id: "salah-invalidators", title: "What Invalidates Salah"
   rulingType: "haram", madhab: "All madhabs"
   points:
   - Speaking intentionally (even one word outside prayer dhikr)
   - Laughing aloud — even one letter audible to yourself
   - Eating or drinking anything, even a tiny amount
   - Turning the chest away from Qibla without necessity
   - Excessive continuous movement (3+ actions in a row) without need
   - Breaking wudu — exit salah, re-make wudu, restart
   - Uncovering awrah unless immediately corrected

9. id: "qada-prayers", title: "Makeup Prayers (Qada)"
   rulingType: "fard", madhab: "All madhabs"
   points:
   - Any missed fard prayer must be made up as soon as possible
   - Making up missed prayers is obligatory — does not expire
   - If many prayers owed, permissible to pray current first then qada
   - Jumu'ah cannot be made up — pray 4 rakat Dhuhr as qada instead
   - Nafl prayers not made up unless one was started and broken
   note: "Deliberately missing salah without valid excuse is a major sin. Repent and make it up immediately."

10. id: "witr", title: "Witr Prayer"
    rulingType: "wajib", madhab: "Hanafi: Wajib | Shafi'i/Maliki/Hanbali: Sunnah Mu'akkadah"
    points:
    - 3 rakat — prayed after Isha, before Fajr
    - Hanafi: 2 rakat with tashahhud, stand for 3rd, add surah, raise hands and recite Dua al-Qunoot before ruku
    - Shafi'i: 1 rakah only, or 3 with one tasleem
    - Dua al-Qunoot: "Allahumma ihdina feeman hadayt..."
    - If missed, Hanafi: must make qada; other madhabs: make it up as even number
    - Do not sleep without praying Witr — make it last prayer of the night
    note: "Hanafi considers Witr Wajib — between Fard and Sunnah in obligation. Never call it optional."

Chapter: "Sawm"
11. id: "fasting-breaks-kaffarah", title: "What Breaks Fast: Qada + Kaffarah Required"
    rulingType: "haram", madhab: "All madhabs"
    points:
    - Intentional eating or drinking while knowing it is Ramadan and the fast is in progress
    - Intentional sexual intercourse during the fast
    - Kaffarah: free a slave, OR fast 60 consecutive days, OR feed 60 poor people — in that order
    - Both Qada AND Kaffarah are required
    note: "Applies to Ramadan fard fast only. Voluntary fasts broken intentionally require Qada only."

12. id: "fasting-breaks-qada", title: "What Breaks Fast: Qada Only"
    rulingType: "info", madhab: "Hanafi (primary)"
    points:
    - Accidentally eating/drinking thinking it is still night — Qada only (Hanafi); Shafi'i: fast not broken at all
    - Eating due to genuine necessity (severe illness)
    - Intentional vomiting of a mouthful
    - Water entering throat while swimming or bathing
    - Taking medication orally or as suppository
    - Eating after Suhoor thinking Fajr had not entered when it had

13. id: "fasting-does-not-break", title: "What Does NOT Break the Fast"
    rulingType: "info", madhab: "Consensus with notes"
    points:
    - Forgetfully eating or drinking — fast is valid; Hanafi: spit it out when remembered
    - Non-nutritional injections (insulin, anaesthetic) — majority: does not break fast
    - Eye drops and ear drops — Hanafi: breaks if reaches throat; Shafi'i: does not
    - Tasting food with tip of tongue without swallowing
    - Brushing teeth or miswak — permissible; avoid swallowing toothpaste
    - Kissing spouse without intercourse — valid fast; disliked for those with low self-control
    - Swimming — permissible; be careful water does not enter throat

14. id: "fasting-exemptions", title: "Who is Exempt from Fasting"
    rulingType: "info", madhab: "All madhabs"
    points:
    - Traveller — may break fast and make up later (distance 77+ km)
    - Ill person — if fasting causes genuine harm, break and make up
    - Pregnant or nursing woman — if fasting harms self or child; Qada required; some scholars add Fidya
    - Menstruating woman (hayd) or post-natal bleeding (nifas) — fasting FORBIDDEN; Qada required
    - Elderly unable to fast without severe hardship — Fidya only (feed one poor person per missed fast)
    note: "Fidya 2026: GYD $60,000 per missed fast (D.E.H.C.). Sadaqatul Fitr: GYD $2,000 per person."

Chapter: "Nikah"
15. id: "nikah-conditions", title: "Conditions for a Valid Nikah"
    rulingType: "fard", madhab: "All madhabs (with notes)"
    points:
    - Offer (Ijab) and acceptance (Qabool) — in one sitting
    - Two Muslim male witnesses of good character (Hanafi allows female witnesses; Shafi'i requires 2 males)
    - Wali (guardian) for the bride — obligatory per Shafi'i/Hanbali/Maliki; Hanafi: adult woman can contract own but Wali still recommended
    - Mahr (dowry) — must be specified; even a small amount is valid
    - Free and willing consent of both parties — forced marriage is invalid
    note: "Islamic nikah without civil registration has no legal standing in Guyana. Register with the Registrar-General."

16. id: "nikah-prohibited", title: "Prohibited Marriages"
    rulingType: "haram", madhab: "All madhabs"
    points:
    - Mother, grandmother, daughter, granddaughter (permanently prohibited)
    - Sister (full, half, or foster), aunt, niece
    - Foster mother and foster sister
    - Wife's mother and wife's daughter (from consummated marriage)
    - Father's wife and son's wife
    - Being simultaneously married to two sisters or a woman and her aunt/niece
    - Non-Muslim men cannot marry Muslim women. Muslim men may marry chaste Christian or Jewish women only.
    - A woman must complete her iddah before remarrying

Chapter: "Common Questions"
17. id: "faq-salah-english", title: "Can I pray in English?"
    rulingType: "info"
    points:
    - No — fard recitation of al-Fatihah and dhikr within Salah must be in Arabic
    - If a new Muslim truly cannot learn Arabic yet, Hanafi: may recite the meaning temporarily while learning
    - Du'a (personal supplication) in sujud and after salah may be in any language
    - Niyyah (intention) may be in any language — it is a matter of the heart

18. id: "faq-sitting-salah", title: "Can I pray sitting if I cannot stand?"
    rulingType: "info"
    points:
    - Yes — if standing causes genuine harm or is impossible, sitting is valid with full reward
    - Pray as much of the salah in correct posture as possible
    - If unable to sit, pray lying on right side facing Qibla
    - If unable to bow/prostrate, indicate positions with head movements (sujud deeper than ruku)
    - "Pray standing; if unable, sitting; if unable, on your side." (Prophet ﷺ, Bukhari)

19. id: "faq-women-hayd", title: "Salah and fasting during menstruation (hayd)"
    rulingType: "info"
    points:
    - Salah is FORBIDDEN during hayd and nifas
    - Missed salah during hayd is NOT made up — obligation is completely lifted
    - Missed Ramadan fasts MUST be made up after hayd ends before the next Ramadan
    - Reciting Quran from memory — Hanafi: impermissible; Shafi'i: permissible without touching mushaf
    - Touching the Quran physically is impermissible during hayd by all madhabs
    - Du'a, dhikr, and listening to Quran are all permitted during hayd

20. id: "faq-witr-optional", title: "Is Witr optional?"
    rulingType: "wajib"
    points:
    - Hanafi: Witr is Wajib — between Fard and Sunnah in obligation
    - Shafi'i/Maliki/Hanbali: Sunnah Mu'akkadah (highly emphasised sunnah)
    - All scholars agree: never neglect Witr
    - The Prophet ﷺ never left Witr whether travelling or at home
    - "Make Witr the last of your night prayers." (Bukhari & Muslim)
    note: "In Guyana (predominantly Hanafi), Witr should be treated as obligatory."

21. id: "faq-beard", title: "Ruling on the beard"
    rulingType: "wajib"
    madhab: "Hanafi/Maliki/Hanbali: Wajib | Shafi'i: Sunnah Mu'akkadah"
    points:
    - Growing the beard is Wajib per Hanafi, Maliki, Hanbali schools
    - Minimum length (Hanafi): one fist-length — shaving below this is impermissible
    - Trimming to fist-length is permissible; shaving shorter is haram (Hanafi)
    - "Trim the moustache and let the beard grow." (Bukhari/Muslim)
    - Shaping/grooming within bounds is permissible

### Component design:
- Chapter filter pills (Tahara | Salah | Sawm | Nikah | Common Questions) — scrollable row, active=bg-violet-600 text-white
- Default: show all chapters
- Each topic = accordion card: collapsed shows title + rulingType badge + chapter tag
- Expanded: points as bullet list (text-xs text-gray-300, leading-relaxed), note in amber callout if present, madhab in text-[10px] text-gray-600 at bottom
- rulingType badge colors:
  - fard: bg-red-500/15 text-red-400 border-red-500/20
  - wajib: bg-orange-500/15 text-orange-400 border-orange-500/20
  - sunnah: bg-blue-500/15 text-blue-400 border-blue-500/20
  - haram: bg-rose-700/15 text-rose-400 border-rose-700/20
  - makruh: bg-amber-500/15 text-amber-400 border-amber-500/20
  - info: bg-gray-700/30 text-gray-400 border-gray-700/20
- Chapter section headers (text-xs font-bold uppercase tracking-widest text-gray-600 mt-4 mb-2)
- Disclaimer at bottom: "This guide presents the Hanafi position as primary (predominant madhab in Guyana) with notes on other schools. For specific personal rulings, consult a qualified scholar (Mufti/Aalim)."
- PageHero: icon=Scale, title="Fiqh Guide", subtitle="Islamic Rulings & Jurisprudence", gradient="from-violet-900 to-purple-900", showBack
- BottomNav at bottom

---

## TASK 2: Add new duas categories to /app/explore/duas/page.tsx

Find the DUA_CATEGORIES array. Add these new categories at the END of the array (before the closing ]):

Category "bathroom" (label: "Bathroom"):
- Dua: "Entering the Bathroom"
  arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ"
  transliteration: "Allahumma innee a-oodhu bika minal khubuthi wal-khaba-ith"
  translation: "O Allah, I seek Your protection from male and female evil spirits."
  source: "Bukhari & Muslim"

- Dua: "Exiting the Bathroom"
  arabic: "غُفْرَانَكَ"
  transliteration: "Ghufraanak"
  translation: "I seek Your forgiveness."
  source: "Abu Dawud, Tirmidhi"

Category "wudu" (label: "Wudu"):
- Dua: "Before Wudu"
  arabic: "بِسْمِ اللَّهِ"
  transliteration: "Bismillah"
  translation: "In the name of Allah."
  source: "Abu Dawud"
  note: "Saying Bismillah before wudu is Sunnah. Wudu without it is valid."

- Dua: "After Wudu (Shahada)"
  arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ"
  transliteration: "Ashhadu an la ilaha illallahu wahdahu la shareeka lah, wa ashhadu anna Muhammadan abduhu wa rasooluh"
  translation: "I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His slave and messenger."
  source: "Muslim"
  note: "Whoever says this after wudu, all 8 gates of Paradise are opened for them."

- Dua: "After Wudu (Full)"
  arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ"
  transliteration: "Allahumma-j'alnee minat-tawwabeena waj-alnee minal-mutatahhireen"
  translation: "O Allah, make me among those who repent and among those who purify themselves."
  source: "Tirmidhi"

Category "clothing" (label: "Clothing"):
- Dua: "When Wearing New Clothes"
  arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ"
  transliteration: "Allahumma lakal hamdu Anta kasawtaneehi, as-aluka min khayrihi wa khayri ma suni-a lahu, wa a-oodhu bika min sharrihi wa sharri ma suni-a lahu"
  translation: "O Allah, all praise is due to You for clothing me with this. I ask You for its good and the good for which it was made, and I seek Your protection from its evil."
  source: "Abu Dawud, Tirmidhi"

- Dua: "When Getting Dressed"
  arabic: "بِسْمِ اللَّهِ"
  transliteration: "Bismillah"
  translation: "In the name of Allah."
  source: "Adab al-Mufrad"
  note: "Say Bismillah when putting on any garment. Begin with the right side."

Category "mirror" (label: "Looking in Mirror"):
- Dua: "When Looking in the Mirror"
  arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي"
  transliteration: "Allahumma anta hassanta khalqee fa-hassin khuluqee"
  translation: "O Allah, You have made my physical form beautiful, so beautify my character too."
  source: "Ahmad, Ibn Hibban"
  note: "Attributed to the Prophet ﷺ. Graded hasan by scholars."

Category "anger" (label: "Anger"):
- Dua: "When Angry"
  arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ"
  transliteration: "A-oodhu billahi minash-shaytanir-rajeem"
  translation: "I seek protection with Allah from the accursed Shaytan."
  source: "Bukhari & Muslim"
  note: "The Prophet ﷺ said: If standing and angry, sit. If anger does not leave, lie down."

- Dua: "For Calm and Ease"
  arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي"
  transliteration: "Rabbish-rah lee sadree wa yassir lee amree"
  translation: "My Lord, expand my chest and ease my affairs."
  source: "Quran 20:25-26"

Category "knowledge" (label: "Seeking Knowledge"):
- Dua: "For Beneficial Knowledge"
  arabic: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا"
  transliteration: "Allahumma-nfa-nee bima allamtanee, wa-allim-nee ma yanfa-unee, wa-zidnee ilma"
  translation: "O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge."
  source: "Tirmidhi, Ibn Majah"

- Dua: "Before Studying"
  arabic: "رَبِّ زِدْنِي عِلْمًا"
  transliteration: "Rabbi zidnee ilma"
  translation: "My Lord, increase me in knowledge."
  source: "Quran 20:114"

Category "istighfar" (label: "Istighfar"):
- Dua: "Short Istighfar"
  arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ"
  transliteration: "Astaghfirullahil-Adheem alladhee la ilaha illa Huwal-Hayyul-Qayyoom wa atoobu ilayh"
  translation: "I seek forgiveness from Allah the Almighty, besides Whom there is none worthy of worship, the Ever-Living, the Self-Sustaining, and I turn to Him in repentance."
  source: "Abu Dawud, Tirmidhi"
  note: "Whoever says this, Allah will forgive them even if they have fled from battle."

- Dua: "Sayyidul Istighfar (Master of Forgiveness)"
  arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ"
  transliteration: "Allahumma Anta Rabbee la ilaha illa Anta, khalaqtanee wa ana abduk, wa ana ala ahdika wa wa-dika mastata-t, a-oodhu bika min sharri ma sana-t, aboo-u laka bini-matika alayya, wa aboo-u laka bi-dhanbee faghfir lee fa-innahu la yaghfirudhdhunoba illa Ant"
  translation: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant. I abide by Your covenant and promise as best I can. I seek protection from the evil I have done. I acknowledge Your favour upon me and acknowledge my sin — so forgive me, for none forgives sins but You."
  source: "Bukhari"
  note: "Whoever says this in the morning with conviction and dies that day, will be among the people of Paradise. Same for the evening."

---

## TASK 3: Add Fiqh to Madrasa hub

In /app/explore/madrasa/page.tsx:
1. Import Scale from lucide-react (add to existing imports)
2. Find the modules/cards array. Add this entry near the top after the Salah entry:
```
href: "/explore/madrasa/fiqh"
icon: Scale
title: "Fiqh Guide"
desc: "Islamic rulings: Tahara, Salah, Sawm, Nikah, Common Q&A — Hanafi primary"
iconColor: "text-violet-400"
bgColor: "bg-violet-500/5"
borderColor: "border-violet-500/30"
```

---

After all three tasks:
git add -A && git commit -m "feat: Fiqh Guide page (Tahara/Salah/Sawm/Nikah/Q&A), 7 new Duas categories (bathroom/wudu/clothing/mirror/anger/knowledge/istighfar), Fiqh added to Madrasa hub"

Then run: openclaw --profile alfred system event --text "Done: Fiqh section and Adab duas complete" --mode now
