import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Textarea = forwardRef(({
  label,
  required,
  error,
  rows = 4,
  id,
  className,
  textareaClassName,
  ...props
}, ref) => {
  const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="block text-xs font-medium text-[#94A3B8]">
          {label}
          {required && <span className="text-[#6366F1] ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        className={cn(
          'w-full bg-[#0F172A] border border-[#334155] rounded-input p-3 text-sm text-white placeholder-[#64748B] outline-none transition duration-180 resize-none font-sans focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]',
          error ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#334155]',
          textareaClassName
        )}
        {...props}
      />

      {error && (
        <p className="text-[11px] text-[#EF4444] font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
