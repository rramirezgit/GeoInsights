import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { Flame, MapPin, BarChart3 } from 'lucide-react'
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
import { useGeoData } from '@/hooks/useGeoData'
import { useDemoStore } from '@/stores/demoStore'
import type { AgroDataPoint, CropType } from '@/types/agro.types'
import type { LucideIcon } from 'lucide-react'

const CROP_COLORS: Record<CropType, string> = {
  soja: '#10b981',
  maiz: '#f59e0b',
  trigo: '#3b82f6',
  girasol: '#f97316',
}

const CROP_LABELS: Record<CropType, string> = {
  soja: 'Soja',
  maiz: 'Maiz',
  trigo: 'Trigo',
  girasol: 'Girasol',
}

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  fontSize: '11px',
  color: '#e2e8f0',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  padding: '8px 12px',
}

export function HeatmapStats() {
  const province = useDemoStore((s) => s.heatmap.province)
  const crop = useDemoStore((s) => s.heatmap.crop)
  const year = useDemoStore((s) => s.heatmap.year)

  const containerRef = useRef<HTMLDivElement>(null)

  const { data: rawData } = useGeoData<AgroDataPoint[]>({
    url: '/data/agro-production.json',
    queryKey: ['agro-production'],
  })

  // GSAP stagger entrance
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

  const filteredData = useMemo(() => {
    if (!rawData) return []
    return rawData.filter((d) => {
      const matchProvince = province === 'all' || d.province === province
      const matchCrop = crop === 'all' || d.crop === crop
      const matchYear = d.year === year
      return matchProvince && matchCrop && matchYear
    })
  }, [rawData, province, crop, year])

  const totalProduction = useMemo(
    () => filteredData.reduce((sum, d) => sum + d.production_tons, 0),
    [filteredData],
  )

  const topProvinces = useMemo(() => {
    const byProvince = new Map<string, number>()
    for (const d of filteredData) {
      byProvince.set(
        d.province,
        (byProvince.get(d.province) ?? 0) + d.production_tons,
      )
    }
    return Array.from(byProvince.entries())
      .map(([name, production]) => ({ name, production }))
      .sort((a, b) => b.production - a.production)
      .slice(0, 5)
  }, [filteredData])

  const cropDistribution = useMemo(() => {
    const byCrop = new Map<CropType, number>()
    for (const d of filteredData) {
      byCrop.set(d.crop, (byCrop.get(d.crop) ?? 0) + d.production_tons)
    }
    return Array.from(byCrop.entries()).map(([cropKey, value]) => ({
      name: CROP_LABELS[cropKey],
      value,
      color: CROP_COLORS[cropKey],
    }))
  }, [filteredData])

  return (
    <div ref={containerRef} className="space-y-1">
      {/* KPI cards */}
      <div className="stat-section grid gap-1.5">
        <KpiCard
          label="Produccion total"
          value={Math.round(totalProduction / 1000).toLocaleString()}
          unit="k tn"
          icon={Flame}
          color="#10b981"
        />
        <KpiCard
          label="Puntos de datos"
          value={filteredData.length.toLocaleString()}
          icon={MapPin}
          color="#3b82f6"
        />
        <KpiCard
          label="Provincias activas"
          value={topProvinces.length.toLocaleString()}
          icon={BarChart3}
          color="#a855f7"
        />
      </div>

      <ChartDivider />

      {/* Top provinces */}
      {topProvinces.length > 0 && (
        <div className="stat-section rounded-xl bg-white/[0.03] p-3">
          <ChartHeader label="Top provincias" />
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              data={topProvinces}
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
                width={80}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(value: string | number | undefined) => [
                  `${Number(value ?? 0).toLocaleString()} tn`,
                  'Produccion',
                ]}
              />
              <Bar dataKey="production" radius={[0, 6, 6, 0]} maxBarSize={14}>
                {topProvinces.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`rgba(16, 185, 129, ${0.9 - i * 0.15})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <ChartDivider />

      {/* Crop distribution */}
      {cropDistribution.length > 1 && (
        <div className="stat-section rounded-xl bg-white/[0.03] p-3">
          <ChartHeader label="Distribucion por cultivo" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={60}
                dataKey="value"
                stroke="rgba(15,23,42,0.6)"
                strokeWidth={2}
                paddingAngle={3}
              >
                {cropDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: string | number | undefined) => [
                  `${Number(value ?? 0).toLocaleString()} tn`,
                  'Produccion',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
            {cropDistribution.map((entry) => (
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
      {/* Colored left accent */}
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
