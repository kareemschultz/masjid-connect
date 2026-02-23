You are working on MasjidConnect GY — a Next.js 16 Islamic community PWA for Guyana.
Repo: /home/karetech/v0-masjid-connect-gy/
Permanently dark: bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800.
NEVER use light-mode classes. Arabic: className="font-arabic".
All sub-pages: showBack on PageHero, BottomNav at bottom, pb-nav on root div.

After ALL tasks, rebuild & redeploy:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
  docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
  docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
  docker network connect kt-net-apps kt-masjidconnect-prod
  docker network connect kt-net-databases kt-masjidconnect-prod

Then commit & push:
  git add -A && git commit -m "feat: sprint 5 — hadith of the day, prayer stats, quran continue, name search, lecture resume, offline badge, notifications UI" && git push origin main

=== TASK 1: HADITH OF THE DAY (Home Page) ===

Add a "Hadith of the Day" card to app/page.tsx, below the prayer time strip, above the checklist.
The hadith rotates by day-of-year (no API needed — static list of 40 authentic hadith).

Create lib/hadith-data.ts:
export const HADITH_OF_DAY = [
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    transliteration: "Innamā al-a'mālu bin-niyyāt",
    english: "Actions are judged only by intentions.",
    source: "Bukhari & Muslim",
    narrator: "Umar ibn al-Khattab (رضي الله عنه)",
  },
  {
    arabic: "الدِّينُ النَّصِيحَةُ",
    transliteration: "Ad-dīnu an-nasīḥah",
    english: "The religion is sincere advice.",
    source: "Muslim",
    narrator: "Tamim al-Dari (رضي الله عنه)",
  },
  {
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    transliteration: "Man kāna yu'minu billāhi wal-yawmil-ākhiri falyaqul khayran aw liyaṣmut",
    english: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    source: "Bukhari & Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    transliteration: "Lā yu'minu aḥadukum ḥattā yuḥibba li-akhīhi mā yuḥibbu li-nafsih",
    english: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Bukhari & Muslim",
    narrator: "Anas ibn Malik (رضي الله عنه)",
  },
  {
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا",
    transliteration: "Ittaqillāha ḥaythumā kunta, wa-atbi' as-sayyi'ata al-ḥasanata tamḥuhā",
    english: "Fear Allah wherever you are. Follow a bad deed with a good one to erase it, and treat people with good character.",
    source: "Tirmidhi",
    narrator: "Abu Dharr al-Ghifari (رضي الله عنه)",
  },
  {
    arabic: "الطَّهُورُ شَطْرُ الْإِيمَانِ",
    transliteration: "Aṭ-ṭahūru shaṭrul-īmān",
    english: "Purity is half of faith.",
    source: "Muslim",
    narrator: "Abu Malik al-Ashari (رضي الله عنه)",
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    transliteration: "Khayrukum man ta'allamal-Qur'āna wa 'allamah",
    english: "The best of you are those who learn the Quran and teach it.",
    source: "Bukhari",
    narrator: "Uthman ibn Affan (رضي الله عنه)",
  },
  {
    arabic: "صَلِّ قَائِمًا، فَإِنْ لَمْ تَسْتَطِعْ فَقَاعِدًا، فَإِنْ لَمْ تَسْتَطِعْ فَعَلَى جَنْبٍ",
    transliteration: "Ṣalli qā'iman, fa-in lam tastaṭi' fa-qā'idan, fa-in lam tastaṭi' fa-'alā janb",
    english: "Pray standing; if you cannot, then sitting; if you cannot, then on your side.",
    source: "Bukhari",
    narrator: "Imran ibn Husain (رضي الله عنه)",
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى أَجْسَامِكُمْ وَلَا إِلَى صُوَرِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ",
    transliteration: "Innallāha lā yanẓuru ilā ajsāmikum wa lā ilā ṣuwarikum wa lākin yanẓuru ilā qulūbikum",
    english: "Allah does not look at your bodies or your faces, but He looks at your hearts.",
    source: "Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهَا أَحَبُّ إِلَى اللَّهِ مِنْ هَذِهِ الْأَيَّامِ",
    transliteration: "Mā min ayyāmil 'amaluṣ-ṣāliḥu fīhā aḥabbu ilallāhi min hādhihil-ayyām",
    english: "There are no days on which righteous deeds are more beloved to Allah than the first ten days of Dhul-Hijjah.",
    source: "Bukhari",
    narrator: "Ibn Abbas (رضي الله عنهما)",
  },
  {
    arabic: "مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ",
    transliteration: "Mathalul-mu'minīna fī tawāddihim wa tarāḥumihim wa ta'āṭufihim mathalul-jasad",
    english: "The believers in their mutual love, mercy, and compassion are like one body.",
    source: "Bukhari & Muslim",
    narrator: "Nu'man ibn Bashir (رضي الله عنه)",
  },
  {
    arabic: "إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ أَحْسَنَكُمْ أَخْلَاقًا",
    transliteration: "Inna min aḥabbikum ilayya aḥsanakum akhlāqā",
    english: "Indeed, the most beloved of you to me are those with the best character.",
    source: "Bukhari",
    narrator: "Abdullah ibn Amr (رضي الله عنه)",
  },
  {
    arabic: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ",
    transliteration: "Idhā mātal-insānu inqaṭa'a 'anhu 'amaluhu illā min thalāthah",
    english: "When a person dies, all their deeds end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for them.",
    source: "Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    transliteration: "Aḥabbul-a'māli ilallāhi adwamuhā wa in qall",
    english: "The most beloved deeds to Allah are the most consistent, even if they are few.",
    source: "Bukhari & Muslim",
    narrator: "Aisha (رضي الله عنها)",
  },
  {
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    transliteration: "Man salaka ṭarīqan yaltamisu fīhi 'ilman sahhallāhu lahu ṭarīqan ilal-jannah",
    english: "Whoever travels a path in search of knowledge, Allah will ease for them a path to Paradise.",
    source: "Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    transliteration: "Al-muslimu man salimal-muslimūna min lisānihi wa yadih",
    english: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    source: "Bukhari",
    narrator: "Abdullah ibn Amr (رضي الله عنه)",
  },
  {
    arabic: "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ",
    transliteration: "Man lā yashkurun-nāsa lā yashkurullāh",
    english: "Whoever does not thank people does not thank Allah.",
    source: "Abu Dawud & Tirmidhi",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    transliteration: "Ista'īnū biṣ-ṣabri waṣ-ṣalāh",
    english: "Seek help through patience and prayer.",
    source: "Quran 2:45",
    narrator: "Allah, Most High",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Inna ma'al-'usri yusrā",
    english: "Indeed, with hardship comes ease.",
    source: "Quran 94:6",
    narrator: "Allah, Most High",
  },
  {
    arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا",
    transliteration: "Wa man yattaqillāha yaj'al lahu makhraja",
    english: "Whoever fears Allah, He will make a way out for them.",
    source: "Quran 65:2",
    narrator: "Allah, Most High",
  },
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
    transliteration: "Wa idhā sa'alaka 'ibādī 'annī fa-innī qarīb",
    english: "When My servants ask about Me — I am near. I respond to the call of the caller when they call on Me.",
    source: "Quran 2:186",
    narrator: "Allah, Most High",
  },
  {
    arabic: "إِنَّ الصَّلَاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ",
    transliteration: "Innaṣ-ṣalāta tanhā 'anil-faḥshā'i wal-munkar",
    english: "Indeed, prayer prohibits immorality and wrongdoing.",
    source: "Quran 29:45",
    narrator: "Allah, Most High",
  },
  {
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    transliteration: "Tabassumukal fī wajhi akhīka ṣadaqah",
    english: "Your smile in the face of your brother is an act of charity.",
    source: "Tirmidhi",
    narrator: "Abu Dharr al-Ghifari (رضي الله عنه)",
  },
  {
    arabic: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ",
    transliteration: "Innallāha rafīqun yuḥibbur-rifq",
    english: "Allah is gentle and loves gentleness.",
    source: "Bukhari & Muslim",
    narrator: "Aisha (رضي الله عنها)",
  },
  {
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    transliteration: "Al-mu'minul-qawiyyu khayrun wa aḥabbu ilallāhi minal-mu'minid-ḍa'īf",
    english: "The strong believer is better and more beloved to Allah than the weak believer.",
    source: "Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    transliteration: "Laysa ash-shadīdu biṣ-ṣur'ah, innamaš-shadīdulladhī yamliku nafsahu 'indal-ghaḍab",
    english: "The strong person is not the one who wrestles others. The truly strong person controls themselves in anger.",
    source: "Bukhari & Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ",
    transliteration: "Innallāha kataba al-iḥsāna 'alā kulli shay'",
    english: "Allah has prescribed excellence in everything.",
    source: "Muslim",
    narrator: "Shaddad ibn Aws (رضي الله عنه)",
  },
  {
    arabic: "مَنْ أَصْبَحَ مِنْكُمْ آمِنًا فِي سِرْبِهِ مُعَافًى فِي جَسَدِهِ عِنْدَهُ قُوتُ يَوْمِهِ فَكَأَنَّمَا حِيزَتْ لَهُ الدُّنْيَا",
    transliteration: "Man aṣbaḥa minkum āminan fī sirbih, mu'āfan fī jasadih, 'indahu qūtu yawmih, fa-ka'annamā ḥīzat lahud-dunyā",
    english: "Whoever wakes up feeling safe, healthy in body, and has food for the day — it is as if the whole world has been granted to them.",
    source: "Tirmidhi",
    narrator: "Ubayda ibn al-Harith (رضي الله عنه)",
  },
  {
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    transliteration: "Ad-du'ā'u huwal-'ibādah",
    english: "Dua (supplication) is worship.",
    source: "Tirmidhi",
    narrator: "Nu'man ibn Bashir (رضي الله عنه)",
  },
  {
    arabic: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ إِلَّا كَفَّرَ اللَّهُ بِهِ",
    transliteration: "Mā yuṣībul-muslima min naṣabin wa lā waṣabin wa lā hammin wa lā ḥuzn illā kaffar allāhu bih",
    english: "No fatigue, illness, worry, grief, harm, or sadness afflicts the Muslim, even a thorn prick, except that Allah expiates some of his sins by it.",
    source: "Bukhari",
    narrator: "Abu Said al-Khudri (رضي الله عنه)",
  },
  {
    arabic: "أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ",
    transliteration: "Afḍaluṣ-ṣiyāmi ba'da Ramaḍāna shahru allāhil-Muḥarram",
    english: "The best fasting after Ramadan is the month of Allah — Muharram.",
    source: "Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "قَالَ اللَّهُ تَعَالَى: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    transliteration: "Qālallāhu ta'ālā: Anā 'inda ẓanni 'abdī bī",
    english: "Allah says: I am as My servant thinks of Me.",
    source: "Bukhari & Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbighfir lī wa tub 'alayya innaka antat-tawwābur-raḥīm",
    english: "My Lord, forgive me and accept my repentance — You are the Ever-Relenting, the Merciful.",
    source: "Tirmidhi",
    narrator: "Ibn Umar (رضي الله عنه)",
  },
  {
    arabic: "حُبُّكَ الشَّيْءَ يُعْمِي وَيُصِمُّ",
    transliteration: "Ḥubbuka ash-shay'a yu'mī wa yuṣimm",
    english: "Your love of something can make you blind and deaf.",
    source: "Abu Dawud",
    narrator: "Abu Darda (رضي الله عنه)",
  },
  {
    arabic: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ",
    transliteration: "Innallāha jamīlun yuḥibbul-jamāl",
    english: "Allah is beautiful and loves beauty.",
    source: "Muslim",
    narrator: "Abdullah ibn Masud (رضي الله عنه)",
  },
  {
    arabic: "خَيْرُ الْقُرُونِ قَرْنِي ثُمَّ الَّذِينَ يَلُونَهُمْ ثُمَّ الَّذِينَ يَلُونَهُمْ",
    transliteration: "Khayrulqurūni qarnī thummal-ladhīna yalūnahum thummal-ladhīna yalūnahum",
    english: "The best of generations is my generation, then those after them, then those after them.",
    source: "Bukhari",
    narrator: "Abdullah ibn Masud (رضي الله عنه)",
  },
  {
    arabic: "مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ",
    transliteration: "Man ṣāma Ramaḍāna thumma atba'ahu sittan min Shawwālin kāna kaṣiyāmid-dahr",
    english: "Whoever fasts Ramadan and follows it with six days from Shawwal, it is as if they fasted the entire year.",
    source: "Muslim",
    narrator: "Abu Ayyub al-Ansari (رضي الله عنه)",
  },
  {
    arabic: "بَلِّغُوا عَنِّي وَلَوْ آيَةً",
    transliteration: "Ballighu 'annī wa law āyah",
    english: "Convey from me, even if one verse.",
    source: "Bukhari",
    narrator: "Abdullah ibn Amr (رضي الله عنه)",
  },
  {
    arabic: "الصَّلَوَاتُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ كَفَّارَةٌ لِمَا بَيْنَهُنَّ",
    transliteration: "Aṣ-ṣalawātul-khamsu wal-jumu'atu ilal-jumu'ati kaffāratun limā baynahunna",
    english: "The five daily prayers and Jumu'ah to the next Jumu'ah are expiation for what comes between them.",
    source: "Muslim",
    narrator: "Abu Hurairah (رضي الله عنه)",
  },
  {
    arabic: "كُلُّ بَنِي آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ",
    transliteration: "Kullu banī Ādama khaṭṭā'un wa khayrulkhaṭṭā'īnat-tawwābūn",
    english: "Every son of Adam sins, and the best of those who sin are those who repent.",
    source: "Tirmidhi & Ibn Majah",
    narrator: "Anas ibn Malik (رضي الله عنه)",
  },
  {
    arabic: "مَنْ تَشَبَّهَ بِقَوْمٍ فَهُوَ مِنْهُمْ",
    transliteration: "Man tashabbaha biqawmin fa-huwa minhum",
    english: "Whoever imitates a people is one of them.",
    source: "Abu Dawud",
    narrator: "Abdullah ibn Umar (رضي الله عنه)",
  },
]

