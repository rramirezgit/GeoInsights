import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useMapStore } from '@/stores/mapStore'
import { useDemoStore } from '@/stores/demoStore'
import { ZONE_PRESETS } from '@/constants/mapbox'
import { SwipeMap, type SwipeMapHandle } from './SwipeMap'
import { ZoneSelector } from './ZoneSelector'
import { ModeToolbar } from './components/ModeToolbar'
import { ElevationOverlay } from './components/ElevationOverlay'
import { ElevationPanel } from './components/ElevationPanel'
import { MeasureOverlay } from './components/MeasureOverlay'
import { MeasurePanel } from './components/MeasurePanel'
import { sampleElevationProfile } from '@/lib/geo/elevation'
import { calculateSegmentDistances, calculateTotalDistance, calculateMeasurementArea } from '@/lib/geo/turf.helpers'
import type { MapMouseEvent } from 'react-map-gl/mapbox'
import type { SatelitalMode } from '@/types/geo.types'

export default function SatelitalPage() {
  const flyTo = useMapStore((s) => s.flyTo)
  const resetViewport = useMapStore((s) => s.resetViewport)
  const resetSatelital = useDemoStore((s) => s.resetSatelital)

  const mode = useDemoStore((s) => s.satelital.mode)
  const elevationPoints = useDemoStore((s) => s.satelital.elevationPoints)
  const elevationProfile = useDemoStore((s) => s.satelital.elevationProfile)
  const measureResult = useDemoStore((s) => s.satelital.measureResult)

  const setSatelitalMode = useDemoStore((s) => s.setSatelitalMode)
  const addElevationPoint = useDemoStore((s) => s.addElevationPoint)
  const setElevationProfile = useDemoStore((s) => s.setElevationProfile)
  const clearElevation = useDemoStore((s) => s.clearElevation)
  const setMeasureResult = useDemoStore((s) => s.setMeasureResult)
  const clearMeasure = useDemoStore((s) => s.clearMeasure)

  const swipeRef = useRef<SwipeMapHandle>(null)

  // Initialize with a good default zone
  useEffect(() => {
    const delta = ZONE_PRESETS.deltaParana
    flyTo([delta.longitude, delta.latitude], delta.zoom, delta.pitch)
    return () => {
      resetViewport()
      resetSatelital()
    }
  }, [flyTo, resetViewport, resetSatelital])

  const handleModeChange = useCallback(
    (newMode: SatelitalMode) => {
      setSatelitalMode(newMode)
    },
    [setSatelitalMode],
  )

  // Handle map click based on current mode
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat

      if (mode === 'elevation') {
        if (elevationPoints.length >= 2) {
          // Reset for a new measurement
          clearElevation()
          return
        }

        const map = swipeRef.current?.getLeftMap()
        let elev: number | null = null
        if (map) {
          try {
            elev = map.queryTerrainElevation(e.lngLat) ?? null
          } catch {
            elev = null
          }
        }

        addElevationPoint({ lng, lat, elevation: elev !== null ? Math.round(elev) : null })

        // If this is the second point, wait for terrain tiles then sample the profile
        if (elevationPoints.length === 1 && map) {
          const startPt = elevationPoints[0]
          const trySample = (attempt: number) => {
            const testElev = map.queryTerrainElevation(e.lngLat)
            if ((testElev === null || testElev === undefined || testElev === 0) && attempt < 8) {
              setTimeout(() => trySample(attempt + 1), 400)
              return
            }
            const profile = sampleElevationProfile(
              map,
              [startPt.lng, startPt.lat],
              [lng, lat],
            )
            setElevationProfile(profile)
          }
          setTimeout(() => trySample(0), 500)
        }
      }

      if (mode === 'measure') {
        if (measureResult?.isClosed) return // already closed, need to clear first

        const currentPoints = measureResult?.points ?? []
        const newPoints: [number, number][] = [...currentPoints, [lng, lat]]
        const segmentDistances = calculateSegmentDistances(newPoints)
        const totalDistance = calculateTotalDistance(newPoints)

        setMeasureResult({
          points: newPoints,
          segmentDistances,
          totalDistance,
          area: null,
          isClosed: false,
        })
      }
    },
    [mode, elevationPoints, measureResult, addElevationPoint, clearElevation, setElevationProfile, setMeasureResult],
  )

  // Handle double click to close polygon in measure mode
  const handleMapDblClick = useCallback(
    (e: MapMouseEvent) => {
      e.preventDefault()

      if (mode === 'measure' && measureResult && !measureResult.isClosed && measureResult.points.length >= 3) {
        // Close the polygon
        const pts = measureResult.points
        const closingSegment = calculateSegmentDistances([pts[pts.length - 1], pts[0]])
        const segmentDistances = [...measureResult.segmentDistances, ...closingSegment]
        const totalDistance = segmentDistances.reduce((s, d) => s + d, 0)
        const area = calculateMeasurementArea(pts)

        setMeasureResult({
          points: pts,
          segmentDistances,
          totalDistance,
          area,
          isClosed: true,
        })
      }
    },
    [mode, measureResult, setMeasureResult],
  )

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Full-screen swipe map */}
      <SwipeMap
        ref={swipeRef}
        mode={mode}
        onClick={handleMapClick}
        onDblClick={handleMapDblClick}
      >
        {/* Overlay layers rendered inside left map */}
        {mode === 'elevation' && <ElevationOverlay points={elevationPoints} />}
        {mode === 'measure' && measureResult && <MeasureOverlay result={measureResult} />}
      </SwipeMap>

      {/* Back button (top-left, glass) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-20 left-4 z-[10]"
      >
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-slate-900/90 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Hub</span>
        </Link>
      </motion.div>

      {/* Mode toolbar (top center) */}
      <ModeToolbar mode={mode} onModeChange={handleModeChange} />

      {/* Elevation panel */}
      <AnimatePresence>
        {mode === 'elevation' && elevationProfile && (
          <ElevationPanel profile={elevationProfile} onClose={clearElevation} />
        )}
      </AnimatePresence>

      {/* Measure panel */}
      <AnimatePresence>
        {mode === 'measure' && measureResult && measureResult.points.length >= 2 && (
          <MeasurePanel result={measureResult} onClear={clearMeasure} />
        )}
      </AnimatePresence>

      {/* Zone selector at bottom (only in compare mode) */}
      {mode === 'compare' && <ZoneSelector />}

      {/* Mode hints */}
      <AnimatePresence>
        {mode === 'elevation' && elevationPoints.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] px-4 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-xs text-slate-300"
          >
            Click en el mapa para colocar el punto A
          </motion.div>
        )}
        {mode === 'elevation' && elevationPoints.length === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] px-4 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-xs text-slate-300"
          >
            Click en el mapa para colocar el punto B
          </motion.div>
        )}
        {mode === 'measure' && (!measureResult || measureResult.points.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] px-4 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-xs text-slate-300"
          >
            Click para agregar puntos de medicion
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
