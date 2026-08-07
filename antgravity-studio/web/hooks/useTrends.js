import { useState, useEffect, useCallback, useRef } from 'react';
import { trendsService } from '../lib/api';
import toast from 'react-hot-toast';

const MOCK_TRENDS_FULL = [
  {
    id: 't1',
    title: 'GTA VI Novidades: Data Oficial do Trailer 2 e Detalhes do Mapa',
    description: 'Vazamentos confirmam novos detalhes sobre o mapa de Vice City e física de água revolucionária no GTA 6.',
    source: 'YouTube',
    views: '1.2M views',
    comments: '15K comentários',
    score: 98,
    url: 'https://youtube.com/watch?v=gta6_trailer',
    thumbnail: 'https://picsum.photos/seed/gta6/400/225',
    niche: 'games',
    publishedAt: '2026-08-07T10:00:00Z',
  },
  {
    id: 't2',
    title: 'Eleições 2026: Primeiras Pesquisas e Cenários Políticos',
    description: 'Análise detalhada das primeiras pesquisas eleitorais para 2026 e o impacto na economia brasileira.',
    source: 'Notícias (Google News)',
    views: '850K leituras',
    comments: '8.4K compartilhamentos',
    score: 94,
    url: 'https://news.google.com',
    thumbnail: 'https://picsum.photos/seed/eleicoes2026/400/225',
    niche: 'notícias',
    publishedAt: '2026-08-07T08:30:00Z',
  },
  {
    id: 't3',
    title: 'Como Fazer R$ 10.000 com IA em 30 Dias (Método 2026)',
    description: 'Estratégia comprovada de automação de vídeos virais usando modelos generativos de inteligência artificial.',
    source: 'YouTube',
    views: '2.4M views',
    comments: '32K comentários',
    score: 99,
    url: 'https://youtube.com',
    thumbnail: 'https://picsum.photos/seed/ia10k/400/225',
    niche: 'finanças',
    publishedAt: '2026-08-06T14:00:00Z',
  },
  {
    id: 't4',
    title: '5 Ferramentas de IA que Vão Substituir Apps Tradicionais',
    description: 'Descubra softwares gratuitos que automatizam relatórios, design e geração de vídeos em segundos.',
    source: 'Google',
    views: '620K buscas',
    comments: '4.1K menções',
    score: 89,
    url: 'https://google.com',
    thumbnail: 'https://picsum.photos/seed/appsia/400/225',
    niche: 'tecnologia',
    publishedAt: '2026-08-06T18:00:00Z',
  },
  {
    id: 't5',
    title: 'Dieta Cetogênica: O que os Médicos Revelaram em 2026',
    description: 'Estudo de Harvard avalia os benefícios da dieta keto para perda de peso rápida e energia constante.',
    source: 'Bing',
    views: '410K buscas',
    comments: '2.9K comentários',
    score: 85,
    url: 'https://bing.com',
    thumbnail: 'https://picsum.photos/seed/dietaketo/400/225',
    niche: 'saúde',
    publishedAt: '2026-08-05T12:00:00Z',
  },
  {
    id: 't6',
    title: 'Cripto 2026: Vale a Pena Investir? Análise de Mercado',
    description: 'Especialistas projetam o comportamento do Bitcoin e altcoins para o segundo semestre de 2026.',
    source: 'Yahoo',
    views: '930K leituras',
    comments: '11K comentários',
    score: 92,
    url: 'https://finance.yahoo.com',
    thumbnail: 'https://picsum.photos/seed/cripto2026/400/225',
    niche: 'finanças',
    publishedAt: '2026-08-05T16:00:00Z',
  },
];

export function useTrends() {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('▶️ YouTube (vídeos)');
  const [language, setLanguage] = useState('Português (Brasil)');
  const [niche, setNiche] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'recente' | 'comentado'

  const [trends, setTrends] = useState(MOCK_TRENDS_FULL);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const debounceTimerRef = useRef(null);

  // Carregar histórico do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const history = JSON.parse(localStorage.getItem('antgravity_trends_history') || '[]');
        setSearchHistory(history);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Salvar no histórico de busca (máximo 10)
  const saveSearchHistory = useCallback((term) => {
    if (!term.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 10);
      if (typeof window !== 'undefined') {
        localStorage.setItem('antgravity_trends_history', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const clearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('antgravity_trends_history');
    }
    toast('Histórico de busca limpo.');
  };

  // Buscar tendências com debouncing
  const executeSearch = useCallback(async (searchTerm = query) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    let filtered = MOCK_TRENDS_FULL;
    if (searchTerm.trim()) {
      saveSearchHistory(searchTerm);
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (niche.trim()) {
      filtered = filtered.filter(t => t.niche.toLowerCase().includes(niche.toLowerCase()));
    }

    // Ordenação
    if (sortBy === 'recente') {
      filtered = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'comentado') {
      filtered = [...filtered].sort((a, b) => b.score - a.score);
    } else {
      filtered = [...filtered].sort((a, b) => b.score - a.score);
    }

    setTrends(filtered.length > 0 ? filtered : MOCK_TRENDS_FULL);
    setLoading(false);
  }, [query, niche, sortBy, saveSearchHistory]);

  // Debouncing na busca (500ms delay)
  const handleQueryChange = (val) => {
    setQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (val.length >= 3 || val.length === 0) {
        executeSearch(val);
      }
    }, 500);
  };

  const getHotTrends = async () => {
    setLoading(true);
    setQuery('GTA VI');
    await new Promise(r => setTimeout(r, 500));
    setTrends(MOCK_TRENDS_FULL);
    setLoading(false);
    toast.success('🔥 Tendências do momento atualizadas!');
  };

  return {
    query,
    source,
    language,
    niche,
    customPrompt,
    sortBy,
    trends,
    loading,
    searchHistory,
    setQuery: handleQueryChange,
    setSource,
    setLanguage,
    setNiche,
    setCustomPrompt,
    setSortBy,
    executeSearch,
    getHotTrends,
    clearHistory,
  };
}

export default useTrends;