export function getTodayHadith() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return HADITH_OF_DAY[dayOfYear % HADITH_OF_DAY.length]
}

Now in app/page.tsx, import getTodayHadith and add a card between the prayer strip and checklist:

const hadith = getTodayHadith()

<div className="mx-4 mb-4 rounded-xl bg-gray-900/70 border border-gray-800 p-4 backdrop-blur-sm">
  <div className="flex items-center gap-2 mb-3">
    <span className="text-amber-400 text-sm">📜</span>
    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-400/80">Hadith of the Day</span>
  </div>
  <p className="font-arabic text-right text-lg leading-loose text-white mb-2">{hadith.arabic}</p>
  <p className="text-xs text-gray-400 italic mb-2">"{hadith.transliteration}"</p>
  <p className="text-sm text-gray-200 mb-3">"{hadith.english}"</p>
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-gray-500">{hadith.narrator}</span>
    <span className="text-[10px] text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full">{hadith.source}</span>
  </div>
</div>

=== TASK 2: PRAYER STATISTICS CHART ===

In app/tracker/page.tsx, add a "This Week" stats section at the very top of the page
(before the daily checklist), showing a 7-day prayer completion bar chart.

Logic:
- Read from localStorage: PRAYER_LOG (format: Record<'YYYY-MM-DD', string[]> where strings are prayer names)
- For last 7 days, count how many of the 5 prayers were logged per day
- Show as a bar chart: 7 columns, height proportional to count (0–5)

