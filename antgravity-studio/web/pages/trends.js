import { useState } from 'react';
import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import Button from '../components/shared/Button';
import Skeleton from '../components/shared/Skeleton';
import useTrends from '../hooks/useTrends';
import TrendSearch from '../components/trends/TrendSearch';
import TrendCard from '../components/trends/TrendCard';
import CreateProjectModal from '../components/trends/CreateProjectModal';
import { TrendingUp, RefreshCw, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrendsPage() {
  const {
    query,
    source,
    language,
    niche,
    customPrompt,
    sortBy,
    trends,
    loading,
    searchHistory,
    setQuery,
    setSource,
    setLanguage,
    setNiche,
    setCustomPrompt,
    setSortBy,
    executeSearch,
    getHotTrends,
    clearHistory,
  } = useTrends();

  const [selectedTrendForModal, setSelectedTrendForModal] = useState(null);

  const handleCreateProjectClick = (trend) => {
    setSelectedTrendForModal(trend);
  };

  const handleConfirmCreateProject = (projectData) => {
    setSelectedTrendForModal(null);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <TrendingUp size={24} className="text-[#FF6B6B]" /> Módulo Tendências
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Busque materiais virais no YouTube, Notícias e Google em tempo real para criar novos projetos
            </p>
          </div>
          <Badge text={`${trends.length} tendências`} variant="primary" />
        </div>

        {/* ── SEÇÃO 1: FORMULÁRIO DE BUSCA ── */}
        <TrendSearch
          query={query}
          source={source}
          language={language}
          niche={niche}
          customPrompt={customPrompt}
          searchHistory={searchHistory}
          loading={loading}
          onQueryChange={setQuery}
          onSourceChange={setSource}
          onLanguageChange={setLanguage}
          onNicheChange={setNiche}
          onCustomPromptChange={setCustomPrompt}
          onSearch={executeSearch}
          onHotTrends={getHotTrends}
          onClearHistory={clearHistory}
        />

        {/* ── SEÇÃO 2: RESULTADOS DE TENDÊNCIAS ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#B0B0B0] uppercase tracking-wider">
              Resultados ({trends.length})
            </h2>

            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B0B0B0] hidden sm:inline">Ordenar por:</span>
              <select
                className="bg-[#2a2a2a] border border-[#444444] rounded text-xs px-2.5 py-1 text-white outline-none focus:border-[#FF6B6B]"
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); executeSearch(); }}
              >
                <option value="popular">🔥 Mais Popular</option>
                <option value="recente">🕒 Mais Recente</option>
                <option value="comentado">💬 Mais Comentado</option>
              </select>
            </div>
          </div>

          {/* Grid Responsivo (Desktop: 3 colunas, Tablet: 2 colunas, Mobile: 1 coluna) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="p-4 rounded-card border border-[#444444] bg-[#2a2a2a] space-y-3">
                  <Skeleton className="aspect-video w-full rounded" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trends.map(trend => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  onCreateProject={handleCreateProjectClick}
                />
              ))}
            </div>
          )}

          {trends.length === 0 && !loading && (
            <div className="text-center py-12 text-[#B0B0B0] text-xs bg-[#2a2a2a] rounded-card border border-[#444444]">
              Nenhuma tendência encontrada para os critérios informados.
            </div>
          )}
        </div>

        {/* ── SEÇÃO 3: MODAL CRIAR PROJETO A PARTIR DE TENDÊNCIA ── */}
        {selectedTrendForModal && (
          <CreateProjectModal
            trend={selectedTrendForModal}
            onClose={() => setSelectedTrendForModal(null)}
            onConfirm={handleConfirmCreateProject}
          />
        )}
      </div>
    </Layout>
  );
}
