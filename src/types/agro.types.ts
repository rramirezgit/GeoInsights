export type CropType = 'soja' | 'maiz' | 'trigo' | 'girasol'

export interface AgroDataPoint {
  lat: number
  lng: number
  crop: CropType
  production_tons: number
  year: number
  province: string
}

export interface ProvinceStats {
  province: string
  totalProduction: number
  topCrop: CropType
  dataPoints: number
}

export interface HarvestData {
  year: number
  crop: CropType
  totalProduction: number
  byProvince: ProvinceStats[]
}
