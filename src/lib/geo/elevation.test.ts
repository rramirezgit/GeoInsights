import { describe, it, expect, vi } from 'vitest'
import { sampleElevationProfile } from './elevation'

const flatMap = { queryTerrainElevation: () => 100 }

describe('sampleElevationProfile', () => {
  it('samples a flat terrain with zero gain', () => {
    const profile = sampleElevationProfile(flatMap, [-60, -34], [-61, -34])
    expect(profile.minElevation).toBe(100)
    expect(profile.maxElevation).toBe(100)
    expect(profile.avgElevation).toBe(100)
    expect(profile.elevationGain).toBe(0)
  })

  it('returns 81 evenly spaced samples covering the full distance', () => {
    const profile = sampleElevationProfile(flatMap, [-60, -34], [-61, -34])
    expect(profile.samples).toHaveLength(81)
    expect(profile.samples[0].distance).toBe(0)
    expect(profile.samples.at(-1)!.distance).toBeCloseTo(profile.totalDistance, 2)
  })

  it('accumulates only positive ascents as elevation gain', () => {
    let call = 0
    const rollercoaster = {
      queryTerrainElevation: () => {
        call += 1
        return call % 2 === 0 ? 200 : 100
      },
    }
    const profile = sampleElevationProfile(rollercoaster, [-60, -34], [-61, -34])
    expect(profile.elevationGain).toBeGreaterThan(0)
    expect(profile.minElevation).toBe(100)
    expect(profile.maxElevation).toBe(200)
  })

  it('treats null elevations as sea level', () => {
    const noData = { queryTerrainElevation: () => null }
    const profile = sampleElevationProfile(noData, [-60, -34], [-61, -34])
    expect(profile.minElevation).toBe(0)
    expect(profile.maxElevation).toBe(0)
  })

  it('survives a map that throws on query', () => {
    const throwing = {
      queryTerrainElevation: vi.fn(() => {
        throw new Error('terrain not loaded')
      }),
    }
    expect(() => sampleElevationProfile(throwing, [-60, -34], [-61, -34])).not.toThrow()
  })

  it('records endpoint elevations in the points field', () => {
    const profile = sampleElevationProfile(flatMap, [-60, -34], [-61, -35])
    expect(profile.points).toEqual([
      { lng: -60, lat: -34, elevation: 100 },
      { lng: -61, lat: -35, elevation: 100 },
    ])
  })
})
