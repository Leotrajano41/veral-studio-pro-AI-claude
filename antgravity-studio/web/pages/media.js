import { useState } from 'react';
import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import useMedias from '../hooks/useMedias';
import MediaSearch from '../components/media/MediaSearch';
import MediaGrid from '../components/media/MediaGrid';
import MediaPreview from '../components/media/MediaPreview';
import MediaLibrary from '../components/media/MediaLibrary';
import { Image as ImageIcon } from 'lucide-react';

export default function MediasPage() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'library'
  const [previewItem, setPreviewItem] = useState(null);

  const {
    query,
    source,
    type,
    orientation,
    searchResults,
    libraryList,
    loading,
    setQuery,
    setSource,
    setType,
    setOrientation,
    toggleSelect,
    selectAll,
    clearSelection,
    executeSearch,
    downloadSelected,
    downloadSingle,
    deleteLibraryItem,
  } = useMedias();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ImageIcon size={24} className="text-[#FF6B6B]" /> Módulo Mídias
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Busque mídias stock em Pixabay e Pexels e gerencie sua biblioteca local de downloads
            </p>
          </div>
          <Badge text={`${libraryList.length} mídia(s) na biblioteca`} variant="primary" />
        </div>

        {/* ── NAVEGAÇÃO POR ABAS ── */}
        <div className="flex gap-1 bg-[#2a2a2a] p-1 rounded-card border border-[#444444] max-w-md">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition duration-150 ${activeTab === 'search' ? 'bg-[#FF6B6B] text-white shadow-glow' : 'text-[#B0B0B0] hover:text-white'}`}
          >
            🔍 Em Busca
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition duration-150 ${activeTab === 'library' ? 'bg-[#FF6B6B] text-white shadow-glow' : 'text-[#B0B0B0] hover:text-white'}`}
          >
            📁 Biblioteca ({libraryList.length})
          </button>
        </div>

        {/* ── ABA 1: EM BUSCA ── */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <MediaSearch
              query={query}
              source={source}
              type={type}
              orientation={orientation}
              loading={loading}
              onQueryChange={setQuery}
              onSourceChange={setSource}
              onTypeChange={setType}
              onOrientationChange={setOrientation}
              onSearch={executeSearch}
            />

            <MediaGrid
              items={searchResults}
              loading={loading}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              onClearSelection={clearSelection}
              onDownloadSelected={downloadSelected}
              onPreview={item => setPreviewItem(item)}
            />
          </div>
        )}

        {/* ── ABA 2: BIBLIOTECA LOCAL ── */}
        {activeTab === 'library' && (
          <MediaLibrary
            items={libraryList}
            onDeleteItem={deleteLibraryItem}
          />
        )}

        {/* ── MODAL DE PREVIEW DA MÍDIA ── */}
        {previewItem && (
          <MediaPreview
            item={previewItem}
            onClose={() => setPreviewItem(null)}
            onDownloadSingle={downloadSingle}
          />
        )}
      </div>
    </Layout>
  );
}
