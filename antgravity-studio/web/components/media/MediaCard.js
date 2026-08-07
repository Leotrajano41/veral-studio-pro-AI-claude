import Badge from '../shared/Badge';
import { Eye, Film, Image as ImageIcon } from 'lucide-react';

export default function MediaCard({ item, onToggleSelect, onPreview }) {
  return (
    <div
      onClick={() => onToggleSelect(item.id)}
      className={`relative rounded-card overflow-hidden border cursor-pointer transition duration-180 flex flex-col justify-between group ${item.selected ? 'border-[#FF6B6B] ring-2 ring-[#FF6B6B]/40 bg-[#FF6B6B]/10' : 'border-[#444444] bg-[#2a2a2a] hover:border-[#FF6B6B]/40'}`}
    >
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video bg-[#333333] overflow-hidden">
        <img
          src={item.thumb}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Checkbox de Seleção Múltipla */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => {}} // Handled by parent container click
            className="w-4 h-4 accent-[#FF6B6B] rounded cursor-pointer"
          />
        </div>

        {/* Ícone de Tipo */}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="text-[10px] bg-black/75 text-white px-2 py-0.5 rounded font-mono flex items-center gap-1 backdrop-blur">
            {item.type === 'video' ? '🎬 Vídeo' : '🖼️ Imagem'}
          </span>
        </div>

        {/* Fonte Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[9px] font-bold bg-[#333333]/90 text-[#4ECDC4] px-1.5 py-0.5 rounded border border-[#444444] backdrop-blur">
            {item.source}
          </span>
        </div>
      </div>

      {/* Info & Action */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold text-white truncate" title={item.name}>
            {item.name}
          </p>
          <p className="text-[10px] text-[#B0B0B0] mt-0.5 font-mono">
            {item.resolution} · {item.sizeMb}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(item);
          }}
          className="w-full py-1.5 rounded-card bg-[#333333] hover:bg-[#444444] text-[#B0B0B0] hover:text-white text-xs font-semibold transition border border-[#444444] flex items-center justify-center gap-1"
          aria-label="Abrir preview da mídia"
        >
          <Eye size={13} /> 👁️ Preview
        </button>
      </div>
    </div>
  );
}
