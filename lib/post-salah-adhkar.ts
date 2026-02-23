// ─── Post-Salah Adhkar Data ──────────────────────────────────────────────────
// Complete Sunnah dhikr sequence after every fard prayer
// Sources: Sahih Muslim, Sahih Bukhari, Abu Dawud, Tirmidhi, Nasa'i

export interface PostSalahDhikr {
  id: string
  arabic: string
  transliteration: string
  translation: string
  count: number
  reference: string
  notes?: string
  afterSpecificPrayer?: ('fajr' | 'maghrib')[]
  fajrMaghribCount?: number // count specifically after Fajr/Maghrib if different
}

export const POST_SALAH_ADHKAR: PostSalahDhikr[] = [
  {
    id: 'istighfar',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah.',
    count: 3,
    reference: 'Sahih Muslim 591',
  },
  {
    id: 'antassalam',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: "Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
    translation: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honour.',
    count: 1,
    reference: 'Sahih Muslim 591',
  },
  {
    id: 'la-ilaha-illallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
    translation: 'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is Able to do all things.',
    count: 1,
    reference: 'Sahih Muslim 597',
    notes: 'Say 10 times after Fajr and Maghrib.',
    afterSpecificPrayer: ['fajr', 'maghrib'],
    fajrMaghribCount: 10,
  },
  {
    id: 'la-hawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ',
    transliteration: "La hawla wa la quwwata illa billah",
    translation: 'There is no might and no power except with Allah.',
    count: 1,
    reference: 'Sahih Bukhari 6384, Sahih Muslim 2704',
    notes: 'A treasure from the treasures of Jannah.',
  },
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللّٰهِ',
    transliteration: 'Subhanallah',
    translation: 'Glory be to Allah.',
    count: 33,
    reference: 'Sahih Muslim 595',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلّٰهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah.',
    count: 33,
    reference: 'Sahih Muslim 595',
  },
  {
    id: 'allahu-akbar',
    arabic: 'اللّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest.',
    count: 34,
    reference: 'Sahih Muslim 595',
    notes: '33+33+34 = 100. Completing this after every fard prayer erases sins even if they were as much as the foam of the sea.',
  },
  {
    id: 'completing-100',
    arabic: 'لَا إِلَٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
    translation: 'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is Able to do all things.',
    count: 1,
    reference: 'Sahih Muslim 597',
    notes: 'Completing the 100. Whoever says this will have their sins forgiven even if they were as much as the foam of the sea.',
  },
  {
    id: 'ayatul-kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu la ilaha illa huwal-hayyul-qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhalladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'. Wasi'a kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifdhuhuma. Wa huwal-'aliyyul-'adheem.",
    translation: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    count: 1,
    reference: "An-Nasa'i, At-Tabarani (Sahih chain)",
    notes: 'Whoever recites Ayatul Kursi after every fard prayer, nothing prevents them from entering Jannah except death.',
  },
  {
    id: 'al-ikhlas',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    transliteration: "Bismillahir-rahmanir-rahim. Qul huwal-lahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakul-lahu kufuwan ahad.",
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.',
    count: 1,
    reference: 'Abu Dawud 5082, Tirmidhi 2903',
    notes: 'Recite 3 times after Fajr and Maghrib.',
    afterSpecificPrayer: ['fajr', 'maghrib'],
    fajrMaghribCount: 3,
  },
  {
    id: 'al-falaq',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    transliteration: "Bismillahir-rahmanir-rahim. Qul a'udhu bi-rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of daybreak, from the evil of that which He created, from the evil of darkness when it settles, from the evil of those who blow on knots, and from the evil of an envier when they envy.',
    count: 1,
    reference: 'Abu Dawud 5082, Tirmidhi 2903',
    notes: 'Recite 3 times after Fajr and Maghrib.',
    afterSpecificPrayer: ['fajr', 'maghrib'],
    fajrMaghribCount: 3,
  },
  {
    id: 'an-nas',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration: "Bismillahir-rahmanir-rahim. Qul a'udhu bi-rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswaasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers in the breasts of mankind, among jinn and among mankind.',
    count: 1,
    reference: 'Abu Dawud 5082, Tirmidhi 2903',
    notes: 'Recite 3 times after Fajr and Maghrib.',
    afterSpecificPrayer: ['fajr', 'maghrib'],
    fajrMaghribCount: 3,
  },
  {
    id: 'dhikr-shukr',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    translation: 'O Allah, help me to remember You, thank You, and worship You in the best manner.',
    count: 1,
    reference: 'Abu Dawud 1522, An-Nasa\'i 1303',
    notes: 'The Prophet ﷺ took Mu\'adh ibn Jabal by the hand and said: "O Mu\'adh, by Allah I love you, so do not forget to say this after every prayer."',
  },
]

// Adhkar specifically with enhanced counts after Fajr and Maghrib
export const FAJR_MAGHRIB_SPECIALS = POST_SALAH_ADHKAR.filter(d => d.afterSpecificPrayer?.length)

// All adhkar that apply after every fard prayer
export const AFTER_EVERY_FARD = POST_SALAH_ADHKAR.filter(d => !d.afterSpecificPrayer?.length)
