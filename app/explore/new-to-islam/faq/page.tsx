'use client'

import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const faqs = [
  {
    q: 'Do I have to change my name?',
    a: 'No. Unless your name has a meaning that directly contradicts Islam (e.g., it refers to another deity), you can keep your name. Many of the Prophet\u2019s \uFDFA companions kept their pre-Islamic names. Changing your name is optional and a personal choice.',
  },
  {
    q: 'How do I tell my family?',
    a: 'There is no obligation to announce your conversion immediately. When you feel ready, approach it calmly and share what Islam means to you personally. Many reverts find it helpful to speak with other reverts or an imam for guidance before having this conversation. Maintain kindness and patience \u2014 your character is the best dawah.',
  },
  {
    q: 'What do I need to do right after taking Shahada?',
    a: 'Make ghusl (a full body purification bath), learn the basics of Salah (prayer), and continue learning at your own pace. The Prophet \uFDFA said: "Make things easy, don\u2019t make them difficult." (Bukhari). You don\u2019t need to know everything at once \u2014 Islam is a lifelong journey.',
  },
  {
    q: 'Are my previous sins forgiven?',
    a: 'Yes, completely. The Prophet \uFDFA said: "Islam wipes out whatever came before it." (Sahih Muslim). From the moment you take your Shahada, your slate is clean. Any good deeds you did before Islam are also kept.',
  },
  {
    q: 'Can I still celebrate Christmas/Diwali/etc with family?',
    a: 'Scholars have different views on this. The general consensus is that attending family gatherings to maintain ties is permissible, but participating in acts of worship specific to other faiths is not. Islam places great emphasis on family ties \u2014 maintain them with kindness.',
  },
  {
    q: 'Do I have to wear hijab immediately?',
    a: 'For sisters \u2014 hijab is an obligation according to Islamic scholarship, but new reverts are encouraged to take things step by step. Focus on the fundamentals first: prayer, understanding the faith, and building your relationship with Allah. Discuss with a female scholar or imam when you feel ready. Your journey is between you and Allah.',
  },
  {
    q: "I can't pray 5 times yet \u2014 am I a bad Muslim?",
    a: 'Absolutely not. Learning takes time. Start with what you can manage and build up gradually. The Prophet \uFDFA said: "Do good deeds within your capacity." (Bukhari). Even one prayer done sincerely is better than none. Every step you take towards Allah, He comes closer to you.',
  },
  {
    q: 'Can I still eat non-halal food from my family?',
    a: 'Pork and alcohol are strictly forbidden in all circumstances. For other meat \u2014 if you cannot access halal meat, some scholars permit the meat of People of the Book (chicken or beef slaughtered by practicing Christians or Jews). This is a nuanced topic \u2014 ask a local imam for guidance specific to your situation in Guyana.',
  },
  {
    q: 'How do I find other Muslims in Guyana?',
    a: 'Visit any masjid in Georgetown \u2014 the CIOG (Central Islamic Organisation of Guyana) masjid and Queenstown Jama Masjid are particularly welcoming to new Muslims. CIOG runs revert support programmes and can connect you with other new Muslims. You are not alone.',
  },
  {
    q: 'What should I read or watch first?',
    a: 'Start with understanding the meaning of Surah Al-Fatiha \u2014 you will recite it in every prayer. Then explore the Lectures section in this app for beneficial talks. For reading, "The Sealed Nectar" (Ar-Raheeq Al-Makhtum) is an excellent biography of the Prophet \uFDFA. Take it one step at a time.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={HelpCircle}
        title="Common Questions"
        subtitle="New Muslims Ask — Islam Answers"
        gradient="from-rose-950 to-pink-900"
        showBack
        stars
        heroTheme="fiqh"
      />

      <div className="space-y-3 px-4 pt-5">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card/50 overflow-hidden cursor-pointer transition-all"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            <div className="flex items-center justify-between p-5">
              <span className="h-7 w-7 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-foreground flex-1 ml-3">
                {faq.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground/80 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
              />
            </div>
            {openIndex === i && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
