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
        <label htmlFor={fieldId} className="block text-xs font-medium text-[#B0B0B0]">
          {label}
          {required && <span className="text-[#FF6B6B] ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        className={cn(
          'w-full bg-[#333333] border rounded-input p-3 text-sm text-white placeholder-[#B0B0B0]/40 outline-none transition duration-180 resize-none font-sans focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/40',
          error ? 'border-[#EF4444]' : 'border-[#444444]',
          textareaClassName
        )}
        {...props}
      />

      {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
