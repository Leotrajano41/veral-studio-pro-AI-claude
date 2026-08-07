import { Play, Pause, X, Trash2, Clock, AlertCircle, ListVideo } from 'lucide-react';

const STATUS_META = {
  pending: { label: '🔵 Pendente', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  processing: { label: '🟡 Processando', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  completed: { label: '🟢 Concluído', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  failed: { label: '🔴 Erro', color: 'text-red-400', bg: 'bg-red-500/10' },
  cancelled: { label: '⚫ Cancelado', color: 'text-[#B0B0B0]', bg: 'bg-gray-500/10' },
  paused: { label: '⏸ Pausado', color: 'text-orange-400', bg: 'bg-orange-500/10' },
};

const ALL_STEPS = [
  { id: 'script', label: '📝 Roteiro' },
  { id: 'narration', label: '🎙️ Voz' },
  { id: 'search', label: '🔍 Busca' },
  { id: 'download', label: '⬇️ Download' },
  { id: 'render', label: '🎬 Render' },
  { id: 'seo', label: '🔎 SEO' },
];

function renderSteps(completedSteps = [], status) {
  return ALL_STEPS.map((step, idx) => {
    const isDone = Array.isArray(completedSteps)
      ? completedSteps.includes(step.id) || idx < completedSteps.length
      : idx < Number(completedSteps);
    const isActive = !isDone && status === 'processing' && idx === (Array.isArray(completedSteps) ? completedSteps.length : Number(completedSteps));

    let symbol = '⏳';
    if (isDone) symbol = '✅';
    else if (isActive) symbol = '🟡';
    else if (status === 'failed' && idx === (Array.isArray(completedSteps) ? completedSteps.length : Number(completedSteps))) symbol = '❌';

    return (
      <span key={step.id} className="inline-flex items-center gap-1 text-[11px] whitespace-nowrap">
        <span>{step.label}</span>
        <span>{symbol}</span>
        {idx < ALL_STEPS.length - 1 && <span className="text-[#444444] mx-1">|</span>}
      </span>
    );
  });
}

export default function QueueTable({ jobs = [], onPlay, onPause, onCancel, onDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-[#B0B0B0] text-xs">
        <ListVideo size={36} className="mx-auto mb-2 text-[#B0B0B0]/30" />
        Nenhum job encontrado nesta aba.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-card border border-[#444444] bg-[#2a2a2a]">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[#444444] text-[#B0B0B0] uppercase tracking-wider font-semibold bg-[#333333]/50">
            <th className="p-3.5 min-w-[180px]">Nome do Vídeo</th>
            <th className="p-3.5">Projeto</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 min-w-[120px]">Progresso</th>
            <th className="p-3.5 min-w-[280px]">Passos</th>
            <th className="p-3.5 min-w-[150px]">Data de Criação</th>
            <th className="p-3.5">Tempo Decorrido</th>
            <th className="p-3.5 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#444444]/50">
          {jobs.map(job => {
            const meta = STATUS_META[job.status] || STATUS_META.pending;
            return (
              <tr key={job.id} className={`hover:bg-[#333333]/40 transition duration-150 ${job.status === 'processing' ? 'bg-[#F59E0B]/5' : ''}`}>
                {/* 1. Nome do Vídeo */}
                <td className="p-3.5 font-semibold text-white">
                  <p className="truncate max-w-[220px]" title={job.name}>{job.name}</p>
                  {job.error_message && (
                    <p className="text-[10px] text-[#EF4444] font-normal mt-0.5 truncate max-w-[220px]" title={job.error_message}>
                      ⚠️ {job.error_message}
                    </p>
                  )}
                </td>

                {/* 2. Projeto */}
                <td className="p-3.5 text-[#B0B0B0]">
                  <span className="bg-[#333333] px-2 py-0.5 rounded border border-[#444444] text-[11px]">
                    {job.project}
                  </span>
                </td>

                {/* 3. Status */}
                <td className="p-3.5 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${meta.bg} ${meta.color} border-current/20`}>
                    {meta.label}
                  </span>
                </td>

                {/* 4. Progresso */}
                <td className="p-3.5">
                  <div className="space-y-1 w-28">
                    <div className="flex justify-between text-[10px] font-mono text-[#B0B0B0]">
                      <span>{job.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#333333] rounded-full overflow-hidden w-full">
                      <div
                        className={`h-full transition-all duration-500 ${job.status === 'completed' ? 'bg-[#10B981]' : job.status === 'failed' ? 'bg-[#EF4444]' : 'bg-[#6366F1]'}`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* 5. Passos */}
                <td className="p-3.5">
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[320px]">
                    {renderSteps(job.steps_completed, job.status)}
                  </div>
                </td>

                {/* 6. Data de Criação */}
                <td className="p-3.5 text-[#B0B0B0] font-mono whitespace-nowrap">
                  {job.created_at}
                </td>

                {/* 7. Tempo Decorrido */}
                <td className="p-3.5 text-[#B0B0B0] font-mono whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-[#B0B0B0]/60" />
                    {job.elapsed_time}
                  </span>
                </td>

                {/* 8. Ações */}
                <td className="p-3.5 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    {(job.status === 'paused' || job.status === 'pending') && (
                      <button
                        onClick={() => onPlay(job.id)}
                        className="p-1.5 rounded hover:bg-[#333333] text-[#10B981] transition"
                        title="▶ Retomar job"
                      >
                        <Play size={14} />
                      </button>
                    )}

                    {job.status === 'processing' && (
                      <button
                        onClick={() => onPause(job.id)}
                        className="p-1.5 rounded hover:bg-[#333333] text-[#F59E0B] transition"
                        title="⏸ Pausar job"
                      >
                        <Pause size={14} />
                      </button>
                    )}

                    {(job.status === 'processing' || job.status === 'pending' || job.status === 'paused') && (
                      <button
                        onClick={() => onCancel(job.id)}
                        className="p-1.5 rounded hover:bg-[#333333] text-[#EF4444] transition"
                        title="✕ Cancelar job"
                      >
                        <X size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(job.id)}
                      className="p-1.5 rounded hover:bg-[#EF4444]/20 text-[#B0B0B0] hover:text-[#EF4444] transition"
                      title="🗑️ Remover job da fila"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
