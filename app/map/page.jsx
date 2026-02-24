'use client'

import dynamic from 'next/dynamic'
import { Map } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PremiumAtmosphere } from '@/components/premium-atmosphere'
import { useSubmissions } from '@/hooks/use-submissions'

const MapView = dynamic(() => import('@/components/map-view'), { ssr: false })

export default function MapPage() {
  const { submissions } = useSubmissions()

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
      <PremiumAtmosphere tone="masjid" />
      <PageHero
        icon={Map}
        title="Map View"
        subtitle="Masjids near you"
        gradient="from-emerald-900 via-teal-900 to-cyan-900"
        showBack
        heroTheme="map"
      />
      <div className="relative px-4 pt-4 max-w-2xl mx-auto">
        <MapView submissions={submissions} />
      </div>
      <BottomNav />
    </div>
  )
}
