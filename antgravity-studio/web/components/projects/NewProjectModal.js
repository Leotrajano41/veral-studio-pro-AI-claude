import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { NICHES } from '../../lib/constants';

export default function NewProjectModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('entertainment');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, niche, description });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Projeto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome do Projeto" placeholder="Ex: Canal de Curiosidades" value={name} onChange={(e) => setName(e.target.value)} required />
        <Select label="Nicho" options={NICHES} value={niche} onChange={(e) => setNiche(e.target.value)} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-txt-secondary">Descrição (opcional)</label>
          <textarea
            className="input-base min-h-[80px] resize-none"
            placeholder="Descreva brevemente o objetivo do projeto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" size="sm" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" size="sm">Salvar Projeto</Button>
        </div>
      </form>
    </Modal>
  );
}
