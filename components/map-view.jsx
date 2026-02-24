'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { masjids } from '@/lib/masjids'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation } from 'lucide-react'

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
  const loadingSettledRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const latestByMasjid = useMemo(() => {
    const map = new Map()
    for (const sub of submissions || []) {
      if (!map.has(sub.masjidId)) map.set(sub.masjidId, sub)
    }
    return map
  }, [submissions])

  const finishLoading = useCallback(() => {
    if (loadingSettledRef.current) return
    loadingSettledRef.current = true
    setLoading(false)
  }, [])

  // ── Map init — runs once ────────────────────────────────────────────────────
  useEffect(() => {
    loadingSettledRef.current = false
    setLoading(true)

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
    const handleTileLoad = () => finishLoading()
    const handleMapLoad = () => finishLoading()
    const handleTileError = () => {
      window.setTimeout(() => finishLoading(), 240)
    }
    tileLayer.once('load', handleTileLoad)
    map.once('load', handleMapLoad)
    tileLayer.on('tileerror', handleTileError)
    tileLayer.addTo(map)

    // Fail-safe to prevent indefinite loading overlays on flaky tile networks.
    const failSafeTimer = window.setTimeout(() => finishLoading(), 9000)

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
      window.clearTimeout(failSafeTimer)
      tileLayer.off('tileerror', handleTileError)
      tileLayer.off('load', handleTileLoad)
      map.off('load', handleMapLoad)
      map.remove()
      mapInstance.current = null
    }
  }, [finishLoading])

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
    <div className="rounded-2xl overflow-hidden relative border border-border">
      {loading && (
        <div className="absolute inset-0 z-20 overflow-hidden bg-background/84 backdrop-blur-sm">
          <style>{`
            @keyframes mapLoaderPulse {
              0%, 100% { transform: scale(0.88); opacity: 0.2; }
              50% { transform: scale(1.16); opacity: 0.55; }
            }
            @keyframes mapLoaderRoute {
              0%, 100% { opacity: 0.16; stroke-dashoffset: 0; }
              50% { opacity: 0.42; stroke-dashoffset: -24; }
            }
          `}</style>

          <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M 20 192 Q 88 160 134 166 Q 188 172 222 146 Q 262 116 312 124 Q 350 130 382 108"
              fill="none"
              stroke="rgba(45,212,191,0.36)"
              strokeWidth="2"
              strokeDasharray="8 6"
              style={{ animationName: 'mapLoaderRoute', animationDuration: '2.6s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }}
            />
            {[[76, 168], [186, 156], [292, 124], [348, 112]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="4.5" fill="rgba(16,185,129,0.68)" />
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke="rgba(45,212,191,0.58)"
                  strokeWidth="1.2"
                  style={{
                    transformOrigin: `${x}px ${y}px`,
                    animationName: 'mapLoaderPulse',
                    animationDuration: `${1.8 + i * 0.25}s`,
                    animationDelay: `${i * 0.3}s`,
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'ease-out',
                  }}
                />
              </g>
            ))}
          </svg>

          <div className="relative flex h-full flex-col items-center justify-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-card/72">
              <MapPin className="h-7 w-7 text-emerald-400" />
              <span
                className="pointer-events-none absolute inset-1.5 rounded-xl border border-emerald-400/35"
                style={{ animation: 'mapLoaderPulse 1.9s ease-out infinite' }}
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/72 px-3.5 py-2 text-xs text-muted-foreground">
              <Navigation className="h-3.5 w-3.5 text-teal-300" />
              Loading masjid map...
            </div>
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-[60vh] sm:h-[400px] w-full" />
    </div>
  )
}
