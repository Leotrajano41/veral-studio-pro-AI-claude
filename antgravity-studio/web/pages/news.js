import { useState } from 'react';
import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import NewsSearch from '../components/news/NewsSearch';
import NewsChannels from '../components/news/NewsChannels';
import NewsAgenda from '../components/news/NewsAgenda';
import NewsConfig from '../components/news/NewsConfig';
import { Newspaper } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_CHANNELS = [
  {
    id: 'ch1',
    name: 'Canal Notícias Tech BR',
    description: 'Resumos diários sobre IA, tecnologia e inovação no Brasil',
    themes: ['tecnologia', 'ia', 'startups', 'inovação'],
    lastVideoDate: '2026-08-06',
    pauta: [
      { id: 'p1', title: 'IA Supera Humanos em Diagnósticos Médicos', addedAt: '07 de ago. 10:30', status: 'Novo' },
      { id: 'p2', title: 'Startup Levanta R$ 100 Milhões para Expansão', addedAt: '07 de ago. 09:15', status: 'Em andamento' },
    ],
  },
  {
    id: 'ch2',
    name: 'Shorts de Notícias Virais',
    description: 'Manchetes rápidas em formato vertical de 60 segundos',
    themes: ['esportes', 'futebol', 'copa2026'],
    lastVideoDate: '2026-08-05',
    pauta: [
      { id: 'p3', title: 'Copa do Mundo 2026: FIFA Confirma Estádio da Final', addedAt: '07 de ago. 11:00', status: 'Novo' },
    ],
  },
];

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('ch1');

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  const handleAddToPautaFromSearch = (newsItem) => {
    const newItem = {
      id: String(Date.now()),
      title: newsItem.title,
      addedAt: 'Hoje 10:30',
      status: 'Novo',
    };
    setChannels(prev => prev.map(c => c.id === activeChannel.id ? { ...c, pauta: [newItem, ...(c.pauta || [])] } : c));
    toast.success(`Notícia adicionada à pauta do canal "${activeChannel.name}"!`);
  };

  const handleCreateChannel = (newChannel) => {
    setChannels(prev => [...prev, newChannel]);
    setActiveChannelId(newChannel.id);
  };

  const handleDeleteChannel = (id) => {
    setChannels(prev => prev.filter(c => c.id !== id));
    toast('Canal removido.');
  };

  const handleAddThemeToAgenda = (themeTitle) => {
    const newItem = {
      id: String(Date.now()),
      title: themeTitle,
      addedAt: 'Hoje 10:30',
      status: 'Novo',
    };
    setChannels(prev => prev.map(c => c.id === activeChannel.id ? { ...c, pauta: [newItem, ...(c.pauta || [])] } : c));
  };

  const handleDeleteAgendaItem = (itemId) => {
    setChannels(prev => prev.map(c => c.id === activeChannel.id ? { ...c, pauta: (c.pauta || []).filter(p => p.id !== itemId) } : c));
    toast('Item removido da pauta.');
  };

  const handleProduceSelected = (config) => {
    const itemCount = activeChannel?.pauta?.length || 0;
    if (itemCount === 0) {
      toast.error('Nenhuma notícia na pauta para produzir!');
      return;
    }
    toast.success(`🎬 Iniciando produção de ${itemCount} notícia(s) na Fila! Redirecionando...`);
    setTimeout(() => {
      window.location.href = '/queue';
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Newspaper size={24} className="text-[#6366F1]" /> 📰 Notícias
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Busque notícias em tempo real, gerencie pautas e produza vídeos jornalísticos automáticos
            </p>
          </div>
          <Badge text={`Canal ativo: ${activeChannel?.name || 'Nenhum'}`} variant="primary" />
        </div>

        {/* ── NAVEGAÇÃO POR ABAS (4 Abas) ── */}
        <div className="flex gap-1 bg-[#1E293B] p-1 rounded-card border border-[#334155] overflow-x-auto">
          {[
            { id: 'search', label: '🔍 1. Buscar Notícias' },
            { id: 'channels', label: `📺 2. Canais (${channels.length})` },
            { id: 'pauta', label: `📋 3. Pauta (${activeChannel?.pauta?.length || 0})` },
            { id: 'config', label: '⚙️ 4. Configuração do Canal' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition duration-150 ${activeTab === tab.id ? 'bg-[#6366F1] text-white shadow-glow' : 'text-[#94A3B8] hover:text-white hover:bg-[#334155]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── ABA 1: BUSCA DE NOTÍCIAS ── */}
        {activeTab === 'search' && (
          <NewsSearch onAddToPauta={handleAddToPautaFromSearch} />
        )}

        {/* ── ABA 2: CANAIS DE NOTÍCIAS ── */}
        {activeTab === 'channels' && (
          <NewsChannels
            channels={channels}
            activeChannelId={activeChannelId}
            onSelectChannel={(id) => { setActiveChannelId(id); setActiveTab('pauta'); }}
            onCreateChannel={handleCreateChannel}
            onDeleteChannel={handleDeleteChannel}
          />
        )}

        {/* ── ABA 3: PAUTA DO CANAL ── */}
        {activeTab === 'pauta' && (
          <NewsAgenda
            activeChannel={activeChannel}
            pautaItems={activeChannel?.pauta || []}
            onAddTheme={handleAddThemeToAgenda}
            onDeleteItem={handleDeleteAgendaItem}
          />
        )}

        {/* ── ABA 4: CONFIGURAÇÃO DO CANAL ── */}
        {activeTab === 'config' && (
          <NewsConfig onProduceSelected={handleProduceSelected} />
        )}
      </div>
    </Layout>
  );
}
