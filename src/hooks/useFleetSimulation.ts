import { useState, useEffect, useRef, useCallback } from 'react'
import type { Truck, FleetEvent } from '@/types'
import { loadFleetData, loadRoutes } from '@/services/static.service'
import { generateRoutePoints, interpolatePosition, randomEvent } from '@/lib/geo/simulation'

const TICK_MS = 100
const NUM_ROUTE_POINTS = 200
const EVENT_PROBABILITY = 0.005 // per truck per tick

export function useFleetSimulation() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [events, setEvents] = useState<FleetEvent[]>([])
  const [isRunning, setIsRunning] = useState(true)
  const [speed, setSpeed] = useState(1)

  const progressRef = useRef<Map<string, number>>(new Map())
  const routePointsRef = useRef<Map<string, [number, number][]>>(new Map())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const trucksRef = useRef<Truck[]>([])

  // Load initial data
  useEffect(() => {
    let cancelled = false

    async function init() {
      const [fleetData, routeData] = await Promise.all([
        loadFleetData(),
        loadRoutes(),
      ])

      if (cancelled) return

      // Assign each truck to a random route and generate interpolation points
      const initialized = fleetData.map((truck, i) => {
        const route = routeData[i % routeData.length]
        const points = generateRoutePoints(route, NUM_ROUTE_POINTS)
        routePointsRef.current.set(truck.id, points)
        progressRef.current.set(truck.id, Math.random())
        return { ...truck, status: 'en_ruta' as const }
      })

      trucksRef.current = initialized
      setTrucks(initialized)
    }

    init()
    return () => { cancelled = true }
  }, [])

  // Simulation loop
  useEffect(() => {
    if (!isRunning || trucksRef.current.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      const updated = trucksRef.current.map((truck) => {
        const points = routePointsRef.current.get(truck.id)
        if (!points) return truck

        let progress = progressRef.current.get(truck.id) ?? 0
        progress += (0.002 * speed)

        // Loop back when reaching end
        if (progress >= 1) progress = 0
        progressRef.current.set(truck.id, progress)

        const pos = interpolatePosition(points, progress)
        return {
          ...truck,
          lat: pos.lat,
          lng: pos.lng,
          heading: pos.heading,
          speed_kmh: 60 + Math.random() * 40 * speed,
        }
      })

      trucksRef.current = updated
      setTrucks(updated)

      // Random events
      for (const truck of updated) {
        if (Math.random() < EVENT_PROBABILITY * speed) {
          const evt = randomEvent(truck)
          setEvents((prev) => [evt, ...prev].slice(0, 50))
        }
      }
    }, TICK_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, speed])

  const setSpeedSafe = useCallback((s: number) => {
    setSpeed(Math.max(0.5, Math.min(5, s)))
  }, [])

  return {
    trucks,
    events,
    isRunning,
    speed,
    setSpeed: setSpeedSafe,
    toggleRunning: () => setIsRunning((r) => !r),
  }
}
