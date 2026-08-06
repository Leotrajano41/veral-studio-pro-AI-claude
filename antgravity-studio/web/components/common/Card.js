import { cn } from '../../lib/utils';

export default function Card({ children, title, footer, className = '', ...props }) {
  return (
    <div className={cn('glass-card p-6', className)} {...props}>
      {title && <h3 className="text-lg font-semibold text-txt-primary mb-4">{title}</h3>}
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-border">{footer}</div>}
    </div>
  );
}
