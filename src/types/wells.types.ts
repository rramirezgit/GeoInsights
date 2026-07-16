export type WellStatus = 'producing' | 'drilling' | 'maintenance' | 'shut_in'

export type WellResource = 'oil' | 'gas'

export type BasinId =
  | 'neuquina'
  | 'golfo_san_jorge'
  | 'cuyana'
  | 'austral'
  | 'noroeste'

export interface Well {
  id: string
  name: string
  basin: BasinId
  operator: string
  resource: WellResource
  unconventional: boolean
  status: WellStatus
  lat: number
  lng: number
  production_boed: number
  depth_m: number
  spud_year: number
}

export interface WellFilters {
  basin: BasinId | 'all'
  statuses: WellStatus[]
  resource: WellResource | 'all'
  minProduction: number
}

export interface BasinConfig {
  id: BasinId
  name: string
  center: [number, number]
  zoom: number
}
