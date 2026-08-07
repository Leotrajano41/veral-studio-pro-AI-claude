import { cn } from '../../lib/utils';

export default function Card({ title, subtitle, action, children, className }) {
  return (
    <div
      className={cn(
        'bg-[#2a2a2a] border border-[#444444] rounded-card shadow-card p-5 transition-all duration-180 hover:border-[#444444]/80',
        className
      )}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#444444]/60">
          <div>
            {title && <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#B0B0B0] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
