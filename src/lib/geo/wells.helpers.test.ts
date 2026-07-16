import { describe, it, expect } from 'vitest'
import {
  filterWells,
  totalProduction,
  productionByBasin,
  statusCounts,
  topProducers,
  jitterProduction,
} from './wells.helpers'
import type { Well, WellFilters } from '@/types/wells.types'

function makeWell(overrides: Partial<Well> = {}): Well {
  return {
    id: 'NQN-0001',
    name: 'Loma Campana 001',
    basin: 'neuquina',
    operator: 'Andes E&P',
    resource: 'oil',
    unconventional: true,
    status: 'producing',
    lat: -38.5,
    lng: -68.9,
    production_boed: 1000,
    depth_m: 3000,
    spud_year: 2020,
    ...overrides,
  }
}

const defaultFilters: WellFilters = {
  basin: 'all',
  statuses: ['producing', 'drilling', 'maintenance', 'shut_in'],
  resource: 'all',
  minProduction: 0,
}

describe('filterWells', () => {
  const wells = [
    makeWell({ id: 'a', basin: 'neuquina', status: 'producing', production_boed: 2000 }),
    makeWell({ id: 'b', basin: 'neuquina', status: 'producing', production_boed: 300 }),
    makeWell({ id: 'c', basin: 'austral', status: 'drilling', resource: 'gas', production_boed: 0 }),
    makeWell({ id: 'd', basin: 'cuyana', status: 'shut_in', production_boed: 0 }),
  ]

  it('returns everything with the default filters', () => {
    expect(filterWells(wells, defaultFilters)).toHaveLength(4)
  })

  it('filters by basin', () => {
    const result = filterWells(wells, { ...defaultFilters, basin: 'austral' })
    expect(result.map((w) => w.id)).toEqual(['c'])
  })

  it('filters by status', () => {
    const result = filterWells(wells, { ...defaultFilters, statuses: ['shut_in'] })
    expect(result.map((w) => w.id)).toEqual(['d'])
  })

  it('filters by resource', () => {
    const result = filterWells(wells, { ...defaultFilters, resource: 'gas' })
    expect(result.map((w) => w.id)).toEqual(['c'])
  })

  it('applies minProduction only to producing wells', () => {
    const result = filterWells(wells, { ...defaultFilters, minProduction: 500 })
    expect(result.map((w) => w.id)).toEqual(['a', 'c', 'd'])
  })
})

describe('aggregations', () => {
  const wells = [
    makeWell({ id: 'a', basin: 'neuquina', production_boed: 2000 }),
    makeWell({ id: 'b', basin: 'austral', production_boed: 500 }),
    makeWell({ id: 'c', basin: 'austral', production_boed: 700 }),
    makeWell({ id: 'd', basin: 'cuyana', status: 'drilling', production_boed: 0 }),
  ]

  it('sums total production', () => {
    expect(totalProduction(wells)).toBe(3200)
  })

  it('groups production by basin sorted descending', () => {
    expect(productionByBasin(wells)).toEqual([
      { basin: 'neuquina', production: 2000 },
      { basin: 'austral', production: 1200 },
      { basin: 'cuyana', production: 0 },
    ])
  })

  it('counts wells by status', () => {
    expect(statusCounts(wells)).toEqual({
      producing: 3,
      drilling: 1,
      maintenance: 0,
      shut_in: 0,
    })
  })

  it('ranks top producers ignoring non-producing wells', () => {
    const top = topProducers(wells, 2)
    expect(top.map((w) => w.id)).toEqual(['a', 'c'])
  })
})

describe('jitterProduction', () => {
  it('moves producing wells within the amplitude and keeps the rest intact', () => {
    const wells = [
      makeWell({ id: 'a', production_boed: 1000 }),
      makeWell({ id: 'b', status: 'shut_in', production_boed: 0 }),
    ]
    const jittered = jitterProduction(wells, 0.05, () => 1)
    expect(jittered[0].production_boed).toBe(1050)
    expect(jittered[1].production_boed).toBe(0)
  })

  it('never drops a producing well below 1 boed', () => {
    const wells = [makeWell({ production_boed: 1 })]
    const jittered = jitterProduction(wells, 0.9, () => 0)
    expect(jittered[0].production_boed).toBeGreaterThanOrEqual(1)
  })
})
