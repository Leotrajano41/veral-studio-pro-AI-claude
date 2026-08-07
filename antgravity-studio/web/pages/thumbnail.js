import { useState } from 'react';
import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import useThumbnail from '../hooks/useThumbnail';
import ThumbnailConfig from '../components/thumbnail/ThumbnailConfig';
import ThumbnailPreview from '../components/thumbnail/ThumbnailPreview';
import ThumbnailResults from '../components/thumbnail/ThumbnailResults';
import { Image as ImageIcon } from 'lucide-react';

export default function ThumbnailPage() {
  const {
    thumbnails,
    loading,
    progress,
    generateThumbnails,
    downloadThumbnail,
    deleteThumbnail,
  } = useThumbnail();

  const [previewState, setPreviewState] = useState({
    theme: '5 Segredos para Investir em 2026',
    position: 'Inferior esquerda',
    colors: '⚪🟡 Branco + Amarelo',
    style: '💥 Impacto (contorno grosso)',
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ImageIcon size={24} className="text-[#6366F1]" /> 🖼️ Thumbnail
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Gere capas virais automáticas para seus vídeos do YouTube usando modelos de IA generativa e testes A/B
            </p>
          </div>
          <Badge text={`${thumbnails.length} capa(s)`} variant="primary" />
        </div>

        {/* ── SEÇÃO 3: PREVIEW EM TEMPO REAL ── */}
        <ThumbnailPreview
          theme={previewState.theme}
          position={previewState.position}
          colors={previewState.colors}
          style={previewState.style}
        />

        {/* ── SEÇÃO 1 & 2: CONFIGURAÇÃO DE TEMA, PROVEDOR IA & DESIGN ── */}
        <ThumbnailConfig
          onGenerate={generateThumbnails}
          onChangePreview={setPreviewState}
          loading={loading}
          progress={progress}
        />

        {/* ── SEÇÃO 4: RESULTADOS & AÇÕES ── */}
        <ThumbnailResults
          thumbnails={thumbnails}
          onDownload={downloadThumbnail}
          onDelete={deleteThumbnail}
        />
      </div>
    </Layout>
  );
}
