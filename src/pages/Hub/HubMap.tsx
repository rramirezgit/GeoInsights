import { useEffect, useRef, useCallback } from 'react'
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
  const mapRef = useRef<any>(null)

  const animate = useCallback(() => {
    bearingRef.current = (bearingRef.current + 0.1) % 360
    mapRef.current?.setBearing(bearingRef.current)
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleLoad = useCallback(
    (e: any) => {
      mapRef.current = e.target
      rafRef.current = requestAnimationFrame(animate)
    },
    [animate],
  )

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
