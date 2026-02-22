// Noorani Qaida - Complete lesson structure
// Based on the traditional Noorani Qaida curriculum by Maulvi Noor Muhammad Ludhyanvi

export interface LetterForm {
  initial: string
  medial: string
  final: string
  name: string
}

export interface AlphabetContent {
  arabic: string
  name: string
  trans: string
  makhraj: string
}

export interface CompoundContent {
  arabic: string
  name: string
  note: string
}

export interface HarakatExample {
  arabic: string
  trans: string
}

export interface HarakatSection {
  section: string
  desc: string
  examples: HarakatExample[]
}

export interface TajweedSection {
  section: string
  desc: string
  examples: HarakatExample[]
}

export interface QaidaLesson {
  id: number
  title: string
  arabicTitle: string
  subtitle: string
  description: string
  icon: string
  type: 'alphabet' | 'compounds' | 'harakat' | 'maddah' | 'tajweed'
  content: AlphabetContent[] | CompoundContent[] | HarakatSection[] | TajweedSection[]
}

export interface MakhrajGroup {
  name: string
  letters: string[]
}

// Arabic letter forms: isolated, initial, medial, final
export const LETTER_FORMS: Record<string, LetterForm> = {
  'ا': { initial: 'ا', medial: 'ـا', final: 'ـا', name: 'Alif' },
  'ب': { initial: 'بـ', medial: 'ـبـ', final: 'ـب', name: 'Ba' },
  'ت': { initial: 'تـ', medial: 'ـتـ', final: 'ـت', name: 'Ta' },
  'ث': { initial: 'ثـ', medial: 'ـثـ', final: 'ـث', name: 'Tha' },
  'ج': { initial: 'جـ', medial: 'ـجـ', final: 'ـج', name: 'Jeem' },
  'ح': { initial: 'حـ', medial: 'ـحـ', final: 'ـح', name: 'Haa' },
  'خ': { initial: 'خـ', medial: 'ـخـ', final: 'ـخ', name: 'Khaa' },
  'د': { initial: 'د', medial: 'ـد', final: 'ـد', name: 'Daal' },
  'ذ': { initial: 'ذ', medial: 'ـذ', final: 'ـذ', name: 'Dhaal' },
  'ر': { initial: 'ر', medial: 'ـر', final: 'ـر', name: 'Raa' },
  'ز': { initial: 'ز', medial: 'ـز', final: 'ـز', name: 'Zaa' },
  'س': { initial: 'سـ', medial: 'ـسـ', final: 'ـس', name: 'Seen' },
  'ش': { initial: 'شـ', medial: 'ـشـ', final: 'ـش', name: 'Sheen' },
  'ص': { initial: 'صـ', medial: 'ـصـ', final: 'ـص', name: 'Saad' },
  'ض': { initial: 'ضـ', medial: 'ـضـ', final: 'ـض', name: 'Daad' },
  'ط': { initial: 'طـ', medial: 'ـطـ', final: 'ـط', name: 'Taa' },
  'ظ': { initial: 'ظـ', medial: 'ـظـ', final: 'ـظ', name: 'Dhaa' },
  'ع': { initial: 'عـ', medial: 'ـعـ', final: 'ـع', name: 'Ain' },
  'غ': { initial: 'غـ', medial: 'ـغـ', final: 'ـغ', name: 'Ghain' },
  'ف': { initial: 'فـ', medial: 'ـفـ', final: 'ـف', name: 'Faa' },
  'ق': { initial: 'قـ', medial: 'ـقـ', final: 'ـق', name: 'Qaaf' },
  'ك': { initial: 'كـ', medial: 'ـكـ', final: 'ـك', name: 'Kaaf' },
  'ل': { initial: 'لـ', medial: 'ـلـ', final: 'ـل', name: 'Laam' },
  'م': { initial: 'مـ', medial: 'ـمـ', final: 'ـم', name: 'Meem' },
  'ن': { initial: 'نـ', medial: 'ـنـ', final: 'ـن', name: 'Noon' },
  'و': { initial: 'و', medial: 'ـو', final: 'ـو', name: 'Waw' },
  'ه': { initial: 'هـ', medial: 'ـهـ', final: 'ـه', name: 'Haa' },
  'ء': { initial: 'ء', medial: 'ء', final: 'ء', name: 'Hamza' },
  'ي': { initial: 'يـ', medial: 'ـيـ', final: 'ـي', name: 'Yaa' },
}

