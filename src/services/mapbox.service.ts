import { MAPBOX_TOKEN } from '@/constants/mapbox'

export async function geocode(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  if (!MAPBOX_TOKEN) return null

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=AR&limit=1`

  const res = await fetch(url)
  if (!res.ok) return null

  const data = await res.json()
  const feature = data.features?.[0]
  if (!feature) return null

  const [lng, lat] = feature.center
  return { lat, lng }
}

export async function getDirections(
  from: [number, number],
  to: [number, number]
): Promise<[number, number][]> {
  if (!MAPBOX_TOKEN) return []

  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${MAPBOX_TOKEN}`

  const res = await fetch(url)
  if (!res.ok) return []

  const data = await res.json()
  const route = data.routes?.[0]
  if (!route) return []

  return route.geometry.coordinates as [number, number][]
}
