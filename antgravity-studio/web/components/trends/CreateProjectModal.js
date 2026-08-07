import { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Textarea from '../shared/Textarea';
import Dropdown from '../shared/Dropdown';
import toast from 'react-hot-toast';

const NICHES = ['games', 'notícias', 'finanças', 'tecnologia', 'saúde', 'motivação', 'culinária', 'entretenimento'];

export default function CreateProjectModal({ trend, onClose, onConfirm }) {
  const [name, setName] = useState(trend?.title || '');
  const [nicho, setNicho] = useState(trend?.niche || 'tecnologia');
  const [urls, setUrls] = useState(trend?.url || '');
  const [temaPadrao, setTemaPadrao] = useState(trend?.title || '');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('O Nome do Projeto é obrigatório!');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));

    const projectData = {
      name,
      nicho,
      urls_referencia: urls.split('\n').filter(u => u.trim()),
      tema_padrao: temaPadrao,
    };

    onConfirm(projectData);
    setSaving(false);
    toast.success(`📁 Projeto "${name.slice(0, 25)}..." criado com sucesso! Redirecionando...`);
    setTimeout(() => {
      window.location.href = '/projects';
    }, 800);
  };

  return (
    <Modal title="📁 Criar Projeto a partir de Tendência" onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* Banner do item de tendência */}
        <div className="flex gap-3 p-3 rounded-card bg-[#333333]/50 border border-[#444444]">
          <img src={trend?.thumbnail} alt="" className="w-24 h-14 object-cover rounded shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{trend?.title}</p>
            <p className="text-[11px] text-[#FF6B6B] mt-0.5">{trend?.source} · {trend?.views}</p>
          </div>
        </div>

        {/* Form Inputs Auto-preenchidos */}
        <FormField
          label="Nome do Projeto *"
          required
          placeholder="Ex: GTA VI Novidades"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Dropdown
            label="Nicho (detectado)"
            options={NICHES}
            value={nicho}
            onChange={e => setNicho(e.target.value)}
          />

          <FormField
            label="Tema Padrão"
            placeholder="Assunto principal do projeto"
            value={temaPadrao}
            onChange={e => setTemaPadrao(e.target.value)}
          />
        </div>

        <Textarea
          label="URLs de Referência (adicionadas automaticamente)"
          rows={3}
          value={urls}
          onChange={e => setUrls(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-[#444444]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleCreate} loading={saving}>
            Criar Projeto
          </Button>
        </div>
      </div>
    </Modal>
  );
}
