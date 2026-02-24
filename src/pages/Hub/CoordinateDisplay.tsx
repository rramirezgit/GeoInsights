import { useState, useEffect, useCallback, useRef } from 'react'
import gsap from 'gsap'

const BOUNDS = { north: -21.78, south: -55.06, west: -73.56, east: -53.64 }

export function CoordinateDisplay() {
  const elRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ lat: -34, lng: -64 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const lat = BOUNDS.north + (e.clientY / window.innerHeight) * (BOUNDS.south - BOUNDS.north)
    const lng = BOUNDS.west + (e.clientX / window.innerWidth) * (BOUNDS.east - BOUNDS.west)
    setCoords({
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Entrance animation
  useEffect(() => {
    if (!elRef.current) return
    gsap.from(elRef.current, {
      y: 12,
      opacity: 0,
      duration: 0.6,
      delay: 1.8,
      ease: 'power2.out',
    })
  }, [])

  return (
    <div
      ref={elRef}
      className="fixed bottom-20 left-4 z-30 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md px-3 py-2 shadow-lg"
    >
      <p className="font-mono text-xs text-slate-400">
        LAT: {coords.lat.toFixed(4)} | LNG: {coords.lng.toFixed(4)}
      </p>
    </div>
  )
}
