import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  LogOut,
  OctagonAlert,
  CirclePause,
  Gauge,
} from 'lucide-react'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { THEME } from '@/constants/theme'
import type { FleetEvent } from '@/types'

const EVENT_CONFIG: Record<
  FleetEvent['type'],
  { icon: typeof MapPin; color: string; borderColor: string }
> = {
  arrival: {
    icon: MapPin,
    color: THEME.colors.status.en_destino,
    borderColor: THEME.colors.status.en_destino,
  },
  departure: {
    icon: LogOut,
    color: THEME.colors.status.en_ruta,
    borderColor: THEME.colors.status.en_ruta,
  },
  stop: {
    icon: CirclePause,
    color: THEME.colors.status.detenido,
    borderColor: THEME.colors.status.detenido,
  },
  alert: {
    icon: OctagonAlert,
    color: THEME.colors.status.alerta,
    borderColor: THEME.colors.status.alerta,
  },
  speed: {
    icon: Gauge,
    color: THEME.colors.accent.secondary,
    borderColor: THEME.colors.accent.secondary,
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [events.length])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Eventos en Tiempo Real
        </h3>
        <LiveBadge variant="live" />
      </div>

      {/* Events list */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto scrollbar-thin"
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
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-lg border border-white/5 bg-slate-800/40 backdrop-blur-sm"
                style={{ borderLeftWidth: 3, borderLeftColor: config.borderColor }}
              >
                <div className="flex items-start gap-2.5 px-3 py-2.5">
                  {/* Icon */}
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon size={12} style={{ color: config.color }} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-slate-300">
                      {event.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-slate-600">
                        {formatTime(event.timestamp)}
                      </span>
                      <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400">
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
      <div className="pt-3 text-center">
        <span className="text-[10px] text-slate-600">
          {events.length} evento{events.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
