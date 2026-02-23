import { Plus, Minus, Home, Layers } from 'lucide-react'
import { useMapViewport } from '@/hooks/useMapViewport'
import { useMapStore } from '@/stores/mapStore'
import type { MapStyle } from '@/types'

const STYLE_CYCLE: MapStyle[] = ['dark', 'satellite', 'terrain', 'outdoors']

export function MapControls() {
  const { zoomIn, zoomOut, resetView } = useMapViewport()
  const baseStyle = useMapStore((s) => s.baseStyle)
  const setBaseStyle = useMapStore((s) => s.setBaseStyle)

  const cycleStyle = () => {
    const idx = STYLE_CYCLE.indexOf(baseStyle)
    const next = STYLE_CYCLE[(idx + 1) % STYLE_CYCLE.length]
    setBaseStyle(next)
  }

  const buttons = [
    { icon: Plus, label: 'Zoom in', onClick: zoomIn },
    { icon: Minus, label: 'Zoom out', onClick: zoomOut },
    { icon: Home, label: 'Reset view', onClick: resetView },
    { icon: Layers, label: 'Toggle basemap', onClick: cycleStyle },
  ]

  return (
    <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
      {buttons.map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-900/80 text-slate-300 backdrop-blur-md transition-colors hover:bg-slate-800/90 hover:text-white"
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  )
}
