'use client'

import dynamic from 'next/dynamic'
import { Map } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { useSubmissions } from '@/hooks/use-submissions'

const MapView = dynamic(() => import('@/components/map-view'), { ssr: false })

export default function MapPage() {
  const { submissions } = useSubmissions()

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Map}
        title="Map View"
        subtitle="Masjids near you"
        gradient="from-emerald-900 to-teal-900"
        showBack
      />
      <div className="px-4 pt-4 max-w-2xl mx-auto">
        <MapView submissions={submissions} />
      </div>
      <BottomNav />
    </div>
  )
}
