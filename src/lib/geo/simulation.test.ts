import { describe, it, expect } from 'vitest'
import {
  generateRoutePoints,
  interpolatePosition,
  calculateHeading,
  randomEvent,
} from './simulation'
import type { RouteData, Truck } from '@/types'

const straightRoute: RouteData = {
  id: 'r1',
  name: 'Test route',
  coordinates: [
    [0, 0],
    [10, 0],
  ],
} as RouteData

describe('generateRoutePoints', () => {
  it('generates the requested number of points', () => {
    const points = generateRoutePoints(straightRoute, 11)
    expect(points).toHaveLength(11)
  })

  it('starts and ends exactly at the route endpoints', () => {
    const points = generateRoutePoints(straightRoute, 5)
    expect(points[0]).toEqual([0, 0])
    expect(points[4]).toEqual([10, 0])
  })

  it('distributes points evenly along a straight segment', () => {
    const points = generateRoutePoints(straightRoute, 5)
    expect(points[2][0]).toBeCloseTo(5, 6)
  })

  it('returns the raw coordinates when the route has fewer than two points', () => {
    const degenerate = { ...straightRoute, coordinates: [[3, 4]] } as RouteData
    expect(generateRoutePoints(degenerate, 10)).toEqual([[3, 4]])
  })
})

describe('interpolatePosition', () => {
  const points: [number, number][] = [
    [0, 0],
    [10, 0],
  ]

  it('returns the start at progress 0', () => {
    const { lat, lng } = interpolatePosition(points, 0)
    expect(lng).toBe(0)
    expect(lat).toBe(0)
  })

  it('returns the end at progress 1', () => {
    const { lng } = interpolatePosition(points, 1)
    expect(lng).toBe(10)
  })

  it('interpolates linearly in between', () => {
    const { lng } = interpolatePosition(points, 0.5)
    expect(lng).toBeCloseTo(5, 6)
  })

  it('clamps progress outside [0, 1]', () => {
    expect(interpolatePosition(points, -1).lng).toBe(0)
    expect(interpolatePosition(points, 2).lng).toBe(10)
  })

  it('handles empty and single-point inputs', () => {
    expect(interpolatePosition([], 0.5)).toEqual({ lat: 0, lng: 0, heading: 0 })
    expect(interpolatePosition([[7, 8]], 0.5)).toEqual({ lat: 8, lng: 7, heading: 0 })
  })
})

describe('calculateHeading', () => {
  it('points east for a west-to-east segment at the equator', () => {
    expect(calculateHeading([0, 0], [1, 0])).toBeCloseTo(90, 0)
  })

  it('points north for a south-to-north segment', () => {
    expect(calculateHeading([0, 0], [0, 1])).toBeCloseTo(0, 0)
  })

  it('always returns a bearing within [0, 360)', () => {
    const bearing = calculateHeading([0, 0], [-1, -1])
    expect(bearing).toBeGreaterThanOrEqual(0)
    expect(bearing).toBeLessThan(360)
  })
})

describe('randomEvent', () => {
  const truck = { id: 't-1', name: 'Camión 1' } as Truck

  it('builds an event referencing the truck', () => {
    const event = randomEvent(truck)
    expect(event.truckId).toBe('t-1')
    expect(event.message).toContain('Camión 1')
    expect(event.timestamp).toBeInstanceOf(Date)
  })

  it('generates unique ids across calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => randomEvent(truck).id))
    expect(ids.size).toBe(50)
  })

  it('always produces a known event type', () => {
    const types = ['arrival', 'departure', 'stop', 'alert', 'speed']
    for (let i = 0; i < 25; i++) {
      expect(types).toContain(randomEvent(truck).type)
    }
  })
})
