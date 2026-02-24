import type { MapStyle, ViewState } from '@/types/geo.types'

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

export const MAP_STYLES: Record<MapStyle, string> = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  terrain: 'mapbox://styles/mapbox/outdoors-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
}

export const ARGENTINA_CENTER: ViewState = {
  longitude: -64,
  latitude: -34,
  zoom: 4,
  pitch: 0,
  bearing: 0,
}

export const ARGENTINA_BOUNDS = {
  north: -21.78,
  south: -55.06,
  west: -73.56,
  east: -53.64,
}

export const ZONE_PRESETS = {
  buenosAires: { longitude: -58.38, latitude: -34.6, zoom: 11, pitch: 0 },
  rosario: { longitude: -60.65, latitude: -32.95, zoom: 12, pitch: 0 },
  cordoba: { longitude: -64.18, latitude: -31.42, zoom: 12, pitch: 0 },
  mendoza: { longitude: -68.84, latitude: -32.89, zoom: 11, pitch: 0 },
  deltaParana: { longitude: -58.9, latitude: -33.9, zoom: 10, pitch: 0 },
  peritoMoreno: { longitude: -73.05, latitude: -50.5, zoom: 12, pitch: 60 },
  iguazu: { longitude: -54.44, latitude: -25.69, zoom: 13, pitch: 0 },
} as const
