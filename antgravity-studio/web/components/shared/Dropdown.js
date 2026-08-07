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
        <label htmlFor={fieldId} className="block text-xs font-medium text-[#B0B0B0]">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full appearance-none bg-[#333333] border rounded-input px-4 py-2.5 text-sm text-white pr-9 outline-none transition duration-180 cursor-pointer focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/40',
            error ? 'border-[#EF4444]' : 'border-[#444444]',
            selectClassName
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal} className="bg-[#2a2a2a] text-white">
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
      </div>

      {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';
export default Dropdown;
