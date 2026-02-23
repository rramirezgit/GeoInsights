import { useQuery } from '@tanstack/react-query'

interface UseGeoDataOptions<T> {
  url: string
  queryKey: string[]
  enabled?: boolean
  transform?: (data: unknown) => T
}

export function useGeoData<T = unknown>({
  url,
  queryKey,
  enabled = true,
  transform,
}: UseGeoDataOptions<T>) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to fetch ${url}`)
      const raw = await res.json()
      return transform ? transform(raw) : raw
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
