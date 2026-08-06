import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import ProjectGrid from '../components/projects/ProjectGrid';
import ProjectFilters from '../components/projects/ProjectFilters';
import NewProjectModal from '../components/projects/NewProjectModal';
import Button from '../components/common/Button';
import { Plus } from 'lucide-react';

const seed = [
  { id: '1', name: 'Canal Espacial', niche: 'education', videoCount: 12, createdAt: '2026-07-01T10:00:00Z' },
  { id: '2', name: 'FinanceHub', niche: 'finance', videoCount: 8, createdAt: '2026-07-10T14:30:00Z' },
  { id: '3', name: 'GamerFlix', niche: 'games', videoCount: 24, createdAt: '2026-06-15T09:00:00Z' },
  { id: '4', name: 'Receitas Express', niche: 'food', videoCount: 5, createdAt: '2026-07-22T12:00:00Z' },
  { id: '5', name: 'FitPulse', niche: 'fitness', videoCount: 15, createdAt: '2026-08-01T08:00:00Z' },
  { id: '6', name: 'TechBites', niche: 'entertainment', videoCount: 3, createdAt: '2026-08-03T16:00:00Z' },
];

export default function Projects() {
  const [projects, setProjects] = useState(seed);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.niche === filter);

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Projeto removido.');
  };

  const handleCreate = (data) => {
    const newP = { id: Date.now().toString(), ...data, videoCount: 0, createdAt: new Date().toISOString() };
    setProjects((prev) => [newP, ...prev]);
    toast.success('Projeto criado!');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary">Meus Projetos</h1>
            <p className="text-sm text-txt-secondary">{projects.length} projetos cadastrados</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setModal(true)}>
            <Plus size={16} /> Novo Projeto
          </Button>
        </div>

        <ProjectFilters active={filter} onChange={setFilter} />
        <ProjectGrid projects={filtered} onDelete={handleDelete} />
        <NewProjectModal isOpen={modal} onClose={() => setModal(false)} onSave={handleCreate} />
      </div>
    </Layout>
  );
}
