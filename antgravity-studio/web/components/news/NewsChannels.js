import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import FormField from '../shared/FormField';
import Textarea from '../shared/Textarea';
import Modal from '../shared/Modal';
import { Newspaper, Plus, Edit2, Trash2, Calendar, Tag, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsChannels({ channels = [], activeChannelId, onSelectChannel, onCreateChannel, onDeleteChannel }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [themes, setThemes] = useState('tecnologia, inovação, futebol, economia');

  const handleCreate = () => {
    if (!name.trim()) { toast.error('Nome do canal é obrigatório!'); return; }
    const newChan = {
      id: String(Date.now()),
      name,
      description: desc || 'Canal automatizado de produção de notícias',
      themes: themes.split(',').map(t => t.trim()).filter(Boolean),
      lastVideoDate: 'Nunca',
      pauta: [],
    };
    onCreateChannel(newChan);
    setName('');
    setDesc('');
    setShowModal(false);
    toast.success(`Canal "${newChan.name}" criado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-card bg-[#2a2a2a] border border-[#444444]">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Newspaper size={18} className="text-[#FF6B6B]" /> Meus Canais de Notícias
          </h2>
          <p className="text-xs text-[#B0B0B0] mt-0.5">
            🗞️ Cada canal guarda a pauta, histórico e linha editorial para geração contínua
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> + Novo Canal de Notícias
        </Button>
      </div>

      {/* Grid de Cards de Canais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map(ch => {
          const isActive = ch.id === activeChannelId;
          return (
            <div
              key={ch.id}
              className={`p-5 rounded-card border transition duration-180 flex flex-col justify-between space-y-4 ${isActive ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 shadow-glow' : 'border-[#444444] bg-[#2a2a2a] hover:border-[#FF6B6B]/40'}`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white truncate">{ch.name}</h3>
                  {isActive && <Badge text="Ativo" variant="primary" />}
                </div>

                <p className="text-xs text-[#B0B0B0] line-clamp-1">{ch.description}</p>

                {/* Temas Cobertos (tags) */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {ch.themes?.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-[#333333] text-[#A78BFA] px-2 py-0.5 rounded border border-[#444444]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#444444]/40 space-y-3">
                <div className="flex justify-between items-center text-[11px] text-[#B0B0B0]">
                  <span className="flex items-center gap-1"><Calendar size={11} /> Último vídeo: {ch.lastVideoDate}</span>
                  <span className="font-semibold text-white">{ch.pauta?.length || 0} na pauta</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isActive ? 'primary' : 'secondary'}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => onSelectChannel(ch.id)}
                  >
                    Ver Pauta <ChevronRight size={12} />
                  </Button>
                  <button
                    onClick={() => onDeleteChannel(ch.id)}
                    className="p-2 rounded-card text-[#B0B0B0] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#444444] transition"
                    title="Deletar canal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Criar Novo Canal */}
      {showModal && (
        <Modal title="📺 Criar Novo Canal de Notícias" onClose={() => setShowModal(false)} size="md">
          <div className="space-y-4">
            <FormField
              label="Nome do Canal *"
              required
              placeholder="Ex: Notícias Tech & Negócios"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <FormField
              label="Descrição Curta (1 linha)"
              placeholder="Ex: Resumos diários das maiores inovações e mercado"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />

            <Textarea
              label="Temas Cobertos (separados por vírgula)"
              placeholder="tecnologia, inovação, futebol, economia, ciência"
              rows={2}
              value={themes}
              onChange={e => setThemes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#444444]">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreate}>
                Criar Canal
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
