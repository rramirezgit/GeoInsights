import { Popup as MapPopup } from 'react-map-gl/mapbox'
import { X } from 'lucide-react'

interface PopupProps {
  longitude: number
  latitude: number
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export function Popup({ longitude, latitude, onClose, title, children }: PopupProps) {
  return (
    <MapPopup
      longitude={longitude}
      latitude={latitude}
      onClose={onClose}
      closeButton={false}
      anchor="bottom"
      offset={12}
      className="[&_.mapboxgl-popup-content]:!bg-transparent [&_.mapboxgl-popup-content]:!p-0 [&_.mapboxgl-popup-content]:!shadow-none [&_.mapboxgl-popup-tip]:!border-t-slate-900/80"
    >
      <div className="min-w-[200px] rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          {title && (
            <span className="text-sm font-medium text-slate-200">{title}</span>
          )}
          <button
            onClick={onClose}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
        {children && <div className="px-4 py-3">{children}</div>}
      </div>
    </MapPopup>
  )
}
