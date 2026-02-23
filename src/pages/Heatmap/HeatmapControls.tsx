import { useDemoStore } from '@/stores/demoStore'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { Toggle } from '@/components/ui/Toggle'
import { TagPill } from '@/components/ui/TagPill'
import { GlassCard } from '@/components/ui/GlassCard'
import { RotateCcw } from 'lucide-react'
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

  return (
    <div className="space-y-4">
      {/* Province selector */}
      <GlassCard padding="sm">
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
          Provincia
        </label>
        <select
          value={province}
          onChange={(e) => setFilter('province', e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 appearance-none cursor-pointer"
        >
          {PROVINCES.map((p) => (
            <option key={p} value={p} className="bg-slate-800">
              {p === 'all' ? 'Todas las provincias' : p}
            </option>
          ))}
        </select>
      </GlassCard>

      {/* Crop selector */}
      <GlassCard padding="sm">
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
          Cultivo
        </label>
        <div className="flex flex-wrap gap-2">
          {CROPS.map((c) => (
            <TagPill
              key={c.value}
              label={c.label}
              color={c.color}
              active={crop === c.value || (c.value === 'all' && crop === 'all')}
              onClick={() =>
                setFilter('crop', c.value)
              }
            />
          ))}
        </div>
      </GlassCard>

      {/* Year slider */}
      <GlassCard padding="sm">
        <RangeSlider
          label="Ano"
          min={2018}
          max={2024}
          value={year}
          step={1}
          onChange={(v) => setFilter('year', v)}
        />
      </GlassCard>

      {/* Show borders toggle */}
      <GlassCard padding="sm">
        <Toggle
          label="Limites provinciales"
          checked={showBorders}
          onChange={(v) => setFilter('showBorders', v)}
        />
      </GlassCard>

      {/* Reset */}
      <button
        onClick={reset}
        className="flex items-center gap-2 w-full justify-center rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-400 transition-colors hover:text-slate-200 hover:border-white/20"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Resetear filtros
      </button>
    </div>
  )
}
