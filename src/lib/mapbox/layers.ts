import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers'

interface HeatmapLayerConfig {
  radiusPixels: number
  intensity: number
  threshold: number
  colorRange: [number, number, number, number][]
  getPosition: (d: Record<string, unknown>) => [number, number]
  getWeight: (d: Record<string, unknown>) => number
}

const DEFAULT_COLOR_RANGE: [number, number, number, number][] = [
  [1, 152, 189, 25],
  [73, 227, 206, 100],
  [216, 254, 181, 150],
  [254, 237, 177, 200],
  [254, 173, 84, 220],
  [209, 55, 78, 255],
]

/**
 * Creates a ScatterplotLayer styled to approximate a heatmap.
 * Note: HeatmapLayer requires @deck.gl/aggregation-layers which is not installed.
 * This uses color-weighted scatter points as a visual fallback.
 */
export function createHeatmapLayer(
  data: Record<string, unknown>[],
  config?: Partial<HeatmapLayerConfig>
): ScatterplotLayer {
  const colors = config?.colorRange ?? DEFAULT_COLOR_RANGE
  const getPos =
    config?.getPosition ??
    ((d: Record<string, unknown>) => [d.lng as number, d.lat as number] as [number, number])
  const getWt =
    config?.getWeight ??
    ((d: Record<string, unknown>) => d.value as number)

  let maxWeight = 0
  for (const d of data) {
    const w = getWt(d)
    if (w > maxWeight) maxWeight = w
  }
  if (maxWeight === 0) maxWeight = 1

  return new ScatterplotLayer({
    id: config?.radiusPixels ? `heatmap-${config.radiusPixels}` : 'heatmap',
    data,
    getPosition: getPos,
    getRadius: (d: Record<string, unknown>) => {
      const t = getWt(d) / maxWeight
      return 5000 + t * 30000
    },
    getFillColor: (d: Record<string, unknown>) => {
      const t = Math.max(0, Math.min(1, getWt(d) / maxWeight))
      const idx = Math.min(Math.floor(t * (colors.length - 1)), colors.length - 2)
      const frac = t * (colors.length - 1) - idx
      const c0 = colors[idx]
      const c1 = colors[idx + 1]
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * frac),
        Math.round(c0[1] + (c1[1] - c0[1]) * frac),
        Math.round(c0[2] + (c1[2] - c0[2]) * frac),
        Math.round(c0[3] + (c1[3] - c0[3]) * frac),
      ] as [number, number, number, number]
    },
    radiusMinPixels: 6,
    radiusMaxPixels: config?.radiusPixels ?? 60,
    pickable: false,
  })
}

export function createScatterplotLayer(
  data: Record<string, unknown>[],
  config?: {
    id?: string
    getPosition?: (d: Record<string, unknown>) => [number, number]
    getRadius?: (d: Record<string, unknown>) => number
    getFillColor?: (d: Record<string, unknown>) => [number, number, number, number]
    radiusMinPixels?: number
    radiusMaxPixels?: number
    pickable?: boolean
  }
): ScatterplotLayer {
  return new ScatterplotLayer({
    id: config?.id ?? 'scatterplot',
    data,
    getPosition: config?.getPosition ?? ((d: Record<string, unknown>) => [d.lng as number, d.lat as number]),
    getRadius: config?.getRadius ?? (() => 100),
    getFillColor: config?.getFillColor ?? (() => [16, 185, 129, 200]),
    radiusMinPixels: config?.radiusMinPixels ?? 3,
    radiusMaxPixels: config?.radiusMaxPixels ?? 30,
    pickable: config?.pickable ?? true,
  })
}

export function createGeoJsonLayer(
  data: GeoJSON.GeoJSON,
  config?: {
    id?: string
    filled?: boolean
    stroked?: boolean
    getFillColor?: [number, number, number, number]
    getLineColor?: [number, number, number, number]
    getLineWidth?: number
    lineWidthMinPixels?: number
    pickable?: boolean
  }
): GeoJsonLayer {
  return new GeoJsonLayer({
    id: config?.id ?? 'geojson',
    data,
    filled: config?.filled ?? true,
    stroked: config?.stroked ?? true,
    getFillColor: config?.getFillColor ?? [16, 185, 129, 40],
    getLineColor: config?.getLineColor ?? [16, 185, 129, 200],
    getLineWidth: config?.getLineWidth ?? 2,
    lineWidthMinPixels: config?.lineWidthMinPixels ?? 1,
    pickable: config?.pickable ?? true,
  })
}
