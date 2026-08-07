import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import useRender from '../hooks/useRender';
import RenderConfig from '../components/render/RenderConfig';
import RenderProgress from '../components/render/RenderProgress';
import { Clapperboard } from 'lucide-react';

export default function RenderPage() {
  const {
    rendering,
    progress,
    currentPhase,
    completedJob,
    startRender,
    openOutputFolder,
    previewVideo,
  } = useRender();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clapperboard size={24} className="text-[#FF6B6B]" /> Módulo Renderizar
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Montagem manual de vídeos com mesclagem de áudio, música de fundo, B-roll e legendas via FFmpeg
            </p>
          </div>
          <Badge text={rendering ? '🎬 Processando...' : 'Pronto para Renderizar'} variant={rendering ? 'warning' : 'primary'} />
        </div>

        {/* ── BARRA DE PROGRESSO & STATUS EM TEMPO REAL ── */}
        <RenderProgress
          rendering={rendering}
          progress={progress}
          currentPhase={currentPhase}
          completedJob={completedJob}
          onOpenFolder={openOutputFolder}
          onPreviewVideo={previewVideo}
        />

        {/* ── PAINEL DE CONFIGURAÇÕES DE ENTRADA, VÍDEO E SAÍDA ── */}
        <RenderConfig
          onStartRender={startRender}
          rendering={rendering}
        />
      </div>
    </Layout>
  );
}
