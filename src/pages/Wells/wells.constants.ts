import type { BasinConfig, BasinId, WellStatus } from '@/types/wells.types'

export const BASINS: BasinConfig[] = [
  { id: 'neuquina', name: 'Neuquina · Vaca Muerta', center: [-69.1, -38.6], zoom: 7 },
  { id: 'golfo_san_jorge', name: 'Golfo San Jorge', center: [-68.4, -46.0], zoom: 7 },
  { id: 'cuyana', name: 'Cuyana', center: [-68.65, -33.5], zoom: 7 },
  { id: 'austral', name: 'Austral', center: [-69.5, -51.4], zoom: 7 },
  { id: 'noroeste', name: 'Noroeste', center: [-63.9, -22.75], zoom: 7.5 },
]

export const BASIN_LABELS: Record<BasinId, string> = {
  neuquina: 'Neuquina · Vaca Muerta',
  golfo_san_jorge: 'Golfo San Jorge',
  cuyana: 'Cuyana',
  austral: 'Austral',
  noroeste: 'Noroeste',
}

export const WELL_STATUS_COLORS: Record<WellStatus, string> = {
  producing: '#22c55e',
  drilling: '#06b6d4',
  maintenance: '#f59e0b',
  shut_in: '#64748b',
}

export const WELL_STATUS_LABELS: Record<WellStatus, string> = {
  producing: 'Producing',
  drilling: 'Drilling',
  maintenance: 'Maintenance',
  shut_in: 'Shut-in',
}

export const ALL_WELL_STATUSES: WellStatus[] = [
  'producing',
  'drilling',
  'maintenance',
  'shut_in',
]
