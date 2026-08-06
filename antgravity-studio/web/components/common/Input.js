import { cn } from '../../lib/utils';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-txt-secondary">{label}</label>}
      <input className={cn('input-base', error && 'border-error focus:border-error focus:ring-error/30', className)} {...props} />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
