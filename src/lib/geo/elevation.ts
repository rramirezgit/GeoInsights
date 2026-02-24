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

  const samples: { distance: number; elevation: number }[] = []

  for (let i = 0; i <= NUM_SAMPLES; i++) {
    const dist = (i / NUM_SAMPLES) * totalDistance
    const point = turf.along(line, dist, { units: 'kilometers' })
    const [lng, lat] = point.geometry.coordinates

    let elev = 0
    try {
      elev = map.queryTerrainElevation({ lng, lat }) ?? 0
    } catch {
      elev = 0
    }

    samples.push({ distance: Math.round(dist * 1000) / 1000, elevation: Math.round(elev) })
  }

  const elevations = samples.map((s) => s.elevation)
  const minElevation = Math.min(...elevations)
  const maxElevation = Math.max(...elevations)
  const avgElevation = Math.round(elevations.reduce((a, b) => a + b, 0) / elevations.length)

  // Compute elevation gain (sum of all positive ascents)
  let elevationGain = 0
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1]
    if (diff > 0) elevationGain += diff
  }

  const startElev = map.queryTerrainElevation({ lng: startLngLat[0], lat: startLngLat[1] }) ?? 0
  const endElev = map.queryTerrainElevation({ lng: endLngLat[0], lat: endLngLat[1] }) ?? 0

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
