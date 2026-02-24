import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mountain, Building2, Waves, Grape } from 'lucide-react'
import { useMapStore } from '@/stores/mapStore'
import { ZONE_PRESETS } from '@/constants/mapbox'

interface ZoneConfig {
  key: keyof typeof ZONE_PRESETS
  label: string
  icon: React.ReactNode
}

const ZONES: ZoneConfig[] = [
  {
    key: 'deltaParana',
    label: 'Delta del Parana',
    icon: <Waves className="w-3.5 h-3.5" />,
  },
  {
    key: 'peritoMoreno',
    label: 'Glaciar Perito Moreno',
    icon: <Mountain className="w-3.5 h-3.5" />,
  },
  {
    key: 'buenosAires',
    label: 'Buenos Aires',
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  {
    key: 'iguazu',
    label: 'Cataratas del Iguazu',
    icon: <MapPin className="w-3.5 h-3.5" />,
  },
  {
    key: 'mendoza',
    label: 'Mendoza Vinedos',
    icon: <Grape className="w-3.5 h-3.5" />,
  },
]

export function ZoneSelector() {
  const flyTo = useMapStore((s) => s.flyTo)
  const [activeZone, setActiveZone] = useState<string | null>(null)

  const handleZoneClick = (zone: ZoneConfig) => {
    const preset = ZONE_PRESETS[zone.key]
    setActiveZone(zone.key)
    flyTo([preset.longitude, preset.latitude], preset.zoom, preset.pitch)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
      className="absolute bottom-6 left-0 right-0 mx-auto z-[5] w-fit max-w-[calc(100%-2rem)] flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 overflow-x-auto scrollbar-thin"
    >
      {ZONES.map((zone) => {
        const isActive = activeZone === zone.key
        return (
          <motion.button
            key={zone.key}
            onClick={() => handleZoneClick(zone)}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap',
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent',
            ].join(' ')}
          >
            {zone.icon}
            <span className="hidden sm:inline">{zone.label}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
