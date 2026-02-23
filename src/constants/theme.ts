export const THEME = {
  colors: {
    bg: {
      primary: '#0f172a',    // slate-900
      secondary: '#1e293b',  // slate-800
      tertiary: '#334155',   // slate-700
    },
    glass: {
      bg: 'rgba(15, 23, 42, 0.8)',
      border: 'rgba(148, 163, 184, 0.1)',
      hover: 'rgba(148, 163, 184, 0.15)',
    },
    accent: {
      primary: '#10b981',    // emerald-500
      secondary: '#06b6d4',  // cyan-500
      tertiary: '#3b82f6',   // blue-500
      warning: '#f59e0b',    // amber-500
      danger: '#ef4444',     // red-500
    },
    text: {
      primary: '#f1f5f9',    // slate-100
      secondary: '#94a3b8',  // slate-400
      muted: '#64748b',      // slate-500
    },
    status: {
      en_ruta: '#22c55e',
      detenido: '#f59e0b',
      alerta: '#ef4444',
      en_destino: '#3b82f6',
    },
  },
  blur: {
    sm: 'blur(8px)',
    md: 'blur(16px)',
    lg: 'blur(24px)',
  },
} as const
