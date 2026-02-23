import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface LegendItem {
  color: string
  label: string
  value?: string
}

interface LegendProps {
  items: LegendItem[]
  title?: string
}

export function Legend({ items, title = 'Leyenda' }: LegendProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (items.length === 0) return null

  return (
    <div className="absolute bottom-6 left-6 z-10 min-w-[180px] rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-md">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-200"
      >
        {title}
        {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {!collapsed && (
        <div className="space-y-2 px-4 pb-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-300">{item.label}</span>
              {item.value && (
                <span className="ml-auto text-xs text-slate-500">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
