export type TruckStatus = 'en_ruta' | 'detenido' | 'alerta' | 'en_destino'

export interface Truck {
  id: string
  name: string
  origin: string
  destination: string
  status: TruckStatus
  cargo: string
  lat: number
  lng: number
  heading: number
  speed_kmh: number
}

export interface FleetEvent {
  id: string
  truckId: string
  message: string
  timestamp: Date
  type: 'arrival' | 'departure' | 'stop' | 'alert' | 'speed'
}

export interface RouteData {
  id: string
  name: string
  coordinates: [number, number][]
  distance_km: number
}
