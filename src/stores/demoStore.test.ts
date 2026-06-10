import { describe, it, expect, beforeEach } from 'vitest'
import { useDemoStore } from './demoStore'
import type { AnalysisResult, ElevationPoint } from '@/types/geo.types'

const point = (lng: number, lat: number): ElevationPoint => ({ lng, lat, elevation: 0 })

describe('demoStore', () => {
  beforeEach(() => {
    const state = useDemoStore.getState()
    state.resetHeatmap()
    state.resetTracking()
    state.resetDraw()
    state.resetSatelital()
  })

  describe('heatmap filters', () => {
    it('starts with soja across all provinces in 2024', () => {
      expect(useDemoStore.getState().heatmap).toEqual({
        province: 'all',
        crop: 'soja',
        year: 2024,
        showBorders: true,
      })
    })

    it('updates a single filter preserving the rest', () => {
      useDemoStore.getState().setHeatmapFilter('crop', 'maiz')
      const { heatmap } = useDemoStore.getState()
      expect(heatmap.crop).toBe('maiz')
      expect(heatmap.province).toBe('all')
    })

    it('resets to the initial filters', () => {
      useDemoStore.getState().setHeatmapFilter('province', 'Córdoba')
      useDemoStore.getState().resetHeatmap()
      expect(useDemoStore.getState().heatmap.province).toBe('all')
    })
  })

  describe('tracking filters', () => {
    it('selects a truck and changes simulation speed', () => {
      useDemoStore.getState().setTrackingFilter('selectedTruck', 't-7')
      useDemoStore.getState().setTrackingFilter('simulationSpeed', 4)
      const { tracking } = useDemoStore.getState()
      expect(tracking.selectedTruck).toBe('t-7')
      expect(tracking.simulationSpeed).toBe(4)
    })

    it('narrows the status filter', () => {
      useDemoStore.getState().setTrackingFilter('filterStatus', ['alerta'])
      expect(useDemoStore.getState().tracking.filterStatus).toEqual(['alerta'])
    })
  })

  describe('draw analysis', () => {
    it('stores and clears the analysis result', () => {
      const result: AnalysisResult = {
        area_km2: 10,
        area_hectares: 1000,
        perimeter_km: 13,
        centroid: { lat: -34, lng: -60 },
        aptitude: 'alta',
        soilType: 'Molisol - Pampa Húmeda',
      }
      useDemoStore.getState().setAnalysisResult(result)
      expect(useDemoStore.getState().draw.analysisResult).toBe(result)

      useDemoStore.getState().setAnalysisResult(null)
      expect(useDemoStore.getState().draw.analysisResult).toBeNull()
    })
  })

  describe('satelital state', () => {
    it('keeps at most two elevation points', () => {
      const { addElevationPoint } = useDemoStore.getState()
      addElevationPoint(point(-60, -34))
      addElevationPoint(point(-61, -35))
      addElevationPoint(point(-62, -36))
      const { elevationPoints } = useDemoStore.getState().satelital
      expect(elevationPoints).toHaveLength(2)
      expect(elevationPoints[0].lng).toBe(-60)
    })

    it('clears elevation data without touching the slider', () => {
      useDemoStore.getState().setSatelitalState('sliderPosition', 80)
      useDemoStore.getState().addElevationPoint(point(-60, -34))
      useDemoStore.getState().clearElevation()
      const { satelital } = useDemoStore.getState()
      expect(satelital.elevationPoints).toEqual([])
      expect(satelital.sliderPosition).toBe(80)
    })

    it('switching mode wipes elevation and measurement state', () => {
      useDemoStore.getState().addElevationPoint(point(-60, -34))
      useDemoStore.getState().setMeasureResult({
        points: [
          [0, 0],
          [1, 0],
        ],
        segmentDistances: [111],
        totalDistance: 111,
        area: null,
        isClosed: false,
      })
      useDemoStore.getState().setSatelitalMode('elevation')
      const { satelital } = useDemoStore.getState()
      expect(satelital.mode).toBe('elevation')
      expect(satelital.elevationPoints).toEqual([])
      expect(satelital.elevationProfile).toBeNull()
      expect(satelital.measureResult).toBeNull()
    })

    it('resets satelital state entirely', () => {
      useDemoStore.getState().setSatelitalState('mode', 'measure')
      useDemoStore.getState().resetSatelital()
      const { satelital } = useDemoStore.getState()
      expect(satelital.mode).toBe('compare')
      expect(satelital.sliderPosition).toBe(50)
    })
  })
})
