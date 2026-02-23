import * as turf from '@turf/turf'
import type { Feature, Polygon } from 'geojson'

export function calculateArea(feature: Feature<Polygon>): { km2: number; hectares: number } {
  const km2 = turf.area(feature) / 1_000_000
  return { km2, hectares: km2 * 100 }
}

export function calculatePerimeter(feature: Feature<Polygon>): number {
  return turf.length(feature, { units: 'kilometers' })
}

export function findCentroid(feature: Feature<Polygon>): { lat: number; lng: number } {
  const centroid = turf.centroid(feature)
  const [lng, lat] = centroid.geometry.coordinates
  return { lat, lng }
}

export function isPointInPolygon(point: [number, number], polygon: Feature<Polygon>): boolean {
  const pt = turf.point(point)
  return turf.booleanPointInPolygon(pt, polygon)
}

export function getAptitude(centroid: { lat: number; lng: number }): {
  aptitude: 'alta' | 'media' | 'baja'
  soilType: string
} {
  const { lat, lng } = centroid

  // Pampa humeda: lat -30 to -38, lng -58 to -64
  if (lat >= -38 && lat <= -30 && lng >= -64 && lng <= -58) {
    return { aptitude: 'alta', soilType: 'Molisol - Pampa Húmeda' }
  }

  // Zona media: lat -38 to -45
  if (lat >= -45 && lat < -38) {
    return { aptitude: 'media', soilType: 'Aridisol - Patagonia Norte' }
  }

  // Zona baja: south of -45
  if (lat < -45) {
    return { aptitude: 'baja', soilType: 'Criosol - Patagonia Sur' }
  }

  // Default for northern regions
  return { aptitude: 'media', soilType: 'Entisol - Región Norte' }
}
