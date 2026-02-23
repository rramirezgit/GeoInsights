import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Ruler, LandPlot, Leaf, MousePointerClick } from 'lucide-react'
import { StatWidget } from '@/components/ui/StatWidget'
import { GlassCard } from '@/components/ui/GlassCard'
import type { AnalysisResult } from '@/types'

interface AnalysisPanelProps {
  analysis: AnalysisResult | null
  onClear: () => void
}

const aptitudeBadge: Record<
  AnalysisResult['aptitude'],
  { label: string; color: string; bg: string; description: string }
> = {
  alta: {
    label: 'Alta',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30',
    description:
      'Zona con excelentes condiciones para agricultura intensiva. Suelos fértiles con alta retención de humedad.',
  },
  media: {
    label: 'Media',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-500/30',
    description:
      'Zona con condiciones moderadas. Apta para ganadería extensiva y algunos cultivos con manejo adecuado.',
  },
  baja: {
    label: 'Baja',
    color: 'text-red-400',
    bg: 'bg-red-500/15 border-red-500/30',
    description:
      'Zona con limitaciones climáticas y edáficas. Requiere técnicas especializadas para uso productivo.',
  },
}

export function AnalysisPanel({ analysis, onClear }: AnalysisPanelProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div
            key="instructions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Instructions />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Results analysis={analysis} onClear={onClear} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Instructions() {
  const steps = [
    { num: 1, text: 'Hace click en el mapa para agregar puntos' },
    { num: 2, text: 'Agrega al menos 3 puntos para formar un poligono' },
    { num: 3, text: 'Click en "Completar Poligono"' },
    { num: 4, text: 'Mira el analisis de la zona' },
  ]

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <MousePointerClick size={24} />
          </div>
          <p className="text-sm text-slate-300">
            Dibuja un poligono en el mapa para analizar la zona
          </p>
        </div>
      </GlassCard>

      <GlassCard padding="sm">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
          Pasos
        </p>
        <div className="space-y-2.5">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-400">
                {step.num}
              </span>
              <span className="text-sm text-slate-400 leading-tight">
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function Results({
  analysis,
  onClear,
}: {
  analysis: AnalysisResult
  onClear: () => void
}) {
  const badge = aptitudeBadge[analysis.aptitude]

  return (
    <>
      {/* Area & Perimeter stats */}
      <StatWidget
        label="Area"
        value={analysis.area_km2}
        unit="km²"
        icon={LandPlot}
      />
      <StatWidget
        label="Hectareas"
        value={analysis.area_hectares}
        unit="ha"
        icon={LandPlot}
      />
      <StatWidget
        label="Perimetro"
        value={analysis.perimeter_km}
        unit="km"
        icon={Ruler}
      />

      {/* Centroid */}
      <GlassCard padding="sm">
        <div className="flex items-center gap-2 mb-1.5">
          <MapPin size={14} className="text-emerald-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Centroide
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          {analysis.centroid.lat.toFixed(4)}, {analysis.centroid.lng.toFixed(4)}
        </p>
      </GlassCard>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Aptitude analysis */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Analisis de Aptitud
          </h3>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold ${badge.bg} ${badge.color} mb-3`}
        >
          <span>{badge.label}</span>
        </div>

        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
          Tipo de suelo
        </p>
        <p className="text-sm text-slate-300 mb-3">{analysis.soilType}</p>

        <p className="text-xs text-slate-400 leading-relaxed">
          {badge.description}
        </p>
      </GlassCard>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Clear button */}
      <button
        onClick={onClear}
        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-sm font-medium border border-white/10 transition-colors"
      >
        Limpiar dibujo
      </button>
    </>
  )
}
