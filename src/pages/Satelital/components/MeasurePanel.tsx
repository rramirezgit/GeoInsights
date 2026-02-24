import { motion } from 'framer-motion'
import { Ruler, X, Maximize2 } from 'lucide-react'
import type { MeasurementResult } from '@/types/geo.types'

interface MeasurePanelProps {
  result: MeasurementResult
  onClear: () => void
}

function formatDistance(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`
  return `${km.toFixed(2)} km`
}

function formatArea(km2: number): string {
  if (km2 < 0.01) return `${(km2 * 1_000_000).toFixed(0)} m²`
  if (km2 < 1) return `${(km2 * 100).toFixed(2)} ha`
  return `${km2.toFixed(2)} km²`
}

export function MeasurePanel({ result, onClear }: MeasurePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[10] w-80 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-cyan-400" />
          <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider">Medicion</h3>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPIs */}
      <div className="flex items-center justify-around gap-3">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-slate-500 uppercase">Puntos</span>
          <span className="text-xs font-semibold text-white">{result.points.length}</span>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-slate-500 uppercase">Distancia</span>
          <span className="text-xs font-semibold text-cyan-400">{formatDistance(result.totalDistance)}</span>
        </div>

        {result.isClosed && result.area != null && (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-slate-500 uppercase">Area</span>
            </div>
            <span className="text-xs font-semibold text-cyan-400">{formatArea(result.area)}</span>
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <p className="text-[10px] text-slate-500 leading-relaxed text-center">
          {result.isClosed
            ? 'Poligono cerrado. Presione Limpiar para reiniciar.'
            : 'Click para agregar puntos. Doble-click para cerrar poligono.'}
        </p>
      </div>
    </motion.div>
  )
}
