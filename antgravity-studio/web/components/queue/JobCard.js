import { useState } from 'react';
import Badge from '../shared/Badge';
import { Play, Pause, X, Trash2, Clock, MoreVertical, AlertTriangle } from 'lucide-react';

const STATUS_META = {
  pending: { label: '🔵 Pendente', variant: 'default', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  processing: { label: '🟡 Processando', variant: 'warning', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  completed: { label: '🟢 Concluído', variant: 'success', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  failed: { label: '🔴 Erro', variant: 'error', color: 'text-red-400', bg: 'bg-red-500/10' },
  cancelled: { label: '⚫ Cancelado', variant: 'default', color: 'text-[#B0B0B0]', bg: 'bg-gray-500/10' },
  paused: { label: '⏸ Pausado', variant: 'default', color: 'text-orange-400', bg: 'bg-orange-500/10' },
};

const ALL_STEPS_LABELS = ['📝 Roteiro', '🎙️ Voz', '🔍 Busca', '⬇️ Download', '🎬 Render', '🔎 SEO'];

export default function JobCard({ job, onPlay, onPause, onCancel, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const meta = STATUS_META[job.status] || STATUS_META.pending;

  return (
    <div className={`p-4 rounded-card border border-[#444444] bg-[#2a2a2a] space-y-3 transition duration-180 ${job.status === 'processing' ? 'border-[#F59E0B]/40 bg-[#F59E0B]/5' : ''}`}>
      {/* Header com Título e Dropdown */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate" title={job.name}>{job.name}</p>
          <span className="inline-block mt-1 bg-[#333333] px-2 py-0.5 rounded border border-[#444444] text-[10px] text-[#B0B0B0]">
            {job.project}
          </span>
        </div>

        {/* Status Badge + Menu */}
        <div className="flex items-center gap-2 shrink-0 relative">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color} border-current/20`}>
            {meta.label}
          </span>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-[#333333] text-[#B0B0B0] hover:text-white transition"
            aria-label="Opções do job"
          >
            <MoreVertical size={16} />
          </button>

          {/* Dropdown Menu Mobile */}
          {showMenu && (
            <div className="absolute right-0 top-8 z-20 w-36 bg-[#2a2a2a] border border-[#444444] rounded-card shadow-card py-1 text-xs space-y-0.5">
              {(job.status === 'paused' || job.status === 'pending') && (
                <button
                  onClick={() => { onPlay(job.id); setShowMenu(false); }}
                  className="w-full px-3 py-1.5 text-left text-[#10B981] hover:bg-[#333333] flex items-center gap-2"
                >
                  <Play size={12} /> ▶ Retomar
                </button>
              )}

              {job.status === 'processing' && (
                <button
                  onClick={() => { onPause(job.id); setShowMenu(false); }}
                  className="w-full px-3 py-1.5 text-left text-[#F59E0B] hover:bg-[#333333] flex items-center gap-2"
                >
                  <Pause size={12} /> ⏸ Pausar
                </button>
              )}

              {(job.status === 'processing' || job.status === 'pending' || job.status === 'paused') && (
                <button
                  onClick={() => { onCancel(job.id); setShowMenu(false); }}
                  className="w-full px-3 py-1.5 text-left text-[#EF4444] hover:bg-[#333333] flex items-center gap-2"
                >
                  <X size={12} /> ✕ Cancelar
                </button>
              )}

              <button
                onClick={() => { onDelete(job.id); setShowMenu(false); }}
                className="w-full px-3 py-1.5 text-left text-[#B0B0B0] hover:text-[#EF4444] hover:bg-[#333333] flex items-center gap-2 border-t border-[#444444]/40"
              >
                <Trash2 size={12} /> 🗑️ Remover
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mensagem de Erro */}
      {job.error_message && (
        <div className="p-2 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-[11px] text-[#EF4444] flex items-start gap-1">
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          <span>{job.error_message}</span>
        </div>
      )}

      {/* Progresso sempre visível */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-[#B0B0B0]">
          <span>Progresso</span>
          <span className="font-bold text-white">{job.progress}%</span>
        </div>
        <div className="h-2 bg-[#333333] rounded-full overflow-hidden w-full">
          <div
            className={`h-full transition-all duration-500 ${job.status === 'completed' ? 'bg-[#10B981]' : job.status === 'failed' ? 'bg-[#EF4444]' : 'bg-[#FF6B6B]'}`}
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      {/* Passos e Tempo */}
      <div className="flex justify-between items-center text-[10px] text-[#B0B0B0] pt-1 border-t border-[#444444]/40">
        <span className="flex items-center gap-1 font-mono">
          <Clock size={10} /> {job.elapsed_time}
        </span>
        <span className="font-mono text-[#B0B0B0]/60">
          {job.created_at}
        </span>
      </div>
    </div>
  );
}
