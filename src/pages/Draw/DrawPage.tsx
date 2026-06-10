import { useCallback } from 'react'
import type { Feature, Polygon } from 'geojson'
import { DemoLayout } from '@/components/layout/DemoLayout'
import { useDrawAnalysis } from '@/hooks/useDrawAnalysis'
import { DrawMap } from './DrawMap'
import { AnalysisPanel } from './AnalysisPanel'

export default function DrawPage() {
  const { analysis, analyze } = useDrawAnalysis()

  const handlePolygonComplete = useCallback(
    (feature: Feature<Polygon>) => {
      analyze([feature])
    },
    [analyze]
  )

  const handleClear = useCallback(() => {
    analyze([])
  }, [analyze])

  return (
    <DemoLayout
      title="Draw & Analyze"
      description="Draw polygons on the map and get geospatial analysis with Turf.js"
      rightPanel={<AnalysisPanel analysis={analysis} onClear={handleClear} />}
      rightPanelTitle="Analysis"
    >
      <DrawMap onPolygonComplete={handlePolygonComplete} onClear={handleClear} />
    </DemoLayout>
  )
}
