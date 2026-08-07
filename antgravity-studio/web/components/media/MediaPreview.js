import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import { Download, Film, Image as ImageIcon } from 'lucide-react';

export default function MediaPreview({ item, onClose, onDownloadSingle }) {
  if (!item) return null;

  return (
    <Modal title={`👁️ Preview: ${item.name}`} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* Preview Container */}
        <div className="relative aspect-video bg-[#1a1a1a] rounded-card overflow-hidden border border-[#444444] flex items-center justify-center">
          {item.type === 'video' ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-white space-y-2">
              <Film size={48} className="text-[#FF6B6B] animate-pulse" />
              <p className="text-xs text-[#B0B0B0]">Preview do Vídeo — Resolução {item.resolution}</p>
              <img src={item.thumb} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 -z-10" />
            </div>
          ) : (
            <img src={item.fullUrl || item.thumb} alt={item.name} className="w-full h-full object-contain" />
          )}
        </div>

        {/* Info */}
        <div className="flex items-center justify-between text-xs text-[#B0B0B0] p-3 rounded-card bg-[#333333]/40 border border-[#444444]">
          <div>
            <p className="font-semibold text-white">{item.name}</p>
            <p className="text-[11px] mt-0.5">{item.resolution} · {item.sizeMb}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge text={item.source} variant="secondary" />
            <Badge text={item.type === 'video' ? '🎬 Vídeo' : '🖼️ Imagem'} variant="primary" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#444444]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onDownloadSingle(item);
              onClose();
            }}
          >
            <Download size={14} /> ⬇️ Baixar esta
          </Button>
        </div>
      </div>
    </Modal>
  );
}
