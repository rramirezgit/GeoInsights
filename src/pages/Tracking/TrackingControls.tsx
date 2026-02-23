import { useMemo } from 'react'
import { Play, Pause, Search } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { TagPill } from '@/components/ui/TagPill'
import { useDemoStore } from '@/stores/demoStore'
import { THEME } from '@/constants/theme'
import type { Truck, TruckStatus } from '@/types'

const ALL_STATUSES: { key: TruckStatus; label: string }[] = [
  { key: 'en_ruta', label: 'En Ruta' },
  { key: 'detenido', label: 'Detenido' },
  { key: 'alerta', label: 'Alerta' },
  { key: 'en_destino', label: 'En Destino' },
]

interface TrackingControlsProps {
  trucks: Truck[]
  speed: number
  isRunning: boolean
  onSpeedChange: (speed: number) => void
  onToggleRunning: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  showRoutes: boolean
  onShowRoutesChange: (show: boolean) => void
}

export function TrackingControls({
  trucks,
  speed,
  isRunning,
  onSpeedChange,
  onToggleRunning,
  searchQuery,
  onSearchChange,
  showRoutes,
  onShowRoutesChange,
}: TrackingControlsProps) {
  const filterStatus = useDemoStore((s) => s.tracking.filterStatus)
  const setTrackingFilter = useDemoStore((s) => s.setTrackingFilter)

  const statusCounts = useMemo(() => {
    const counts: Record<TruckStatus, number> = {
      en_ruta: 0,
      detenido: 0,
      alerta: 0,
      en_destino: 0,
    }
    for (const t of trucks) {
      counts[t.status]++
    }
    return counts
  }, [trucks])

  const toggleStatus = (status: TruckStatus) => {
    const current = filterStatus
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status]
    setTrackingFilter('filterStatus', next)
  }

  return (
    <div className="space-y-6">
      {/* Simulation controls */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Simulacion
        </h3>

        <button
          onClick={onToggleRunning}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
        >
          {isRunning ? (
            <>
              <Pause size={14} /> Pausar
            </>
          ) : (
            <>
              <Play size={14} /> Reanudar
            </>
          )}
        </button>

        <RangeSlider
          label="Velocidad"
          min={0.5}
          max={5}
          step={0.5}
          value={speed}
          onChange={onSpeedChange}
          formatValue={(v) => `${v}x`}
        />
      </div>

      {/* Status filters */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Filtros de Estado
        </h3>

        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(({ key, label }) => (
            <TagPill
              key={key}
              label={`${label} (${statusCounts[key]})`}
              color={THEME.colors.status[key]}
              active={filterStatus.includes(key)}
              onClick={() => toggleStatus(key)}
            />
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Buscar Camion
        </h3>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ID o nombre..."
            className="w-full rounded-lg border border-white/10 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Show routes toggle */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Opciones
        </h3>
        <Toggle
          label="Mostrar rutas"
          checked={showRoutes}
          onChange={onShowRoutesChange}
        />
      </div>

      {/* Fleet summary */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Resumen de Flota
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {ALL_STATUSES.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-lg border border-white/5 bg-slate-800/40 px-3 py-2.5"
            >
              <p className="text-lg font-bold text-white">
                {statusCounts[key]}
              </p>
              <p
                className="text-[11px] font-medium"
                style={{ color: THEME.colors.status[key] }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
