import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useScrollChapter } from '@/hooks/useScrollChapter'
import { StoryMap } from './StoryMap'
import { CHAPTERS } from './chapters.data'

export default function StoryMapPage() {
  const { activeChapter, chapterRefs } = useScrollChapter()

  return (
    <div className="relative bg-slate-950 overflow-x-hidden">
      {/* Fixed map background */}
      <div className="fixed inset-0 z-0">
        <StoryMap activeChapterId={activeChapter} />
      </div>

      {/* Back button */}
      <div className="fixed top-20 left-4 z-20">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-slate-200 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver</span>
        </Link>
      </div>

      {/* Scroll content overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Initial spacer to show full map */}
        <div className="h-screen" />

        {/* Chapter cards */}
        <div className="space-y-[40vh] px-4 md:px-8">
          {CHAPTERS.map((chapter, index) => {
            const isActive = activeChapter === chapter.id
            return (
              <div
                key={chapter.id}
                ref={chapterRefs(chapter.id)}
                className="ml-auto w-full md:w-[40%] md:max-w-md min-h-[60vh] flex items-center pointer-events-auto"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={[
                    'w-full rounded-xl p-8 backdrop-blur-xl border transition-all duration-500',
                    'bg-slate-900/70 shadow-lg shadow-black/30',
                    isActive
                      ? 'border-emerald-500/40 shadow-emerald-500/10'
                      : 'border-white/10',
                  ].join(' ')}
                >
                  {/* Chapter number */}
                  <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">
                    {String(index + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
                  </span>

                  <h2 className="text-2xl font-bold text-white mt-3">
                    {chapter.title}
                  </h2>
                  <p className="text-lg text-emerald-400 mt-1">
                    {chapter.subtitle}
                  </p>
                  <p className="text-base text-slate-300 leading-relaxed mt-4">
                    {chapter.description}
                  </p>

                  {/* Coordinates badge */}
                  <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>{chapter.coordinates.latitude.toFixed(2)}S</span>
                    <span className="text-slate-700">/</span>
                    <span>{Math.abs(chapter.coordinates.longitude).toFixed(2)}W</span>
                    <span className="text-slate-700">|</span>
                    <span>zoom {chapter.zoom}</span>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Bottom spacer */}
        <div className="h-[50vh]" />
      </div>

      {/* Chapter progress dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {CHAPTERS.map((chapter) => (
          <div
            key={chapter.id}
            className={[
              'w-2 h-2 rounded-full transition-all duration-500',
              activeChapter === chapter.id
                ? 'bg-emerald-400 scale-150 shadow-lg shadow-emerald-400/50'
                : 'bg-white/20',
            ].join(' ')}
            title={chapter.title}
          />
        ))}
      </div>
    </div>
  )
}
