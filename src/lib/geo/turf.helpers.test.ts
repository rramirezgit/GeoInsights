import { describe, it, expect } from 'vitest'
import type { Feature, Polygon } from 'geojson'
import {
  calculateArea,
  calculatePerimeter,
  findCentroid,
  isPointInPolygon,
  calculateSegmentDistances,
  calculateTotalDistance,
  calculateMeasurementArea,
  getAptitude,
} from './turf.helpers'

const squareAroundOrigin = (size: number): Feature<Polygon> => ({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-size, -size],
        [size, -size],
        [size, size],
        [-size, size],
        [-size, -size],
      ],
    ],
  },
})

describe('calculateArea', () => {
  it('returns area in km2 and hectares for a 1-degree square at the equator', () => {
    const { km2, hectares } = calculateArea(squareAroundOrigin(0.5))
    expect(km2).toBeGreaterThan(12000)
    expect(km2).toBeLessThan(12500)
    expect(hectares).toBeCloseTo(km2 * 100, 5)
  })

  it('scales area with polygon size', () => {
    const small = calculateArea(squareAroundOrigin(0.1)).km2
    const large = calculateArea(squareAroundOrigin(0.2)).km2
    expect(large / small).toBeCloseTo(4, 1)
  })
})

describe('calculatePerimeter', () => {
  it('measures the perimeter of a 1-degree square in kilometers', () => {
    const perimeter = calculatePerimeter(squareAroundOrigin(0.5))
    expect(perimeter).toBeGreaterThan(440)
    expect(perimeter).toBeLessThan(450)
  })
})

describe('findCentroid', () => {
  it('finds the center of a symmetric polygon', () => {
    const { lat, lng } = findCentroid(squareAroundOrigin(0.5))
    expect(lat).toBeCloseTo(0, 6)
    expect(lng).toBeCloseTo(0, 6)
  })
})

describe('isPointInPolygon', () => {
  const square = squareAroundOrigin(1)

  it('detects a point inside', () => {
    expect(isPointInPolygon([0, 0], square)).toBe(true)
  })

  it('detects a point outside', () => {
    expect(isPointInPolygon([2, 2], square)).toBe(false)
  })
})

describe('calculateSegmentDistances', () => {
  it('returns one distance per consecutive pair', () => {
    const distances = calculateSegmentDistances([
      [0, 0],
      [1, 0],
      [2, 0],
    ])
    expect(distances).toHaveLength(2)
    expect(distances[0]).toBeCloseTo(distances[1], 1)
  })

  it('returns an empty array for fewer than two points', () => {
    expect(calculateSegmentDistances([[0, 0]])).toEqual([])
    expect(calculateSegmentDistances([])).toEqual([])
  })

  it('measures ~111km per degree of longitude at the equator', () => {
    const [distance] = calculateSegmentDistances([
      [0, 0],
      [1, 0],
    ])
    expect(distance).toBeGreaterThan(110)
    expect(distance).toBeLessThan(112)
  })
})

describe('calculateTotalDistance', () => {
  it('sums all segment distances', () => {
    const points: [number, number][] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ]
    const total = calculateTotalDistance(points)
    const segments = calculateSegmentDistances(points)
    expect(total).toBeCloseTo(segments[0] + segments[1], 6)
  })

  it('returns 0 for a single point', () => {
    expect(calculateTotalDistance([[0, 0]])).toBe(0)
  })
})

describe('calculateMeasurementArea', () => {
  it('returns null with fewer than three points', () => {
    expect(
      calculateMeasurementArea([
        [0, 0],
        [1, 0],
      ])
    ).toBeNull()
  })

  it('closes the ring and computes the area of a triangle', () => {
    const area = calculateMeasurementArea([
      [0, 0],
      [1, 0],
      [0, 1],
    ])
    expect(area).not.toBeNull()
    expect(area!).toBeGreaterThan(6000)
    expect(area!).toBeLessThan(6300)
  })
})

describe('getAptitude', () => {
  it('classifies the Pampa Húmeda as high aptitude', () => {
    expect(getAptitude({ lat: -34, lng: -60 })).toEqual({
      aptitude: 'alta',
      soilType: 'Mollisol - Humid Pampas',
    })
  })

  it('classifies northern Patagonia as medium aptitude', () => {
    expect(getAptitude({ lat: -40, lng: -68 }).aptitude).toBe('media')
  })

  it('classifies southern Patagonia as low aptitude', () => {
    expect(getAptitude({ lat: -50, lng: -70 }).aptitude).toBe('baja')
  })

  it('falls back to medium aptitude for northern regions', () => {
    expect(getAptitude({ lat: -25, lng: -65 })).toEqual({
      aptitude: 'media',
      soilType: 'Entisol - Northern Region',
    })
  })
})
