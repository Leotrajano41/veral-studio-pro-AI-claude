import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Dropdown from '../shared/Dropdown';
import Badge from '../shared/Badge';
import { Search, Newspaper, ExternalLink, Plus, Flame, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const SECTIONS = [
  'Destaques do dia',
  'País',
  'Mundo',
  'Economia',
  'Tecnologia',
  'Esportes',
  'Entretenimento',
  'Ciência',
  'Saúde',
];

const LANGUAGES = [
  '🇧🇷 Português (Brasil)',
  '🇵🇹 Português (Portugal)',
  '🇺🇸 English',
  '🇪🇸 Español',
  '🇫🇷 Français',
];

const FRESHNESS = ['Últimas 24h', 'Últimos 2 dias', 'Última semana', 'Sem limite'];

const MOCK_NEWS_RESULTS = [
  {
    id: 'n1',
    title: 'Copa do Mundo 2026: FIFA Confirma Estádio da Final e Venda de Ingressos',
    snippet: 'A FIFA anunciou oficialmente a data da grande final no MetLife Stadium e os detalhes para o cadastro de torcedores.',
    source: 'Globo Esporte',
    date: 'Há 2 horas',
    section: 'Esportes',
    url: 'https://ge.globo.com',
    thumbnail: 'https://picsum.photos/seed/copa2026/300/160',
  },
  {
    id: 'n2',
    title: 'Inteligência Artificial Supera Humanos em Diagnósticos Médicos em Novo Teste',
    snippet: 'Pesquisa publicada na Nature demonstra eficácia de 98.7% em detecção precoce de doenças complexas.',
    source: 'Tecmundo',
    date: 'Há 4 horas',
    section: 'Tecnologia',
    url: 'https://tecmundo.com.br',
    thumbnail: 'https://picsum.photos/seed/iamedicina/300/160',
  },
  {
    id: 'n3',
    title: 'Banco Central Anuncia Nova Taxa Selic e Projeção Econômica',
    snippet: 'Copom mantém tendência de ajuste e analistas revisam projeções de inflação para o próximo trimestre.',
    source: 'InfoMoney',
    date: 'Há 6 horas',
    section: 'Economia',
    url: 'https://infomoney.com.br',
    thumbnail: 'https://picsum.photos/seed/selic/300/160',
  },
  {
    id: 'n4',
    title: 'Descoberta Científica Traz Nova Esperança para Tratamento do Envelhecimento',
    snippet: 'Cientistas de Stanford identificam molécula que desacelera a degradação celular em modelos biológicos.',
    source: 'CNN Brasil',
    date: 'Há 8 horas',
    section: 'Ciência',
    url: 'https://cnnbrasil.com.br',
    thumbnail: 'https://picsum.photos/seed/ciencia/300/160',
  },
];

export default function NewsSearch({ onAddToPauta }) {
  const [query, setQuery] = useState('copa do mundo 2026 final');
  const [section, setSection] = useState('Destaques do dia');
  const [language, setLanguage] = useState('🇧🇷 Português (Brasil)');
  const [freshness, setFreshness] = useState('Últimos 2 dias');
  const [results, setResults] = useState(MOCK_NEWS_RESULTS);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    toast.success(`${results.length} notícias encontradas!`);
  };

  const handleHeadlinesNow = async () => {
    setLoading(true);
    setQuery('');
    setSection('Destaques do dia');
    await new Promise(r => setTimeout(r, 500));
    setResults(MOCK_NEWS_RESULTS);
    setLoading(false);
    toast.success('📰 Manchetes de agora atualizadas!');
  };

  return (
    <div className="space-y-6">
      <Card title="🔍 Pesquisar Notícias em Tempo Real" subtitle="Busque manchetes e artigos de grandes portais jornalísticos para transformar em pauta">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <FormField
                label="Buscar notícia"
                placeholder="Ex: copa do mundo 2026 final"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <Dropdown
              label="Seção"
              options={SECTIONS}
              value={section}
              onChange={e => setSection(e.target.value)}
            />

            <Dropdown
              label="Idioma / país"
              options={LANGUAGES}
              value={language}
              onChange={e => setLanguage(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B0B0B0]">Frescor:</span>
              <div className="flex gap-1 overflow-x-auto">
                {FRESHNESS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFreshness(f)}
                    className={`text-xs px-2.5 py-1 rounded transition ${freshness === f ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30' : 'bg-[#333333] text-[#B0B0B0] hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSearch} loading={loading}>
                <Search size={14} /> 🔍 Buscar
              </Button>
              <Button variant="secondary" size="sm" onClick={handleHeadlinesNow} disabled={loading}>
                <Flame size={14} className="text-[#FF6B6B]" /> 📰 Manchetes de Agora
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* List Results */}
      <div className="space-y-3">
        {results.map(item => (
          <div key={item.id} className="p-4 rounded-card border border-[#444444] bg-[#2a2a2a] hover:border-[#FF6B6B]/30 transition duration-180 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3 items-start flex-1 min-w-0">
              <img src={item.thumbnail} alt="" className="w-20 h-14 object-cover rounded bg-[#333333] shrink-0 hidden sm:block" />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge text={item.section} variant="primary" />
                  <span className="text-xs font-semibold text-[#4ECDC4]">{item.source}</span>
                  <span className="text-[11px] text-[#B0B0B0]/60 flex items-center gap-1"><Clock size={10} /> {item.date}</span>
                </div>
                <p className="text-sm font-semibold text-white leading-snug">{item.title}</p>
                <p className="text-xs text-[#B0B0B0] line-clamp-1">{item.snippet}</p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <Button variant="secondary" size="sm" className="flex-1 sm:flex-initial text-xs" onClick={() => onAddToPauta(item)}>
                <Plus size={12} /> + Add à Pauta
              </Button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-card bg-[#333333] text-[#B0B0B0] hover:text-white border border-[#444444] transition"
                title="Abrir matéria original"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
