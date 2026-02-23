import { MAP_STYLES } from '@/constants/mapbox'
import type { MapStyle } from '@/types'

export { MAP_STYLES }

export function getStyleUrl(style: MapStyle): string {
  return MAP_STYLES[style]
}
