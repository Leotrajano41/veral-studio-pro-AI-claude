import React, { useState } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';

const mockProjects = [
  { id: '1', name: 'Curiosidades do Espaço', niche: 'Ciência', createdAt: new Date().toISOString() },
  { id: '2', name: 'Dicas de Finanças Pessoais', niche: 'Finanças', createdAt: new Date().toISOString() },
  { id: '3', name: 'Receitas Rápidas 1 Minuto', niche: 'Culinária', createdAt: new Date().toISOString() },
];

export default function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('Finanças');

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name) return;
    const newProject = {
      id: Date.now().toString(),
      name,
      niche,
      createdAt: new Date().toISOString(),
    };
    setProjects([newProject, ...projects]);
    setName('');
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Projetos</h1>
          <p className="text-sm text-gray-400">Gerencie seus canais e ideias de vídeos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
        ))}
      </div>

      {/* Modal Criar Projeto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-cardBg border border-cardBorder p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Criar Novo Projeto</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome do Projeto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-cardBorder rounded-lg p-2.5 text-white focus:outline-none focus:border-primary"
                  placeholder="Ex: Canal de Curiosidades"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nicho</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-background border border-cardBorder rounded-lg p-2.5 text-white focus:outline-none focus:border-primary"
                >
                  <option value="Finanças">Finanças</option>
                  <option value="Ciência">Ciência</option>
                  <option value="Culinária">Culinária</option>
                  <option value="Tecnologia">Tecnologia</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button type="submit" className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-medium">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
