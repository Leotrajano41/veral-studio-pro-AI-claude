import { cn } from '../../lib/utils';

export default function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-txt-secondary">{label}</label>}
      <select className={cn('input-base appearance-none cursor-pointer', error && 'border-error', className)} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
