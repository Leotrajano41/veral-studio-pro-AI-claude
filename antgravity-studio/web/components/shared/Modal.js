import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ isOpen = true, onClose, title, children, size = 'md', className }) {
  const modalRef = useRef(null);

  // Esc key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-[#2a2a2a] border border-[#444444] rounded-card shadow-card p-6 flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-180',
          SIZES[size] || SIZES.md,
          className
        )}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#444444] shrink-0">
          <h2 id="modal-title" className="text-lg font-bold text-white tracking-tight">
            {title}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-card hover:bg-[#333333] text-[#B0B0B0] hover:text-white transition duration-150 focus-visible:ring-2 focus-visible:ring-[#FF6B6B]"
              aria-label="Fechar diálogo"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
