import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import {
  MapPin,
  LogOut,
  OctagonAlert,
  CirclePause,
  Gauge,
  Radio,
} from 'lucide-react'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { THEME } from '@/constants/theme'
import type { FleetEvent } from '@/types'

const EVENT_CONFIG: Record<
  FleetEvent['type'],
  { icon: typeof MapPin; color: string }
> = {
  arrival: {
    icon: MapPin,
    color: THEME.colors.status.en_destino,
  },
  departure: {
    icon: LogOut,
    color: THEME.colors.status.en_ruta,
  },
  stop: {
    icon: CirclePause,
    color: THEME.colors.status.detenido,
  },
  alert: {
    icon: OctagonAlert,
    color: THEME.colors.status.alerta,
  },
  speed: {
    icon: Gauge,
    color: THEME.colors.accent.secondary,
  },
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

interface LiveFeedProps {
  events: FleetEvent[]
}

export function LiveFeed({ events }: LiveFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [events.length])

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.feed-header', {
        y: 12,
        opacity: 0,
        duration: 0.4,
        delay: 0.2,
        ease: 'power2.out',
      })
    }, headerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="flex h-full flex-col">
      {/* Header */}
      <div className="feed-header flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-5 h-5 rounded-md shrink-0"
            style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}
          >
            <Radio className="w-3 h-3 text-red-400" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Eventos en vivo
          </span>
        </div>
        <LiveBadge variant="live" />
      </div>

      {/* Events list */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {events.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-600">
              Esperando eventos...
            </p>
          )}

          {events.map((event) => {
            const config = EVENT_CONFIG[event.type]
            const Icon = config.icon

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative rounded-lg border border-white/[0.04] bg-white/[0.02] overflow-hidden"
              >
                {/* Colored left accent */}
                <div
                  className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
                  style={{ backgroundColor: config.color }}
                />

                <div className="flex items-start gap-2.5 px-3 py-2.5 ml-1">
                  {/* Icon */}
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon size={12} style={{ color: config.color }} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-slate-300">
                      {event.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-slate-600 tabular-nums">
                        {formatTime(event.timestamp)}
                      </span>
                      <span className="rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500">
                        {event.truckId}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer count */}
      <div className="pt-3">
        <div className="px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-2">
          {events.length} evento{events.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
