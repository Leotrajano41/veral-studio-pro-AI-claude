import React from 'react';
import { cn } from '../lib/utils';

/**
 * Standardized Reusable Progress Bar Component
 * Props:
 * - value: number (current progress, e.g. 1 to 5)
 * - max: number (max progress, default 5)
 * - color: 'green' | 'yellow' | 'red' (optional explicit color)
 */
export default function ProgressBar({
  value = 0,
  max = 5,
  color,
  className,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getGradient = () => {
    if (color === 'green' || value >= 5) return 'from-[#10b981] to-[#34d399]';
    if (color === 'yellow' || value >= 2) return 'from-[#f59e0b] to-[#fbbf24]';
    return 'from-[#ef4444] to-[#f87171]';
  };

  return (
    <div
      className={cn(
        'w-10 h-1 bg-[#1E293B] rounded-full overflow-hidden border border-[#334155]',
        className
      )}
      title={`Progresso: ${value}/${max} (${Math.round(percentage)}%)`}
    >
      <div
        className={cn(
          'h-full bg-gradient-to-r transition-all duration-500 rounded-full',
          getGradient()
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
