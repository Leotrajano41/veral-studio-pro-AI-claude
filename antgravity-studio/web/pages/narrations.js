import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import useVoiceovers from '../hooks/useVoiceovers';
import VoiceGenerator from '../components/narrations/VoiceGenerator';
import VoiceResults from '../components/narrations/VoiceResults';
import { Mic } from 'lucide-react';

export default function VoiceoversPage() {
  const {
    recordings,
    loading,
    progress,
    previewingVoice,
    playPreview,
    stopPreview,
    generateVoiceovers,
    downloadAudio,
    deleteAudio,
  } = useVoiceovers();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Mic size={24} className="text-[#FF6B6B]" /> Módulo Narrações (TTS)
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Converta seus roteiros em faixas de áudio narradas por vozes neurais realistas com ajustes de tom, velocidade e volume
            </p>
          </div>
          <Badge text={`${recordings.length} áudio(s)`} variant="primary" />
        </div>

        {/* ── SEÇÃO 1: GERADOR DE NARRAÇÕES ── */}
        <VoiceGenerator
          onGenerate={generateVoiceovers}
          onPlayPreview={playPreview}
          onStopPreview={stopPreview}
          previewingVoice={previewingVoice}
          loading={loading}
          progress={progress}
        />

        {/* ── SEÇÃO 2: RESULTADOS ── */}
        <VoiceResults
          recordings={recordings}
          onDownload={downloadAudio}
          onDelete={deleteAudio}
        />
      </div>
    </Layout>
  );
}
