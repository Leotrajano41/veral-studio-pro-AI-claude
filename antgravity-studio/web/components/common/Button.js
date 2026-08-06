import { cn } from '../../lib/utils';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const sizes = {
  sm: 'text-xs px-3 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-6 py-3',
};

export default function Button({ children, variant = 'primary', size = 'md', disabled = false, className = '', ...props }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        'inline-flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
