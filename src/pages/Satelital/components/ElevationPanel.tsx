import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { X, Mountain, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import type { ElevationProfile } from '@/types/geo.types'

interface ElevationPanelProps {
  profile: ElevationProfile
  onClose: () => void
}

export function ElevationPanel({ profile, onClose }: ElevationPanelProps) {
  const kpis = [
    { label: 'Min', value: `${profile.minElevation} m`, icon: <ArrowDownRight className="w-3 h-3 text-cyan-400" /> },
    { label: 'Max', value: `${profile.maxElevation} m`, icon: <ArrowUpRight className="w-3 h-3 text-emerald-400" /> },
    { label: 'Prom', value: `${profile.avgElevation} m`, icon: <Minus className="w-3 h-3 text-slate-400" /> },
    { label: 'Ganancia', value: `${profile.elevationGain} m`, icon: <Mountain className="w-3 h-3 text-amber-400" /> },
    { label: 'Distancia', value: `${profile.totalDistance.toFixed(2)} km`, icon: null },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-20 left-4 right-4 mx-auto max-w-lg z-[10] rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider">
          Perfil de Elevacion
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-32 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={profile.samples} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="distance"
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              tickFormatter={(v: number) => `${v.toFixed(1)}`}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              tickFormatter={(v: number) => `${v}m`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#e2e8f0',
              }}
              formatter={(value) => [`${value} m`, 'Elevacion']}
              labelFormatter={(label) => `${label} km`}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#elevGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* KPIs */}
      <div className="flex items-center justify-between gap-2">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              {kpi.icon}
              <span className="text-[10px] text-slate-500 uppercase">{kpi.label}</span>
            </div>
            <span className="text-xs font-semibold text-white">{kpi.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