Component (inline, no external charting lib):
- 7 vertical bars in a flex row
- Bar height: (count/5) * 100% of a 60px container
- Color: emerald if 5/5, amber if 3-4, rose if 1-2, gray if 0
- Day labels: Mon, Tue, Wed, Thu, Fri, Sat, Sun (or M T W T F S S)
- Today's bar has a subtle ring highlight
- "Week Average: X.X/5 prayers" below the chart

Stat cards below chart (row of 3):
- Streak: consecutive days with at least 1 prayer (from PRAYER_LOG)
- Best day: day with most prayers logged
- Fajr rate: % of days this week Fajr was logged

Header: "Prayer Statistics" with a small bar-chart icon (BarChart2 from lucide-react)

=== TASK 3: QURAN "CONTINUE READING" BOOKMARK ===

A) In app/quran/page.tsx (or wherever the Quran hub is), add a "Continue Reading" card
   at the top of the page ONLY if the user has a saved page:

   const lastPage = typeof window !== 'undefined' ? localStorage.getItem('quran_last_page') : null

   If lastPage exists:
   <div className="mx-4 mb-4 rounded-xl bg-emerald-900/30 border border-emerald-700/30 p-4 cursor-pointer"
        onClick={() => router.push(`/quran/mushaf?page=${lastPage}`)}>
     <div className="flex items-center justify-between">
       <div>
         <p className="text-xs text-emerald-400 mb-1">Continue Reading</p>
         <p className="text-white font-semibold">Page {lastPage} / 604</p>
         <p className="text-xs text-gray-400 mt-0.5">Tap to resume</p>
       </div>
       <BookOpen className="h-8 w-8 text-emerald-400/60" />
     </div>
     <div className="mt-2 h-1 rounded-full bg-gray-800">
       <div className="h-1 rounded-full bg-emerald-500" style={{ width: `${(parseInt(lastPage) / 604) * 100}%` }} />
     </div>
   </div>

