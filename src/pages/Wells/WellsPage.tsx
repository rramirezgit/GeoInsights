import { useMemo } from 'react'
import { DemoLayout } from '@/components/layout/DemoLayout'
import { useGeoData } from '@/hooks/useGeoData'
import { useWellsLive } from '@/hooks/useWellsLive'
import { useDemoStore } from '@/stores/demoStore'
import { filterWells } from '@/lib/geo/wells.helpers'
import type { Well } from '@/types/wells.types'
import { WellsMap } from './WellsMap'
import { WellsControls } from './WellsControls'
import { WellsStats } from './WellsStats'

export default function WellsPage() {
  const { data: rawWells } = useGeoData<Well[]>({
    url: '/data/oil-wells.json',
    queryKey: ['oil-wells'],
  })

  const { wells, isLive, toggleLive } = useWellsLive(rawWells)

  const basin = useDemoStore((s) => s.wells.basin)
  const statusFilter = useDemoStore((s) => s.wells.statusFilter)
  const resource = useDemoStore((s) => s.wells.resource)
  const minProduction = useDemoStore((s) => s.wells.minProduction)

  const filteredWells = useMemo(
    () =>
      filterWells(wells, {
        basin,
        statuses: statusFilter,
        resource,
        minProduction,
      }),
    [wells, basin, statusFilter, resource, minProduction]
  )

  return (
    <DemoLayout
      title="Oil & Gas Wells"
      description="Live monitoring of wells across the Argentine oil basins"
      leftPanel={
        <WellsControls
          wells={wells}
          shownCount={filteredWells.length}
          isLive={isLive}
          onToggleLive={toggleLive}
        />
      }
      leftPanelTitle="Filters"
      rightPanel={<WellsStats wells={filteredWells} />}
      rightPanelTitle="Production"
    >
      <WellsMap wells={filteredWells} />
    </DemoLayout>
  )
}
