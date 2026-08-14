import React from 'react';
import { cn } from '../lib/utils';

/**
 * Standardized Reusable Badge Component (Item 10)
 * Colors:
 * - Green (#10b981): ✅ Completo / Ativo
 * - Yellow (#f59e0b): ⏳ Pendente
 * - Red (#ef4444): ❌ Erro
 * - Purple (#7c3aed): ✨ Novo
 */
export default function Badge({
  text,
  color = 'purple',
  type = 'default',
  onClick,
  tooltip,
  className,
  children,
}) {
  const colorStyles = {
    green: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40 shadow-[0_0_8px_rgba(16,185,129,0.25)] font-bold',
    yellow: 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40 font-bold',
    red: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40 animate-pulse font-extrabold',
    purple: 'bg-[#7c3aed]/20 text-[#a855f7] border-[#7c3aed]/40 shadow-[0_0_10px_rgba(124,58,237,0.3)] animate-pulse font-extrabold',
  };

  return (
    <span
      title={tooltip}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border transition-all duration-300 select-none',
        colorStyles[color] || colorStyles.purple,
        onClick && 'cursor-pointer hover:scale-105 active:scale-95',
        className
      )}
    >
      {text || children}
    </span>
  );
}
