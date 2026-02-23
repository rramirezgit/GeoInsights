import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const paddingMap = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
} as const;

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={
        hover
          ? { scale: 1.02, borderColor: 'rgba(16, 185, 129, 0.3)' }
          : undefined
      }
      onClick={onClick}
      className={[
        'rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md',
        'shadow-lg shadow-black/20',
        hover && 'cursor-pointer transition-shadow hover:shadow-emerald-500/10',
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </motion.div>
  );
}
