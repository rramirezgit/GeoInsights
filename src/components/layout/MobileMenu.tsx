import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flame, Truck, Satellite, PenTool, BookOpen } from 'lucide-react'
import { DEMOS } from '@/constants/demos'
import type { DemoConfig } from '@/types/map.types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Truck,
  Satellite,
  PenTool,
  BookOpen,
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-2xl pt-16"
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 p-6 pt-8 max-w-md mx-auto">
            {DEMOS.map((demo: DemoConfig, i: number) => {
              const Icon = iconMap[demo.icon]
              const isActive = location.pathname === demo.path

              return (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    to={demo.path}
                    onClick={onClose}
                    className={[
                      'block rounded-xl border p-4 transition-all',
                      isActive
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-white/5 bg-slate-900/60 hover:border-white/10 hover:bg-slate-800/60',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <span style={{ color: demo.color }}>
                          <Icon className="w-5 h-5 shrink-0" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">
                          {demo.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {demo.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
