import { useEffect, useRef } from 'react'
import Map from 'react-map-gl/mapbox'
import { MAPBOX_TOKEN, MAP_STYLES } from '@/constants/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

const HUB_VIEW = {
  longitude: -64,
  latitude: -34,
  zoom: 4,
  pitch: 45,
  bearing: 0,
} as const

export function HubMap() {
  const bearingRef = useRef(0)
  const rafRef = useRef<number>(0)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function handleLoad(e: { target: mapboxgl.Map }) {
    mapInstanceRef.current = e.target

    const tick = () => {
      bearingRef.current = (bearingRef.current + 0.1) % 360
      mapInstanceRef.current?.setBearing(bearingRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div className="fixed inset-0 z-0">
      <Map
        initialViewState={HUB_VIEW}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLES.dark}
        interactive={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        onLoad={handleLoad}
      />
      <div className="absolute inset-0 bg-slate-950/50 pointer-events-none" />
    </div>
  )
}
