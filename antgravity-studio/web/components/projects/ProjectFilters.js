import { cn } from '../../lib/utils';
import { NICHES } from '../../lib/constants';

const allFilter = { value: 'all', label: 'Todos' };

export default function ProjectFilters({ active, onChange }) {
  const filters = [allFilter, ...NICHES];
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            'px-4 py-1.5 rounded-full text-xs font-semibold border transition',
            active === f.value
              ? 'bg-accent-red text-white border-accent-red'
              : 'bg-bg-tertiary text-txt-secondary border-border hover:border-txt-secondary'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
