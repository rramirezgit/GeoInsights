import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useDemoStore } from '@/stores/demoStore'
import { Toggle } from '@/components/ui/Toggle'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { MapPin, Leaf, CalendarDays, Layers, RotateCcw, ChevronDown } from 'lucide-react'
import type { CropType } from '@/types/agro.types'

const PROVINCES = [
  'all',
  'Buenos Aires',
  'Córdoba',
  'Santa Fe',
  'Entre Ríos',
  'Tucumán',
  'Salta',
  'Chaco',
  'Santiago del Estero',
  'La Pampa',
  'Mendoza',
  'San Luis',
  'Corrientes',
  'Misiones',
  'Jujuy',
  'Formosa',
] as const

const CROPS: { value: CropType | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'Todos', color: '#94a3b8' },
  { value: 'soja', label: 'Soja', color: '#10b981' },
  { value: 'maiz', label: 'Maiz', color: '#f59e0b' },
  { value: 'trigo', label: 'Trigo', color: '#3b82f6' },
  { value: 'girasol', label: 'Girasol', color: '#f97316' },
]

export function HeatmapControls() {
  const province = useDemoStore((s) => s.heatmap.province)
  const crop = useDemoStore((s) => s.heatmap.crop)
  const year = useDemoStore((s) => s.heatmap.year)
  const showBorders = useDemoStore((s) => s.heatmap.showBorders)
  const setFilter = useDemoStore((s) => s.setHeatmapFilter)
  const reset = useDemoStore((s) => s.resetHeatmap)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.ctrl-section', {
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
      {/* Province */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={MapPin} label="Provincia" color="#10b981" />
        <div className="mt-2.5 relative">
          <select
            value={province}
            onChange={(e) => setFilter('province', e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-slate-800/60 px-3 py-2 pr-9 text-sm text-slate-200 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 focus:bg-slate-800/80 appearance-none cursor-pointer hover:border-white/[0.15]"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p} className="bg-slate-800">
                {p === 'all' ? 'Todas las provincias' : p}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      <SectionDivider />

      {/* Crop */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Leaf} label="Cultivo" color="#f59e0b" />
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {CROPS.map((c) => {
            const isActive = crop === c.value
            return (
              <button
                key={c.value}
                onClick={() => setFilter('crop', c.value)}
                className="relative rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer overflow-hidden"
                style={{
                  color: isActive ? c.color : '#94a3b8',
                  borderColor: isActive ? `${c.color}50` : 'rgba(255,255,255,0.08)',
                  backgroundColor: isActive ? `${c.color}12` : 'transparent',
                }}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{ boxShadow: `inset 0 0 16px ${c.color}15` }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <SectionDivider />

      {/* Year */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={CalendarDays} label="Ano" color="#3b82f6">
          <span className="text-xs font-bold text-white tabular-nums">{year}</span>
        </SectionHeader>
        <div className="mt-2.5">
          <RangeSlider
            label=""
            min={2018}
            max={2024}
            value={year}
            step={1}
            onChange={(v) => setFilter('year', v)}
          />
          <div className="flex justify-between mt-1 px-0.5">
            {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map((y) => (
              <span
                key={y}
                className="text-[9px] tabular-nums transition-colors duration-150"
                style={{ color: y === year ? '#3b82f6' : '#475569' }}
              >
                {`'${y.toString().slice(2)}`}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Borders toggle */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Layers} label="Limites provinciales" color="#a855f7" />
          <Toggle
            label=""
            checked={showBorders}
            onChange={(v) => setFilter('showBorders', v)}
          />
        </div>
      </div>

      <SectionDivider />

      {/* Reset */}
      <div className="ctrl-section">
        <button
          onClick={reset}
          className="group flex items-center gap-2 w-full justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-slate-500 transition-all duration-200 hover:text-slate-300 hover:bg-white/[0.05] hover:border-white/[0.12]"
        >
          <RotateCcw className="w-3 h-3 transition-transform duration-300 group-hover:-rotate-180" />
          Resetear filtros
        </button>
      </div>
    </div>
  )
}

/* ─── Local sub-components ─── */

function SectionHeader({
  icon: Icon,
  label,
  color,
  children,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  color: string
  children?: React.ReactNode
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
      {children}
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
