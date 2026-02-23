import { useCallback, useState, useMemo } from 'react'
import { Source, Layer, Marker } from 'react-map-gl/mapbox'
import type { MapMouseEvent } from 'react-map-gl/mapbox'
import type { Feature, Polygon } from 'geojson'
import { BaseMap } from '@/components/map/BaseMap'

interface DrawMapProps {
  onPolygonComplete: (feature: Feature<Polygon>) => void
  onClear: () => void
}

export function DrawMap({ onPolygonComplete, onClear }: DrawMapProps) {
  const [points, setPoints] = useState<[number, number][]>([])
  const [isComplete, setIsComplete] = useState(false)

  const handleMapClick = useCallback(
    (evt: MapMouseEvent) => {
      if (isComplete) return
      setPoints((prev) => [...prev, [evt.lngLat.lng, evt.lngLat.lat]])
    },
    [isComplete]
  )

  const handleComplete = useCallback(() => {
    if (points.length < 3) return
    setIsComplete(true)

    const coordinates = [...points, points[0]]
    const feature: Feature<Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
    }
    onPolygonComplete(feature)
  }, [points, onPolygonComplete])

  const handleClear = useCallback(() => {
    setPoints([])
    setIsComplete(false)
    onClear()
  }, [onClear])

  const lineGeoJSON = useMemo(() => {
    if (points.length < 2) return null
    const coords = isComplete ? [...points, points[0]] : points
    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: coords,
          },
        },
      ],
    }
  }, [points, isComplete])

  const fillGeoJSON = useMemo(() => {
    if (!isComplete || points.length < 3) return null
    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[...points, points[0]]],
          },
        },
      ],
    }
  }, [points, isComplete])

  return (
    <div
      className="relative w-full h-full"
      style={{ cursor: isComplete ? undefined : 'crosshair' }}
    >
      <BaseMap onMapClick={handleMapClick}>
        {/* Polygon fill when complete */}
        {fillGeoJSON && (
          <Source id="draw-fill" type="geojson" data={fillGeoJSON}>
            <Layer
              id="draw-fill-layer"
              type="fill"
              paint={{
                'fill-color': 'rgba(16, 185, 129, 0.2)',
              }}
            />
          </Source>
        )}

        {/* Line connecting points */}
        {lineGeoJSON && (
          <Source id="draw-line" type="geojson" data={lineGeoJSON}>
            <Layer
              id="draw-line-layer"
              type="line"
              paint={{
                'line-color': '#10b981',
                'line-width': 2,
                'line-dasharray': isComplete ? [1] : [2, 2],
              }}
            />
          </Source>
        )}

        {/* Vertex markers */}
        {points.map((point, index) => (
          <Marker
            key={`vertex-${index}`}
            longitude={point[0]}
            latitude={point[1]}
            anchor="center"
          >
            <div
              className={[
                'w-3 h-3 rounded-full border-2 border-emerald-400',
                index === 0 && !isComplete
                  ? 'bg-emerald-400'
                  : 'bg-emerald-500/40',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </Marker>
        ))}
      </BaseMap>

      {/* Floating controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {points.length >= 3 && !isComplete && (
          <button
            onClick={handleComplete}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-black/30 transition-colors"
          >
            Completar Poligono ({points.length} puntos)
          </button>
        )}
        {points.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-white/10 shadow-lg shadow-black/30 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Point counter / hint */}
      {!isComplete && points.length > 0 && points.length < 3 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-white/10 text-xs text-slate-400">
          {3 - points.length} punto{3 - points.length !== 1 ? 's' : ''} mas
          para completar
        </div>
      )}
    </div>
  )
}
