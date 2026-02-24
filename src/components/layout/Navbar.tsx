import { useEffect, useRef, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import {
  MapPin,
  Menu,
  Flame,
  Truck,
  Satellite,
  PenTool,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { DEMOS } from '@/constants/demos'

const ICON_MAP: Record<string, LucideIcon> = {
  Flame,
  Truck,
  Satellite,
  PenTool,
  BookOpen,
}

export function Navbar() {
  const location = useLocation()
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu)

  const navRef = useRef<HTMLElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const pillRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // --- Entrance animation ---
  useEffect(() => {
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(navRef.current, {
        y: -64,
        opacity: 0,
        duration: 0.6,
      })

      tl.from('.nav-logo', {
        x: -20,
        opacity: 0,
        duration: 0.5,
      }, '-=0.2')

      tl.from('.nav-tab', {
        y: -16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.07,
      }, '-=0.3')
    }, navRef)

    return () => ctx.revert()
  }, [])

  // --- Sliding pill indicator on route change ---
  useLayoutEffect(() => {
    const activeIndex = DEMOS.findIndex((d) => d.path === location.pathname)
    const activeTab = tabsRef.current[activeIndex]
    const activeDemo = DEMOS[activeIndex]

    if (activeTab && pillRef.current && glowRef.current && tabsContainerRef.current) {
      const containerRect = tabsContainerRef.current.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()
      const left = tabRect.left - containerRect.left

      gsap.to(pillRef.current, {
        left,
        width: tabRect.width,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      })

      gsap.to(glowRef.current, {
        left: left + tabRect.width / 2,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      })

      // Update glow color to match active demo
      glowRef.current.style.background = `radial-gradient(ellipse at center, ${activeDemo.color}80 0%, ${activeDemo.color}20 50%, transparent 80%)`
    } else if (pillRef.current && glowRef.current) {
      // No active demo (Hub page)
      gsap.to(pillRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
      gsap.to(glowRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
    }
  }, [location.pathname])

  // --- Icon micro-interaction on hover ---
  function handleTabEnter(e: React.MouseEvent) {
    const icon = (e.currentTarget as HTMLElement).querySelector('.tab-icon')
    if (icon) {
      gsap.to(icon, {
        scale: 1.3,
        rotate: -15,
        duration: 0.35,
        ease: 'back.out(3)',
        overwrite: 'auto',
      })
    }
  }

  function handleTabLeave(e: React.MouseEvent) {
    const icon = (e.currentTarget as HTMLElement).querySelector('.tab-icon')
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotate: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="nav-logo flex items-center gap-2 group">
          <MapPin className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl text-slate-100">
            Geo<span className="text-emerald-500">Insights</span>
          </span>
        </Link>

        {/* Desktop tabs */}
        <div
          ref={tabsContainerRef}
          className="hidden md:flex items-center gap-0.5 relative"
        >
          {/* Sliding glass pill */}
          <div
            ref={pillRef}
            className="absolute top-1/2 -translate-y-1/2 h-9 rounded-xl opacity-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
              willChange: 'transform, width, opacity',
            }}
          />

          {/* Active glow */}
          <div
            ref={glowRef}
            className="absolute -bottom-1 w-16 h-3 -translate-x-1/2 rounded-full opacity-0 pointer-events-none"
            style={{ filter: 'blur(6px)', willChange: 'transform, opacity' }}
          />

          {DEMOS.map((demo, i) => {
            const Icon = ICON_MAP[demo.icon]
            const isActive = location.pathname === demo.path

            return (
              <Link
                key={demo.id}
                ref={(el) => { tabsRef.current[i] = el }}
                to={demo.path}
                className="nav-tab relative z-10 px-3 py-2 text-[13px] font-medium flex items-center gap-1.5 rounded-xl transition-colors duration-200"
                onMouseEnter={handleTabEnter}
                onMouseLeave={handleTabLeave}
              >
                {Icon && (
                  <Icon
                    className="tab-icon w-3.5 h-3.5 shrink-0 transition-colors duration-200"
                    style={{ color: isActive ? demo.color : undefined }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                )}
                <span
                  className={
                    isActive
                      ? 'font-semibold'
                      : 'text-slate-400 hover:text-slate-200 transition-colors duration-200'
                  }
                  style={isActive ? { color: demo.color } : undefined}
                >
                  {demo.title}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  )
}
