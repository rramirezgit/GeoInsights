import { DemoLayout } from '@/components/layout/DemoLayout'
import { HeatmapMap } from './HeatmapMap'
import { HeatmapControls } from './HeatmapControls'
import { HeatmapStats } from './HeatmapStats'

export default function HeatmapPage() {
  return (
    <DemoLayout
      title="Heatmap Agricola"
      description="Visualizacion de produccion agricola argentina con mapas de calor"
      leftPanel={<HeatmapControls />}
      leftPanelTitle="Filtros"
      rightPanel={<HeatmapStats />}
      rightPanelTitle="Estadisticas"
    >
      <HeatmapMap />
    </DemoLayout>
  )
}
