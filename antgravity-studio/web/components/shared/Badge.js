import { cn } from '../../lib/utils';

const VARIANTS = {
  default: 'bg-[#333333] text-[#B0B0B0] border-[#444444]',
  primary: 'bg-[#FF6B6B]/15 text-[#FF6B6B] border-[#FF6B6B]/30',
  secondary: 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30',
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
