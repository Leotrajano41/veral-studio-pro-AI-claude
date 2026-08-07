import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Dropdown from '../shared/Dropdown';
import { Search, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const SOURCES = ['📷 Pixabay', '📸 Pexels', 'All (todas)'];
const TYPES = ['Ambas', 'Vídeos', 'Imagens'];
const ORIENTATIONS = ['Qualquer', 'Horizontal (16:9)', 'Vertical (9:16)'];
const POPULAR_SEARCHES = ['carro vermelho', 'praia paradisíaca', 'cidade futurista', 'tecnologia', 'natureza 4k', 'futebol'];

export default function MediaSearch({
  query,
  source,
  type,
  orientation,
  loading,
  onQueryChange,
  onSourceChange,
  onTypeChange,
  onOrientationChange,
  onSearch,
}) {
  const handleValidateAndSearch = () => {
    if (!query || query.trim().length < 3) {
      toast.error('❌ Campo obrigatório: Digite um termo de mídia com no mínimo 3 caracteres!');
      return;
    }
    onSearch();
  };

  return (
    <Card title="🔍 Buscar Mídia Stock" subtitle="Pesquise mídias em altíssima resolução nos bancos de dados integrados Pixabay e Pexels">
      <div className="space-y-4">
        {/* Input de Busca + Autocomplete de Buscas Populares */}
        <div className="space-y-2">
          <FormField
            label="Buscar mídia *"
            required
            placeholder="Ex: carro vermelho, praia, natureza..."
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleValidateAndSearch()}
          />

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#B0B0B0] flex items-center gap-1">
              <Sparkles size={10} className="text-[#FF6B6B]" /> Buscas populares:
            </span>
            {POPULAR_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => { onQueryChange(term); onSearch(); }}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[#333333] text-[#B0B0B0] hover:text-white hover:bg-[#444444] transition border border-[#444444]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns de Filtro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-[#444444]/40">
          <Dropdown
            label="Fonte"
            options={SOURCES}
            value={source}
            onChange={e => onSourceChange(e.target.value)}
          />

          <Dropdown
            label="Tipo"
            options={TYPES}
            value={type}
            onChange={e => onTypeChange(e.target.value)}
          />

          <Dropdown
            label="Orientação"
            options={ORIENTATIONS}
            value={orientation}
            onChange={e => onOrientationChange(e.target.value)}
          />

          <div className="flex items-end">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleValidateAndSearch}
              loading={loading}
              ariaLabel="Buscar mídias"
            >
              <Search size={14} /> 🔍 Buscar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
