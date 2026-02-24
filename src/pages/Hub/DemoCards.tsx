import { useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
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

export function DemoCards() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  // --- Magnetic hover ---
  const handleMouseMove = useCallback(
    (e: React.MouseEvent, index: number) => {
      const card = cardsRef.current[index]
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = x - rect.width / 2
      const centerY = y - rect.height / 2

      gsap.to(card, {
        x: centerX * 0.12,
        y: centerY * 0.12,
        rotateY: centerX * 0.025,
        rotateX: -centerY * 0.025,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      const glow = card.querySelector<HTMLElement>('.card-glow')
      if (glow) {
        gsap.to(glow, {
          left: x,
          top: y,
          opacity: 1,
          duration: 0.35,
          overwrite: 'auto',
        })
      }
    },
    [],
  )

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardsRef.current[index]
    if (!card) return

    gsap.to(card, {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    })

    const glow = card.querySelector<HTMLElement>('.card-glow')
    if (glow) {
      gsap.to(glow, { opacity: 0, duration: 0.4, overwrite: 'auto' })
    }
  }, [])

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl"
      style={{ perspective: '1200px' }}
    >
      {DEMOS.map((demo, i) => {
        const Icon = ICON_MAP[demo.icon]
        return (
          <div
            key={demo.id}
            className="demo-card"
            ref={(el) => {
              cardsRef.current[i] = el
            }}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            <Link to={demo.path} className="block h-full">
              <div className="relative h-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-4 shadow-lg shadow-black/20 overflow-hidden transition-shadow duration-300 hover:shadow-emerald-500/10 hover:border-white/[0.15]">
                {/* Cursor-following glow */}
                <div
                  className="card-glow absolute w-40 h-40 rounded-full pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background: `radial-gradient(circle, ${demo.color}18 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                  }}
                />

                {/* Hover edge glow */}
                <div
                  className="absolute inset-0 opacity-0 hover-glow transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `inset 0 1px 0 ${demo.color}25, inset 0 0 40px ${demo.color}08`,
                  }}
                />

                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                        style={{ backgroundColor: `${demo.color}15` }}
                      >
                        <span style={{ color: demo.color }}>
                          <Icon className="w-4 h-4" />
                        </span>
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-slate-100 leading-tight">
                      {demo.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {demo.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {demo.tags.map((tag) => (
                      <TagPill key={tag} label={tag} color={demo.color} />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
