import { Source, Layer, Marker } from 'react-map-gl/mapbox'
import type { ElevationPoint } from '@/types/geo.types'

interface ElevationOverlayProps {
  points: ElevationPoint[]
}

export function ElevationOverlay({ points }: ElevationOverlayProps) {
  if (points.length === 0) return null

  const lineGeoJSON: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features:
      points.length === 2
        ? [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: points.map((p) => [p.lng, p.lat]),
              },
            },
          ]
        : [],
  }

  return (
    <>
      {/* Line between the two points */}
      <Source id="elevation-line" type="geojson" data={lineGeoJSON}>
        <Layer
          id="elevation-line-layer"
          type="line"
          paint={{
            'line-color': '#10b981',
            'line-width': 3,
            'line-dasharray': [2, 2],
          }}
        />
      </Source>

      {/* Endpoint markers */}
      {points.map((pt, i) => (
        <Marker key={i} longitude={pt.lng} latitude={pt.lat} anchor="center">
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-500/30" />
            <div className="absolute -top-7 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] text-white whitespace-nowrap border border-white/10">
              {i === 0 ? 'A' : 'B'}
            </div>
          </div>
        </Marker>
      ))}
    </>
  )
}
