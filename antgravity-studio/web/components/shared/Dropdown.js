import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const Dropdown = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  error,
  id,
  className,
  selectClassName,
  placeholder,
  ...props
}, ref) => {
  const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="block text-xs font-medium text-[#94A3B8]">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={cn(
            'w-full appearance-none bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition duration-180 cursor-pointer disabled:opacity-50 disabled:bg-[#1E293B]',
            error && 'border-[#EF4444] focus:border-[#EF4444]',
            selectClassName
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt, i) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={i} value={val} className="bg-[#0F172A] text-white">
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
      </div>

      {error && (
        <p className="text-[11px] text-[#EF4444] font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';
export default Dropdown;
