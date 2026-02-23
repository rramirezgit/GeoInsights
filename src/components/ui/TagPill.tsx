import { X } from 'lucide-react';
import type { CSSProperties } from 'react';

interface TagPillProps {
  label: string;
  color: string;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

export function TagPill({
  label,
  color,
  active = false,
  onRemove,
  onClick,
}: TagPillProps) {
  const style: CSSProperties = active
    ? { backgroundColor: `${color}22`, borderColor: color, color }
    : { borderColor: `${color}66`, color };

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={style}
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        onClick && 'cursor-pointer hover:brightness-125',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-white/10"
          aria-label={`Remove ${label}`}
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}
