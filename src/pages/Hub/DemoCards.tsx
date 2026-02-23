import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Flame,
  Truck,
  Satellite,
  PenTool,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import { DEMOS } from '@/constants/demos'
import { TagPill } from '@/components/ui/TagPill'

const ICON_MAP: Record<string, LucideIcon> = {
  Flame,
  Truck,
  Satellite,
  PenTool,
  BookOpen,
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function DemoCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4"
    >
      {DEMOS.map((demo) => {
        const Icon = ICON_MAP[demo.icon]
        return (
          <motion.div key={demo.id} variants={item}>
            <Link to={demo.path} className="block group">
              <div
                className="relative rounded-2xl border border-white/10 border-r-0 bg-slate-900/60 backdrop-blur-md p-5 shadow-lg shadow-black/20 transition-all duration-300 group-hover:scale-[1.03] overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 30px ${demo.color}10, 0 0 40px ${demo.color}15`,
                  }}
                />

                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl"
                        style={{ backgroundColor: `${demo.color}15` }}
                      >
                        <span style={{ color: demo.color }}>
                          <Icon className="w-5 h-5" />
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-slate-100">
                      {demo.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {demo.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {demo.tags.map((tag) => (
                      <TagPill key={tag} label={tag} color={demo.color} />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
