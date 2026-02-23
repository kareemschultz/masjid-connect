'use client'

import { useState, useMemo } from 'react'
import { BookOpen, Search, Copy, Heart, Check, X, Share2 } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'
import { shareOrCopy } from '@/lib/share'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Dua {
  arabic: string
  transliteration: string
  meaning: string
  source?: string
  note?: string
}

interface Category {
  id: string
  label: string
  icon: string
  group: string
  duas: Dua[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  // ── Daily Routines ──────────────────────────────────────────────────────────
  {
    id: 'waking',
    label: 'Waking Up',
    icon: '🌅',
    group: 'Daily Routines',
    duas: [
      {
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
        meaning: 'All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.',
        source: 'Bukhari',
      },
      {
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamd, wa Huwa 'ala kulli shay'in Qadir",
        meaning: 'None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
        source: 'Bukhari',
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
        transliteration: "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jami'a khalqika annaka Antallaahu la ilaha illa Anta wahdaka la shareeka laka wa anna Muhammadan 'abduka wa rasooluk",
        meaning: 'O Allah, I have entered the morning calling You to witness, and calling to witness the bearers of Your throne, Your angels, and all of Your creation, that You are Allah, none has the right to be worshipped except You alone, without partner, and that Muhammad is Your servant and Your Messenger.',
        source: 'Abu Dawud',
        note: 'Recite 4 times in the morning and evening',
      },
    ],
  },
  {
    id: 'sleeping',
    label: 'Before Sleeping',
    icon: '🌙',
    group: 'Daily Routines',
    duas: [
      {
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: "Bismika Allahumma amootu wa ahya",
        meaning: 'In Your name, O Allah, I die and I live.',
        source: 'Bukhari',
      },
      {
        arabic: 'اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا',
        transliteration: "Allahumma innaka khalaqta nafsi wa Anta tawaffaha, laka mamaatuha wa mahyaha, in ahyaytaha fahfadhha, wa in amattaha faghfir laha",
        meaning: 'O Allah, You have created my soul and You take it back. Unto You is its death and its life. If You give it life, protect it, and if You cause it to die, forgive it.',
        source: 'Muslim',
      },
      {
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
        meaning: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
        source: 'Abu Dawud',
        note: 'Recite 3 times before sleeping',
      },
      {
        arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
        transliteration: "Bismika Rabbee wada'tu janbee wa bika arfa'uh, fa-in amsakta nafsee farhamha, wa in arsaltaha fahfadha bima tahfadhu bihi 'ibadakas-saliheen",
        meaning: 'In Your name, my Lord, I lay down my side and by You I raise it. If You take my soul, have mercy on it, and if You release it, protect it as You protect Your righteous servants.',
        source: 'Bukhari & Muslim',
      },
    ],
  },
  {
    id: 'morning-adhkar',
    label: 'Morning Adhkar',
    icon: '☀️',
    group: 'Daily Routines',
    duas: [
      {
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah",
        meaning: 'We have entered the morning and the entire kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilaykan-nushur",
        meaning: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
        source: 'Tirmidhi',
      },
      {
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
        transliteration: "Allahumma Anta Rabbee la ilaha illa Anta, khalaqtanee wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't",
        meaning: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant. I am upon Your covenant and promise as best I can.',
        source: 'Bukhari',
        note: "The master of seeking forgiveness (Sayyidul Istighfar). Whoever says this in the morning with firm faith will enter Paradise if they die that day.",
      },
    ],
  },
  {
    id: 'evening-adhkar',
    label: 'Evening Adhkar',
    icon: '🌆',
    group: 'Daily Routines',
    duas: [
      {
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah",
        meaning: 'We have entered the evening and the entire kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
        transliteration: "Allahumma ma amsa bee min ni'matin aw bi-ahadin min khalqika faminka wahdaka la shareeka lak, falakal hamdu wa lakash-shukr",
        meaning: 'O Allah, whatever blessing I or any of Your creation have received in the evening is from You alone, without partner. To You belongs all praise and thanks.',
        source: 'Abu Dawud',
      },
    ],
  },
  // ── Food & Drink ──────────────────────────────────────────────────────────────
  {
    id: 'food',
    label: 'Food & Drink',
    icon: '🍽️',
    group: 'Food & Fasting',
    duas: [
      {
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        meaning: 'In the name of Allah.',
        source: 'Abu Dawud',
        note: 'Say before eating. If you forget, say: "Bismillahi fi awwalihi wa akhirih"',
      },
      {
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
        meaning: 'All praise is for Allah who fed us, gave us drink, and made us Muslims.',
        source: 'Abu Dawud & Tirmidhi',
        note: 'After eating',
      },
      {
        arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ',
        transliteration: "Allahumma barik lana feehi wa at'imna khayran minh",
        meaning: 'O Allah, bless it for us and feed us with better than it.',
        source: 'Tirmidhi',
        note: 'When eating food — or for milk specifically',
      },
      {
        arabic: 'اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي',
        transliteration: "Allahumma at'im man at'amanee wasqi man saqanee",
        meaning: 'O Allah, feed the one who has fed me, and give drink to the one who has given me drink.',
        source: 'Muslim',
      },
    ],
  },
  {
    id: 'iftaar',
    label: 'Iftaar',
    icon: '🌙',
    group: 'Food & Fasting',
    duas: [
      {
        arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
        transliteration: "Allahumma laka sumtu wa 'ala rizqika aftartu",
        meaning: 'O Allah! For You I fasted and upon Your provision I break my fast.',
        source: 'Abu Dawud',
      },
      {
        arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
        transliteration: "Dhahaba al-zama' wa'btallat al-'urooq wa thabata al-ajru in sha Allah",
        meaning: 'The thirst is gone, the veins are moistened, and the reward is certain, if Allah wills.',
        source: 'Abu Dawud',
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي',
        transliteration: "Allahumma innee as'aluka birahmatikallati wasi'at kulla shay'in an taghfira lee",
        meaning: 'O Allah, I ask You by Your mercy which encompasses all things, that You forgive me.',
        source: 'Ibn Majah',
      },
    ],
  },
  // ── Prayer ────────────────────────────────────────────────────────────────────
  {
    id: 'salah',
    label: 'Prayer (Salah)',
    icon: '🕌',
    group: 'Prayer & Worship',
    duas: [
      {
        arabic: 'اللَّهُمَّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
        transliteration: "Allahumaj'alnee muqeemas-salati wa min dhurriyyatee Rabbana wa taqabbal du'aa",
        meaning: 'O our Lord, make me one who establishes prayer, and from my descendants. Our Lord, and accept my supplication.',
        source: 'Quran 14:40',
      },
      {
        arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
        transliteration: "Rabbij'alnee muqeemas-salati wa min dhurriyyatee Rabbana wa taqabbal du'aa",
        meaning: 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication.',
        source: 'Quran 14:40',
      },
      {
        arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        transliteration: "Allahumma a'innee 'ala dhikrika wa shukrika wa husni 'ibadatik",
        meaning: 'O Allah, help me to remember You, to be grateful to You, and to worship You in an excellent manner.',
        source: 'Abu Dawud',
        note: 'Recommended after every prayer',
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنْ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ',
        transliteration: "Allahumma innee a'oodhu bika minal jubn, wa a'oodhu bika minal bukhl, wa a'oodhu bika min an uradda ila ardhalil-'umur",
        meaning: 'O Allah, I seek Your refuge from cowardice, I seek Your refuge from miserliness, and I seek Your refuge from being returned to a decrepit age.',
        source: 'Bukhari',
        note: 'After Fajr prayer',
      },
      {
        arabic: 'اللَّهُمَّ اهْدِنَا فِيمَنْ هَدَيْتَ وَعَافِنَا فِيمَنْ عَافَيْتَ وَتَوَلَّنَا فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لَنَا فِيمَا أَعْطَيْتَ وَقِنَا شَرَّ مَا قَضَيْتَ فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ وَلَا يَعِزُّ مَنْ عَادَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
        transliteration: "Allahumm-ahdina fiman hadayt, wa 'afina fiman 'afayt, wa tawallana fiman tawallayt, wa barik lana fima a'tayt, wa qina sharra ma qadayt, fa innaka taqdi wa la yuqda 'alayk, wa innahu la yadhillu man walayt, wa la ya'izzu man 'adayt, tabarakta Rabbana wa ta'alayt",
        meaning: 'O Allah, guide us among those You have guided, pardon us among those You have pardoned, befriend us among those You have befriended, bless us in what You have given us, and protect us from the evil of what You have decreed. Verily You decree and none can decree against You. He is not humiliated whom You befriend, nor is he honoured who is Your enemy. Blessed are You, O Lord, and Exalted.',
        source: 'Abu Dawud, Tirmidhi',
        note: 'Dua Qunoot — recited in Witr prayer (3rd rakat, before or after ruku depending on madhab). Wajib per Hanafi school. Narrated by al-Hasan ibn Ali (RA), taught by the Prophet ﷺ.',
      },
    ],
  },
  {
    id: 'mosque',
    label: 'Mosque',
    icon: '🕍',
    group: 'Prayer & Worship',
    duas: [
      {
        arabic: 'أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: "A'oodhu billahil-'Adheem wa biwajhihil-Kareem wa sultanihil-qadeem minash-shaytanir-rajeem",
        meaning: 'I seek refuge in Allah the Supreme, and in His noble face, and His eternal authority, from the accursed devil.',
        source: 'Abu Dawud',
        note: 'Upon entering the mosque with right foot first',
      },
      {
        arabic: 'بِسْمِ اللَّهِ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: "Bismillahi wassalamu 'ala Rasoolillah, Allahummaghfir lee dhunoobee waftah lee abwaba rahmatik",
        meaning: 'In the name of Allah, and peace be upon the Messenger of Allah. O Allah, forgive me my sins and open for me the doors of Your mercy.',
        source: 'Ibn Majah',
        note: 'Entering the mosque',
      },
      {
        arabic: 'بِسْمِ اللَّهِ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ فَضْلِكَ',
        transliteration: "Bismillahi wassalamu 'ala Rasoolillah, Allahummaghfir lee dhunoobee waftah lee abwaba fadlik",
        meaning: 'In the name of Allah, and peace be upon the Messenger of Allah. O Allah, forgive me my sins and open for me the doors of Your grace.',
        source: 'Ibn Majah',
        note: 'Leaving the mosque',
      },
    ],
  },
  // ── Home & Family ─────────────────────────────────────────────────────────────
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    group: 'Home & Family',
    duas: [
      {
        arabic: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        transliteration: "Bismillahi walajna wa bismillahi kharajna wa 'alallahi Rabbina tawakkalna",
        meaning: 'In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust.',
        source: 'Abu Dawud',
        note: 'Entering and leaving the home',
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        transliteration: "Allahumma innee as'aluka khayral mawliji wa khayral makhraji, bismillahi walajna wa bismillahi kharajna wa 'alallahi rabbina tawakkalna",
        meaning: 'O Allah, I ask You for the best of entrances and the best of exits. In the name of Allah we enter, and in the name of Allah we leave, and upon Allah our Lord we place our trust.',
        source: 'Abu Dawud',
      },
      {
        arabic: 'رَبِّ أَنْزِلْنِي مُنْزَلًا مُبَارَكًا وَأَنْتَ خَيْرُ الْمُنْزِلِينَ',
        transliteration: "Rabbi anzilnee munzalan mubarakan wa Anta khayrul munzileen",
        meaning: 'My Lord, let me land at a blessed landing place, and You are the best to accommodate.',
        source: 'Quran 23:29',
        note: 'Upon entering a place/home',
      },
    ],
  },
  {
    id: 'parents',
    label: 'Parents',
    icon: '👨‍👩‍👧',
    group: 'Home & Family',
    duas: [
      {
        arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
        transliteration: "Rabbir-hamhuma kama rabbayani sagheeran",
        meaning: 'My Lord, have mercy upon them as they brought me up when I was small.',
        source: 'Quran 17:24',
      },
      {
        arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
        transliteration: "Rabbighfir lee wa liwalidayya wa liman dakhala baytiya mu'minan wa lil-mu'mineena wal-mu'minat",
        meaning: 'My Lord, forgive me and my parents and whoever enters my house as a believer and the believing men and believing women.',
        source: 'Quran 71:28',
      },
      {
        arabic: 'اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ، اللَّهُمَّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
        transliteration: "Allahummaghfir lee wa liwalidayya, Allahummar-hamhuma kama rabbayani sagheeran",
        meaning: 'O Allah, forgive me and my parents. O Allah, have mercy on them as they raised me when I was young.',
        source: 'Quran 17:24',
      },
    ],
  },
  // ── Travel ────────────────────────────────────────────────────────────────────
  {
    id: 'travel',
    label: 'Travel',
    icon: '✈️',
    group: 'Travel',
    duas: [
      {
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrineena wa inna ila Rabbina lamunqalibooon",
        meaning: 'Glory to Him who has subjected this to us, for we could never have accomplished this by ourselves, and truly, to our Lord we are returning.',
        source: 'Quran 43:13-14',
        note: 'When boarding a vehicle',
      },
      {
        arabic: 'اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الأَهْلِ',
        transliteration: "Allahumma hawwin 'alayna safarana hadha wat-wi 'anna bu'dah, Allahumma Antas-sahibu fis-safari wal-khaleefatu fil-ahl",
        meaning: 'O Allah, make this journey easy for us and shorten its distance. O Allah, You are our companion in the journey and guardian of our family.',
        source: 'Muslim',
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالأَهْلِ وَالْوَلَدِ',
        transliteration: "Allahumma innee a'oodhu bika min wa'tha'is-safari wa ka'abatil mandhari wa soo'il munqalabi fil mali wal ahli wal walad",
        meaning: 'O Allah, I seek Your refuge from the hardship of travel, from having a change for the worse, and from finding my family and wealth in adversity upon return.',
        source: 'Bukhari & Muslim',
      },
    ],
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: '🛒',
    group: 'Travel',
    duas: [
      {
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamdu yuhyee wa yumeetu wa huwa hayyun la yamootu biyadihil khayru wa huwa 'ala kulli shay'in Qadeer",
        meaning: 'None has the right to be worshipped except Allah, alone, without partner. His is the dominion and His is the praise. He gives life and causes death, and He is ever Living and will never die. In His Hand is all goodness, and He is over all things omnipotent.',
        source: 'Tirmidhi',
        note: 'Entering the market. Imam Tirmidhi says Allah will write a million good deeds for whoever recites this.',
      },
    ],
  },
  // ── Protection & Health ───────────────────────────────────────────────────────
  {
    id: 'protection',
    label: 'Protection',
    icon: '🛡️',
    group: 'Protection & Health',
    duas: [
      {
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Samee'ul-'Aleem",
        meaning: 'In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.',
        source: 'Abu Dawud & Tirmidhi',
        note: 'Recite 3 times in the morning and evening for complete protection',
      },
      {
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: "A'oodhu bikalimatillahit-tammati min sharri ma khalaq",
        meaning: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        source: 'Muslim',
        note: 'Recite 3 times in the evening for protection from harm',
      },
      {
        arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
        transliteration: "Allahumma 'afini fee badanee, Allahumma 'afini fee sam'ee, Allahumma 'afini fee basaree, la ilaha illa Anta",
        meaning: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is none worthy of worship but You.',
        source: 'Abu Dawud',
        note: 'Recite 3 times in the morning and evening',
      },
    ],
  },
  {
    id: 'sickness',
    label: 'Sickness & Healing',
    icon: '🤲',
    group: 'Protection & Health',
    duas: [
      {
        arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
        transliteration: "Allahumma Rabban-naasi adhhibil-ba's, ishfihi wa Antash-Shaafee, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama",
        meaning: 'O Allah, Lord of mankind, remove the hardship and heal him/her. You are the Healer. There is no healing except Your healing — a healing that leaves no illness.',
        source: 'Bukhari & Muslim',
        note: 'Place right hand on afflicted area and recite 7 times when visiting the sick',
      },
      {
        arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
        transliteration: "As'alullaahal-'Adheema Rabbal-'Arshil-'Adheemi an yashfiyak",
        meaning: 'I ask Allah the Supreme, Lord of the Supreme Throne, to cure you.',
        source: 'Abu Dawud & Tirmidhi',
        note: 'Recite 7 times when visiting the sick',
      },
      {
        arabic: 'بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ وَمِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنٍ حَاسِدٍ اللَّهُ يَشْفِيكَ بِسْمِ اللَّهِ أَرْقِيكَ',
        transliteration: "Bismillahi arqeeka min kulli shay'in yu'dheeka wa min sharri kulli nafsin aw 'aynin hasiding Allahu yashfeeka bismillahi arqeeka",
        meaning: 'In the name of Allah I perform ruqyah (healing recitation) for you, from everything that harms you, and from the evil of every soul and envious eye. May Allah heal you. In the name of Allah I perform ruqyah for you.',
        source: 'Muslim',
      },
    ],
  },
  // ── Forgiveness & Mercy ───────────────────────────────────────────────────────
  {
    id: 'forgiveness',
    label: 'Forgiveness',
    icon: '🤍',
    group: 'Forgiveness & Mercy',
    duas: [
      {
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
        transliteration: "Astaghfirullahal-'Adheemal-ladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh",
        meaning: 'I seek the forgiveness of Allah the Mighty, whom there is no god but He, the Living, the Self-Sustaining, and I repent to Him.',
        source: 'Abu Dawud & Tirmidhi',
        note: 'Whoever says this, Allah will forgive him even if he fled from the battlefield',
      },
      {
        arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
        transliteration: "Rabbana dhalamna anfusana wa-in lam taghfir lana wa tarhamna lanakoona minal-khasirin",
        meaning: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',
        source: 'Quran 7:23',
        note: 'The dua of Prophet Adam and Eve',
      },
      {
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        transliteration: "Rabbighfir lee wa tub 'alayya innaka Antat-Tawwaabur-Raheem",
        meaning: 'My Lord, forgive me and accept my repentance. You are the Accepting of Repentance, the Most Merciful.',
        source: 'Abu Dawud & Tirmidhi',
      },
      {
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: "Allahumma Anta Rabbee la ilaha illa Anta, khalaqtanee wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'oodhu bika min sharri ma sana't, aboo'u laka bini'matika 'alayya wa aboo'u bidhanbee, faghfir lee fa'innahu la yaghfirudh-dhunooba illa Anta",
        meaning: 'O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant. I am upon Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin. So forgive me, for none forgives sins except You.',
        source: 'Bukhari',
        note: 'The Master of Seeking Forgiveness (Sayyidul Istighfar)',
      },
    ],
  },
  {
    id: 'anxiety',
    label: 'Anxiety & Hardship',
    icon: '💙',
    group: 'Forgiveness & Mercy',
    duas: [
      {
        arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        transliteration: "La ilaha illa Anta subhanaka innee kuntu minadh-dhalimeen",
        meaning: 'There is none worthy of worship besides You. Glory be to You. Truly, I have been among the wrongdoers.',
        source: 'Quran 21:87',
        note: "The dua of Prophet Yunus (AS) from inside the whale. The Prophet ﷺ said whoever calls upon Allah with these words will receive a response.",
      },
      {
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
        transliteration: "Allahumma innee a'oodhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dhala'id-dayni wa ghalabatir-rijal",
        meaning: 'O Allah, I seek refuge in You from worry and grief, from helplessness and laziness, from miserliness and cowardice, and from being heavily in debt and from being overpowered by others.',
        source: 'Bukhari',
      },
      {
        arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        transliteration: "Hasbunallahu wa ni'mal-wakeel",
        meaning: 'Allah is sufficient for us and He is the Best Disposer of affairs.',
        source: 'Quran 3:173',
        note: 'The words of Prophet Ibrahim (AS) when thrown into fire, and the words of the Companions when threatened',
      },
      {
        arabic: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ وَأَصْلِحْ لِي شَأْنِي كُلَّهُ',
        transliteration: "Allahumma rahmataka arjoo fala takilnee ila nafsee tarfata 'aynin wa aslih lee sha'nee kullah",
        meaning: 'O Allah, it is Your mercy that I hope for. Do not leave me in charge of my affairs even for the blink of an eye, and rectify for me all of my affairs.',
        source: 'Abu Dawud',
      },
    ],
  },
  // ── Special Occasions ─────────────────────────────────────────────────────────
  {
    id: 'rain',
    label: 'Rain',
    icon: '🌧️',
    group: 'Special Occasions',
    duas: [
      {
        arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
        transliteration: "Allahumma sayyiban nafi'a",
        meaning: 'O Allah, bring beneficial rain.',
        source: 'Bukhari',
        note: 'When it starts to rain',
      },
      {
        arabic: 'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ',
        transliteration: "Mutirna bifadlillahi wa rahmatihi",
        meaning: 'We have been given rain by the grace and mercy of Allah.',
        source: 'Bukhari & Muslim',
        note: 'After it rains',
      },
      {
        arabic: 'اللَّهُمَّ حَوَالَيْنَا وَلَا عَلَيْنَا، اللَّهُمَّ عَلَى الآكَامِ وَالظِّرَابِ وَبُطُونِ الأَوْدِيَةِ وَمَنَابِتِ الشَّجَرِ',
        transliteration: "Allahumma hawalayna wa la 'alayna, Allahumma 'alal-akammi wadh-dhirabi wa butoonil awdiyati wa manabitis-shajar",
        meaning: 'O Allah, let it rain around us and not on us. O Allah, let it rain on the hills, mountains, valleys, and in the places where trees grow.',
        source: 'Bukhari & Muslim',
        note: 'During heavy rain or when rain is causing difficulty',
      },
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    icon: '🚿',
    group: 'Special Occasions',
    duas: [
      {
        arabic: 'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
        transliteration: "Bismillah, Allahumma innee a'oodhu bika minal-khubuthi wal-khaba'ith",
        meaning: 'In the name of Allah. O Allah, I seek refuge in You from the male and female evil spirits.',
        source: 'Bukhari & Muslim',
        note: 'Before entering the bathroom',
      },
      {
        arabic: 'غُفْرَانَكَ',
        transliteration: "Ghufraanak",
        meaning: 'I seek Your forgiveness.',
        source: 'Abu Dawud & Tirmidhi',
        note: 'Upon leaving the bathroom',
      },
    ],
  },
  {
    id: 'dressing',
    label: 'Dressing',
    icon: '👔',
    group: 'Special Occasions',
    duas: [
      {
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        transliteration: "Alhamdu lillahil-ladhi kasanee hadha wa razaqaneehi min ghayri hawlin minnee wa la quwwah",
        meaning: 'All praise is for Allah who clothed me with this and provided it for me with no power or might from myself.',
        source: 'Abu Dawud & Tirmidhi',
        note: 'Whoever says this when putting on new clothes will have their past sins forgiven',
      },
    ],
  },
  // ── Wudu ────────────────────────────────────────────────────────────────────
  {
    id: 'wudu',
    label: 'Wudu',
    icon: '💧',
    group: 'Daily Routines',
    duas: [
      {
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        meaning: 'In the name of Allah.',
        source: 'Abu Dawud',
        note: 'Saying Bismillah before wudu is Sunnah. Wudu without it is valid.',
      },
      {
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'Ashhadu an la ilaha illallahu wahdahu la shareeka lah, wa ashhadu anna Muhammadan abduhu wa rasooluh',
        meaning: 'I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His slave and messenger.',
        source: 'Muslim',
        note: 'Whoever says this after wudu, all 8 gates of Paradise are opened for them.',
      },
      {
        arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
        transliteration: "Allahumma-j'alnee minat-tawwabeena waj-alnee minal-mutatahhireen",
        meaning: 'O Allah, make me among those who repent and among those who purify themselves.',
        source: 'Tirmidhi',
      },
    ],
  },
  // ── Clothing ────────────────────────────────────────────────────────────────
  {
    id: 'clothing',
    label: 'Clothing',
    icon: '👕',
    group: 'Daily Routines',
    duas: [
      {
        arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ',
        transliteration: 'Allahumma lakal hamdu Anta kasawtaneehi, as-aluka min khayrihi wa khayri ma suni-a lahu, wa a-oodhu bika min sharrihi wa sharri ma suni-a lahu',
        meaning: 'O Allah, all praise is due to You for clothing me with this. I ask You for its good and the good for which it was made, and I seek Your protection from its evil.',
        source: 'Abu Dawud, Tirmidhi',
      },
      {
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        meaning: 'In the name of Allah.',
        source: 'Adab al-Mufrad',
        note: 'Say Bismillah when putting on any garment. Begin with the right side.',
      },
    ],
  },
  // ── Looking in Mirror ───────────────────────────────────────────────────────
  {
    id: 'mirror',
    label: 'Looking in Mirror',
    icon: '🪞',
    group: 'Daily Routines',
    duas: [
      {
        arabic: 'اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
        transliteration: 'Allahumma anta hassanta khalqee fa-hassin khuluqee',
        meaning: 'O Allah, You have made my physical form beautiful, so beautify my character too.',
        source: 'Ahmad, Ibn Hibban',
        note: 'Attributed to the Prophet \uFDFA. Graded hasan by scholars.',
      },
    ],
  },
  // ── Anger ───────────────────────────────────────────────────────────────────
  {
    id: 'anger',
    label: 'Anger',
    icon: '😤',
    group: 'Forgiveness & Mercy',
    duas: [
      {
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'A-oodhu billahi minash-shaytanir-rajeem',
        meaning: 'I seek protection with Allah from the accursed Shaytan.',
        source: 'Bukhari & Muslim',
        note: 'The Prophet \uFDFA said: If standing and angry, sit. If anger does not leave, lie down.',
      },
      {
        arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        transliteration: 'Rabbish-rah lee sadree wa yassir lee amree',
        meaning: 'My Lord, expand my chest and ease my affairs.',
        source: 'Quran 20:25-26',
      },
    ],
  },
  // ── Seeking Knowledge ───────────────────────────────────────────────────────
  {
    id: 'knowledge',
    label: 'Seeking Knowledge',
    icon: '📖',
    group: 'Prayer & Worship',
    duas: [
      {
        arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا',
        transliteration: 'Allahumma-nfa-nee bima allamtanee, wa-allim-nee ma yanfa-unee, wa-zidnee ilma',
        meaning: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.',
        source: 'Tirmidhi, Ibn Majah',
      },
      {
        arabic: 'رَبِّ زِدْنِي عِلْمًا',
        transliteration: 'Rabbi zidnee ilma',
        meaning: 'My Lord, increase me in knowledge.',
        source: 'Quran 20:114',
      },
    ],
  },
  // ── Istighfar ───────────────────────────────────────────────────────────────
  {
    id: 'istighfar',
    label: 'Istighfar',
    icon: '🤍',
    group: 'Forgiveness & Mercy',
    duas: [
      {
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        transliteration: 'Astaghfirullahil-Adheem alladhee la ilaha illa Huwal-Hayyul-Qayyoom wa atoobu ilayh',
        meaning: 'I seek forgiveness from Allah the Almighty, besides Whom there is none worthy of worship, the Ever-Living, the Self-Sustaining, and I turn to Him in repentance.',
        source: 'Abu Dawud, Tirmidhi',
        note: 'Whoever says this, Allah will forgive them even if they have fled from battle.',
      },
      {
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: "Allahumma Anta Rabbee la ilaha illa Anta, khalaqtanee wa ana abduk, wa ana ala ahdika wa wa-dika mastata-t, a-oodhu bika min sharri ma sana-t, aboo-u laka bini-matika alayya, wa aboo-u laka bi-dhanbee faghfir lee fa-innahu la yaghfirudhdhunoba illa Ant",
        meaning: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant. I abide by Your covenant and promise as best I can. I seek protection from the evil I have done. I acknowledge Your favour upon me and acknowledge my sin — so forgive me, for none forgives sins but You.',
        source: 'Bukhari',
        note: 'Whoever says this in the morning with conviction and dies that day, will be among the people of Paradise. Same for the evening.',
      },
    ],
  },
]

// ─── Groups ───────────────────────────────────────────────────────────────────

const GROUPS = [...new Set(CATEGORIES.map(c => c.group))]

// ─── Component ────────────────────────────────────────────────────────────────

const BOOKMARKS_KEY = 'dua_bookmarks'

export default function DuasPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    const saved = getItem<string[]>(BOOKMARKS_KEY, [])
    return new Set(saved)
  })
  const [showBookmarks, setShowBookmarks] = useState(false)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedIdx(key)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const toggleBookmark = (key: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      setItem(BOOKMARKS_KEY, [...next])
      return next
    })
  }

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)

  // Search across all duas
  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    const results: { cat: Category; dua: Dua; duaIdx: number }[] = []
    for (const cat of CATEGORIES) {
      for (let i = 0; i < cat.duas.length; i++) {
        const dua = cat.duas[i]
        if (
          dua.transliteration.toLowerCase().includes(q) ||
          dua.meaning.toLowerCase().includes(q) ||
          cat.label.toLowerCase().includes(q)
        ) {
          results.push({ cat, dua, duaIdx: i })
        }
      }
    }
    return results
  }, [search])

  // Bookmarked duas
  const bookmarkedDuas = useMemo(() => {
    const results: { cat: Category; dua: Dua; duaIdx: number }[] = []
    for (const cat of CATEGORIES) {
      for (let i = 0; i < cat.duas.length; i++) {
        const key = `${cat.id}-${i}`
        if (bookmarks.has(key)) results.push({ cat, dua: cat.duas[i], duaIdx: i })
      }
    }
    return results
  }, [bookmarks])

  const filteredCategories = activeGroup
    ? CATEGORIES.filter(c => c.group === activeGroup)
    : CATEGORIES

  const DuaCard = ({ dua, catId, idx }: { dua: Dua; catId: string; idx: number }) => {
    const key = `${catId}-${idx}`
    const isBookmarked = bookmarks.has(key)
    const isCopied = copiedIdx === key
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
        {/* Arabic */}
        <p
          className="text-right leading-[2.4] text-white"
          style={{ fontFamily: '"Amiri Quran", "Amiri", serif', fontSize: '1.15rem' }}
          dir="rtl"
        >
          {dua.arabic}
        </p>

        {/* Transliteration */}
        <p className="mt-3 text-xs font-semibold italic text-purple-400">{dua.transliteration}</p>

        {/* Meaning */}
        <p className="mt-1.5 text-xs leading-relaxed text-gray-300">{dua.meaning}</p>

        {/* Source + Note */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {dua.source && (
            <span className="rounded-lg bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
              {dua.source}
            </span>
          )}
          {dua.note && (
            <span className="rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
              ✦ {dua.note}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={() => shareOrCopy({
              title: dua.meaning,
              text: `${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.meaning}"\n\n${dua.source ? `— ${dua.source}` : ''}\n\n— via MasjidConnect GY`,
            })}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold bg-gray-800 text-gray-500 active:bg-gray-700 transition-all"
          >
            <Share2 className="h-3 w-3" />
            Share
          </button>
          <button
            onClick={() => copy(`${dua.arabic}\n\n${dua.transliteration}\n\n${dua.meaning}`, key)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all ${
              isCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500 active:bg-gray-700'
            }`}
          >
            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {isCopied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => toggleBookmark(key)}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
              isBookmarked ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-800 text-gray-500 active:bg-gray-700'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0a0b14] pb-28">
      {/* Arabesque pattern */}
      <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 overflow-hidden" aria-hidden>
        <svg viewBox="0 0 200 200" style={{animation:'arabesque-drift 6s ease-in-out infinite',opacity:0.08}} className="text-purple-300" fill="currentColor">
          <polygon points="100,10 120,80 190,80 135,125 155,195 100,155 45,195 65,125 10,80 80,80" />
        </svg>
      </div>

      <PageHero
        icon={BookOpen}
        title="Duas"
        subtitle={`${CATEGORIES.reduce((n, c) => n + c.duas.length, 0)} supplications · ${CATEGORIES.length} categories`}
        gradient="from-purple-900 to-violet-900"
        showBack
      
        heroTheme="duas"
      />

      {/* ── Toolbar ─────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0a0b14]/95 backdrop-blur border-b border-gray-800/50 px-4 py-2.5 space-y-2">
        {/* Actions row */}
        <div className="flex items-center gap-2">
          {/* Bookmarks toggle */}
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              showBookmarks ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-800 text-gray-400'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${showBookmarks ? 'fill-rose-400' : ''}`} />
            {bookmarks.size > 0 ? `Saved (${bookmarks.size})` : 'Saved'}
          </button>

          {/* Group filter */}
          <div className="flex-1 overflow-x-auto scrollbar-none">
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveGroup(null)}
                className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all ${
                  !activeGroup ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-500'
                }`}
              >
                All
              </button>
              {GROUPS.map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(activeGroup === g ? null : g)}
                  className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all ${
                    activeGroup === g ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <button
            onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearch('') }}
            className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
              showSearch ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'
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
            placeholder="Search by meaning or transliteration..."
            autoFocus
            className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50"
          />
        )}

        {/* Category pills */}
        {!search && !showBookmarks && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {filteredCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="px-4 pt-4 space-y-3">
        {/* Search results */}
        {search && (
          <>
            <p className="text-[11px] text-gray-500">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{search}"</p>
            {searchResults.length === 0 && (
              <div className="pt-8 text-center">
                <p className="text-gray-500 text-sm">No duas found.</p>
              </div>
            )}
            {searchResults.map(({ cat, dua, duaIdx }) => (
              <div key={`${cat.id}-${duaIdx}`}>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  {cat.icon} {cat.label}
                </p>
                <DuaCard dua={dua} catId={cat.id} idx={duaIdx} />
              </div>
            ))}
          </>
        )}

        {/* Bookmarks */}
        {!search && showBookmarks && (
          <>
            {bookmarkedDuas.length === 0 ? (
              <div className="pt-16 text-center">
                <p className="text-3xl mb-2">🤍</p>
                <p className="text-gray-500 text-sm">No saved duas yet</p>
                <p className="text-gray-600 text-xs mt-1">Tap the heart icon on any dua to save it</p>
              </div>
            ) : bookmarkedDuas.map(({ cat, dua, duaIdx }) => (
              <div key={`${cat.id}-${duaIdx}`}>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  {cat.icon} {cat.label}
                </p>
                <DuaCard dua={dua} catId={cat.id} idx={duaIdx} />
              </div>
            ))}
          </>
        )}

        {/* Normal category view */}
        {!search && !showBookmarks && activeCat && (
          <>
            <div className="flex items-center gap-2 pb-1">
              <span className="text-lg">{activeCat.icon}</span>
              <h2 className="text-sm font-bold text-white">{activeCat.label}</h2>
              <span className="rounded-lg bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
                {activeCat.duas.length} duas
              </span>
            </div>
            {activeCat.duas.map((dua, i) => (
              <DuaCard key={i} dua={dua} catId={activeCat.id} idx={i} />
            ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
