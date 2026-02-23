import type { Truck, FleetEvent, RouteData } from '@/types'

export function generateRoutePoints(
  route: RouteData,
  numPoints: number
): [number, number][] {
  const coords = route.coordinates
  if (coords.length < 2) return coords

  const points: [number, number][] = []
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1)
    const totalSegments = coords.length - 1
    const segFloat = t * totalSegments
    const segIndex = Math.min(Math.floor(segFloat), totalSegments - 1)
    const segProgress = segFloat - segIndex

    const [lng1, lat1] = coords[segIndex]
    const [lng2, lat2] = coords[segIndex + 1]

    points.push([
      lng1 + (lng2 - lng1) * segProgress,
      lat1 + (lat2 - lat1) * segProgress,
    ])
  }

  return points
}

export function interpolatePosition(
  points: [number, number][],
  progress: number
): { lat: number; lng: number; heading: number } {
  if (points.length === 0) return { lat: 0, lng: 0, heading: 0 }
  if (points.length === 1) return { lat: points[0][1], lng: points[0][0], heading: 0 }

  const clampedProgress = Math.max(0, Math.min(1, progress))
  const totalSegments = points.length - 1
  const segFloat = clampedProgress * totalSegments
  const segIndex = Math.min(Math.floor(segFloat), totalSegments - 1)
  const segProgress = segFloat - segIndex

  const [lng1, lat1] = points[segIndex]
  const [lng2, lat2] = points[segIndex + 1] ?? points[segIndex]

  const lng = lng1 + (lng2 - lng1) * segProgress
  const lat = lat1 + (lat2 - lat1) * segProgress
  const heading = calculateHeading([lng1, lat1], [lng2, lat2])

  return { lat, lng, heading }
}

export function calculateHeading(from: [number, number], to: [number, number]): number {
  const dLng = ((to[0] - from[0]) * Math.PI) / 180
  const lat1 = (from[1] * Math.PI) / 180
  const lat2 = (to[1] * Math.PI) / 180

  const y = Math.sin(dLng) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  const bearing = (Math.atan2(y, x) * 180) / Math.PI
  return (bearing + 360) % 360
}

const eventMessages: Record<FleetEvent['type'], string[]> = {
  arrival: ['Llegó a destino', 'Arribó al punto de entrega'],
  departure: ['Salió del origen', 'Inició recorrido'],
  stop: ['Parada programada', 'Detenido por descanso'],
  alert: ['Desvío de ruta detectado', 'Velocidad excesiva', 'Frenada brusca'],
  speed: ['Cambio de velocidad registrado'],
}

export function randomEvent(truck: Truck): FleetEvent {
  const types: FleetEvent['type'][] = ['arrival', 'departure', 'stop', 'alert', 'speed']
  const type = types[Math.floor(Math.random() * types.length)]
  const messages = eventMessages[type]

  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    truckId: truck.id,
    message: `${truck.name}: ${messages[Math.floor(Math.random() * messages.length)]}`,
    timestamp: new Date(),
    type,
  }
}
