import { cn } from '../../lib/utils';

const colors = {
  success: 'bg-success/15 text-success border-success/30',
  error: 'bg-error/15 text-error border-error/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  info: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
};

export default function Badge({ text, variant = 'info', className = '' }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', colors[variant], className)}>
      {text}
    </span>
  );
}
