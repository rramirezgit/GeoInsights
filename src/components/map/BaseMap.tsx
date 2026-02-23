import Map, { NavigationControl, type ViewStateChangeEvent, type MapMouseEvent } from 'react-map-gl/mapbox'
import { useMapStore } from '@/stores/mapStore'
import { MAPBOX_TOKEN, MAP_STYLES } from '@/constants/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

interface BaseMapProps {
  children?: React.ReactNode
  className?: string
  interactive?: boolean
  onMove?: (evt: ViewStateChangeEvent) => void
  onMapClick?: (evt: MapMouseEvent) => void
  style?: string
}

export function BaseMap({
  children,
  className = '',
  interactive = true,
  onMove,
  onMapClick,
  style,
}: BaseMapProps) {
  const viewport = useMapStore((s) => s.viewport)
  const baseStyle = useMapStore((s) => s.baseStyle)
  const setViewport = useMapStore((s) => s.setViewport)

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewport(evt.viewState)
    onMove?.(evt)
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
    <Map
      {...viewport}
      onMove={handleMove}
      onClick={onMapClick}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={style ?? MAP_STYLES[baseStyle]}
      interactive={interactive}
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
    >
      <NavigationControl position="top-right" showCompass={false} />
      {children}
    </Map>
    </div>
  )
}
