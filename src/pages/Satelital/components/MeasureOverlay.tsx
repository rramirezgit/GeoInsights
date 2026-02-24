import { Source, Layer, Marker } from 'react-map-gl/mapbox'
import type { MeasurementResult } from '@/types/geo.types'

interface MeasureOverlayProps {
  result: MeasurementResult
}

export function MeasureOverlay({ result }: MeasureOverlayProps) {
  const { points, segmentDistances, isClosed } = result
  if (points.length === 0) return null

  const lineCoords = isClosed ? [...points, points[0]] : points

  const lineGeoJSON: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features:
      points.length >= 2
        ? [
            isClosed
              ? {
                  type: 'Feature' as const,
                  properties: {},
                  geometry: {
                    type: 'Polygon' as const,
                    coordinates: [lineCoords],
                  },
                }
              : {
                  type: 'Feature' as const,
                  properties: {},
                  geometry: {
                    type: 'LineString' as const,
                    coordinates: lineCoords,
                  },
                },
          ]
        : [],
  }

  // Compute midpoints for distance labels
  const midpoints: { lng: number; lat: number; dist: number }[] = []
  for (let i = 0; i < segmentDistances.length; i++) {
    const a = points[i]
    const b = i + 1 < points.length ? points[i + 1] : points[0]
    midpoints.push({
      lng: (a[0] + b[0]) / 2,
      lat: (a[1] + b[1]) / 2,
      dist: segmentDistances[i],
    })
  }

  return (
    <>
      {/* Line/polygon fill */}
      <Source id="measure-geom" type="geojson" data={lineGeoJSON}>
        {isClosed && (
          <Layer
            id="measure-fill"
            type="fill"
            paint={{
              'fill-color': '#06b6d4',
              'fill-opacity': 0.15,
            }}
          />
        )}
        <Layer
          id="measure-line"
          type="line"
          paint={{
            'line-color': '#06b6d4',
            'line-width': 2.5,
          }}
        />
      </Source>

      {/* Vertex markers */}
      {points.map((pt, i) => (
        <Marker key={`v-${i}`} longitude={pt[0]} latitude={pt[1]} anchor="center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/30" />
        </Marker>
      ))}

      {/* Distance labels at segment midpoints */}
      {midpoints.map((mp, i) => (
        <Marker key={`d-${i}`} longitude={mp.lng} latitude={mp.lat} anchor="center">
          <div className="px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] text-cyan-300 font-medium whitespace-nowrap border border-cyan-500/20">
            {mp.dist < 1 ? `${(mp.dist * 1000).toFixed(0)} m` : `${mp.dist.toFixed(2)} km`}
          </div>
        </Marker>
      ))}
    </>
  )
}
