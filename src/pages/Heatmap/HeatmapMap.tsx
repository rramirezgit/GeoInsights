import { useMemo, useState, useCallback } from 'react'
import { Map, NavigationControl, Popup, Layer } from 'react-map-gl/mapbox'
import { DeckGL } from '@deck.gl/react'
import { ScatterplotLayer } from '@deck.gl/layers'
import { useGeoData } from '@/hooks/useGeoData'
import { useDemoStore } from '@/stores/demoStore'
import { useMapStore } from '@/stores/mapStore'
import { MAPBOX_TOKEN, MAP_STYLES } from '@/constants/mapbox'
import type { AgroDataPoint } from '@/types/agro.types'
import type { PickingInfo } from '@deck.gl/core'
import 'mapbox-gl/dist/mapbox-gl.css'

/**
 * Interpolates between color stops based on a normalized value [0..1].
 * Produces a smooth blue -> cyan -> yellow -> orange -> red gradient
 * to visually simulate a heatmap effect using scatterplot circles.
 */
const COLOR_STOPS: [number, [number, number, number, number]][] = [
  [0.0, [1, 152, 189, 140]],
  [0.2, [73, 227, 206, 170]],
  [0.4, [216, 254, 181, 190]],
  [0.6, [254, 237, 177, 210]],
  [0.8, [254, 173, 84, 230]],
  [1.0, [209, 55, 78, 255]],
]

function getHeatColor(t: number): [number, number, number, number] {
  const clamped = Math.max(0, Math.min(1, t))
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const [t0, c0] = COLOR_STOPS[i]
    const [t1, c1] = COLOR_STOPS[i + 1]
    if (clamped >= t0 && clamped <= t1) {
      const ratio = (clamped - t0) / (t1 - t0)
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * ratio),
        Math.round(c0[1] + (c1[1] - c0[1]) * ratio),
        Math.round(c0[2] + (c1[2] - c0[2]) * ratio),
        Math.round(c0[3] + (c1[3] - c0[3]) * ratio),
      ]
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][1]
}

interface PopupInfo {
  longitude: number
  latitude: number
  province: string
  crop: string
  production: number
}

