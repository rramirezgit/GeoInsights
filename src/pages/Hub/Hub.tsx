import { motion } from 'framer-motion'
import { HubMap } from './HubMap'
import { DemoCards } from './DemoCards'
import { CoordinateDisplay } from './CoordinateDisplay'
import { Footer } from '@/components/layout/Footer'

export default function Hub() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated map background */}
      <HubMap />

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen pt-16">
        {/* Hero section */}
        <section className="flex flex-col items-center justify-center px-4 pt-20 pb-16 md:pt-28 md:pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-6xl md:text-7xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            GeoInsights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-4 text-xl text-slate-400 text-center"
          >
            Visualizacion geoespacial inteligente
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
            className="mt-3 text-sm text-slate-500 text-center tracking-wide"
          >
            React &middot; Mapbox GL &middot; deck.gl &middot; TypeScript
          </motion.p>
        </section>

        {/* Demo cards */}
        <section className="flex-1 pb-16">
          <DemoCards />
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Coordinate display */}
      <CoordinateDisplay />
    </div>
  )
}
