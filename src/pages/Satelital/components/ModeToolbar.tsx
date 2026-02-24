import { motion } from 'framer-motion'
import { Layers, Mountain, Ruler } from 'lucide-react'
import type { SatelitalMode } from '@/types/geo.types'

interface ModeToolbarProps {
  mode: SatelitalMode
  onModeChange: (mode: SatelitalMode) => void
}

const MODES: { key: SatelitalMode; label: string; icon: React.ReactNode }[] = [
  { key: 'compare', label: 'Comparar', icon: <Layers className="w-3.5 h-3.5" /> },
  { key: 'elevation', label: 'Elevacion', icon: <Mountain className="w-3.5 h-3.5" /> },
  { key: 'measure', label: 'Medir', icon: <Ruler className="w-3.5 h-3.5" /> },
]

export function ModeToolbar({ mode, onModeChange }: ModeToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="absolute top-20 left-1/2 -translate-x-1/2 z-[10] flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10"
    >
      {MODES.map((m) => {
        const isActive = mode === m.key
        return (
          <button
            key={m.key}
            onClick={() => onModeChange(m.key)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent',
            ].join(' ')}
          >
            {m.icon}
            {m.label}
          </button>
        )
      })}
    </motion.div>
  )
}
