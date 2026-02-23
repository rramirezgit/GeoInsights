import type { AgroDataPoint, CropType, ProvinceStats } from '@/types'
import { loadAgroData } from './static.service'

let cachedData: AgroDataPoint[] | null = null

async function getData(): Promise<AgroDataPoint[]> {
  if (!cachedData) {
    cachedData = await loadAgroData()
  }
  return cachedData
}

export async function getProductionByProvince(
  province: string,
  year: number
): Promise<AgroDataPoint[]> {
  const data = await getData()
  return data.filter(
    (d) =>
      (province === 'all' || d.province === province) && d.year === year
  )
}

export async function getTopProvinces(
  crop: CropType,
  year: number
): Promise<ProvinceStats[]> {
  const data = await getData()
  const filtered = data.filter((d) => d.crop === crop && d.year === year)

  const byProvince = new Map<string, { total: number; count: number }>()
  for (const d of filtered) {
    const existing = byProvince.get(d.province) ?? { total: 0, count: 0 }
    existing.total += d.production_tons
    existing.count += 1
    byProvince.set(d.province, existing)
  }

  return Array.from(byProvince.entries())
    .map(([province, { total, count }]) => ({
      province,
      totalProduction: total,
      topCrop: crop,
      dataPoints: count,
    }))
    .sort((a, b) => b.totalProduction - a.totalProduction)
}

export async function getYearlyTrend(
  crop: CropType
): Promise<{ year: number; production: number }[]> {
  const data = await getData()
  const filtered = data.filter((d) => d.crop === crop)

  const byYear = new Map<number, number>()
  for (const d of filtered) {
    byYear.set(d.year, (byYear.get(d.year) ?? 0) + d.production_tons)
  }

  return Array.from(byYear.entries())
    .map(([year, production]) => ({ year, production }))
    .sort((a, b) => a.year - b.year)
}