B) In the Mus'haf page viewer (app/quran/mushaf/page.tsx or similar), save the current page
   on every page navigation:
   localStorage.setItem('quran_last_page', String(currentPage))

C) ALSO add "quran_last_page" to KEYS in lib/storage.ts

=== TASK 4: ISLAMIC NAME SEARCH PAGE ===

Create app/explore/names-search/page.tsx — searchable database of 80+ Muslim names:

Title: "Islamic Names", subtitle: "Names with meaning and origin"
showBack + BottomNav + pb-nav

Create lib/islamic-names.ts with 80 names:
interface IslamicName {
  name: string
  arabic: string
  meaning: string
  origin: 'Arabic' | 'Persian' | 'Turkish' | 'Urdu' | 'Quranic'
  gender: 'Male' | 'Female' | 'Unisex'
  root?: string  // Arabic root letters
}

Include at minimum these names (fill out the data):
Male names: Muhammad, Ahmad, Ibrahim, Ismail, Yusuf, Musa, Isa, Adam, Idris, Nuh, Dawud, Sulayman, Yahya, Zakariyya, Harun, Saleh, Hud, Luqman, Ali, Umar, Uthman, Abu Bakr (given as Bakr), Bilal, Khalid, Tariq, Usamah, Hassan, Husain, Abdullah, Abdul Rahman, Zaid, Amr, Hamza, Jibril, Mikail, Israfil, Malik, Sufyan, Faris, Rayyan, Ziyad, Suhail, Qasim, Walid
Female names: Fatimah, Aisha, Khadijah, Maryam, Asiya, Hajar, Ruqayyah, Zainab, Hafsa, Safiyyah, Umm Kulthum, Sumayya, Bilqis, Lubnah, Nour, Sara, Rahmah, Saba, Mariam, Amira, Layla, Hana, Yasmin, Rania, Nadia, Dina, Salma, Imaan, Amal, Jannah, Rayan, Huda, Sakina, Zahra, Fatima (Latinised), Asma, Baseera, Karima

