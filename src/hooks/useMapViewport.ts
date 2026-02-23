import { useCallback } from 'react'
import { useMapStore } from '@/stores/mapStore'
import type { ViewState } from '@/types'

export function useMapViewport() {
  const viewport = useMapStore((s) => s.viewport)
  const setViewport = useMapStore((s) => s.setViewport)
  const flyToStore = useMapStore((s) => s.flyTo)
  const resetViewport = useMapStore((s) => s.resetViewport)

  const flyTo = useCallback(
    (coords: [number, number], zoom?: number) => {
      flyToStore(coords, zoom)
    },
    [flyToStore]
  )

  const resetView = useCallback(() => {
    resetViewport()
  }, [resetViewport])

  const zoomIn = useCallback(() => {
    setViewport({ zoom: Math.min(viewport.zoom + 1, 20) })
  }, [setViewport, viewport.zoom])

  const zoomOut = useCallback(() => {
    setViewport({ zoom: Math.max(viewport.zoom - 1, 1) })
  }, [setViewport, viewport.zoom])

  return {
    viewport,
    flyTo,
    resetView,
    setViewport: (v: Partial<ViewState>) => setViewport(v),
    zoomIn,
    zoomOut,
  }
}
