import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CropType } from '@/types/agro.types'
import type { TruckStatus } from '@/types/fleet.types'
import type { MapStyle, AnalysisResult, SatelitalMode, ElevationPoint, ElevationProfile, MeasurementResult } from '@/types/geo.types'

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
  mode: SatelitalMode
  elevationPoints: ElevationPoint[]
  elevationProfile: ElevationProfile | null
  measureResult: MeasurementResult | null
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
  setSatelitalMode: (mode: SatelitalMode) => void
  addElevationPoint: (point: ElevationPoint) => void
  setElevationProfile: (profile: ElevationProfile | null) => void
  clearElevation: () => void
  setMeasureResult: (result: MeasurementResult | null) => void
  clearMeasure: () => void

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
  mode: 'compare',
  elevationPoints: [],
  elevationProfile: null,
  measureResult: null,
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
      setSatelitalMode: (mode) =>
        set((state) => ({
          satelital: {
            ...state.satelital,
            mode,
            elevationPoints: [],
            elevationProfile: null,
            measureResult: null,
          },
        })),
      addElevationPoint: (point) =>
        set((state) => ({
          satelital: {
            ...state.satelital,
            elevationPoints: [...state.satelital.elevationPoints, point].slice(0, 2),
          },
        })),
      setElevationProfile: (profile) =>
        set((state) => ({ satelital: { ...state.satelital, elevationProfile: profile } })),
      clearElevation: () =>
        set((state) => ({
          satelital: { ...state.satelital, elevationPoints: [], elevationProfile: null },
        })),
      setMeasureResult: (result) =>
        set((state) => ({ satelital: { ...state.satelital, measureResult: result } })),
      clearMeasure: () =>
        set((state) => ({ satelital: { ...state.satelital, measureResult: null } })),

      resetHeatmap: () => set({ heatmap: initialHeatmap }),
      resetTracking: () => set({ tracking: initialTracking }),
      resetDraw: () => set({ draw: initialDraw }),
      resetSatelital: () => set({ satelital: initialSatelital }),
    }),
    { name: 'demo-store' }
  )
)
