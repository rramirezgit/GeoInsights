import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { HubMap } from './HubMap'
import { DemoCards } from './DemoCards'
import { CoordinateDisplay } from './CoordinateDisplay'

export default function Hub() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const techRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const lineGlowRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 1. Split-text character reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || ''
        titleRef.current.innerHTML = text
          .split('')
          .map(
            (char) =>
              `<span class="gsap-char" style="display:inline-block${char === ' ' ? ';width:0.3em' : ''}">${char === ' ' ? '&nbsp;' : char}</span>`,
          )
          .join('')
        titleRef.current.style.visibility = 'visible'

        const chars = titleRef.current.querySelectorAll('.gsap-char')

        tl.from(chars, {
          y: 60,
          opacity: 0,
          scale: 0.5,
          filter: 'blur(14px)',
          duration: 0.9,
          stagger: 0.045,
        })
      }

      // Subtitle
      tl.from(
        subtitleRef.current,
        { y: 30, opacity: 0, filter: 'blur(8px)', duration: 0.7 },
        '-=0.35',
      )

      // Tech stack
      tl.from(
        techRef.current,
        { y: 20, opacity: 0, duration: 0.55 },
        '-=0.3',
      )

      // 2. Line divider draws from center
      tl.from(
        lineRef.current,
        { scaleX: 0, duration: 1.2, ease: 'power2.inOut' },
        '-=0.25',
      )

      // Glow dot sweeps along the line
      if (lineGlowRef.current) {
        tl.fromTo(
          lineGlowRef.current,
          { xPercent: -50, left: '45%', opacity: 0 },
          { left: '98%', opacity: 1, duration: 1, ease: 'power2.inOut' },
          '-=1.1',
        )
        tl.to(lineGlowRef.current, { opacity: 0, duration: 0.4 }, '-=0.1')
      }

      // 3. Cards stagger entrance (part of master timeline, no scroll)
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>('.demo-card')
        tl.from(
          cards,
          {
            y: 60,
            opacity: 0,
            rotateY: -8,
            rotateX: 5,
            scale: 0.92,
            duration: 0.7,
            stagger: 0.09,
            ease: 'power3.out',
          },
          '-=0.4',
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative h-screen overflow-hidden">
      <HubMap />

      <div className="relative z-10 flex flex-col h-screen pt-16">
        {/* Hero — compact */}
        <section className="flex flex-col items-center justify-center px-4 pt-10 pb-4 md:pt-14 md:pb-6 shrink-0">
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-center bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent leading-tight"
            style={{ visibility: 'hidden' }}
          >
            GeoInsights
          </h1>

          <p
            ref={subtitleRef}
            className="mt-3 text-lg md:text-xl text-slate-400 text-center font-light"
          >
            Visualizacion geoespacial inteligente
          </p>

          <p
            ref={techRef}
            className="mt-2 text-xs text-slate-500/80 text-center tracking-[0.25em] uppercase"
          >
            React &middot; Mapbox GL &middot; deck.gl &middot; TypeScript
          </p>
        </section>

        {/* Animated divider */}
        <div className="flex justify-center px-4 pb-4 md:pb-6 shrink-0">
          <div className="relative w-full max-w-xl">
            <div
              ref={lineRef}
              className="w-full h-px origin-center"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.6) 25%, rgba(6,182,212,0.5) 75%, transparent 100%)',
              }}
            />
            <div
              ref={lineGlowRef}
              className="absolute top-1/2 -translate-y-1/2 w-12 h-6 pointer-events-none opacity-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(16,185,129,0.9) 0%, rgba(6,182,212,0.4) 40%, transparent 70%)',
                filter: 'blur(3px)',
              }}
            />
          </div>
        </div>

        {/* Cards — fills remaining space */}
        <div ref={cardsRef} className="flex-1 min-h-0 flex items-start justify-center px-4 pb-4">
          <DemoCards />
        </div>

        {/* Minimal footer line */}
        <div className="shrink-0 border-t border-white/5 px-4 py-2 flex items-center justify-between">
          <p className="text-[10px] text-slate-600 tracking-wide">
            GeoInsights &middot; React + Mapbox GL + deck.gl
          </p>
        </div>
      </div>

      <CoordinateDisplay />
    </div>
  )
}
