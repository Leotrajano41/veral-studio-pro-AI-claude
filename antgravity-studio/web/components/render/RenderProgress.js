import Button from '../shared/Button';
import { FolderOpen, Play, CheckCircle2, Loader, Clapperboard } from 'lucide-react';

export default function RenderProgress({
  rendering,
  progress,
  currentPhase,
  completedJob,
  onOpenFolder,
  onPreviewVideo,
}) {
  if (!rendering && !completedJob) return null;

  return (
    <div className="p-6 rounded-card bg-[#2a2a2a] border border-[#444444] space-y-5">
      {rendering ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Loader size={18} className="text-[#FF6B6B] animate-spin" /> Renderizando Vídeo via FFmpeg...
            </h3>
            <span className="text-lg font-mono font-bold text-[#FF6B6B]">{progress}%</span>
          </div>

          <p className="text-xs text-[#B0B0B0] font-mono animate-pulse">
            ▶ Status: {currentPhase}
          </p>

          <div className="h-3 bg-[#333333] rounded-full overflow-hidden w-full p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B6B] via-[#A78BFA] to-[#10B981] rounded-full transition-all duration-300 shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : completedJob ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-card bg-[#10B981]/10 border border-[#10B981]/30">
            <CheckCircle2 size={24} className="text-[#10B981] shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Vídeo gerado com sucesso!</p>
              <p className="text-xs font-mono text-[#B0B0B0] truncate mt-0.5">{completedJob.outputPath}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenFolder(completedJob.outputPath)}
            >
              <FolderOpen size={14} /> 📂 Abrir Pasta
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onPreviewVideo(completedJob.outputPath)}
            >
              <Play size={14} /> ▶ Ver Vídeo
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
