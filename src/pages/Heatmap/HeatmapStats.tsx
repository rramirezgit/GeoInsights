import { useMemo } from 'react'
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
import { StatWidget } from '@/components/ui/StatWidget'
import { GlassCard } from '@/components/ui/GlassCard'
import { useGeoData } from '@/hooks/useGeoData'
import { useDemoStore } from '@/stores/demoStore'
import type { AgroDataPoint, CropType } from '@/types/agro.types'

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

export function HeatmapStats() {
  const province = useDemoStore((s) => s.heatmap.province)
  const crop = useDemoStore((s) => s.heatmap.crop)
  const year = useDemoStore((s) => s.heatmap.year)

  const { data: rawData } = useGeoData<AgroDataPoint[]>({
    url: '/data/agro-production.json',
    queryKey: ['agro-production'],
  })

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
    [filteredData]
  )

  const topProvinces = useMemo(() => {
    const byProvince = new Map<string, number>()
    for (const d of filteredData) {
      byProvince.set(
        d.province,
        (byProvince.get(d.province) ?? 0) + d.production_tons
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
    <div className="space-y-4">
      <StatWidget
        label="Produccion total"
        value={Math.round(totalProduction / 1000)}
        unit="k tn"
        icon={Flame}
      />

      <StatWidget
        label="Puntos de datos"
        value={filteredData.length}
        icon={MapPin}
      />

      <StatWidget
        label="Provincias activas"
        value={topProvinces.length}
        icon={BarChart3}
      />

      {/* Top provinces bar chart */}
      {topProvinces.length > 0 && (
        <GlassCard padding="sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
            Top provincias
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={topProvinces}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
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
                width={85}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
                formatter={(value: string | number | undefined) => [
                  `${Number(value ?? 0).toLocaleString()} tn`,
                  'Produccion',
                ]}
              />
              <Bar
                dataKey="production"
                fill="#10b981"
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Crop distribution pie chart */}
      {cropDistribution.length > 1 && (
        <GlassCard padding="sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
            Distribucion por cultivo
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                stroke="none"
                paddingAngle={2}
              >
                {cropDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
                formatter={(value: string | number | undefined) => [
                  `${Number(value ?? 0).toLocaleString()} tn`,
                  'Produccion',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-1">
            {cropDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
