import { DemoLayout } from '@/components/layout/DemoLayout'
import { HeatmapMap } from './HeatmapMap'
import { HeatmapControls } from './HeatmapControls'
import { HeatmapStats } from './HeatmapStats'

export default function HeatmapPage() {
  return (
    <DemoLayout
      title="Agricultural Heatmap"
      description="Argentine agricultural production visualization with heatmaps"
      leftPanel={<HeatmapControls />}
      leftPanelTitle="Filters"
      rightPanel={<HeatmapStats />}
      rightPanelTitle="Stats"
    >
      <HeatmapMap />
    </DemoLayout>
  )
}
