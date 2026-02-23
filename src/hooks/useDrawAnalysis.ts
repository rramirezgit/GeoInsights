import { useState, useCallback } from 'react'
import type { Feature, Polygon } from 'geojson'
import type { AnalysisResult } from '@/types'
import { calculateArea, calculatePerimeter, findCentroid, getAptitude } from '@/lib/geo/turf.helpers'

export function useDrawAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  const analyze = useCallback((features: Feature[]) => {
    if (features.length === 0) {
      setAnalysis(null)
      return
    }

    const polygon = features[0] as Feature<Polygon>
    if (polygon.geometry.type !== 'Polygon') {
      setAnalysis(null)
      return
    }

    const { km2, hectares } = calculateArea(polygon)
    const perimeter_km = calculatePerimeter(polygon)
    const centroid = findCentroid(polygon)
    const { aptitude, soilType } = getAptitude(centroid)

    setAnalysis({
      area_km2: Math.round(km2 * 100) / 100,
      area_hectares: Math.round(hectares * 100) / 100,
      perimeter_km: Math.round(perimeter_km * 100) / 100,
      centroid,
      aptitude,
      soilType,
    })
  }, [])

  return { analysis, analyze }
}
