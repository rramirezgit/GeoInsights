import { useMemo, useState, useCallback } from 'react'
import { Map, NavigationControl, Popup, Layer } from 'react-map-gl/mapbox'
import { DeckGL } from '@deck.gl/react'
import { ScatterplotLayer } from '@deck.gl/layers'
import { useDemoStore } from '@/stores/demoStore'
import { useMapStore } from '@/stores/mapStore'
import { MAPBOX_TOKEN, MAP_STYLES } from '@/constants/mapbox'
import { Legend } from '@/components/map/Legend'
import type { Well, WellStatus } from '@/types/wells.types'
import type { PickingInfo } from '@deck.gl/core'
import {
  BASIN_LABELS,
  WELL_STATUS_COLORS,
  WELL_STATUS_LABELS,
  ALL_WELL_STATUSES,
} from './wells.constants'
import 'mapbox-gl/dist/mapbox-gl.css'

const STATUS_RGB: Record<WellStatus, [number, number, number]> = {
  producing: [34, 197, 94],
  drilling: [6, 182, 212],
  maintenance: [245, 158, 11],
  shut_in: [100, 116, 139],
}

interface WellsMapProps {
  wells: Well[]
}

export function WellsMap({ wells }: WellsMapProps) {
  const viewport = useMapStore((s) => s.viewport)
  const setViewport = useMapStore((s) => s.setViewport)
  const selectedWell = useDemoStore((s) => s.wells.selectedWell)
  const setWellsFilter = useDemoStore((s) => s.setWellsFilter)

  const [popupWell, setPopupWell] = useState<Well | null>(null)

  const maxProduction = useMemo(() => {
    let max = 1
    for (const w of wells) {
      if (w.production_boed > max) max = w.production_boed
    }
    return max
  }, [wells])

  const layers = useMemo(() => {
    if (wells.length === 0) return []
    return [
      new ScatterplotLayer<Well>({
        id: 'wells-scatter',
        data: wells,
        getPosition: (w: Well) => [w.lng, w.lat],
        getRadius: (w: Well) => {
          if (w.status !== 'producing') return 1600
          return 1600 + (w.production_boed / maxProduction) * 6000
        },
        getFillColor: (w: Well) => {
          const [r, g, b] = STATUS_RGB[w.status]
          return [r, g, b, w.status === 'shut_in' ? 130 : 200]
        },
        getLineColor: (w: Well) =>
          w.id === selectedWell ? [255, 255, 255, 255] : [15, 23, 42, 120],
        getLineWidth: (w: Well) => (w.id === selectedWell ? 3 : 1),
        lineWidthUnits: 'pixels',
        stroked: true,
        radiusMinPixels: 4,
        radiusMaxPixels: 22,
        pickable: true,
        antialiasing: true,
        updateTriggers: {
          getRadius: [maxProduction],
          getLineColor: [selectedWell],
          getLineWidth: [selectedWell],
        },
      }),
    ]
  }, [wells, maxProduction, selectedWell])

  const handleClick = useCallback(
    (info: PickingInfo) => {
      const well = info.object as Well | undefined
      if (well?.id) {
        setPopupWell(well)
        setWellsFilter('selectedWell', well.id)
      } else {
        setPopupWell(null)
        setWellsFilter('selectedWell', null)
      }
    },
    [setWellsFilter]
  )

  const legendItems = ALL_WELL_STATUSES.map((status) => ({
    color: WELL_STATUS_COLORS[status],
    label: WELL_STATUS_LABELS[status],
  }))

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
          projection="mercator"
          attributionControl={false}
        >
          <NavigationControl position="top-right" showCompass={false} />

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
              'line-width': 1,
              'line-opacity': 0.35,
            }}
          />

          {popupWell && (
            <Popup
              longitude={popupWell.lng}
              latitude={popupWell.lat}
              anchor="bottom"
              onClose={() => {
                setPopupWell(null)
                setWellsFilter('selectedWell', null)
              }}
              closeOnClick={false}
              className="[&_.mapboxgl-popup-content]:!bg-slate-900/95 [&_.mapboxgl-popup-content]:!backdrop-blur-xl [&_.mapboxgl-popup-content]:!border [&_.mapboxgl-popup-content]:!border-white/10 [&_.mapboxgl-popup-content]:!rounded-xl [&_.mapboxgl-popup-content]:!px-4 [&_.mapboxgl-popup-content]:!py-3 [&_.mapboxgl-popup-content]:!shadow-xl [&_.mapboxgl-popup-tip]:!border-t-slate-900/95 [&_.mapboxgl-popup-close-button]:!text-slate-400 [&_.mapboxgl-popup-close-button]:!text-lg [&_.mapboxgl-popup-close-button]:!right-2 [&_.mapboxgl-popup-close-button]:!top-1"
            >
              <div className="min-w-[190px] text-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: WELL_STATUS_COLORS[popupWell.status] }}
                  />
                  <p className="font-semibold text-sm text-emerald-400">
                    {popupWell.name}
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {popupWell.id} · {BASIN_LABELS[popupWell.basin]}
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <p>
                    Status:{' '}
                    <span className="text-white font-medium">
                      {WELL_STATUS_LABELS[popupWell.status]}
                    </span>
                  </p>
                  <p>
                    Production:{' '}
                    <span className="text-white font-medium tabular-nums">
                      {popupWell.production_boed.toLocaleString()} boe/d
                    </span>
                  </p>
                  <p>
                    Operator: <span className="text-slate-200">{popupWell.operator}</span>
                  </p>
                  <p>
                    Depth:{' '}
                    <span className="text-slate-200 tabular-nums">
                      {popupWell.depth_m.toLocaleString()} m
                    </span>{' '}
                    · Spud {popupWell.spud_year}
                  </p>
                  <p>
                    Type:{' '}
                    <span className="text-slate-200 uppercase">{popupWell.resource}</span>
                    {popupWell.unconventional && (
                      <span className="ml-1.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                        SHALE
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </DeckGL>

      <Legend items={legendItems} title="Well status" />

      {wells.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 text-center">
            <p className="text-slate-300 text-sm">No wells for the selected filters</p>
            <p className="text-slate-500 text-xs mt-1">
              Adjust basin, status or production range
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
