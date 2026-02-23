import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect } from 'react';

interface StatWidgetProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

function AnimatedNumber({ value }: { value: string | number }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumeric = !isNaN(numericValue);

  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (latest) => {
    if (!isNumeric) return String(value);
    return Number.isInteger(numericValue)
      ? Math.round(latest).toLocaleString()
      : latest.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
  });

  useEffect(() => {
    if (!isNumeric) return;
    const controls = animate(motionVal, numericValue, {
      duration: 1.2,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [motionVal, numericValue, isNumeric]);

  if (!isNumeric) {
    return <span>{value}</span>;
  }

  return <motion.span>{display}</motion.span>;
}

export function StatWidget({ label, value, unit, icon: Icon, trend }: StatWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg shadow-black/20"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-accent-emerald">
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-white">
          <AnimatedNumber value={value} />
          {unit && (
            <span className="ml-1 text-sm font-normal text-slate-400">
              {unit}
            </span>
          )}
        </p>

        {trend && (
          <div
            className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
              trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
