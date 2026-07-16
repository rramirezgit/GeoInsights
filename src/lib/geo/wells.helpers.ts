import type { BasinId, Well, WellFilters, WellStatus } from '@/types/wells.types'

export function filterWells(wells: Well[], filters: WellFilters): Well[] {
  return wells.filter((w) => {
    if (filters.basin !== 'all' && w.basin !== filters.basin) return false
    if (!filters.statuses.includes(w.status)) return false
    if (filters.resource !== 'all' && w.resource !== filters.resource) return false
    if (w.status === 'producing' && w.production_boed < filters.minProduction) return false
    return true
  })
}

export function totalProduction(wells: Well[]): number {
  return wells.reduce((sum, w) => sum + w.production_boed, 0)
}

export function productionByBasin(wells: Well[]): { basin: BasinId; production: number }[] {
  const byBasin = new Map<BasinId, number>()
  for (const w of wells) {
    byBasin.set(w.basin, (byBasin.get(w.basin) ?? 0) + w.production_boed)
  }
  return Array.from(byBasin.entries())
    .map(([basin, production]) => ({ basin, production }))
    .sort((a, b) => b.production - a.production)
}

export function statusCounts(wells: Well[]): Record<WellStatus, number> {
  const counts: Record<WellStatus, number> = {
    producing: 0,
    drilling: 0,
    maintenance: 0,
    shut_in: 0,
  }
  for (const w of wells) {
    counts[w.status]++
  }
  return counts
}

export function topProducers(wells: Well[], limit: number): Well[] {
  return [...wells]
    .filter((w) => w.status === 'producing')
    .sort((a, b) => b.production_boed - a.production_boed)
    .slice(0, limit)
}

export function jitterProduction(
  wells: Well[],
  amplitude = 0.03,
  random: () => number = Math.random
): Well[] {
  return wells.map((w) => {
    if (w.status !== 'producing' || w.production_boed === 0) return w
    const factor = 1 + (random() * 2 - 1) * amplitude
    return { ...w, production_boed: Math.max(1, Math.round(w.production_boed * factor)) }
  })
}
