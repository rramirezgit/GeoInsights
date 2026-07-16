import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { Activity, Droplets, Drill, Ruler } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  totalProduction,
  productionByBasin,
  statusCounts,
  topProducers,
} from '@/lib/geo/wells.helpers'
import type { Well } from '@/types/wells.types'
import type { LucideIcon } from 'lucide-react'
import {
  BASIN_LABELS,
  WELL_STATUS_COLORS,
  WELL_STATUS_LABELS,
  ALL_WELL_STATUSES,
} from './wells.constants'

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  fontSize: '11px',
  color: '#e2e8f0',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  padding: '8px 12px',
}

interface WellsStatsProps {
  wells: Well[]
}

export function WellsStats({ wells }: WellsStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.stat-section', {
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
  const production = useMemo(() => totalProduction(wells), [wells])

  const basinData = useMemo(
    () =>
      productionByBasin(wells).map(({ basin, production: value }) => ({
        name: BASIN_LABELS[basin].split(' · ')[0],
        production: value,
      })),
    [wells]
  )

  const statusData = useMemo(
    () =>
      ALL_WELL_STATUSES.map((status) => ({
        name: WELL_STATUS_LABELS[status],
        value: counts[status],
        color: WELL_STATUS_COLORS[status],
      })).filter((d) => d.value > 0),
    [counts]
  )

  const top = useMemo(() => topProducers(wells, 5), [wells])

  const avgDepth = useMemo(() => {
    if (wells.length === 0) return 0
    return Math.round(wells.reduce((sum, w) => sum + w.depth_m, 0) / wells.length)
  }, [wells])

  return (
    <div ref={containerRef} className="space-y-1">
      {/* KPI cards */}
      <div className="stat-section grid gap-1.5">
        <KpiCard
          label="Total production"
          value={(production / 1000).toFixed(1)}
          unit="k boe/d"
          icon={Droplets}
          color="#eab308"
        />
        <KpiCard
          label="Producing wells"
          value={counts.producing.toLocaleString()}
          icon={Activity}
          color="#22c55e"
        />
        <KpiCard
          label="Drilling now"
          value={counts.drilling.toLocaleString()}
          icon={Drill}
          color="#06b6d4"
        />
        <KpiCard
          label="Average depth"
          value={avgDepth.toLocaleString()}
          unit="m"
          icon={Ruler}
          color="#a855f7"
        />
      </div>

      <ChartDivider />

      {/* Production by basin */}
      {basinData.length > 0 && (
        <div className="stat-section rounded-xl bg-white/[0.03] p-3">
          <ChartHeader label="Production by basin" />
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              data={basinData}
              layout="vertical"
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(value: string | number | undefined) => [
                  `${Number(value ?? 0).toLocaleString()} boe/d`,
                  'Production',
                ]}
              />
              <Bar dataKey="production" radius={[0, 6, 6, 0]} maxBarSize={14}>
                {basinData.map((_, i) => (
                  <Cell key={i} fill={`rgba(234, 179, 8, ${0.9 - i * 0.15})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <ChartDivider />

      {/* Wells by status */}
      {statusData.length > 1 && (
        <div className="stat-section rounded-xl bg-white/[0.03] p-3">
          <ChartHeader label="Wells by status" />
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                dataKey="value"
                stroke="rgba(15,23,42,0.6)"
                strokeWidth={2}
                paddingAngle={3}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: string | number | undefined) => [
                  `${Number(value ?? 0).toLocaleString()} wells`,
                  'Count',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
            {statusData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[10px] text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChartDivider />

      {/* Top producers */}
      {top.length > 0 && (
        <div className="stat-section rounded-xl bg-white/[0.03] p-3">
          <ChartHeader label="Top producers" />
          <div className="space-y-1.5">
            {top.map((well, i) => (
              <div
                key={well.id}
                className="flex items-center gap-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] px-2.5 py-1.5"
              >
                <span className="w-4 text-[10px] font-bold text-slate-600 tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-200">
                    {well.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {BASIN_LABELS[well.basin].split(' · ')[0]}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-emerald-400 tabular-nums">
                  {well.production_boed.toLocaleString()}
                  <span className="ml-1 text-[9px] font-normal text-slate-500">boe/d</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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
            <span className="ml-1 text-[10px] font-normal text-slate-500">{unit}</span>
          )}
        </p>
      </div>
    </div>
  )
}

function ChartHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-white/[0.06] to-transparent" />
    </div>
  )
}

function ChartDivider() {
  return (
    <div className="px-3">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}
