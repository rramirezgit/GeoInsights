import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ARGENTINA_CENTER } from '@/constants/mapbox'

export function CoordinateDisplay() {
  const [coords, setCoords] = useState({
    lat: ARGENTINA_CENTER.latitude,
    lng: ARGENTINA_CENTER.longitude,
  })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Map screen position to approximate visible lat/lng range over Argentina
    const lat = -21.78 + (e.clientY / window.innerHeight) * (-55.06 + 21.78)
    const lng = -73.56 + (e.clientX / window.innerWidth) * (-53.64 + 73.56)
    setCoords({
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="fixed bottom-20 left-4 z-30 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md px-3 py-2 shadow-lg"
    >
      <p className="font-mono text-xs text-slate-400">
        LAT: {coords.lat.toFixed(4)} | LNG: {coords.lng.toFixed(4)}
      </p>
    </motion.div>
  )
}
