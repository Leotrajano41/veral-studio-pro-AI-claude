import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = '⚠️ Confirmar Ação',
  message = 'Tem certeza que deseja executar esta ação? Esta operação não pode ser desfeita.',
  confirmText = 'Sim, Deletar',
  cancelText = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning'
  onConfirm,
  onClose,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <Modal title={title} onClose={onClose} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-card bg-[#EF4444]/10 border border-[#EF4444]/30">
          <AlertTriangle size={20} className="text-[#EF4444] shrink-0 mt-0.5" />
          <p className="text-xs text-white leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#444444]">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            loading={loading}
            className="bg-[#EF4444] hover:bg-[#DC2626] text-white border-none"
          >
            <Trash2 size={13} /> {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
