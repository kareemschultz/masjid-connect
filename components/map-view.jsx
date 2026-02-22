'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { masjids } from '@/lib/masjids'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons for Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const masjidIcon = L.divIcon({
  html: '<span style="font-size:24px">🕌</span>',
  className: 'masjid-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
})

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default function MapViewComponent({ submissions }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const [loading, setLoading] = useState(true)
  const latestByMasjid = useMemo(() => {
    const map = new Map()
    for (const sub of submissions || []) {
      if (!map.has(sub.masjidId)) map.set(sub.masjidId, sub)
    }
    return map
  }, [submissions])

  // ── Map init — runs once ────────────────────────────────────────────────────
  useEffect(() => {
    const map = L.map(mapRef.current, {
      center: [6.808, -58.155],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    })

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    })
    tileLayer.once('load', () => setLoading(false))
    tileLayer.addTo(map)

    // User location (once at init)
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const userIcon = L.divIcon({
          html: '<span style="font-size:20px">📍</span>',
          className: 'user-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
        L.marker([pos.coords.latitude, pos.coords.longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('<strong>You are here</strong>')
      },
      () => null,
      { enableHighAccuracy: false, timeout: 5000 }
    )

    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  // ── Markers update — runs when submissions change ───────────────────────────
  useEffect(() => {
    const map = mapInstance.current
    if (!map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    masjids.forEach(m => {
      const latest = latestByMasjid.get(m.id)
      const safeName = escapeHtml(m.name)
      const safeAddress = escapeHtml(m.address)
      const safeMenu = latest ? escapeHtml(latest.menu).slice(0, 80) : ''
      const encodedDestination = encodeURIComponent(`${m.lat},${m.lng}`)
      const popupHtml = `
        <div style="min-width:180px;font-family:system-ui">
          <strong style="color:#065f46">🕌 ${safeName}</strong><br/>
          <span style="color:#666;font-size:12px">📍 ${safeAddress}</span>
          ${latest ? `<br/><span style="color:#047857;font-size:12px">🍽️ ${safeMenu}${latest.menu.length > 80 ? '...' : ''}</span>` : ''}
          <br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-size:12px;text-decoration:none">📍 Get Directions →</a>
        </div>
      `
      const marker = L.marker([m.lat, m.lng], { icon: masjidIcon })
        .addTo(map)
        .bindPopup(popupHtml)
      markersRef.current.push(marker)
    })
  }, [latestByMasjid])

  return (
    <div className="rounded-2xl overflow-hidden relative border border-gray-800">
      {loading && (
        <div className="absolute inset-0 z-10 bg-[#0a0b14]/80 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      )}
      <div ref={mapRef} className="h-[60vh] sm:h-[400px] w-full" />
    </div>
  )
}
