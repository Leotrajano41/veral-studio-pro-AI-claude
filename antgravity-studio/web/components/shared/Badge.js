import { cn } from '../../lib/utils';

const VARIANTS = {
  default: 'bg-[#334155] text-[#94A3B8] border-[#475569]',
  primary: 'bg-[#6366F1]/15 text-[#6366F1] border-[#6366F1]/30',
  secondary: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30',
  success: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
  warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
  error: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
};

export default function Badge({ text, variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition duration-150',
        VARIANTS[variant] || VARIANTS.default,
        className
      )}
    >
      {text || children}
    </span>
  );
}
