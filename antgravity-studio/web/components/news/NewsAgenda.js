import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Textarea from '../shared/Textarea';
import Table from '../shared/Table';
import Badge from '../shared/Badge';
import { Search, Brain, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsAgenda({ activeChannel, pautaItems = [], onAddTheme, onDeleteItem }) {
  const [themeInput, setThemeInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchAndAdd = () => {
    if (!themeInput.trim()) { toast.error('Digite um tema para adicionar!'); return; }
    onAddTheme(themeInput.trim());
    setThemeInput('');
    toast.success('Tema adicionado à pauta!');
  };

  const handleFindNeighborTopics = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    const neighbors = [
      `${activeChannel?.name || 'Canal'} — Impacto na Economia Global em 2026`,
      `${activeChannel?.name || 'Canal'} — Repercussão nas Redes Sociais`,
    ];
    neighbors.forEach(n => onAddTheme(n));
    toast.success('🧠 IA encontrou 2 assuntos vizinhos relevantes e adicionou à pauta!');
  };

  const STATUS_BADGES = {
    Novo: 'primary',
    'Em andamento': 'warning',
    Publicado: 'success',
  };

  const columns = [
    {
      header: 'Tema da Notícia',
      cell: (row) => <span className="font-semibold text-white">{row.title}</span>,
    },
    {
      header: 'Data Adicionado',
      cell: (row) => <span className="font-mono text-[#B0B0B0]">{row.addedAt}</span>,
    },
    {
      header: 'Status',
      cell: (row) => <Badge text={row.status} variant={STATUS_BADGES[row.status] || 'default'} />,
    },
    {
      header: 'Ações',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onDeleteItem(row.id)}
            className="p-1.5 rounded hover:bg-[#EF4444]/20 text-[#B0B0B0] hover:text-[#EF4444] transition"
            title="Deletar da pauta"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card title={`📋 Pauta de Conteúdo — ${activeChannel?.name || 'Selecione um Canal'}`} subtitle="Pesquise e gerencie as notícias que serão convertidas em roteiros e vídeos">
        <div className="space-y-4">
          <Textarea
            label={`Pesquisar notícias para ${activeChannel?.name || 'este canal'} (entra na pauta)`}
            placeholder="Ex: futebol pelo mundo, seleção brasileira, mercado da bola, novos patrocinadores..."
            rows={3}
            value={themeInput}
            onChange={e => setThemeInput(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button variant="primary" size="sm" onClick={handleSearchAndAdd}>
              <Search size={14} /> 🔍 Buscar e Adicionar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleFindNeighborTopics} loading={loading}>
              <Brain size={14} className="text-[#A78BFA]" /> 🧠 IA acha assuntos vizinhos
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabela de Itens na Pauta */}
      <div>
        <h3 className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-wider mb-2">
          Notícias na Pauta ({pautaItems.length})
        </h3>
        <Table
          columns={columns}
          data={pautaItems}
          emptyMessage="Nenhuma notícia na pauta deste canal. Adicione novos temas acima!"
        />
      </div>
    </div>
  );
}