export const qaidaLessons: QaidaLesson[] = [
  {
    id: 1,
    title: 'The Arabic Alphabet',
    arabicTitle: 'الحروف المفردة',
    subtitle: 'Huroof Mufradat',
    description: 'Learn the 29 individual Arabic letters',
    icon: '🔤',
    type: 'alphabet',
    content: [
      { arabic: 'ا', name: 'Alif', trans: 'a', makhraj: 'Throat (deepest)' },
      { arabic: 'ب', name: 'Ba', trans: 'b', makhraj: 'Lips (together)' },
      { arabic: 'ت', name: 'Ta', trans: 't', makhraj: 'Tongue tip + upper teeth base' },
      { arabic: 'ث', name: 'Tha', trans: 'th', makhraj: 'Tongue tip + upper teeth edge' },
      { arabic: 'ج', name: 'Jeem', trans: 'j', makhraj: 'Middle tongue + roof' },
      { arabic: 'ح', name: 'Haa', trans: 'ḥ', makhraj: 'Middle throat' },
      { arabic: 'خ', name: 'Khaa', trans: 'kh', makhraj: 'Near throat opening' },
      { arabic: 'د', name: 'Daal', trans: 'd', makhraj: 'Tongue tip + upper teeth base' },
      { arabic: 'ذ', name: 'Dhaal', trans: 'dh', makhraj: 'Tongue tip + upper teeth edge' },
      { arabic: 'ر', name: 'Raa', trans: 'r', makhraj: 'Tongue tip (rolled)' },
      { arabic: 'ز', name: 'Zaa', trans: 'z', makhraj: 'Tongue tip + lower teeth edge' },
      { arabic: 'س', name: 'Seen', trans: 's', makhraj: 'Tongue tip + lower teeth edge' },
      { arabic: 'ش', name: 'Sheen', trans: 'sh', makhraj: 'Middle tongue + roof' },
      { arabic: 'ص', name: 'Saad', trans: 'ṣ', makhraj: 'Tongue tip + lower teeth (heavy)' },
      { arabic: 'ض', name: 'Daad', trans: 'ḍ', makhraj: 'Tongue side + upper molars' },
      { arabic: 'ط', name: 'Taa', trans: 'ṭ', makhraj: 'Tongue tip + upper teeth base (heavy)' },
      { arabic: 'ظ', name: 'Dhaa', trans: 'ẓ', makhraj: 'Tongue tip + upper teeth edge (heavy)' },
      { arabic: 'ع', name: 'Ain', trans: 'ʿ', makhraj: 'Middle throat' },
      { arabic: 'غ', name: 'Ghain', trans: 'gh', makhraj: 'Near throat opening' },
      { arabic: 'ف', name: 'Faa', trans: 'f', makhraj: 'Lower lip + upper teeth' },
      { arabic: 'ق', name: 'Qaaf', trans: 'q', makhraj: 'Back tongue + soft palate' },
      { arabic: 'ك', name: 'Kaaf', trans: 'k', makhraj: 'Back tongue + hard palate' },
      { arabic: 'ل', name: 'Laam', trans: 'l', makhraj: 'Tongue sides + gums' },
      { arabic: 'م', name: 'Meem', trans: 'm', makhraj: 'Lips (together)' },
      { arabic: 'ن', name: 'Noon', trans: 'n', makhraj: 'Tongue tip + upper gums' },
      { arabic: 'و', name: 'Waw', trans: 'w', makhraj: 'Lips (rounded)' },
      { arabic: 'ه', name: 'Haa', trans: 'h', makhraj: 'Deepest throat' },
      { arabic: 'ء', name: 'Hamza', trans: 'ʾ', makhraj: 'Deepest throat (glottal stop)' },
      { arabic: 'ي', name: 'Yaa', trans: 'y', makhraj: 'Middle tongue + roof' },
    ],
  },
  {
    id: 2,
    title: 'Compound Letters',
    arabicTitle: 'الحروف المركبة',
    subtitle: 'Huroof Murakkabat',
    description: 'How letters connect and change shape',
    icon: '🔗',
    type: 'compounds',
    content: [
      { arabic: 'لا', name: 'Laam-Alif', note: 'Special ligature' },
      { arabic: 'بب', name: 'Ba-Ba joined', note: 'Two letters connected' },
      { arabic: 'تث', name: 'Ta-Tha joined', note: 'Similar letters together' },
      { arabic: 'جح', name: 'Jeem-Haa joined', note: 'Similar letters together' },
      { arabic: 'سش', name: 'Seen-Sheen joined', note: 'Dotted vs undotted' },
      { arabic: 'صض', name: 'Saad-Daad joined', note: 'Similar shape pair' },
      { arabic: 'طظ', name: 'Taa-Dhaa joined', note: 'Similar shape pair' },
      { arabic: 'عغ', name: 'Ain-Ghain joined', note: 'Similar shape pair' },
      { arabic: 'فق', name: 'Faa-Qaaf joined', note: 'One dot vs two' },
    ],
  },
  {
    id: 3,
    title: 'Short Vowels',
    arabicTitle: 'الحركات',
    subtitle: 'Harakat',
    description: 'Fatha (Zabar), Kasra (Zer), Damma (Pesh)',
    icon: '◌َ',
    type: 'harakat',
    content: [
      {
        section: 'Fatha (Zabar) ـَ',
        desc: 'A short "a" sound, marked above the letter',
        examples: [
          { arabic: 'بَ', trans: 'ba' }, { arabic: 'تَ', trans: 'ta' }, { arabic: 'ثَ', trans: 'tha' },
          { arabic: 'جَ', trans: 'ja' }, { arabic: 'حَ', trans: 'ḥa' }, { arabic: 'خَ', trans: 'kha' },
          { arabic: 'دَ', trans: 'da' }, { arabic: 'رَ', trans: 'ra' }, { arabic: 'سَ', trans: 'sa' },
          { arabic: 'عَ', trans: 'ʿa' }, { arabic: 'فَ', trans: 'fa' }, { arabic: 'قَ', trans: 'qa' },
          { arabic: 'كَ', trans: 'ka' }, { arabic: 'لَ', trans: 'la' }, { arabic: 'مَ', trans: 'ma' },
          { arabic: 'نَ', trans: 'na' },
        ],
      },
      {
        section: 'Kasra (Zer) ـِ',
        desc: 'A short "i" sound, marked below the letter',
        examples: [
          { arabic: 'بِ', trans: 'bi' }, { arabic: 'تِ', trans: 'ti' }, { arabic: 'جِ', trans: 'ji' },
          { arabic: 'حِ', trans: 'ḥi' }, { arabic: 'دِ', trans: 'di' }, { arabic: 'رِ', trans: 'ri' },
          { arabic: 'سِ', trans: 'si' }, { arabic: 'عِ', trans: 'ʿi' }, { arabic: 'فِ', trans: 'fi' },
          { arabic: 'قِ', trans: 'qi' }, { arabic: 'كِ', trans: 'ki' }, { arabic: 'لِ', trans: 'li' },
          { arabic: 'مِ', trans: 'mi' }, { arabic: 'نِ', trans: 'ni' },
        ],
      },
      {
        section: 'Damma (Pesh) ـُ',
        desc: 'A short "u" sound, marked above the letter',
        examples: [
          { arabic: 'بُ', trans: 'bu' }, { arabic: 'تُ', trans: 'tu' }, { arabic: 'جُ', trans: 'ju' },
          { arabic: 'حُ', trans: 'ḥu' }, { arabic: 'دُ', trans: 'du' }, { arabic: 'رُ', trans: 'ru' },
          { arabic: 'سُ', trans: 'su' }, { arabic: 'عُ', trans: 'ʿu' }, { arabic: 'فُ', trans: 'fu' },
          { arabic: 'قُ', trans: 'qu' }, { arabic: 'كُ', trans: 'ku' }, { arabic: 'لُ', trans: 'lu' },
          { arabic: 'مُ', trans: 'mu' }, { arabic: 'نُ', trans: 'nu' },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Long Vowels',
    arabicTitle: 'حروف المد',
    subtitle: 'Huroof Maddah',
    description: 'Alif Madd, Waw Madd, Ya Madd',
    icon: '〰️',
    type: 'maddah',
    content: [
      {
        section: 'Alif Madd (Long "aa")',
        desc: 'Fatha followed by Alif — stretch 2 counts',
        examples: [
          { arabic: 'بَا', trans: 'baa' }, { arabic: 'تَا', trans: 'taa' }, { arabic: 'سَا', trans: 'saa' },
          { arabic: 'مَا', trans: 'maa' }, { arabic: 'نَا', trans: 'naa' }, { arabic: 'لَا', trans: 'laa' },
          { arabic: 'كَا', trans: 'kaa' }, { arabic: 'فَا', trans: 'faa' },
        ],
      },
      {
        section: 'Waw Madd (Long "oo")',
        desc: 'Damma followed by Waw — stretch 2 counts',
        examples: [
          { arabic: 'بُو', trans: 'boo' }, { arabic: 'تُو', trans: 'too' }, { arabic: 'سُو', trans: 'soo' },
          { arabic: 'نُو', trans: 'noo' }, { arabic: 'لُو', trans: 'loo' }, { arabic: 'كُو', trans: 'koo' },
        ],
      },
      {
        section: 'Ya Madd (Long "ee")',
        desc: 'Kasra followed by Ya — stretch 2 counts',
        examples: [
          { arabic: 'بِي', trans: 'bee' }, { arabic: 'تِي', trans: 'tee' }, { arabic: 'سِي', trans: 'see' },
          { arabic: 'نِي', trans: 'nee' }, { arabic: 'لِي', trans: 'lee' }, { arabic: 'فِي', trans: 'fee' },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Tanween',
    arabicTitle: 'التنوين',
    subtitle: 'Double Vowels',
    description: 'Fathatayn, Kasratayn, Dammatayn (nun sound)',
    icon: '◌ً',
    type: 'harakat',
    content: [
      {
        section: 'Fathatayn ـً (an)',
        desc: 'Double Fatha — makes an "an" sound at the end',
        examples: [
          { arabic: 'بًا', trans: 'ban' }, { arabic: 'تًا', trans: 'tan' }, { arabic: 'سًا', trans: 'san' },
          { arabic: 'كِتَابًا', trans: 'kitaaban' }, { arabic: 'عِلْمًا', trans: 'ʿilman' },
        ],
      },
      {
        section: 'Kasratayn ـٍ (in)',
        desc: 'Double Kasra — makes an "in" sound at the end',
        examples: [
          { arabic: 'بٍ', trans: 'bin' }, { arabic: 'تٍ', trans: 'tin' },
          { arabic: 'كِتَابٍ', trans: 'kitaabin' }, { arabic: 'عِلْمٍ', trans: 'ʿilmin' },
        ],
      },
      {
        section: 'Dammatayn ـٌ (un)',
        desc: 'Double Damma — makes an "un" sound at the end',
        examples: [
          { arabic: 'بٌ', trans: 'bun' }, { arabic: 'تٌ', trans: 'tun' },
          { arabic: 'كِتَابٌ', trans: 'kitaabun' }, { arabic: 'عِلْمٌ', trans: 'ʿilmun' },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Sukoon & Jazm',
    arabicTitle: 'السكون والجزم',
    subtitle: 'Stopping on a Letter',
    description: 'When a letter has no vowel — stop sound',
    icon: '◌ْ',
    type: 'harakat',
    content: [
      {
        section: 'Sukoon ـْ',
        desc: 'A circle above the letter means no vowel — the letter stops. Pronounce only the consonant sound.',
        examples: [
          { arabic: 'أَبْ', trans: 'ab' }, { arabic: 'أَتْ', trans: 'at' }, { arabic: 'أَنْ', trans: 'an' },
          { arabic: 'مِنْ', trans: 'min' }, { arabic: 'عَنْ', trans: 'ʿan' }, { arabic: 'قُلْ', trans: 'qul' },
          { arabic: 'كَمْ', trans: 'kam' },
        ],
      },
    ],
  },
  {
    id: 7,
    title: 'Shaddah',
    arabicTitle: 'الشدة',
    subtitle: 'Doubling a Letter',
    description: 'Emphasis mark — pronounce the letter twice',
    icon: '◌ّ',
    type: 'harakat',
    content: [
      {
        section: 'Shaddah ـّ',
        desc: 'A "w" shape above the letter means it is doubled. The first is with Sukoon, the second with a vowel.',
        examples: [
          { arabic: 'بَبَّ', trans: 'babba' }, { arabic: 'رَبَّ', trans: 'rabba' }, { arabic: 'حَقَّ', trans: 'ḥaqqa' },
          { arabic: 'إِنَّ', trans: 'inna' }, { arabic: 'أَنَّ', trans: 'anna' }, { arabic: 'ثُمَّ', trans: 'thumma' },
          { arabic: 'جَنَّة', trans: 'jannah' },
        ],
      },
    ],
  },
  {
    id: 8,
    title: 'Soft Vowels',
    arabicTitle: 'حروف اللين',
    subtitle: 'Huroof Leen',
    description: 'Waw and Ya with Fatha before them',
    icon: '🎵',
    type: 'harakat',
    content: [
      {
        section: 'Huroof Leen',
        desc: 'When Waw (و) or Ya (ي) have Sukoon and the letter before has Fatha, they become soft vowels.',
        examples: [
          { arabic: 'بَيْت', trans: 'bayt (house)' }, { arabic: 'خَوْف', trans: 'khawf (fear)' },
          { arabic: 'لَيْل', trans: 'layl (night)' }, { arabic: 'قَوْم', trans: 'qawm (people)' },
          { arabic: 'عَيْن', trans: 'ʿayn (eye)' }, { arabic: 'صَوْت', trans: 'ṣawt (voice)' },
        ],
      },
    ],
  },
  {
    id: 9,
    title: 'Noon Sakinah & Tanween Rules',
    arabicTitle: 'أحكام النون الساكنة والتنوين',
    subtitle: 'Ikhfa, Idgham, Iqlab, Izhar',
    description: 'The four rules when Noon Sakinah meets another letter',
    icon: '📖',
    type: 'tajweed',
    content: [
      {
        section: 'Izhar (Clear) — 6 throat letters',
        desc: 'When Noon Sakinah/Tanween is followed by: ء ه ع ح غ خ, pronounce the Noon clearly.',
        examples: [
          { arabic: 'مِنْ أَحَدٍ', trans: 'min aḥadin' },
          { arabic: 'مِنْ عِلْمٍ', trans: 'min ʿilmin' },
          { arabic: 'أَنْعَمْتَ', trans: 'anʿamta' },
        ],
      },
      {
        section: 'Idgham (Merging) — يرملون',
        desc: 'When Noon Sakinah/Tanween is followed by: ي ر م ل و ن, the Noon merges into the next letter.',
        examples: [
          { arabic: 'مِنْ يَوْمٍ', trans: 'miy-yawmin' },
          { arabic: 'مِنْ رَبِّ', trans: 'mir-rabbi' },
          { arabic: 'مِنْ وَلِيٍّ', trans: 'miw-waliyyin' },
        ],
      },
      {
        section: 'Iqlab (Conversion) — ب only',
        desc: 'When Noon Sakinah/Tanween is followed by ب, the Noon becomes Meem.',
        examples: [
          { arabic: 'أَنْبِيَاء', trans: 'ambiyaaʾ' },
          { arabic: 'مِنْ بَعْدِ', trans: 'mim baʿdi' },
        ],
      },
      {
        section: 'Ikhfa (Hiding) — 15 remaining letters',
        desc: 'The Noon sound is hidden (nasal hum) before the remaining 15 letters.',
        examples: [
          { arabic: 'أَنْتَ', trans: 'an~ta' },
          { arabic: 'مِنْ قَبْلِ', trans: 'min~ qabli' },
          { arabic: 'كُنْتُمْ', trans: 'kun~tum' },
        ],
      },
    ],
  },
  {
    id: 10,
    title: 'Rules of Raa',
    arabicTitle: 'أحكام الراء',
    subtitle: 'Heavy (Tafkheem) vs Light (Tarqeeq)',
    description: 'When Raa is pronounced thick or thin',
    icon: 'ر',
    type: 'tajweed',
    content: [
      {
        section: 'Raa Tafkheem (Heavy)',
        desc: 'Raa is heavy when: it has Fatha/Damma, or Sukoon after Fatha/Damma, or before a heavy letter.',
        examples: [
          { arabic: 'رَبِّ', trans: 'rabbi (Lord)' },
          { arabic: 'رُوح', trans: 'rooḥ (soul)' },
          { arabic: 'قَرْيَة', trans: 'qaryah (village)' },
        ],
      },
      {
        section: 'Raa Tarqeeq (Light)',
        desc: 'Raa is light when: it has Kasra, or Sukoon after Kasra (with no heavy letter after).',
        examples: [
          { arabic: 'رِجَال', trans: 'rijaal (men)' },
          { arabic: 'فِرْعَوْن', trans: 'firʿawn (Pharaoh)' },
          { arabic: 'بَصِير', trans: 'baṣeer (All-Seeing)' },
        ],
      },
    ],
  },
  {
    id: 11,
    title: 'Rules of Laam',
    arabicTitle: 'أحكام اللام',
    subtitle: 'Laam in "Allah" and Alif-Laam',
    description: 'Sun letters (Shamsiyyah) and Moon letters (Qamariyyah)',
    icon: 'ل',
    type: 'tajweed',
    content: [
      {
        section: 'Sun Letters (الحروف الشمسية)',
        desc: 'The Laam of "Al" is silent and the next letter is doubled: ت ث د ذ ر ز س ش ص ض ط ظ ل ن',
        examples: [
          { arabic: 'الشَّمْس', trans: 'ash-shams (the sun)' },
          { arabic: 'النَّاس', trans: 'an-naas (the people)' },
          { arabic: 'الرَّحْمَن', trans: 'ar-Raḥmaan' },
          { arabic: 'السَّمَاء', trans: 'as-samaaʾ (the sky)' },
        ],
      },
      {
        section: 'Moon Letters (الحروف القمرية)',
        desc: 'The Laam of "Al" is pronounced clearly: ا ب ج ح خ ع غ ف ق ك م و ه ي',
        examples: [
          { arabic: 'الْقَمَر', trans: 'al-qamar (the moon)' },
          { arabic: 'الْكِتَاب', trans: 'al-kitaab (the book)' },
          { arabic: 'الْحَمْد', trans: 'al-ḥamd (the praise)' },
          { arabic: 'الْمَلِك', trans: 'al-malik (the king)' },
        ],
      },
      {
        section: 'Laam in "Allah" (لفظ الجلالة)',
        desc: 'Heavy after Fatha/Damma, light after Kasra.',
        examples: [
          { arabic: 'قَالَ ٱللَّهُ', trans: 'qaalALLAAhu (heavy)' },
          { arabic: 'بِسْمِ ٱللَّهِ', trans: 'bismil-laahi (light)' },
        ],
      },
    ],
  },
  {
    id: 12,
    title: 'Waqf — Stopping Rules',
    arabicTitle: 'أحكام الوقف',
    subtitle: 'Where to Pause and Stop',
    description: 'Signs that tell you where to stop when reading Quran',
    icon: '⏸️',
    type: 'tajweed',
    content: [
      {
        section: 'Waqf Signs',
        desc: 'These symbols appear in the Mushaf to guide your reading.',
        examples: [
          { arabic: 'مـ', trans: 'Waqf Laazim — Must stop' },
          { arabic: 'لا', trans: 'Laa — Do not stop' },
          { arabic: 'ج', trans: 'Jaaiz — May stop or continue' },
          { arabic: 'صلى', trans: 'al-Wasl Awla — Better to continue' },
          { arabic: 'قلى', trans: 'al-Waqf Awla — Better to stop' },
          { arabic: '∴ ∴', trans: 'Muʿaanaqah — Stop at one, not both' },
        ],
      },
    ],
  },
]

export const MAKHRAJ_GROUPS: MakhrajGroup[] = [
  { name: 'Throat (Halq)', letters: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'] },
  { name: 'Tongue Back', letters: ['ق', 'ك'] },
  { name: 'Tongue Middle', letters: ['ج', 'ش', 'ي'] },
  { name: 'Tongue Sides', letters: ['ض', 'ل'] },
  { name: 'Tongue Tip', letters: ['ن', 'ر', 'ط', 'د', 'ت', 'ص', 'ز', 'س', 'ظ', 'ذ', 'ث'] },
  { name: 'Lips', letters: ['ف', 'و', 'ب', 'م'] },
  { name: 'Nasal Cavity', letters: ['ن', 'م'] },
]