Page features:
- Search input: filters by name or meaning in real-time (no API call)
- Gender filter pills: All | Male | Female
- Origin filter pills: All | Arabic | Quranic | Persian
- Each name card: shows name, arabic, meaning, origin badge, gender icon
- Tap a name card: expands to show root, additional context if available

Add card to Explore grid in "🔧 Tools" section:
{ icon: Heart, label: 'Islamic Names', description: 'Meanings & origins', href: '/explore/names-search', color: '...', iconColor: 'text-rose-400' }

=== TASK 5: LECTURE PLAYBACK POSITION (RESUME) ===

In app/explore/lectures/page.tsx, save the playback position when a lecture is playing:

A) In the audio player's onTimeUpdate handler, save every 5 seconds to avoid spam:
   - Key: `lecture_pos_${scholar.id}_${series.id}_${lectureIndex}`
   - Value: currentTime (number, seconds)
   - Only save if currentTime > 10 (avoid saving from the very start)

B) When loading a lecture, check for a saved position:
   const savedPos = localStorage.getItem(`lecture_pos_${...}`)
   if (savedPos && audioRef.current) {
     audioRef.current.currentTime = parseFloat(savedPos)
   }

C) On the lecture list item, if a saved position exists, show a small badge:
   "Resume 12:34" in amber below the lecture title

