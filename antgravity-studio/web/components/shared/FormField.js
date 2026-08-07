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
        <label htmlFor={fieldId} className="block text-xs font-medium text-[#B0B0B0]">
          {label}
          {required && <span className="text-[#FF6B6B] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={fieldId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
        className={cn(
          'w-full bg-[#333333] border rounded-input px-4 py-2.5 text-sm text-white placeholder-[#B0B0B0]/40 outline-none transition duration-180 focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/40',
          error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/40' : 'border-[#444444]',
          inputClassName
        )}
        {...props}
      />

      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-[#EF4444] font-medium" role="alert">
          {error}
        </p>
      )}

      {!error && helpText && (
        <p id={`${fieldId}-help`} className="text-[11px] text-[#B0B0B0]/60">
          {helpText}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
export default FormField;
