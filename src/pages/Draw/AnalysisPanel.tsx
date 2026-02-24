import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import {
  MapPin,
  Ruler,
  LandPlot,
  Leaf,
  MousePointerClick,
  Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AnalysisResult } from '@/types'

interface AnalysisPanelProps {
  analysis: AnalysisResult | null
  onClear: () => void
}

const aptitudeBadge: Record<
  AnalysisResult['aptitude'],
  { label: string; color: string; description: string }
> = {
  alta: {
    label: 'Alta',
    color: '#10b981',
    description:
      'Zona con excelentes condiciones para agricultura intensiva. Suelos fertiles con alta retencion de humedad.',
  },
  media: {
    label: 'Media',
    color: '#f59e0b',
    description:
      'Zona con condiciones moderadas. Apta para ganaderia extensiva y algunos cultivos con manejo adecuado.',
  },
  baja: {
    label: 'Baja',
    color: '#ef4444',
    description:
      'Zona con limitaciones climaticas y edaficas. Requiere tecnicas especializadas para uso productivo.',
  },
}

export function AnalysisPanel({ analysis, onClear }: AnalysisPanelProps) {
  return (
    <div className="space-y-1">
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
          >
            <Results analysis={analysis} onClear={onClear} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Instructions() {
  const containerRef = useRef<HTMLDivElement>(null)

  const steps = [
    { num: 1, text: 'Hace click en el mapa para agregar puntos' },
    { num: 2, text: 'Agrega al menos 3 puntos para formar un poligono' },
    { num: 3, text: 'Click en "Completar Poligono"' },
    { num: 4, text: 'Mira el analisis de la zona' },
  ]

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.instr-section', {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.07,
        delay: 0.3,
        ease: 'power2.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-1">
      {/* CTA */}
      <div className="instr-section rounded-xl bg-white/[0.03] p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'rgba(16,185,129,0.12)' }}
          >
            <MousePointerClick size={20} className="text-emerald-400" />
          </div>
          <p className="text-sm text-slate-300">
            Dibuja un poligono en el mapa para analizar la zona
          </p>
        </div>
      </div>

      <SectionDivider />

      {/* Steps */}
      <div className="instr-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={MousePointerClick} label="Pasos" color="#10b981" />
        <div className="mt-2.5 space-y-2.5">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: 'rgba(16,185,129,0.12)',
                  color: '#34d399',
                }}
              >
                {step.num}
              </span>
              <span className="text-xs text-slate-400 leading-relaxed">
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </div>
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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.result-section', {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.07,
        delay: 0.1,
        ease: 'power2.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-1">
      {/* KPI cards */}
      <div className="result-section grid gap-1.5">
        <KpiCard
          label="Area"
          value={analysis.area_km2.toFixed(2)}
          unit="km²"
          icon={LandPlot}
          color="#10b981"
        />
        <KpiCard
          label="Hectareas"
          value={analysis.area_hectares.toFixed(1)}
          unit="ha"
          icon={LandPlot}
          color="#3b82f6"
        />
        <KpiCard
          label="Perimetro"
          value={analysis.perimeter_km.toFixed(2)}
          unit="km"
          icon={Ruler}
          color="#a855f7"
        />
      </div>

      <SectionDivider />

      {/* Centroid */}
      <div className="result-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={MapPin} label="Centroide" color="#06b6d4" />
        <p className="mt-2 text-xs text-slate-400 font-mono tabular-nums">
          {analysis.centroid.lat.toFixed(4)}, {analysis.centroid.lng.toFixed(4)}
        </p>
      </div>

      <SectionDivider />

      {/* Aptitude */}
      <div className="result-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Leaf} label="Aptitud agropecuaria" color="#10b981" />

        <div className="mt-2.5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border"
            style={{
              color: badge.color,
              borderColor: `${badge.color}40`,
              backgroundColor: `${badge.color}12`,
            }}
          >
            {badge.label}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">
            Tipo de suelo
          </p>
          <p className="text-sm text-slate-300">{analysis.soilType}</p>
        </div>

        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          {badge.description}
        </p>
      </div>

      <SectionDivider />

      {/* Clear button */}
      <div className="result-section">
        <button
          onClick={onClear}
          className="group flex items-center gap-2 w-full justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-slate-500 transition-all duration-200 hover:text-red-400 hover:bg-red-500/[0.05] hover:border-red-500/20"
        >
          <Trash2 className="w-3 h-3" />
          Limpiar dibujo
        </button>
      </div>
    </div>
  )
}

/* ─── Local sub-components ─── */

function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  color: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 overflow-hidden relative">
      <div
        className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
        style={{ backgroundColor: color }}
      />
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ml-1"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 leading-none">
          {label}
        </p>
        <p className="mt-1 text-lg font-bold text-white leading-none tabular-nums">
          {value}
          {unit && (
            <span className="ml-1 text-[10px] font-normal text-slate-500">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center w-5 h-5 rounded-md shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-3 h-3" style={{ color }} />
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex-1">
        {label}
      </span>
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="px-3">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}
