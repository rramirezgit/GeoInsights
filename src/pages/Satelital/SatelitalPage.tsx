import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useMapStore } from '@/stores/mapStore'
import { useDemoStore } from '@/stores/demoStore'
import { ZONE_PRESETS } from '@/constants/mapbox'
import { SwipeMap } from './SwipeMap'
import { ZoneSelector } from './ZoneSelector'

export default function SatelitalPage() {
  const flyTo = useMapStore((s) => s.flyTo)
  const resetViewport = useMapStore((s) => s.resetViewport)
  const resetSatelital = useDemoStore((s) => s.resetSatelital)

  // Initialize with a good default zone
  useEffect(() => {
    const delta = ZONE_PRESETS.deltaParana
    flyTo([delta.longitude, delta.latitude], delta.zoom)
    return () => {
      resetViewport()
      resetSatelital()
    }
  }, [flyTo, resetViewport, resetSatelital])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      {/* Full-screen swipe map */}
      <SwipeMap />

      {/* Back button (top-left, glass) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-20 left-4 z-[10]"
      >
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-slate-900/90 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Hub</span>
        </Link>
      </motion.div>

      {/* Title badge (top-center, glass) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 z-[10] px-5 py-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10"
      >
        <h1 className="text-sm font-semibold text-white tracking-wide">
          Comparador Satelital
        </h1>
      </motion.div>

      {/* Zone selector at bottom */}
      <ZoneSelector />
    </div>
  )
}
