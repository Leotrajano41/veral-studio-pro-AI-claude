import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-bg-secondary border border-border rounded-card shadow-card p-6 animate-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-txt-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-tertiary transition text-txt-secondary hover:text-txt-primary">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
