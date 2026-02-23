import { useState, useMemo } from 'react'
import { DemoLayout } from '@/components/layout/DemoLayout'
import { useFleetSimulation } from '@/hooks/useFleetSimulation'
import { useDemoStore } from '@/stores/demoStore'
import { TrackingMap } from './TrackingMap'
import { TrackingControls } from './TrackingControls'
import { LiveFeed } from './LiveFeed'

export default function TrackingPage() {
  const { trucks, events, isRunning, speed, setSpeed, toggleRunning } =
    useFleetSimulation()

  const [searchQuery, setSearchQuery] = useState('')
  const [showRoutes, setShowRoutes] = useState(false)

  const setTrackingFilter = useDemoStore((s) => s.setTrackingFilter)

  // Filter trucks by search query
  const displayTrucks = useMemo(() => {
    if (!searchQuery.trim()) return trucks
    const q = searchQuery.toLowerCase()
    return trucks.filter(
      (t) =>
        t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    )
  }, [trucks, searchQuery])

  // When a truck is found by search and there's exactly one result, select it
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const q = query.toLowerCase()
      const matches = trucks.filter(
        (t) =>
          t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
      )
      if (matches.length === 1) {
        setTrackingFilter('selectedTruck', matches[0].id)
      }
    } else {
      setTrackingFilter('selectedTruck', null)
    }
  }

  return (
    <DemoLayout
      title="Tracking de Flota"
      description="Seguimiento en tiempo real de vehiculos con simulacion de rutas argentinas"
      leftPanel={
        <TrackingControls
          trucks={trucks}
          speed={speed}
          isRunning={isRunning}
          onSpeedChange={setSpeed}
          onToggleRunning={toggleRunning}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          showRoutes={showRoutes}
          onShowRoutesChange={setShowRoutes}
        />
      }
      leftPanelTitle="Controles"
      rightPanel={<LiveFeed events={events} />}
      rightPanelTitle="Feed en Vivo"
    >
      <TrackingMap trucks={displayTrucks} showRoutes={showRoutes} />
    </DemoLayout>
  )
}
