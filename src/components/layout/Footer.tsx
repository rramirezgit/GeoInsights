import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          GeoInsights &middot; Built with React + Mapbox GL + deck.gl
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="GitHub repository"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </footer>
  )
}