export function HeatmapMap() {
  const province = useDemoStore((s) => s.heatmap.province)
  const crop = useDemoStore((s) => s.heatmap.crop)
  const year = useDemoStore((s) => s.heatmap.year)
  const showBorders = useDemoStore((s) => s.heatmap.showBorders)

  const viewport = useMapStore((s) => s.viewport)
  const setViewport = useMapStore((s) => s.setViewport)

  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)

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

  const { minProd, maxProd } = useMemo(() => {
    if (filteredData.length === 0) return { minProd: 0, maxProd: 1 }
    let min = Infinity
    let max = -Infinity
    for (const d of filteredData) {
      if (d.production_tons < min) min = d.production_tons
      if (d.production_tons > max) max = d.production_tons
    }
    return { minProd: min, maxProd: max === min ? min + 1 : max }
  }, [filteredData])

  const layers = useMemo(() => {
    const result = []

    if (filteredData.length > 0) {
      result.push(
        new ScatterplotLayer<AgroDataPoint>({
          id: 'heatmap-scatter',
          data: filteredData,
          getPosition: (d: AgroDataPoint) => [d.lng, d.lat],
          getRadius: (d: AgroDataPoint) => {
            const t = (d.production_tons - minProd) / (maxProd - minProd)
            return 8000 + t * 40000
          },
          getFillColor: (d: AgroDataPoint) => {
            const t = (d.production_tons - minProd) / (maxProd - minProd)
            return getHeatColor(t)
          },
          radiusMinPixels: 8,
          radiusMaxPixels: 60,
          pickable: true,
          antialiasing: true,
          parameters: {
            blend: true,
          },
          updateTriggers: {
            getRadius: [minProd, maxProd],
            getFillColor: [minProd, maxProd],
          },
        })
      )
    }

    return result
  }, [filteredData, minProd, maxProd])

  const handleClick = useCallback(
    (info: PickingInfo) => {
      if (info.object && info.coordinate) {
        // Check if it's a GeoJSON province feature
        const geoProps = (
          info.object as { properties?: { name?: string } }
        ).properties
        if (geoProps?.name) {
          const provinceName = geoProps.name
          const provinceData = filteredData.filter(
            (d) => d.province === provinceName
          )
          const totalProduction = provinceData.reduce(
            (sum, d) => sum + d.production_tons,
            0
          )
          setPopupInfo({
            longitude: info.coordinate[0],
            latitude: info.coordinate[1],
            province: provinceName,
            crop: crop === 'all' ? 'Todos' : crop,
            production: totalProduction,
          })
          return
        }

        // Check if it's a scatter data point
        const point = info.object as AgroDataPoint
        if (point.province) {
          setPopupInfo({
            longitude: point.lng,
            latitude: point.lat,
            province: point.province,
            crop: point.crop,
            production: point.production_tons,
          })
          return
        }
      }
      setPopupInfo(null)
    },
    [filteredData, crop]
  )

  return (
    <div className="w-full h-full relative">
      <DeckGL
        viewState={viewport}
        onViewStateChange={(e) => {
          if (e.viewState) {
            setViewport(e.viewState as typeof viewport)
          }
        }}
        layers={layers}
        controller
        onClick={handleClick}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={MAP_STYLES.dark}
          attributionControl={false}
        >
          <NavigationControl position="top-right" showCompass={false} />

          {/* Province borders from Mapbox vector tiles - 100% accurate */}
          {showBorders && (
            <>
              <Layer
                id="province-borders-line"
                type="line"
                source="composite"
                source-layer="admin"
                filter={['all',
                  ['==', ['get', 'admin_level'], 1],
                  ['==', ['get', 'iso_3166_1'], 'AR'],
                  ['==', ['get', 'maritime'], 'false'],
                ]}
                paint={{
                  'line-color': '#64c8b4',
                  'line-width': 1.5,
                  'line-opacity': 0.7,
                }}
              />
              <Layer
                id="province-borders-line-glow"
                type="line"
                source="composite"
                source-layer="admin"
                filter={['all',
                  ['==', ['get', 'admin_level'], 1],
                  ['==', ['get', 'iso_3166_1'], 'AR'],
                  ['==', ['get', 'maritime'], 'false'],
                ]}
                paint={{
                  'line-color': '#64c8b4',
                  'line-width': 4,
                  'line-opacity': 0.15,
                  'line-blur': 3,
                }}
              />
            </>
          )}

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeOnClick={false}
              className="[&_.mapboxgl-popup-content]:!bg-slate-900/95 [&_.mapboxgl-popup-content]:!backdrop-blur-xl [&_.mapboxgl-popup-content]:!border [&_.mapboxgl-popup-content]:!border-white/10 [&_.mapboxgl-popup-content]:!rounded-xl [&_.mapboxgl-popup-content]:!px-4 [&_.mapboxgl-popup-content]:!py-3 [&_.mapboxgl-popup-content]:!shadow-xl [&_.mapboxgl-popup-tip]:!border-t-slate-900/95 [&_.mapboxgl-popup-close-button]:!text-slate-400 [&_.mapboxgl-popup-close-button]:!text-lg [&_.mapboxgl-popup-close-button]:!right-2 [&_.mapboxgl-popup-close-button]:!top-1"
            >
              <div className="text-slate-100">
                <p className="font-semibold text-sm text-emerald-400">
                  {popupInfo.province}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Cultivo: {popupInfo.crop}
                </p>
                <p className="text-xs text-slate-400">
                  Produccion:{' '}
                  <span className="text-white font-medium">
                    {popupInfo.production.toLocaleString()} tn
                  </span>
                </p>
              </div>
            </Popup>
          )}
        </Map>
      </DeckGL>

      {filteredData.length === 0 && rawData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 text-center">
            <p className="text-slate-300 text-sm">
              No hay datos para los filtros seleccionados
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Ajusta provincia, cultivo o ano
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
