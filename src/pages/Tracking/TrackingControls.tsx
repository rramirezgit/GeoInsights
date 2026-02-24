import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { Play, Pause, Search, Gauge, Filter, Route, Truck } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { useDemoStore } from '@/stores/demoStore'
import { THEME } from '@/constants/theme'
import type { Truck as TruckType, TruckStatus } from '@/types'

const ALL_STATUSES: { key: TruckStatus; label: string }[] = [
  { key: 'en_ruta', label: 'En Ruta' },
  { key: 'detenido', label: 'Detenido' },
  { key: 'alerta', label: 'Alerta' },
  { key: 'en_destino', label: 'En Destino' },
]

interface TrackingControlsProps {
  trucks: TruckType[]
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
    <div ref={containerRef} className="space-y-1">
      {/* Simulation */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Gauge} label="Simulacion" color="#06b6d4" />

        <button
          onClick={onToggleRunning}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200"
          style={{
            borderColor: isRunning ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)',
            backgroundColor: isRunning ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
            color: isRunning ? '#f87171' : '#34d399',
          }}
        >
          {isRunning ? (
            <>
              <Pause size={13} /> Pausar
            </>
          ) : (
            <>
              <Play size={13} /> Reanudar
            </>
          )}
        </button>

        <div className="mt-3">
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
      </div>

      <SectionDivider />

      {/* Status filters */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Filter} label="Filtros de estado" color="#f59e0b" />
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {ALL_STATUSES.map(({ key, label }) => {
            const isActive = filterStatus.includes(key)
            const color = THEME.colors.status[key]
            return (
              <button
                key={key}
                onClick={() => toggleStatus(key)}
                className="relative rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer overflow-hidden"
                style={{
                  color: isActive ? color : '#64748b',
                  borderColor: isActive ? `${color}50` : 'rgba(255,255,255,0.08)',
                  backgroundColor: isActive ? `${color}12` : 'transparent',
                }}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{ boxShadow: `inset 0 0 16px ${color}15` }}
                  />
                )}
                <span className="relative">
                  {label}{' '}
                  <span className="tabular-nums opacity-60">
                    ({statusCounts[key]})
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <SectionDivider />

      {/* Search */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Search} label="Buscar camion" color="#3b82f6" />
        <div className="mt-2.5 relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ID o nombre..."
            className="w-full rounded-lg border border-white/[0.08] bg-slate-800/60 py-2 pl-8 pr-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 hover:border-white/[0.15]"
          />
        </div>
      </div>

      <SectionDivider />

      {/* Options */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Route} label="Mostrar rutas" color="#a855f7" />
          <Toggle
            label=""
            checked={showRoutes}
            onChange={onShowRoutesChange}
          />
        </div>
      </div>

      <SectionDivider />

      {/* Fleet summary */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Truck} label="Resumen de flota" color="#10b981" />
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {ALL_STATUSES.map(({ key, label }) => {
            const color = THEME.colors.status[key]
            return (
              <div
                key={key}
                className="relative rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2 overflow-hidden"
              >
                <div
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
                  style={{ backgroundColor: color }}
                />
                <p className="text-base font-bold text-white tabular-nums ml-1">
                  {statusCounts[key]}
                </p>
                <p
                  className="text-[10px] font-medium ml-1"
                  style={{ color }}
                >
                  {label}
                </p>
              </div>
            )
          })}
        </div>
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
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number }>
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
