import { z } from 'zod'

// --- GeoJSON Geometry Schemas ---

export const PositionSchema = z.tuple([z.number(), z.number()])

export const PointSchema = z.object({
  type: z.literal('Point'),
  coordinates: PositionSchema,
})

export const PolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(PositionSchema)),
})

export const MultiPolygonSchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(PositionSchema))),
})

// --- Generic Feature / FeatureCollection ---

export const FeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: z.union([PointSchema, PolygonSchema, MultiPolygonSchema]),
  properties: z.record(z.string(), z.unknown()).nullable(),
})

export const FeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(FeatureSchema),
})

// --- Domain Schemas ---

export const AgroDataPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  crop: z.enum(['soja', 'maiz', 'trigo', 'girasol']),
  production_tons: z.number().nonnegative(),
  year: z.number().int().min(2000).max(2100),
  province: z.string().min(1),
})

export const TruckSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  status: z.enum(['en_ruta', 'detenido', 'alerta', 'en_destino']),
  cargo: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  heading: z.number().min(0).max(360),
  speed_kmh: z.number().nonnegative(),
})
