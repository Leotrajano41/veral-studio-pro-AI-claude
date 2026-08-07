import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-[#FF6B6B] hover:bg-[#FF5252] text-white shadow-glow border-transparent',
  secondary: 'bg-[#333333] hover:bg-[#444444] text-white border-[#444444]',
  ghost: 'bg-transparent hover:bg-[#333333] text-[#B0B0B0] hover:text-white border-transparent',
  danger: 'bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border-[#EF4444]/30',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-card',
  md: 'px-5 py-2.5 text-sm rounded-card',
  lg: 'px-6 py-3.5 text-base rounded-card font-bold',
};

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ariaLabel,
  children,
  className,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 border font-semibold transition-all duration-180 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-[#FF6B6B]',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
