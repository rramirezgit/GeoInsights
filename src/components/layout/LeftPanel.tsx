import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LeftPanelProps {
  title: string
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
}

export function LeftPanel({ title, children, isOpen, onToggle }: LeftPanelProps) {
  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative hidden lg:flex flex-col h-full bg-slate-900/80 backdrop-blur-xl border-r border-white/5 overflow-hidden shrink-0"
          >
            <div className="flex items-center justify-between px-4 h-12 border-b border-white/5 shrink-0">
              <h2 className="text-sm font-semibold text-slate-200 truncate">
                {title}
              </h2>
              <button
                onClick={onToggle}
                className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Collapse panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {children}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-6 h-12 bg-slate-900/80 backdrop-blur-md border border-white/5 border-l-0 rounded-r-lg text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Expand left panel"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </>
  )
}
