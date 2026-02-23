import { useRef, useCallback, useEffect, useState } from 'react'
import Map, { type ViewStateChangeEvent, type MapRef } from 'react-map-gl/mapbox'
import { motion } from 'framer-motion'
import { useMapStore } from '@/stores/mapStore'
import { useDemoStore } from '@/stores/demoStore'
import { MAPBOX_TOKEN, MAP_STYLES } from '@/constants/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

export function SwipeMap() {
  const viewport = useMapStore((s) => s.viewport)
  const setViewport = useMapStore((s) => s.setViewport)

  const leftStyle = useDemoStore((s) => s.satelital.leftStyle)
  const rightStyle = useDemoStore((s) => s.satelital.rightStyle)
  const sliderPosition = useDemoStore((s) => s.satelital.sliderPosition)
  const setSatelitalState = useDemoStore((s) => s.setSatelitalState)

  const containerRef = useRef<HTMLDivElement>(null)
  const leftMapRef = useRef<MapRef>(null)
  const rightMapRef = useRef<MapRef>(null)
  const isDragging = useRef(false)
  const isUpdatingViewport = useRef(false)

  const [containerWidth, setContainerWidth] = useState(0)

  // Track container width for slider pixel calculation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Sync viewport changes across both maps
  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      if (isUpdatingViewport.current) return
      isUpdatingViewport.current = true
      setViewport(evt.viewState)
      requestAnimationFrame(() => {
        isUpdatingViewport.current = false
      })
    },
    [setViewport],
  )

  // Slider drag handler using pointer events
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      isDragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSatelitalState('sliderPosition', pct)
    },
    [setSatelitalState],
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const sliderPx = (sliderPosition / 100) * containerWidth

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Left map (satellite) -- full width underneath */}
      <div className="absolute inset-0 z-[1]">
        <Map
          ref={leftMapRef}
          {...viewport}
          onMove={handleMove}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={MAP_STYLES[leftStyle]}
          interactive={true}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        />
      </div>

      {/* Right map (terrain) -- clipped from the right */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          clipPath: `inset(0 0 0 ${sliderPosition}%)`,
        }}
      >
        <Map
          ref={rightMapRef}
          {...viewport}
          onMove={handleMove}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={MAP_STYLES[rightStyle]}
          interactive={false}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        />
      </div>

      {/* Slider line + handle */}
      <div
        className="absolute top-0 bottom-0 z-[3]"
        style={{
          left: `${sliderPx}px`,
          transform: 'translateX(-50%)',
          width: '48px',
          cursor: 'col-resize',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

        {/* Drag handle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border-2 border-white shadow-lg shadow-black/30 flex items-center justify-center backdrop-blur-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-slate-700"
          >
            <path
              d="M4 8L1 5.5M4 8L1 10.5M4 8H1M12 8L15 5.5M12 8L15 10.5M12 8H15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Map style labels */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="absolute top-4 left-4 z-[4] px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80"
      >
        Satelital
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="absolute top-4 right-4 z-[4] px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80"
      >
        Terrain
      </motion.div>
    </div>
  )
}
