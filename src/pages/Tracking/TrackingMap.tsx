import { useState, useMemo } from 'react'
import { Marker, Source, Layer } from 'react-map-gl/mapbox'
import { BaseMap } from '@/components/map/BaseMap'
import { Popup } from '@/components/map/Popup'
import { useGeoData } from '@/hooks/useGeoData'
import { useDemoStore } from '@/stores/demoStore'
import { THEME } from '@/constants/theme'
import type { Truck, TruckStatus, RouteData } from '@/types'

const STATUS_COLORS = THEME.colors.status

const STATUS_LABELS: Record<TruckStatus, string> = {
  en_ruta: 'En Ruta',
  detenido: 'Detenido',
  alerta: 'Alerta',
  en_destino: 'En Destino',
}

interface TrackingMapProps {
  trucks: Truck[]
  showRoutes: boolean
}

export function TrackingMap({ trucks, showRoutes }: TrackingMapProps) {
  const [popupTruck, setPopupTruck] = useState<Truck | null>(null)
  const filterStatus = useDemoStore((s) => s.tracking.filterStatus)
  const selectedTruck = useDemoStore((s) => s.tracking.selectedTruck)
  const setTrackingFilter = useDemoStore((s) => s.setTrackingFilter)

  const { data: routesData } = useGeoData<RouteData[]>({
    url: '/data/argentina-routes.json',
    queryKey: ['argentina-routes'],
    enabled: showRoutes,
  })

  const routesGeoJSON = useMemo(() => {
    if (!routesData) return null
    return {
      type: 'FeatureCollection' as const,
      features: routesData.map((route) => ({
        type: 'Feature' as const,
        properties: { id: route.id, name: route.name },
        geometry: {
          type: 'LineString' as const,
          coordinates: route.coordinates,
        },
      })),
    }
  }, [routesData])

  const filteredTrucks = useMemo(
    () => trucks.filter((t) => filterStatus.includes(t.status)),
    [trucks, filterStatus]
  )

  const handleTruckClick = (truck: Truck) => {
    setPopupTruck(truck)
    setTrackingFilter('selectedTruck', truck.id)
  }

  const handlePopupClose = () => {
    setPopupTruck(null)
    setTrackingFilter('selectedTruck', null)
  }

  return (
    <BaseMap>
      <style>{pulseKeyframes}</style>

      {/* Route lines */}
      {showRoutes && routesGeoJSON && (
        <Source id="routes" type="geojson" data={routesGeoJSON}>
          <Layer
            id="routes-glow"
            type="line"
            paint={{
              'line-color': '#10b981',
              'line-width': 6,
              'line-opacity': 0.1,
              'line-blur': 4,
            }}
          />
          <Layer
            id="routes-line"
            type="line"
            paint={{
              'line-color': '#10b981',
              'line-width': 2,
              'line-opacity': 0.4,
              'line-dasharray': [2, 3],
            }}
          />
        </Source>
      )}

      {filteredTrucks.map((truck) => {
        const isSelected = selectedTruck === truck.id
        const color = STATUS_COLORS[truck.status]
        const isMoving = truck.status === 'en_ruta'
        const size = isSelected ? 18 : 12

        return (
          <Marker
            key={truck.id}
            longitude={truck.lng}
            latitude={truck.lat}
            anchor="center"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation()
              handleTruckClick(truck)
            }}
          >
            <div
              className="relative cursor-pointer"
              style={{ width: size + 16, height: size + 16 }}
            >
              {/* Pulse ring for moving trucks */}
              {isMoving && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: `${color}40`,
                    animation: 'truck-pulse 2s ease-out infinite',
                  }}
                />
              )}

              {/* Selected ring */}
              {isSelected && (
                <span
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: color }}
                />
              )}

              {/* Truck dot */}
              <span
                className="absolute rounded-full shadow-lg"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 8px ${color}80`,
                }}
              />
            </div>
          </Marker>
        )
      })}

      {popupTruck && (
        <Popup
          longitude={popupTruck.lng}
          latitude={popupTruck.lat}
          onClose={handlePopupClose}
          title={popupTruck.name}
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[popupTruck.status] }}
              />
              <span className="font-medium text-slate-200">
                {STATUS_LABELS[popupTruck.status]}
              </span>
            </div>

            <div className="space-y-1 text-slate-400">
              <p>
                <span className="text-slate-500">Carga:</span>{' '}
                {popupTruck.cargo}
              </p>
              <p>
                <span className="text-slate-500">Ruta:</span>{' '}
                {popupTruck.origin} → {popupTruck.destination}
              </p>
              <p>
                <span className="text-slate-500">Velocidad:</span>{' '}
                {Math.round(popupTruck.speed_kmh)} km/h
              </p>
              <p>
                <span className="text-slate-500">Rumbo:</span>{' '}
                {Math.round(popupTruck.heading)}°
              </p>
            </div>
          </div>
        </Popup>
      )}
    </BaseMap>
  )
}

const pulseKeyframes = `
@keyframes truck-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  70% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
`
