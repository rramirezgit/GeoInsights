import type { DemoConfig } from '@/types/map.types'

export const DEMOS: DemoConfig[] = [
  {
    id: 'heatmap',
    title: 'Heatmap Agrícola',
    description: 'Visualización de producción agrícola por zona con deck.gl HeatmapLayer',
    icon: 'Flame',
    path: '/heatmap',
    color: '#f97316',
    tags: ['deck.gl', 'HeatmapLayer', 'TanStack Query'],
  },
  {
    id: 'tracking',
    title: 'Tracking de Flota',
    description: 'Seguimiento en tiempo real de 20 camiones sobre rutas argentinas',
    icon: 'Truck',
    path: '/tracking',
    color: '#22c55e',
    tags: ['Real-time', 'Animation', 'WebSocket-ready'],
  },
  {
    id: 'satelital',
    title: 'Comparador Satelital',
    description: 'Compará vistas satelitales vs terrain con slider sincronizado',
    icon: 'Satellite',
    path: '/satelital',
    color: '#3b82f6',
    tags: ['Dual Map', 'Sync', 'Swipe'],
  },
  {
    id: 'draw',
    title: 'Draw & Analyze',
    description: 'Dibujá polígonos y analizá área, perímetro y aptitud con Turf.js',
    icon: 'PenTool',
    path: '/draw',
    color: '#a855f7',
    tags: ['Turf.js', 'Mapbox Draw', 'Analysis'],
  },
  {
    id: 'storymap',
    title: 'StoryMap Argentina',
    description: 'Narrativa scroll-driven con vuelos cinematográficos por Argentina',
    icon: 'BookOpen',
    path: '/storymap',
    color: '#06b6d4',
    tags: ['Scroll-driven', 'Cinematic', 'Narrative'],
  },
]