D) When a lecture completes (onEnded), clear the saved position for that lecture
   and auto-advance to the next lecture in the series.

=== TASK 6: AUTO-ADVANCE TO NEXT LECTURE ===

In the lectures player, on the onEnded event (when current lecture finishes):
- Mark the current lecture as "completed" in localStorage: `lecture_done_${scholar}_${series}_${index}` = "1"
- Show completed lectures with a green checkmark ✓ in the list
- Auto-play the next lecture if there is one (increment index, load new src, play)
- If it was the last lecture in the series, show a "Series Complete 🎉" toast

=== TASK 7: OFFLINE STATUS BADGE ===

In app/layout.tsx (or a client component), add a subtle offline indicator:
- Listen to window online/offline events
- When offline: show a small pill at the top: "Offline — showing cached data"
  Style: fixed top bar, amber bg, text-xs, z-[100], centered
- When back online: auto-hide after 2 seconds with "Back online ✓" (emerald)
- On initial load, if navigator.onLine is false: show immediately

Component: components/offline-badge.tsx
Import and add to app/layout.tsx just before {children}

=== TASK 8: SETTINGS — NOTIFICATION PREFERENCES ===

In app/settings/page.tsx, add a "Notifications" section with per-prayer toggles:

const PRAYER_NOTIF_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah', 'suhoor', 'iftaar']

Show 8 toggles (styled as pill switches — use a simple div with conditional bg-emerald-600/bg-gray-700):
- Fajr prayer reminder
- Dhuhr prayer reminder  
- Asr prayer reminder
- Maghrib prayer reminder
- Isha prayer reminder
- Jumu'ah reminder (Friday 11:30 AM)
- Suhoor alert (30 min before Fajr during Ramadan)
- Iftaar alert (5 min before Maghrib during Ramadan)

Save each preference to localStorage: `notif_pref_${key}` = '1' or '0'
Show a note: "Notifications require browser permission. Tap a prayer to enable."
If Notification.permission !== 'granted': show a "Grant Permission" button that calls Notification.requestPermission()

This is UI-only — the actual push scheduling is handled server-side (future task). For now, just save preferences.

=== TASK 9: MADRASA — LINK EXISTING PAGES FROM EXISTING MODULES ===

In app/explore/madrasa/page.tsx, the "5 Pillars" and "Articles of Faith" cards currently say "Coming Soon".
Update them to link to the existing New to Islam sub-pages:
- 5 Pillars → /explore/new-to-islam/pillars
- Articles of Faith (Aqeedah) → /explore/new-to-islam/beliefs

