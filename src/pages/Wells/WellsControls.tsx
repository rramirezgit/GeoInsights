import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { MapPin, Filter, Fuel, Radio, Gauge } from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { useDemoStore } from '@/stores/demoStore'
import { useMapStore } from '@/stores/mapStore'
import { statusCounts } from '@/lib/geo/wells.helpers'
import type { Well, WellResource, WellStatus } from '@/types/wells.types'
import {
  BASINS,
  WELL_STATUS_COLORS,
  WELL_STATUS_LABELS,
  ALL_WELL_STATUSES,
} from './wells.constants'

const RESOURCE_OPTIONS: { key: WellResource | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'oil', label: 'Oil' },
  { key: 'gas', label: 'Gas' },
]

interface WellsControlsProps {
  wells: Well[]
  shownCount: number
  isLive: boolean
  onToggleLive: () => void
}

export function WellsControls({
  wells,
  shownCount,
  isLive,
  onToggleLive,
}: WellsControlsProps) {
  const basin = useDemoStore((s) => s.wells.basin)
  const statusFilter = useDemoStore((s) => s.wells.statusFilter)
  const resource = useDemoStore((s) => s.wells.resource)
  const minProduction = useDemoStore((s) => s.wells.minProduction)
  const setWellsFilter = useDemoStore((s) => s.setWellsFilter)

  const flyTo = useMapStore((s) => s.flyTo)
  const resetViewport = useMapStore((s) => s.resetViewport)

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

  const counts = useMemo(() => statusCounts(wells), [wells])

  const selectBasin = (id: typeof basin) => {
    setWellsFilter('basin', id)
    if (id === 'all') {
      resetViewport()
      return
    }
    const config = BASINS.find((b) => b.id === id)
    if (config) flyTo(config.center, config.zoom)
  }

  const toggleStatus = (status: WellStatus) => {
    const next = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status]
    setWellsFilter('statusFilter', next)
  }

  return (
    <div ref={containerRef} className="space-y-1">
      {/* Live updates */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Radio} label="Live updates" color="#22c55e" />
          <Toggle label="" checked={isLive} onChange={onToggleLive} />
        </div>
        <p className="mt-2 text-[10px] text-slate-500 leading-relaxed">
          Production readings refresh every 2.5s, simulating a SCADA telemetry feed.
        </p>
      </div>

      <SectionDivider />

      {/* Basin */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={MapPin} label="Basin" color="#eab308" />
        <div className="mt-2.5 space-y-1">
          <BasinButton
            label="All basins"
            active={basin === 'all'}
            onClick={() => selectBasin('all')}
          />
          {BASINS.map((b) => (
            <BasinButton
              key={b.id}
              label={b.name}
              active={basin === b.id}
              onClick={() => selectBasin(b.id)}
            />
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* Status filters */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Filter} label="Status" color="#06b6d4" />
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {ALL_WELL_STATUSES.map((status) => {
            const isActive = statusFilter.includes(status)
            const color = WELL_STATUS_COLORS[status]
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className="relative rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer overflow-hidden"
                style={{
                  color: isActive ? color : '#64748b',
                  borderColor: isActive ? `${color}50` : 'rgba(255,255,255,0.08)',
                  backgroundColor: isActive ? `${color}12` : 'transparent',
                }}
              >
                <span className="relative">
                  {WELL_STATUS_LABELS[status]}{' '}
                  <span className="tabular-nums opacity-60">({counts[status]})</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <SectionDivider />

      {/* Resource */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Fuel} label="Resource" color="#f97316" />
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {RESOURCE_OPTIONS.map(({ key, label }) => {
            const isActive = resource === key
            return (
              <button
                key={key}
                onClick={() => setWellsFilter('resource', key)}
                className="rounded-lg border px-2 py-1.5 text-xs font-medium transition-all duration-200"
                style={{
                  color: isActive ? '#f97316' : '#64748b',
                  borderColor: isActive ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)',
                  backgroundColor: isActive ? 'rgba(249,115,22,0.08)' : 'transparent',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <SectionDivider />

      {/* Min production */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <SectionHeader icon={Gauge} label="Min production" color="#a855f7" />
        <div className="mt-3">
          <RangeSlider
            label="Producing wells above"
            min={0}
            max={3000}
            step={100}
            value={minProduction}
            onChange={(v) => setWellsFilter('minProduction', v)}
            formatValue={(v) => `${v.toLocaleString()} boe/d`}
          />
        </div>
      </div>

      <SectionDivider />

      {/* Result count */}
      <div className="ctrl-section rounded-xl bg-white/[0.03] p-3">
        <p className="text-xs text-slate-400">
          Showing{' '}
          <span className="font-semibold text-white tabular-nums">{shownCount}</span> of{' '}
          <span className="tabular-nums">{wells.length}</span> wells
        </p>
        <p className="mt-1.5 text-[10px] text-slate-600 leading-relaxed">
          Simulated dataset — basins and field names are real, well positions and
          production figures are not.
        </p>
      </div>
    </div>
  )
}

/* ─── Local sub-components ─── */

function BasinButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border px-3 py-1.5 text-left text-xs font-medium transition-all duration-200"
      style={{
        color: active ? '#eab308' : '#94a3b8',
        borderColor: active ? 'rgba(234,179,8,0.4)' : 'rgba(255,255,255,0.06)',
        backgroundColor: active ? 'rgba(234,179,8,0.08)' : 'transparent',
      }}
    >
      {label}
    </button>
  )
}

function SectionHeader({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number }>
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
