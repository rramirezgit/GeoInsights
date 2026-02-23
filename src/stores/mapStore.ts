import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ViewState, MapStyle } from '@/types/geo.types'
import { ARGENTINA_CENTER } from '@/constants/mapbox'

interface MapStore {
  viewport: ViewState
  baseStyle: MapStyle
  setViewport: (viewport: Partial<ViewState>) => void
  setBaseStyle: (style: MapStyle) => void
  flyTo: (coords: [number, number], zoom?: number) => void
  resetViewport: () => void
}

export const useMapStore = create<MapStore>()(
  devtools(
    (set) => ({
      viewport: ARGENTINA_CENTER,
      baseStyle: 'dark',
      setViewport: (viewport) =>
        set((state) => ({ viewport: { ...state.viewport, ...viewport } })),
      setBaseStyle: (baseStyle) => set({ baseStyle }),
      flyTo: (coords, zoom = 12) =>
        set({
          viewport: {
            longitude: coords[0],
            latitude: coords[1],
            zoom,
            pitch: 0,
            bearing: 0,
            transitionDuration: 2000,
          },
        }),
      resetViewport: () => set({ viewport: ARGENTINA_CENTER }),
    }),
    { name: 'map-store' }
  )
)
