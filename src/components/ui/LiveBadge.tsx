const variantStyles = {
  live: {
    dot: 'bg-emerald-400',
    ring: 'bg-emerald-400/40',
    text: 'text-emerald-400',
    defaultLabel: 'LIVE',
  },
  offline: {
    dot: 'bg-slate-500',
    ring: 'bg-transparent',
    text: 'text-slate-500',
    defaultLabel: 'OFFLINE',
  },
  warning: {
    dot: 'bg-amber-400',
    ring: 'bg-amber-400/40',
    text: 'text-amber-400',
    defaultLabel: 'WARNING',
  },
} as const;

interface LiveBadgeProps {
  label?: string;
  variant: 'live' | 'offline' | 'warning';
}

export function LiveBadge({ label, variant }: LiveBadgeProps) {
  const style = variantStyles[variant];
  const showPulse = variant !== 'offline';

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        {showPulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${style.ring}`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${style.dot}`}
        />
      </span>
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
        {label ?? style.defaultLabel}
      </span>
    </span>
  );
}
