import React from 'react';
import { cn } from '../lib/utils';

/**
 * ProgressIndicator Component
 * Renders progress ratio (e.g. 4/5) with gradient bar and percentage.
 */
export default function ProgressIndicator({ count = 0, total = 5, className }) {
  const percentage = Math.min(Math.max((count / total) * 100, 0), 100);
  const isCompleted = count >= total;

  return (
    <div className={cn('flex items-center gap-3 bg-[#0F172A] px-3.5 py-1.5 rounded-xl border border-[#334155]', className)}>
      <div className="text-right">
        <p className="text-xs font-bold text-white font-mono">{count} de {total} APIs</p>
        <p className="text-[10px] text-[#94A3B8]">{Math.round(percentage)}% concluído</p>
      </div>
      <div className="w-16 h-2 bg-[#1E293B] rounded-full overflow-hidden border border-[#334155]">
        <div
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-500 rounded-full',
            isCompleted ? 'from-[#10B981] to-[#34D399]' : 'from-[#F59E0B] to-[#FBBF24]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
