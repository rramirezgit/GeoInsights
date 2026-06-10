import * as turf from '@turf/turf'
import type { ElevationProfile } from '@/types/geo.types'

const NUM_SAMPLES = 80

export function sampleElevationProfile(
  map: { queryTerrainElevation: (lngLat: { lng: number; lat: number }) => number | null | undefined },
  startLngLat: [number, number],
  endLngLat: [number, number],
): ElevationProfile {
  const line = turf.lineString([startLngLat, endLngLat])
  const totalDistance = turf.length(line, { units: 'kilometers' })

  const queryElevation = (lng: number, lat: number): number => {
    try {
      return map.queryTerrainElevation({ lng, lat }) ?? 0
    } catch {
      return 0
    }
  }

  const samples: { distance: number; elevation: number }[] = []

  for (let i = 0; i <= NUM_SAMPLES; i++) {
    const dist = (i / NUM_SAMPLES) * totalDistance
    const point = turf.along(line, dist, { units: 'kilometers' })
    const [lng, lat] = point.geometry.coordinates

    samples.push({
      distance: Math.round(dist * 1000) / 1000,
      elevation: Math.round(queryElevation(lng, lat)),
    })
  }

  const elevations = samples.map((s) => s.elevation)
  const minElevation = Math.min(...elevations)
  const maxElevation = Math.max(...elevations)
  const avgElevation = Math.round(elevations.reduce((a, b) => a + b, 0) / elevations.length)

  let elevationGain = 0
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1]
    if (diff > 0) elevationGain += diff
  }

  const startElev = queryElevation(startLngLat[0], startLngLat[1])
  const endElev = queryElevation(endLngLat[0], endLngLat[1])

  return {
    points: [
      { lng: startLngLat[0], lat: startLngLat[1], elevation: Math.round(startElev) },
      { lng: endLngLat[0], lat: endLngLat[1], elevation: Math.round(endElev) },
    ],
    samples,
    totalDistance: Math.round(totalDistance * 1000) / 1000,
    minElevation,
    maxElevation,
    avgElevation,
    elevationGain: Math.round(elevationGain),
  }
}
