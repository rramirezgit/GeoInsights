import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CropType } from '@/types/agro.types'
import type { TruckStatus } from '@/types/fleet.types'
import type { MapStyle, AnalysisResult } from '@/types/geo.types'

interface HeatmapFilters {
  province: string
  crop: CropType | 'all'
  year: number
  showBorders: boolean
}

interface TrackingFilters {
  filterStatus: TruckStatus[]
  selectedTruck: string | null
  simulationSpeed: number
}

interface DrawState {
  analysisResult: AnalysisResult | null
}

interface SatelitalState {
  leftStyle: MapStyle
  rightStyle: MapStyle
  sliderPosition: number
}

interface DemoStore {
  heatmap: HeatmapFilters
  tracking: TrackingFilters
  draw: DrawState
  satelital: SatelitalState

  setHeatmapFilter: <K extends keyof HeatmapFilters>(key: K, value: HeatmapFilters[K]) => void
  setTrackingFilter: <K extends keyof TrackingFilters>(key: K, value: TrackingFilters[K]) => void
  setAnalysisResult: (result: AnalysisResult | null) => void
  setSatelitalState: <K extends keyof SatelitalState>(key: K, value: SatelitalState[K]) => void

  resetHeatmap: () => void
  resetTracking: () => void
  resetDraw: () => void
  resetSatelital: () => void
}

const initialHeatmap: HeatmapFilters = {
  province: 'all',
  crop: 'soja',
  year: 2024,
  showBorders: true,
}

const initialTracking: TrackingFilters = {
  filterStatus: ['en_ruta', 'detenido', 'alerta', 'en_destino'],
  selectedTruck: null,
  simulationSpeed: 1,
}

const initialDraw: DrawState = {
  analysisResult: null,
}

const initialSatelital: SatelitalState = {
  leftStyle: 'satellite',
  rightStyle: 'terrain',
  sliderPosition: 50,
}

export const useDemoStore = create<DemoStore>()(
  devtools(
    (set) => ({
      heatmap: initialHeatmap,
      tracking: initialTracking,
      draw: initialDraw,
      satelital: initialSatelital,

      setHeatmapFilter: (key, value) =>
        set((state) => ({ heatmap: { ...state.heatmap, [key]: value } })),
      setTrackingFilter: (key, value) =>
        set((state) => ({ tracking: { ...state.tracking, [key]: value } })),
      setAnalysisResult: (result) =>
        set({ draw: { analysisResult: result } }),
      setSatelitalState: (key, value) =>
        set((state) => ({ satelital: { ...state.satelital, [key]: value } })),

      resetHeatmap: () => set({ heatmap: initialHeatmap }),
      resetTracking: () => set({ tracking: initialTracking }),
      resetDraw: () => set({ draw: initialDraw }),
      resetSatelital: () => set({ satelital: initialSatelital }),
    }),
    { name: 'demo-store' }
  )
)
