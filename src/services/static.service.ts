import type { ProvinceCollection, AgroDataPoint, Truck, RouteData } from '@/types'

export async function loadProvinces(): Promise<ProvinceCollection> {
  const res = await fetch('/data/argentina-provinces.json')
  if (!res.ok) throw new Error('Failed to load provinces data')
  return res.json()
}

export async function loadAgroData(): Promise<AgroDataPoint[]> {
  const res = await fetch('/data/agro-production.json')
  if (!res.ok) throw new Error('Failed to load agro data')
  return res.json()
}

export async function loadFleetData(): Promise<Truck[]> {
  const res = await fetch('/data/sample-fleet.json')
  if (!res.ok) throw new Error('Failed to load fleet data')
  return res.json()
}

export async function loadRoutes(): Promise<RouteData[]> {
  const res = await fetch('/data/argentina-routes.json')
  if (!res.ok) throw new Error('Failed to load routes data')
  return res.json()
}
