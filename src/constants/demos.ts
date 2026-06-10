import type { DemoConfig } from '@/types/map.types'

export const DEMOS: DemoConfig[] = [
  {
    id: 'heatmap',
    title: 'Agricultural Heatmap',
    description: 'Agricultural production visualization by zone with deck.gl HeatmapLayer',
    icon: 'Flame',
    path: '/heatmap',
    color: '#f97316',
    tags: ['deck.gl', 'HeatmapLayer', 'TanStack Query'],
  },
  {
    id: 'tracking',
    title: 'Fleet Tracking',
    description: 'Real-time tracking of 20 trucks on Argentine routes',
    icon: 'Truck',
    path: '/tracking',
    color: '#22c55e',
    tags: ['Real-time', 'Animation', 'WebSocket-ready'],
  },
  {
    id: 'satelital',
    title: 'Satellite Comparator',
    description: 'Compare satellite vs terrain views with a synced slider',
    icon: 'Satellite',
    path: '/satelital',
    color: '#3b82f6',
    tags: ['Dual Map', 'Sync', 'Swipe'],
  },
  {
    id: 'draw',
    title: 'Draw & Analyze',
    description: 'Draw polygons and analyze area, perimeter and aptitude with Turf.js',
    icon: 'PenTool',
    path: '/draw',
    color: '#a855f7',
    tags: ['Turf.js', 'Mapbox Draw', 'Analysis'],
  },
  {
    id: 'storymap',
    title: 'StoryMap Argentina',
    description: 'Scroll-driven narrative with cinematic flights across Argentina',
    icon: 'BookOpen',
    path: '/storymap',
    color: '#06b6d4',
    tags: ['Scroll-driven', 'Cinematic', 'Narrative'],
  },
]
