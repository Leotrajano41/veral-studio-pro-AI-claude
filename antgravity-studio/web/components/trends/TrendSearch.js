import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Dropdown from '../shared/Dropdown';
import Textarea from '../shared/Textarea';
import { Search, Flame, History, Trash2, Sparkles } from 'lucide-react';

const SOURCES = [
  '▶️ YouTube (vídeos)',
  '📰 Notícias (Google News)',
  '🔍 Google',
  '⚙️ Bing',
  '🟡 Yahoo',
  '🦆 DuckDuckGo',
  '🔀 Todos (mesclado)',
];

const LANGUAGES = [
  'Português (Brasil)',
  'English (US)',
  'Español',
  'Français',
  'Deutsch',
  'Italiano',
];

export default function TrendSearch({
  query,
  source,
  language,
  niche,
  customPrompt,
  searchHistory = [],
  loading,
  onQueryChange,
  onSourceChange,
  onLanguageChange,
  onNicheChange,
  onCustomPromptChange,
  onSearch,
  onHotTrends,
  onClearHistory,
}) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Card title="🔍 Buscar Tema / Material" subtitle="Consulte as maiores fontes de dados em tempo real para encontrar temas de alto interesse">
      <div className="space-y-4">
        {/* Input de Busca + Histórico */}
        <div className="relative">
          <FormField
            label="Buscar tema / material"
            placeholder="Ex: GTA VI novidades, Eleições 2026, Investimentos..."
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
          />

          {/* Tag Suggestions do Histórico */}
          {searchHistory.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[#B0B0B0] flex items-center gap-1">
                <History size={10} /> Histórico recente:
              </span>
              {searchHistory.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { onQueryChange(item); onSearch(); }}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-[#333333] text-[#B0B0B0] hover:text-white hover:bg-[#444444] transition border border-[#444444]"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={onClearHistory}
                className="text-[10px] text-[#EF4444] hover:underline ml-1"
                title="Limpar histórico"
              >
                Limpar
              </button>
            </div>
          )}
        </div>

        {/* Dropdowns & Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Dropdown
            label="Fonte"
            options={SOURCES}
            value={source}
            onChange={e => onSourceChange(e.target.value)}
          />

          <Dropdown
            label="Idioma da busca"
            options={LANGUAGES}
            value={language}
            onChange={e => onLanguageChange(e.target.value)}
          />

          <FormField
            label="Nicho (novo projeto) (opcional)"
            placeholder="games, notícias, finanças..."
            value={niche}
            onChange={e => onNicheChange(e.target.value)}
          />

          <div className="flex items-end">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => onSearch()}
              loading={loading}
              ariaLabel="Buscar tendências"
            >
              <Search size={14} /> 🔍 Buscar
            </Button>
          </div>
        </div>

        {/* Textarea Prompt Personalizado & Botão Hot */}
        <div className="space-y-3 pt-1 border-t border-[#444444]/40">
          <Textarea
            label="Prompt personalizado do projeto (opcional)"
            placeholder="Ex: tom investigativo, focar em fatos pouco conhecidos, estrutura com gancho nos 3 primeiros segundos..."
            rows={2}
            value={customPrompt}
            onChange={e => onCustomPromptChange(e.target.value)}
          />

          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onHotTrends}
              disabled={loading}
              ariaLabel="Puxar tendências do momento"
            >
              <Flame size={14} className="text-[#FF6B6B]" /> 🔥 Tendências do Momento
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
