import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Hub = lazy(() => import('@/pages/Hub/Hub'))
const HeatmapPage = lazy(() => import('@/pages/Heatmap/HeatmapPage'))
const TrackingPage = lazy(() => import('@/pages/Tracking/TrackingPage'))
const SatelitalPage = lazy(() => import('@/pages/Satelital/SatelitalPage'))
const DrawPage = lazy(() => import('@/pages/Draw/DrawPage'))
const StoryMapPage = lazy(() => import('@/pages/StoryMap/StoryMapPage'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="glass-panel p-8 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Cargando...</span>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/satelital" element={<SatelitalPage />} />
        <Route path="/draw" element={<DrawPage />} />
        <Route path="/storymap" element={<StoryMapPage />} />
      </Routes>
    </Suspense>
  )
}
