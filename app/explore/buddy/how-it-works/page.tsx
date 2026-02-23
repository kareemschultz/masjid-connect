'use client'

import {
  Users, Heart, Target, Trophy, Star, Flame, Crown, Medal, Award,
  Bell, Swords, BookOpen, Moon, HandHeart, Sparkles, Gift,
  ChevronRight, ArrowRight, ShieldCheck, Zap, MessageCircle, TrendingUp
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { LEVELS } from '@/lib/points-client'
import Link from 'next/link'

const STEPS = [
  {
    step: 1,
    icon: Users,
    color: 'from-blue-500 to-indigo-600',
    title: 'Find a Buddy',
    description: 'Pair up with a friend, family member, or someone from your masjid. The best buddy is someone you trust and who shares your desire to grow spiritually.',
  },
  {
    step: 2,
    icon: Target,
    color: 'from-emerald-500 to-teal-600',
    title: 'Set Challenges',
    description: 'Choose from pre-built challenges like 30-Day Prayer Streaks, Quran Khatam Races, or create your own. Each challenge has a goal, timeline, and point reward.',
  },
  {
    step: 3,
    icon: Bell,
    color: 'from-amber-500 to-orange-600',
    title: 'Stay Accountable',
    description: 'Send gentle nudges to remind each other about prayers, Quran reading, or any shared goal. A small reminder can make a huge difference in consistency.',
  },
  {
    step: 4,
    icon: Trophy,
    color: 'from-purple-500 to-pink-600',
    title: 'Earn and Compete',
    description: 'Earn points for completing prayers, reading Quran, fasting, and hitting challenge milestones. Climb the leaderboard and reach Champion level.',
  },
]

const DAILY_POINTS = [
  { action: 'Each Fard prayer', points: '5', bonus: '+5 in jamaah', icon: HandHeart, color: 'text-emerald-400' },
  { action: 'Fast a day (Ramadan)', points: '50', icon: Moon, color: 'text-amber-400' },
  { action: 'Fast a voluntary day', points: '25', icon: Moon, color: 'text-amber-400' },
  { action: 'Visit the masjid', points: '40', icon: Sparkles, color: 'text-teal-400' },
  { action: 'Daily adhkar (per 10)', points: '10', bonus: 'up to 100', icon: Sparkles, color: 'text-cyan-400' },
  { action: 'Read a surah', points: '10', bonus: 'up to 100', icon: BookOpen, color: 'text-purple-400' },
  { action: 'Perfect Day (all 5 items)', points: '+50', bonus: 'bonus', icon: ShieldCheck, color: 'text-emerald-400' },
]

const SUNNAH_POINTS = [
  { label: "Fajr Sunnah (2 rak'ah)", pts: 30, note: 'Prophet \u2E3A never missed it' },
  { label: 'Witr (Wajib/Sunnah)', pts: 50, note: 'Wajib per Hanafi school' },
  { label: 'Dhuhr Sunnah (before + after)', pts: 40, note: "4+2 rak'ah" },
  { label: 'Maghrib Sunnah', pts: 20 },
  { label: 'Isha Sunnah', pts: 20 },
]

const NAWAFIL_POINTS = [
  { label: 'Tahajjud', pts: 100, icon: '\uD83C\uDF19', note: 'Highest reward' },
  { label: 'Tarawih (Ramadan)', pts: 60, icon: '\uD83C\uDF19' },
  { label: 'Duha', pts: 50, icon: '\u2600\uFE0F' },
  { label: 'Ishraq', pts: 40, icon: '\uD83C\uDF05' },
  { label: 'Awwabeen', pts: 30, icon: '\u2B50' },
]

const STREAK_MULTIPLIERS = [
  { days: '3+ days', mult: '1.2\u00D7', label: 'Consistent' },
  { days: '7+ days', mult: '1.5\u00D7', label: 'Committed' },
  { days: '14+ days', mult: '1.8\u00D7', label: 'Dedicated' },
  { days: '21+ days', mult: '2.0\u00D7', label: 'Elite' },
]

const LEVEL_STYLES: Record<number, { gradient: string; text: string; border: string; description: string }> = {
  1: {
    gradient: 'from-gray-500 to-gray-600',
    text: 'text-muted-foreground',
    border: 'border-gray-500/40',
    description: 'Every journey starts here. Begin your daily ibadah and earn your first points.',
  },
  2: {
    gradient: 'from-blue-600 to-blue-700',
    text: 'text-blue-400',
    border: 'border-blue-600/40',
    description: "You've established consistent habits. Your dedication is showing, keep going!",
  },
  3: {
    gradient: 'from-emerald-500 to-emerald-600',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    description: 'Strong in faith and practice. You inspire those around you with your consistency.',
  },
  4: {
    gradient: 'from-purple-500 to-purple-600',
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    description: 'Your ibadah shines like a lantern. You are an example for the whole community.',
  },
  5: {
    gradient: 'from-amber-400 to-amber-600',
    text: 'text-amber-400',
    border: 'border-amber-400/40',
    description: 'The pinnacle of devotion. You are a role model for the Ummah. May Allah keep you firm.',
  },
}

const LEVEL_ICONS: Record<number, typeof Crown> = {
  1: Award, 2: Medal, 3: Star, 4: Sparkles, 5: Crown,
}

function getLevelRange(level: typeof LEVELS[number]): string {
  const nextLevel = LEVELS.find(l => l.level === level.level + 1)
  if (!nextLevel) return `${level.min.toLocaleString()}+ pts`
  return `${level.min.toLocaleString()} - ${(nextLevel.min - 1).toLocaleString()} pts`
}

// Reversed so Seeker is first visually
const LEVELS_DISPLAY = [...LEVELS].reverse()

const CHALLENGE_TYPES = [
  {
    icon: HandHeart,
    color: 'from-emerald-500 to-teal-600',
    title: 'Prayer Challenges',
    description: 'Compete to maintain the longest consecutive prayer streak. Includes all 5 daily prayers, sunnah prayers, and tahajjud.',
    examples: ['30-Day All Prayers', 'Sunnah Prayer Week', 'Tahajjud Challenge'],
  },
  {
    icon: BookOpen,
    color: 'from-purple-500 to-indigo-600',
    title: 'Quran Challenges',
    description: 'Race to complete a Khatam, memorize new surahs, or read a set number of pages. Track progress in real-time.',
    examples: ['Khatam Race', 'Memorize Juz Amma', '5 Pages a Day'],
  },
  {
    icon: Moon,
    color: 'from-amber-500 to-orange-600',
    title: 'Fasting Challenges',
    description: 'Fast together on voluntary days (Mondays and Thursdays), the White Days, or throughout Ramadan.',
    examples: ['Monday/Thursday Fasting', 'White Days Challenge', 'Ramadan Companion'],
  },
  {
    icon: Moon,
    color: 'from-indigo-500 to-violet-600',
    title: 'Sunnah & Nawafil',
    description: 'Track your sunnah prayers and nawafil \u2014 Tahajjud, Duha, Witr. Earn the highest points per prayer in the app.',
    examples: ['Witr Every Night', 'Tahajjud Week', 'Fajr Sunnah Month'],
  },
  {
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-600',
    title: 'Dhikr Challenges',
    description: 'Complete daily morning and evening adhkar, tasbih goals, or specific dhikr counts together.',
    examples: ['Daily Adhkar', '1000 Tasbih Week', 'Istighfar Challenge'],
  },
  {
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    title: 'Charity Challenges',
    description: 'Give sadaqah together every Friday, donate to a cause, or volunteer time for community service.',
    examples: ['Friday Sadaqah', 'Community Service', 'Charity Drive'],
  },
]

const HADITHS = [
  {
    text: '\u201CA person is upon the religion of their close friend, so let one of you look at whom they befriend.\u201D',
    source: 'Abu Dawud and Tirmidhi',
  },
  {
    text: '\u201CThe believers in their mutual kindness, compassion, and sympathy are just like one body. When one limb suffers, the whole body responds to it with wakefulness and fever.\u201D',
    source: 'Sahih Muslim',
  },
  {
    text: '\u201CWhoever guides someone to good, they will have a reward like the one who did it.\u201D',
    source: 'Sahih Muslim',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Users}
        title="How It Works"
        subtitle="The Faith Buddy System"
        gradient="from-sky-900 to-indigo-900"
        showBack
        heroTheme="community"
      />

      <div className="space-y-6 px-4 pt-6">
        {/* Intro */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Faith Buddy system pairs you with an accountability partner to help you stay consistent in your ibadah (worship). Compete in good deeds, encourage each other, and earn rewards as you grow together on your spiritual journey.
          </p>
        </div>

        {/* Hadith */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm italic leading-relaxed text-amber-200/80">
            {HADITHS[0].text}
          </p>
          <p className="mt-2 text-xs text-amber-400/60">- {HADITHS[0].source}</p>
        </div>

        {/* Steps */}
        <SettingGroup label="Getting Started" accentColor="bg-blue-500">
          <div className="divide-y divide-border/50">
            {STEPS.map((step) => (
              <div key={step.step} className="flex items-start gap-4 p-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color}`}>
                  <step.icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">{step.step}</span>
                    <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* Daily Point System */}
        <SettingGroup label="Daily Points" accentColor="bg-amber-500">
          <div className="divide-y divide-border/50">
            {DAILY_POINTS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">{item.action}</span>
                  {item.bonus && (
                    <span className="ml-1.5 text-[10px] text-muted-foreground/80">({item.bonus})</span>
                  )}
                </div>
                <span className="flex items-center gap-0.5 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                  <Star className="h-2.5 w-2.5" /> {item.points}
                </span>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* Sunnah Prayer Points */}
        <SettingGroup label="Sunnah Prayer Points" accentColor="bg-indigo-500">
          <div className="divide-y divide-border/50">
            {SUNNAH_POINTS.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  {s.note && <p className="text-[10px] text-muted-foreground/80">{s.note}</p>}
                </div>
                <span className="flex items-center gap-0.5 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-400">
                  <Star className="h-2.5 w-2.5" /> +{s.pts}
                </span>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* Nawafil Points */}
        <SettingGroup label="Nawafil Points" accentColor="bg-violet-500">
          <div className="divide-y divide-border/50">
            {NAWAFIL_POINTS.map((n, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{n.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{n.label}</p>
                    {n.note && <p className="text-[10px] text-muted-foreground/80">{n.note}</p>}
                  </div>
                </div>
                <span className="flex items-center gap-0.5 rounded-lg bg-violet-500/10 px-2 py-0.5 text-[11px] font-bold text-violet-400">
                  <Star className="h-2.5 w-2.5" /> +{n.pts}
                </span>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* Streak Multipliers */}
        <SettingGroup label="Streak Multipliers" accentColor="bg-orange-500">
          <div className="p-4">
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Maintain consecutive active days (3+ tracked items) to multiply all your daily points. The multiplier applies to your base score before the Perfect Day bonus.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STREAK_MULTIPLIERS.map((s, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                    <TrendingUp className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-400">{s.mult}</p>
                    <p className="text-[10px] text-muted-foreground/80">{s.days}</p>
                    <p className="text-[10px] text-muted-foreground/60">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SettingGroup>

        {/* Level System */}
        <SettingGroup label="Level System" accentColor="bg-purple-500">
          <div className="space-y-3 p-4">
            {LEVELS_DISPLAY.map((level) => {
              const style = LEVEL_STYLES[level.level]
              const LevelIcon = LEVEL_ICONS[level.level]
              return (
                <div key={level.level} className={`rounded-xl border ${style.border} p-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient}`}>
                      <LevelIcon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${style.text}`}>{level.label}</h4>
                        <span className="text-[10px] text-muted-foreground/60">{level.arabic}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground/80">{getLevelRange(level)}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{style.description}</p>
                </div>
              )
            })}
          </div>
        </SettingGroup>

        {/* Challenge Types */}
        <SettingGroup label="Challenge Categories" accentColor="bg-emerald-500">
          <div className="divide-y divide-border/50">
            {CHALLENGE_TYPES.map((cat) => (
              <div key={cat.title} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color}`}>
                    <cat.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{cat.title}</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 pl-[52px]">
                  {cat.examples.map((ex) => (
                    <span key={ex} className="rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* More Hadiths */}
        <SettingGroup label="Inspiration from the Sunnah" accentColor="bg-amber-500">
          <div className="divide-y divide-border/50">
            {HADITHS.slice(1).map((h, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/60" />
                  <div>
                    <p className="text-sm italic leading-relaxed text-muted-foreground">{h.text}</p>
                    <p className="mt-1.5 text-[11px] text-amber-400/50">- {h.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* Tips */}
        <SettingGroup label="Tips for Success" accentColor="bg-cyan-500">
          <div className="divide-y divide-border/50">
            {[
              { icon: ShieldCheck, text: 'Choose a buddy who shares your spiritual goals and level of commitment' },
              { icon: Bell, text: 'Use the nudge feature before prayer times as a gentle reminder' },
              { icon: Target, text: 'Start with one challenge at a time. Build momentum before adding more' },
              { icon: Heart, text: 'Celebrate each other\'s wins. A kind word goes a long way' },
              { icon: Swords, text: 'Keep competition healthy. The goal is to grow together, not just to win' },
              { icon: Gift, text: 'Remember: the reward of guiding someone to good is equal to the deed itself' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5">
                <tip.icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span className="text-xs leading-relaxed text-muted-foreground">{tip.text}</span>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* CTA */}
        <Link
          href="/explore/buddy"
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 text-sm font-semibold text-foreground transition-all active:bg-blue-600 active:scale-[0.98]"
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
