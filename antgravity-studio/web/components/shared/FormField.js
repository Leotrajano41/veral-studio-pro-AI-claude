import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const FormField = forwardRef(({
  label,
  required,
  error,
  helpText,
  id,
  type = 'text',
  className,
  inputClassName,
  ...props
}, ref) => {
  const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="block text-xs font-medium text-[#94A3B8]">
          {label}
          {required && <span className="text-[#6366F1] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={fieldId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
        className={cn(
          'w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition duration-180 disabled:opacity-50 disabled:bg-[#1E293B]',
          error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
          inputClassName
        )}
        {...props}
      />

      {helpText && !error && (
        <p id={`${fieldId}-help`} className="text-[11px] text-[#64748B]">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${fieldId}-error`} className="text-[11px] text-[#EF4444] font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
export default FormField;
