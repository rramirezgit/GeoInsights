import { describe, it, expect } from 'vitest'
import {
  PointSchema,
  PolygonSchema,
  FeatureSchema,
  FeatureCollectionSchema,
  AgroDataPointSchema,
  TruckSchema,
} from './geojson.validators'

describe('geometry schemas', () => {
  it('accepts a valid Point', () => {
    expect(PointSchema.safeParse({ type: 'Point', coordinates: [-64, -34] }).success).toBe(true)
  })

  it('rejects a Point with missing coordinates', () => {
    expect(PointSchema.safeParse({ type: 'Point', coordinates: [-64] }).success).toBe(false)
  })

  it('accepts a valid Polygon ring', () => {
    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 0],
        ],
      ],
    }
    expect(PolygonSchema.safeParse(polygon).success).toBe(true)
  })

  it('rejects a geometry with the wrong type literal', () => {
    expect(PolygonSchema.safeParse({ type: 'Point', coordinates: [] }).success).toBe(false)
  })
})

describe('FeatureSchema', () => {
  it('accepts a feature with null properties', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: null,
    }
    expect(FeatureSchema.safeParse(feature).success).toBe(true)
  })

  it('accepts a feature collection of valid features', () => {
    const collection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: { name: 'test' },
        },
      ],
    }
    expect(FeatureCollectionSchema.safeParse(collection).success).toBe(true)
  })
})

describe('AgroDataPointSchema', () => {
  const valid = {
    lat: -34,
    lng: -60,
    crop: 'soja',
    production_tons: 1200,
    year: 2024,
    province: 'Buenos Aires',
  }

  it('accepts a valid data point', () => {
    expect(AgroDataPointSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects out-of-range coordinates', () => {
    expect(AgroDataPointSchema.safeParse({ ...valid, lat: -95 }).success).toBe(false)
    expect(AgroDataPointSchema.safeParse({ ...valid, lng: 200 }).success).toBe(false)
  })

  it('rejects unknown crops and negative production', () => {
    expect(AgroDataPointSchema.safeParse({ ...valid, crop: 'banana' }).success).toBe(false)
    expect(AgroDataPointSchema.safeParse({ ...valid, production_tons: -1 }).success).toBe(false)
  })
})

describe('TruckSchema', () => {
  const valid = {
    id: 't-1',
    name: 'Camión 1',
    origin: 'Buenos Aires',
    destination: 'Córdoba',
    status: 'en_ruta',
    cargo: 'Granos',
    lat: -34,
    lng: -60,
    heading: 270,
    speed_kmh: 80,
  }

  it('accepts a valid truck', () => {
    expect(TruckSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects an invalid status', () => {
    expect(TruckSchema.safeParse({ ...valid, status: 'volando' }).success).toBe(false)
  })

  it('rejects a heading beyond 360 degrees', () => {
    expect(TruckSchema.safeParse({ ...valid, heading: 400 }).success).toBe(false)
  })
})
