import { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/shared/Button';
import { useQueue } from '../hooks/useQueue';
import QueueTable from '../components/queue/QueueTable';
import JobCard from '../components/queue/JobCard';
import { ListVideo, Play, Pause } from 'lucide-react';

const QUEUE_TABS = [
  { id: 'todos', label: 'Todos' },
  { id: 'execucao', label: 'Em execução' },
  { id: 'concluidos', label: 'Concluídos' },
  { id: 'erro', label: 'Cancelados/Erro' },
  { id: 'fila', label: 'Na Fila' },
];

export default function QueuePage() {
  const {
    jobs,
    isGlobalPaused,
    toggleGlobalPause,
    resumeJob,
    pauseJob,
    cancelJob,
    deleteJob,
  } = useQueue(5000); // 5s real-time polling

  const [activeTab, setActiveTab] = useState('todos');

  // Filter Jobs by Tab
  const filteredJobs = jobs.filter(j => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'execucao') return j.status === 'processing';
    if (activeTab === 'concluidos') return j.status === 'completed';
    if (activeTab === 'erro') return j.status === 'failed' || j.status === 'cancelled';
    if (activeTab === 'fila') return j.status === 'pending' || j.status === 'paused';
    return true;
  });

  const processingCount = jobs.filter(j => j.status === 'processing').length;
  const pendingCount = jobs.filter(j => j.status === 'pending').length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ListVideo size={24} className="text-[#FF6B6B]" /> 🎬 Fila de Produção
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              <span className="text-[#F59E0B] font-semibold">{processingCount} em produção</span>
              {' · '}até 2 em paralelo
              {pendingCount > 0 && <> · <span className="text-[#B0B0B0]">{pendingCount} na fila</span></>}
            </p>
          </div>

          {/* Botões de Controle Globais */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleGlobalPause}
              disabled={isGlobalPaused}
              ariaLabel="Pausar fila inteira"
            >
              <Pause size={14} className="text-[#F59E0B]" /> ⏸ Pausar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={toggleGlobalPause}
              disabled={!isGlobalPaused}
              ariaLabel="Continuar fila inteira"
            >
              <Play size={14} /> ▶ Continuar
            </Button>
          </div>
        </div>

        {/* Banner de Fila Pausada */}
        {isGlobalPaused && (
          <div className="p-3 rounded-card bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-between text-xs text-[#F59E0B]">
            <span className="flex items-center gap-2 font-medium">
              <Pause size={14} /> Fila inteira está PAUSADA. Novas tarefas aguardarão a retomada.
            </span>
            <button onClick={toggleGlobalPause} className="underline font-bold hover:text-white">
              Retomar Agora →
            </button>
          </div>
        )}

        {/* Abas de Filtro (5 Abas) */}
        <div className="flex gap-1 bg-[#2a2a2a] p-1 rounded-card border border-[#444444] overflow-x-auto">
          {QUEUE_TABS.map(tab => {
            const counts = {
              todos: jobs.length,
              execucao: processingCount,
              concluidos: jobs.filter(j => j.status === 'completed').length,
              erro: jobs.filter(j => j.status === 'failed' || j.status === 'cancelled').length,
              fila: jobs.filter(j => j.status === 'pending' || j.status === 'paused').length,
            };
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold whitespace-nowrap transition duration-150 ${activeTab === tab.id ? 'bg-[#FF6B6B] text-white shadow-glow' : 'text-[#B0B0B0] hover:text-white hover:bg-[#333333]'}`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#333333] text-[#B0B0B0]'}`}>
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop View (Tabela 8 colunas) */}
        <div className="hidden lg:block">
          <QueueTable
            jobs={filteredJobs}
            onPlay={resumeJob}
            onPause={pauseJob}
            onCancel={cancelJob}
            onDelete={deleteJob}
          />
        </div>

        {/* Mobile View (Cards) */}
        <div className="block lg:hidden space-y-3">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onPlay={resumeJob}
              onPause={pauseJob}
              onCancel={cancelJob}
              onDelete={deleteJob}
            />
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-[#B0B0B0] text-xs bg-[#2a2a2a] rounded-card border border-[#444444]">
              Nenhum job encontrado nesta aba.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
