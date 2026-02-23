import type { MapStyle, ViewState } from './geo.types'

export type DemoId = 'hub' | 'heatmap' | 'tracking' | 'satelital' | 'draw' | 'storymap'

export interface DemoConfig {
  id: DemoId
  title: string
  description: string
  icon: string
  path: string
  color: string
  tags: string[]
}

export interface LayerConfig {
  id: string
  visible: boolean
  opacity: number
  data?: unknown
}

export interface MapConfig {
  initialViewState: ViewState
  style: MapStyle
  interactive: boolean
  showControls: boolean
}
