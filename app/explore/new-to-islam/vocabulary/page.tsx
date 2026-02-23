'use client'

import { useState, useMemo } from 'react'
import { MessageCircle, Search, ChevronDown } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

interface Term {
  arabic: string
  transliteration: string
  meaning: string
  usage: string
  group: string
}

const terms: Term[] = [
  // Greetings
  { arabic: '\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645', transliteration: 'As-salamu alaykum', meaning: 'Peace be upon you', usage: 'The greeting between Muslims', group: 'Greetings' },
  { arabic: '\u0648\u0639\u0644\u064A\u0643\u0645 \u0627\u0644\u0633\u0644\u0627\u0645', transliteration: 'Wa alaykum as-salam', meaning: 'And upon you peace', usage: 'The response to the greeting', group: 'Greetings' },

  // About Allah
  { arabic: '\u0628\u0633\u0645 \u0627\u0644\u0644\u0647', transliteration: 'Bismillah', meaning: 'In the name of Allah', usage: 'Said before starting anything \u2014 eating, reading, working', group: 'About Allah' },
  { arabic: '\u0627\u0644\u062D\u0645\u062F \u0644\u0644\u0647', transliteration: 'Alhamdulillah', meaning: 'All praise is for Allah', usage: 'Said to express gratitude \u2014 after eating, sneezing, good news', group: 'About Allah' },
  { arabic: '\u0633\u0628\u062D\u0627\u0646 \u0627\u0644\u0644\u0647', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah', usage: 'Said in wonder, awe, or during dhikr', group: 'About Allah' },
  { arabic: '\u0627\u0644\u0644\u0647 \u0623\u0643\u0628\u0631', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest', usage: 'Said in prayer, adhan, and moments of awe', group: 'About Allah' },
  { arabic: '\u0625\u0646 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647', transliteration: 'InshaAllah', meaning: 'If Allah wills', usage: 'Said when expressing intention or hope for the future', group: 'About Allah' },
  { arabic: '\u0645\u0627 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647', transliteration: 'MashaAllah', meaning: 'What Allah has willed', usage: 'Said in admiration \u2014 to acknowledge Allah\'s will', group: 'About Allah' },
  { arabic: '\u0627\u0633\u062A\u063A\u0641\u0631 \u0627\u0644\u0644\u0647', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah', usage: 'Said in repentance or when witnessing something wrong', group: 'About Allah' },

  // About the Prophet
  { arabic: '\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645', transliteration: 'Sallallahu Alayhi Wasallam (\uFDFA)', meaning: 'Peace and blessings of Allah be upon him', usage: 'Said after mentioning the Prophet Muhammad', group: 'About the Prophet' },
  { arabic: '\u0631\u0636\u064A \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', transliteration: 'Radhi Allahu Anhu', meaning: 'May Allah be pleased with him', usage: 'Said after mentioning a companion of the Prophet', group: 'About the Prophet' },
  { arabic: '\u0631\u062D\u0645\u0647 \u0627\u0644\u0644\u0647', transliteration: 'Rahimahullah', meaning: 'May Allah have mercy on him', usage: 'Said about deceased scholars and righteous people', group: 'About the Prophet' },

  // Daily Life
  { arabic: '\u062C\u0632\u0627\u0643\u0645 \u0627\u0644\u0644\u0647 \u062E\u064A\u0631\u0627', transliteration: 'Jazakallahu Khairan', meaning: 'May Allah reward you with good', usage: 'The Islamic way of saying thank you', group: 'Daily Life' },
  { arabic: '\u0622\u0645\u064A\u0646', transliteration: 'Ameen', meaning: 'Amen \u2014 O Allah, accept', usage: 'Said after a dua or after Al-Fatiha in prayer', group: 'Daily Life' },
  { arabic: '\u062D\u0644\u0627\u0644', transliteration: 'Halal', meaning: 'Permissible', usage: 'Food, actions, or earnings that are lawful in Islam', group: 'Daily Life' },
  { arabic: '\u062D\u0631\u0627\u0645', transliteration: 'Haram', meaning: 'Forbidden', usage: 'Actions or things prohibited in Islam \u2014 pork, alcohol, lying', group: 'Daily Life' },
  { arabic: '\u0633\u0646\u0629', transliteration: 'Sunnah', meaning: 'The Prophet\u2019s \uFDFA way', usage: 'His practices, sayings, and approvals \u2014 the second source of Islamic law', group: 'Daily Life' },
  { arabic: '\u062D\u062F\u064A\u062B', transliteration: 'Hadith', meaning: 'Recorded saying/tradition of the Prophet \uFDFA', usage: 'Collections include Bukhari, Muslim, Tirmidhi', group: 'Daily Life' },
  { arabic: '\u0623\u0645\u0629', transliteration: 'Ummah', meaning: 'The global Muslim community', usage: 'All 1.8+ billion Muslims worldwide', group: 'Daily Life' },
  { arabic: '\u0635\u062F\u0642\u0629', transliteration: 'Sadaqah', meaning: 'Voluntary charity', usage: 'Any act of kindness \u2014 even a smile is sadaqah', group: 'Daily Life' },

  // Prayer
  { arabic: '\u062A\u0643\u0628\u064A\u0631', transliteration: 'Takbir', meaning: 'Saying "Allahu Akbar"', usage: 'Used to transition between positions in Salah', group: 'Prayer' },
  { arabic: '\u062F\u0639\u0627\u0621', transliteration: 'Dua', meaning: 'Supplication / personal prayer', usage: 'Direct, personal conversation with Allah \u2014 anytime, anywhere', group: 'Prayer' },
  { arabic: '\u0630\u0643\u0631', transliteration: 'Dhikr', meaning: 'Remembrance of Allah', usage: 'Repeated phrases like SubhanAllah, Alhamdulillah, Allahu Akbar', group: 'Prayer' },
  { arabic: '\u062A\u0642\u0648\u0649', transliteration: 'Taqwa', meaning: 'God-consciousness, piety', usage: 'Being aware of Allah in every action and decision', group: 'Prayer' },

  // Quran
  { arabic: '\u062C\u0647\u0627\u062F', transliteration: 'Jihad', meaning: 'Striving / struggle', usage: 'Primarily the inner struggle against desires (nafs). Also effort to improve oneself and society.', group: 'Quran' },

  // Community
  { arabic: '\u0631\u0645\u0636\u0627\u0646', transliteration: 'Ramadan', meaning: 'The holy month of fasting', usage: 'The 9th month of the Islamic calendar \u2014 month of the Quran', group: 'Community' },
  { arabic: '\u0639\u064A\u062F', transliteration: 'Eid', meaning: 'Islamic celebration / holiday', usage: 'Eid al-Fitr (after Ramadan) and Eid al-Adha (after Hajj)', group: 'Community' },
  { arabic: '\u0645\u0633\u062C\u062F', transliteration: 'Masjid', meaning: 'Mosque \u2014 place of prostration', usage: 'The house of Allah where Muslims pray and gather', group: 'Community' },
  { arabic: '\u0625\u0645\u0627\u0645', transliteration: 'Imam', meaning: 'Prayer leader / scholar', usage: 'The person who leads congregational prayer', group: 'Community' },
  { arabic: '\u062C\u0645\u0639\u0629', transliteration: "Jumu'ah", meaning: 'Friday congregational prayer', usage: 'Obligatory for men \u2014 includes a khutbah (sermon)', group: 'Community' },
]

const groupOrder = ['Greetings', 'About Allah', 'About the Prophet', 'Daily Life', 'Prayer', 'Quran', 'Community']

export default function VocabularyPage() {
  const [search, setSearch] = useState('')
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const isSearching = search.trim().length > 0

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return terms
    return terms.filter(
      (t) =>
        t.arabic.includes(q) ||
        t.transliteration.toLowerCase().includes(q) ||
        t.meaning.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() => {
    const map = new Map<string, Term[]>()
    for (const g of groupOrder) {
      const items = filtered.filter((t) => t.group === g)
      if (items.length > 0) map.set(g, items)
    }
    return map
  }, [filtered])

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={MessageCircle}
        title="Islamic Vocabulary"
        subtitle="Common Arabic Words"
        gradient="from-teal-950 to-cyan-900"
        showBack
        stars
      />

      <div className="px-4 pt-5 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full bg-transparent text-sm text-[#f9fafb] placeholder-gray-500 outline-none"
          />
        </div>

        {/* Results */}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 text-center">
            <p className="text-sm text-gray-400">No terms found for &quot;{search}&quot;</p>
          </div>
        )}

        {isSearching ? (
          /* Flat list when searching */
          <div className="space-y-2">
            {filtered.map((term, i) => (
              <TermCard key={i} term={term} />
            ))}
          </div>
        ) : (
          /* Grouped list when browsing */
          <>
            {groupOrder.map((group) => {
              const items = grouped.get(group)
              if (!items) return null
              const isOpen = openGroup === group

              return (
                <div key={group}>
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : group)}
                    className="flex w-full items-center justify-between mt-5 mb-2"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {group} ({items.length})
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="space-y-2">
                      {items.map((term, i) => (
                        <TermCard key={i} term={term} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function TermCard({ term }: { term: Term }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 mb-2">
      <p className="font-arabic text-xl text-teal-300">{term.arabic}</p>
      <p className="mt-1 text-sm font-medium text-[#f9fafb]">{term.transliteration}</p>
      <p className="text-sm text-gray-400">{term.meaning}</p>
      <p className="mt-1 text-xs text-gray-500 italic">{term.usage}</p>
    </div>
  )
}
