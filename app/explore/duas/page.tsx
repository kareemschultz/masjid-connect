'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const CATEGORIES = ['Iftaar', 'Waking Up', 'Food', 'Travel', 'Protection', 'Forgiveness'] as const

const DUAS: Record<string, { arabic: string; transliteration: string; meaning: string }[]> = {
  Iftaar: [
    { arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', transliteration: 'Allahumma laka sumtu wa \'ala rizqika aftartu', meaning: 'O Allah! For You I fasted and upon Your provision I break my fast.' },
    { arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ', transliteration: 'Dhahaba al-zama\' wa\'btallat al-\'urooq wa thabata al-ajru in sha Allah', meaning: 'The thirst is gone, the veins are moistened, and the reward is certain, if Allah wills.' },
  ],
  'Waking Up': [
    { arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur', meaning: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection' },
  ],
  Food: [
    { arabic: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', meaning: 'In the name of Allah (before eating)' },
    { arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', transliteration: 'Alhamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin', meaning: 'All praise is for Allah who fed us, gave us drink, and made us Muslims (after eating)' },
  ],
  Travel: [
    { arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ', transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin', meaning: 'Glory to Him who has subjected this to us, for we could never have accomplished it by ourselves' },
  ],
  Protection: [
    { arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ', transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-sama\'', meaning: 'In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm' },
  ],
  Forgiveness: [
    { arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ', transliteration: 'Astaghfirullaha al-\'Adheemal-ladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh', meaning: 'I seek the forgiveness of Allah the Mighty, whom there is no god but He, the Living, the Self-Sustaining, and I repent to Him' },
    { arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', transliteration: 'Rabbighfir li wa tub \'alayya innaka Antat-Tawwabur-Rahim', meaning: 'My Lord, forgive me and accept my repentance. You are the Accepting of Repentance, the Most Merciful' },
  ],
}

export default function DuasPage() {
  const [category, setCategory] = useState<string>('Waking Up')

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={BookOpen}
        title="Duas"
        subtitle="Daily Supplications"
        gradient="from-purple-900 to-violet-900"
        showBack
      />

      <div className="flex gap-2 overflow-x-auto px-4 pt-4 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              category === cat ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4 pt-4 animate-stagger">
        {DUAS[category]?.map((dua, i) => (
          <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-right font-arabic text-xl leading-loose text-foreground" dir="rtl">
              {dua.arabic}
            </p>
            <p className="mt-3 text-xs font-medium text-purple-400">{dua.transliteration}</p>
            <p className="mt-1 text-xs text-gray-400">{dua.meaning}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
