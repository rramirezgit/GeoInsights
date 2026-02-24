import type { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson'

export interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
  transitionDuration?: number
}

export type MapStyle = 'dark' | 'satellite' | 'terrain' | 'outdoors'

export interface GeoDataPoint {
  lat: number
  lng: number
  value: number
  label?: string
}

export interface ProvinceProperties {
  name: string
  code: string
  population: number
  area_km2: number
}

export type ProvinceFeature = Feature<Polygon | MultiPolygon, ProvinceProperties>
export type ProvinceCollection = FeatureCollection<Polygon | MultiPolygon, ProvinceProperties>

export interface AnalysisResult {
  area_km2: number
  area_hectares: number
  perimeter_km: number
  centroid: { lat: number; lng: number }
  aptitude: 'alta' | 'media' | 'baja'
  soilType: string
}

// Satelital Comparator modes
export type SatelitalMode = 'compare' | 'elevation' | 'measure'

export interface ElevationPoint {
  lng: number
  lat: number
  elevation: number | null
}

export interface ElevationProfile {
  points: ElevationPoint[]
  samples: { distance: number; elevation: number }[]
  totalDistance: number
  minElevation: number
  maxElevation: number
  avgElevation: number
  elevationGain: number
}

export interface MeasurementResult {
  points: [number, number][]
  segmentDistances: number[]
  totalDistance: number
  area: number | null // null when polygon is not closed
  isClosed: boolean
}
