import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, PanelLeftOpen, PanelRightOpen, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'

interface DemoLayoutProps {
  children: ReactNode
  title: string
  description?: string
  leftPanel?: ReactNode
  leftPanelTitle?: string
  rightPanel?: ReactNode
  rightPanelTitle?: string
}

export function DemoLayout({
  children,
  title,
  description,
  leftPanel,
  leftPanelTitle = 'Controls',
  rightPanel,
  rightPanelTitle = 'Info',
}: DemoLayoutProps) {
  const leftOpen = useUIStore((s) => s.leftPanelOpen)
  const rightOpen = useUIStore((s) => s.rightPanelOpen)
  const toggleLeft = useUIStore((s) => s.toggleLeftPanel)
  const toggleRight = useUIStore((s) => s.toggleRightPanel)

  return (
    <div className="h-screen pt-16 flex flex-col bg-slate-950">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 h-12 bg-slate-950/90 backdrop-blur-md border-b border-white/5 shrink-0 z-10">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <div className="w-px h-5 bg-white/10" />
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-slate-100 truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-slate-500 truncate hidden sm:block">
              {description}
            </p>
          )}
        </div>

        {/* Mobile panel toggles */}
        <div className="flex items-center gap-1 lg:hidden">
          {leftPanel && (
            <button
              onClick={toggleLeft}
              className={[
                'p-1.5 rounded-md transition-colors',
                leftOpen
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-300',
              ].join(' ')}
              aria-label="Toggle left panel"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
          {rightPanel && (
            <button
              onClick={toggleRight}
              className={[
                'p-1.5 rounded-md transition-colors',
                rightOpen
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-300',
              ].join(' ')}
              aria-label="Toggle right panel"
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Desktop left panel */}
        {leftPanel && (
          <LeftPanel
            title={leftPanelTitle}
            isOpen={leftOpen}
            onToggle={toggleLeft}
          >
            {leftPanel}
          </LeftPanel>
        )}

        {/* Center: map / main content */}
        <div className="flex-1 relative overflow-hidden">{children}</div>

        {/* Desktop right panel */}
        {rightPanel && (
          <RightPanel
            title={rightPanelTitle}
            isOpen={rightOpen}
            onToggle={toggleRight}
          >
            {rightPanel}
          </RightPanel>
        )}

        {/* Mobile left drawer overlay */}
        <AnimatePresence>
          {leftPanel && leftOpen && (
            <MobileDrawer side="left" onClose={toggleLeft}>
              <DrawerHeader title={leftPanelTitle} onClose={toggleLeft} />
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {leftPanel}
              </div>
            </MobileDrawer>
          )}
        </AnimatePresence>

        {/* Mobile right drawer overlay */}
        <AnimatePresence>
          {rightPanel && rightOpen && (
            <MobileDrawer side="right" onClose={toggleRight}>
              <DrawerHeader title={rightPanelTitle} onClose={toggleRight} />
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {rightPanel}
              </div>
            </MobileDrawer>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MobileDrawer({
  children,
  side,
  onClose,
}: {
  children: ReactNode
  side: 'left' | 'right'
  onClose: () => void
}) {
  const isLeft = side === 'left'
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="lg:hidden fixed inset-0 z-20 bg-black/40"
      />
      <motion.div
        initial={{ x: isLeft ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: isLeft ? '-100%' : '100%' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={[
          'lg:hidden fixed top-0 bottom-0 z-30 w-80 max-w-[85vw] flex flex-col',
          'bg-slate-900/95 backdrop-blur-2xl border-white/5',
          isLeft ? 'left-0 border-r' : 'right-0 border-l',
        ].join(' ')}
        style={{ paddingTop: 'calc(4rem + 3rem)' }} // navbar + header bar
      >
        {children}
      </motion.div>
    </>
  )
}

function DrawerHeader({
  title,
  onClose,
}: {
  title: string
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 h-12 border-b border-white/5 shrink-0">
      <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      <button
        onClick={onClose}
        className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Close panel"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
