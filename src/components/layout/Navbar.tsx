import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Menu } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { DEMOS } from '@/constants/demos'

export function Navbar() {
  const location = useLocation()
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu)

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <MapPin className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl text-slate-100">
            Geo<span className="text-emerald-500">Insights</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {DEMOS.map((demo) => {
            const isActive = location.pathname === demo.path
            return (
              <Link
                key={demo.id}
                to={demo.path}
                className="relative px-3 py-2 text-sm font-medium transition-colors"
                style={{ color: isActive ? demo.color : undefined }}
              >
                <span
                  className={
                    isActive
                      ? ''
                      : 'text-slate-400 hover:text-slate-200 transition-colors'
                  }
                >
                  {demo.title}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </motion.nav>
  )
}