Just change the href and remove "Coming Soon" label on those two cards.

Also add "Learn to Pray" card link (check if it's already linked; if not, link to /explore/madrasa/salah).

=== TASK 10: README + CHANGELOG + SESSION LOG ===

A) Append to CHANGELOG.md:
## v2.2.0 — Feb 23, 2026
- Home: Hadith of the Day card (40-hadith rotation, Arabic + transliteration + source)
- Tracker: 7-day prayer statistics chart with streak, best day, Fajr rate stats
- Quran: "Continue Reading" bookmark — saves last page, shows progress bar
- New page: Islamic Names search — 80+ names, Arabic, meaning, gender, origin filter
- Lectures: Playback position saved (Resume at X:XX badge); auto-advance on completion
- Layout: Offline status badge — amber pill when offline, auto-hides when reconnected
- Settings: Notification preferences UI — per-prayer toggles with permission prompt
- Madrasa: 5 Pillars + Articles of Faith linked to existing New to Islam pages

B) Update ROADMAP.md — mark completed:
- [ ] Explore grid reorganisation → [x] ✅ Sprint 4
- [ ] Quran daily log → [x] ✅ Sprint 5
- [ ] Adhkar completion → [x] ✅ Sprint 5
- [ ] Istighfar counter → [x] ✅ Sprint 5
- [ ] Jumu'ah prep checklist → [x] ✅ Sprint 4
- [ ] Surah Al-Kahf reminder → [x] ✅ Sprint 4 (link to /quran/18 on Jumuah page)
- [ ] Stories of the Prophets → [partially] via Seerah page (Sprint 4)
- [ ] Seerah → [x] ✅ Sprint 4
- [ ] Islamic etiquette (Adab) → [x] ✅ Sprint 4
- [ ] README.md → [x] ✅ Sprint 4

Add new items if not already in ROADMAP:
- [ ] Quran verse sharer — generate image card with Ayah + translation to share on WhatsApp
- [ ] Real halal business listing — Master Kareem to provide Georgetown halal spot names
- [ ] Arabic typing practice — tap the keyboard to spell Arabic words (Madrasa tool)
- [ ] Khatam tracker — personal progress toward completing the Quran
- [ ] Google Sign-In end-to-end test in production
- [ ] Stories of Prophets — full written content for 25 prophets

C) Append to KareTech-Vault/Memory/Sessions/2026-02-22-masjidconnect-v1.9-sprint.md:
## Sprint 5 additions (Alfred's own initiative):
- Hadith of the Day: 40 authentic hadith (Arabic + English + source) rotating daily on home page
- Prayer Statistics: 7-day bar chart, streak, Fajr rate in Tracker
- Quran bookmark: "Continue Reading" card with progress bar
- Islamic Names search: 80+ names with meanings, Arabic, gender, origin
- Lecture playback resume: saves position, shows "Resume at X:XX", auto-advance on completion
- Offline status badge in layout
- Notification preferences UI in Settings (8 toggles, permission prompt)
- Madrasa cross-links to existing New to Islam content

=== BUILD + DEPLOY ===

After ALL tasks complete:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
  docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
  docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
  docker network connect kt-net-apps kt-masjidconnect-prod
  docker network connect kt-net-databases kt-masjidconnect-prod
  git add -A && git commit -m "feat: sprint 5 — hadith of day, prayer stats, quran bookmark, name search, lecture resume, offline badge, notif settings" && git push origin main

=== CONSTRAINTS ===
- PERMANENTLY DARK: bg-[#0a0b14], bg-gray-900, border-gray-800. NEVER bg-white/gray-50/gray-100.
- Arabic text always uses font-arabic className
- All new pages: showBack on PageHero, BottomNav at bottom, pb-nav on root div
- No external dependencies beyond what's already in package.json
- Hadith data is hardcoded in lib/hadith-data.ts (no API call)
- Names data is hardcoded in lib/islamic-names.ts (no API call)
