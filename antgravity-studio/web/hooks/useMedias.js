import { useState, useEffect, useCallback, useRef } from 'react';
import { mediaService } from '../lib/api';
import toast from 'react-hot-toast';

const MOCK_SEARCH_MEDIA = Array.from({ length: 16 }, (_, i) => ({
  id: `sm-${i + 1}`,
  name: i % 2 === 0 ? `carro_vermelho_esportivo_${i + 1}.mp4` : `praia_paradisíaca_${i + 1}.jpg`,
  type: i % 2 === 0 ? 'video' : 'image',
  source: i % 3 === 0 ? 'Pixabay' : i % 3 === 1 ? 'Pexels' : 'Pixabay',
  sourceUrl: 'https://pixabay.com',
  thumb: `https://picsum.photos/seed/${300 + i}/360/200`,
  fullUrl: `https://picsum.photos/seed/${300 + i}/1280/720`,
  resolution: i % 2 === 0 ? '1920x1080 · 1080p' : '3840x2160 · 4K',
  sizeMb: `${(Math.random() * 25 + 2).toFixed(1)} MB`,
  selected: false,
}));

const MOCK_LIBRARY_MEDIA = [
  {
    id: 'lib-1',
    name: 'carro_esportivo_fundo.mp4',
    type: 'video',
    source: 'Pexels',
    localPath: '/downloads/medias/carro_esportivo_fundo.mp4',
    size: '24.5 MB',
    resolution: '1920x1080',
    downloadedAt: '07 de ago. de 2026 10:30',
    thumb: 'https://picsum.photos/seed/lib1/120/68',
  },
  {
    id: 'lib-2',
    name: 'cidade_futurista_noite.jpg',
    type: 'image',
    source: 'Pixabay',
    localPath: '/downloads/medias/cidade_futurista_noite.jpg',
    size: '3.2 MB',
    resolution: '3840x2160',
    downloadedAt: '06 de ago. de 2026 16:45',
    thumb: 'https://picsum.photos/seed/lib2/120/68',
  },
  {
    id: 'lib-3',
    name: 'grafico_financas_animado.mp4',
    type: 'video',
    source: 'Pixabay',
    localPath: '/downloads/medias/grafico_financas_animado.mp4',
    size: '18.1 MB',
    resolution: '1920x1080',
    downloadedAt: '05 de ago. de 2026 14:20',
    thumb: 'https://picsum.photos/seed/lib3/120/68',
  },
];

export function useMedias() {
  const [query, setQuery] = useState('carro vermelho');
  const [source, setSource] = useState('📷 Pixabay');
  const [type, setType] = useState('Ambas');
  const [orientation, setOrientation] = useState('Qualquer');

  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_MEDIA);
  const [libraryList, setLibraryList] = useState(MOCK_LIBRARY_MEDIA);
  const [loading, setLoading] = useState(false);
  const [downloadProgressMap, setDownloadProgressMap] = useState({});

  const debounceTimerRef = useRef(null);

  // Search function with Debouncing
  const executeSearch = useCallback(async (searchTerm = query) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    let filtered = MOCK_SEARCH_MEDIA;
    if (searchTerm.trim()) {
      filtered = filtered.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (type === 'Vídeos') filtered = filtered.filter(m => m.type === 'video');
    if (type === 'Imagens') filtered = filtered.filter(m => m.type === 'image');

    setSearchResults(filtered.length > 0 ? filtered : MOCK_SEARCH_MEDIA);
    setLoading(false);
  }, [query, type]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(val);
    }, 500);
  };

  // Checkbox selection
  const toggleSelect = (id) => {
    setSearchResults(prev => prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m));
  };

  const selectAll = () => {
    setSearchResults(prev => prev.map(m => ({ ...m, selected: true })));
    toast.success('✅ Todas as mídias selecionadas!');
  };

  const clearSelection = () => {
    setSearchResults(prev => prev.map(m => ({ ...m, selected: false })));
    toast('❌ Seleção limpa.');
  };

  // Parallel Download
  const downloadSelected = async () => {
    const selectedItems = searchResults.filter(m => m.selected);
    if (selectedItems.length === 0) {
      toast.error('Selecione ao menos uma mídia!');
      return;
    }

    toast.success(`⬇️ Baixando ${selectedItems.length} mídia(s) em paralelo...`);

    const newDownloaded = selectedItems.map(m => ({
      id: `lib-${Date.now()}-${m.id}`,
      name: m.name,
      type: m.type,
      source: m.source,
      localPath: `/downloads/medias/${m.name}`,
      size: m.sizeMb,
      resolution: m.resolution.split(' ')[0],
      downloadedAt: new Date().toLocaleString('pt-BR'),
      thumb: m.thumb,
    }));

    setLibraryList(prev => [...newDownloaded, ...prev]);
    clearSelection();
  };

  const downloadSingle = (item) => {
    const newItem = {
      id: `lib-${Date.now()}-${item.id}`,
      name: item.name,
      type: item.type,
      source: item.source,
      localPath: `/downloads/medias/${item.name}`,
      size: item.sizeMb,
      resolution: item.resolution.split(' ')[0],
      downloadedAt: new Date().toLocaleString('pt-BR'),
      thumb: item.thumb,
    };
    setLibraryList(prev => [newItem, ...prev]);
    toast.success(`⬇️ ${item.name} baixado para a biblioteca!`);
  };

  const deleteLibraryItem = (id) => {
    setLibraryList(prev => prev.filter(m => m.id !== id));
    toast('Mídia removida da biblioteca.');
  };

  return {
    query,
    source,
    type,
    orientation,
    searchResults,
    libraryList,
    loading,
    setQuery: handleQueryChange,
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
  };
}

export default useMedias;
