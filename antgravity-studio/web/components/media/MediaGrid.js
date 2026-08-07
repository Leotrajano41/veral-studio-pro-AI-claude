import MediaCard from './MediaCard';
import Button from '../shared/Button';
import Skeleton from '../shared/Skeleton';
import { Download, CheckSquare, Square, ImageIcon } from 'lucide-react';

export default function MediaGrid({
  items = [],
  loading = false,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onDownloadSelected,
  onPreview,
}) {
  const selectedCount = items.filter(i => i.selected).length;

  return (
    <div className="space-y-4">
      {/* SEÇÃO 3: Barra de Ações em Massa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-card bg-[#2a2a2a] border border-[#444444]">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#B0B0B0]">
            Mídias selecionadas: <strong className="text-white font-bold">{selectedCount}</strong> de {items.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onSelectAll}
              className="text-xs text-[#4ECDC4] hover:underline font-semibold flex items-center gap-1"
            >
              <CheckSquare size={13} /> ✅ Selecionar todas
            </button>
            <span className="text-[#444444]">|</span>
            <button
              onClick={onClearSelection}
              className="text-xs text-[#B0B0B0] hover:text-white transition"
            >
              ❌ Limpar seleção
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onDownloadSelected}
          disabled={selectedCount === 0}
          className="font-bold py-2.5 px-6"
          ariaLabel="Baixar mídias selecionadas em massa"
        >
          <Download size={16} /> ⬇️ BAIXAR SELECIONADAS ({selectedCount})
        </Button>
      </div>

      {/* SEÇÃO 2: Grid Responsivo (4 colunas Desktop, 2 colunas Tablet, 1 coluna Mobile) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="p-3 rounded-card border border-[#444444] bg-[#2a2a2a] space-y-3">
              <Skeleton className="aspect-video w-full rounded" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              onToggleSelect={onToggleSelect}
              onPreview={onPreview}
            />
          ))}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-[#B0B0B0] text-xs bg-[#2a2a2a] rounded-card border border-[#444444]">
          <ImageIcon size={36} className="mx-auto mb-2 text-[#B0B0B0]/30" />
          Nenhuma mídia encontrada para os filtros selecionados.
        </div>
      )}
    </div>
  );
}
