import { useState, useEffect } from 'react'
import { jitterProduction } from '@/lib/geo/wells.helpers'
import type { Well } from '@/types/wells.types'

const TICK_MS = 2500

export function useWellsLive(baseWells: Well[] | undefined) {
  const [jittered, setJittered] = useState<Well[] | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive || !baseWells || baseWells.length === 0) return
    const interval = setInterval(() => {
      setJittered(jitterProduction(baseWells))
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [isLive, baseWells])

  return {
    wells: jittered ?? baseWells ?? [],
    isLive,
    toggleLive: () => setIsLive((v) => !v),
  }
}
