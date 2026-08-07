import Card from '../shared/Card';
import { Eye, Sparkles } from 'lucide-react';

const POSITION_CLASSES = {
  'Inferior esquerda': 'items-start justify-end p-6 text-left',
  'Inferior centro': 'items-center justify-end p-6 text-center',
  'Inferior direita': 'items-end justify-end p-6 text-right',
  'Superior esquerda': 'items-start justify-start p-6 text-left',
  'Superior centro': 'items-center justify-start p-6 text-center',
  'Superior direita': 'items-end justify-start p-6 text-right',
  Centro: 'items-center justify-center p-6 text-center',
};

const STYLE_CLASSES = {
  '💥 Impacto (contorno grosso)': 'font-black drop-shadow-[0_4px_8px_rgba(0,0,0,1)] uppercase tracking-tight text-stroke',
  '📰 Barra (tarja sólida)': 'bg-black/90 px-4 py-2 font-bold rounded border border-white/20',
  '✨ Neon (brilho na cor)': 'font-black text-shadow-neon uppercase tracking-wide',
  '🫧 Limpo (sem faixa escura)': 'font-bold drop-shadow-md',
};

export default function ThumbnailPreview({ theme, position, colors, style }) {
  const posClass = POSITION_CLASSES[position] || POSITION_CLASSES['Inferior esquerda'];
  const styleClass = STYLE_CLASSES[style] || STYLE_CLASSES['💥 Impacto (contorno grosso)'];

  return (
    <Card title="👁️ Preview da Thumbnail em Tempo Real" subtitle="Simulação instantânea de como a capa do seu vídeo ficará no YouTube">
      <div className="relative aspect-video rounded-card overflow-hidden bg-[#1a1a1a] border border-[#444444] shadow-card flex flex-col justify-between group">
        {/* Background Image Preview */}
        <img
          src="https://picsum.photos/seed/thumb_preview_bg/1280/720"
          alt="Thumbnail Preview"
          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badge */}
        <div className="relative z-10 p-4 flex justify-between items-center">
          <span className="text-[10px] font-bold bg-[#FF6B6B] text-white px-2.5 py-1 rounded shadow flex items-center gap-1">
            <Sparkles size={11} /> PREVIEW AO VIVO (16:9)
          </span>
          <span className="text-[10px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
            1280 x 720 HD
          </span>
        </div>

        {/* Renderizado de Texto Dinâmico conforme Configurações */}
        <div className={`relative z-10 flex flex-col w-full h-full ${posClass}`}>
          <div className="max-w-[85%] space-y-1">
            <span className={`inline-block text-xl sm:text-2xl lg:text-3xl ${styleClass}`} style={{ color: '#FFFFFF' }}>
              {theme || 'SEU TÍTULO IMPACTANTE AQUI'}
            </span>
            <div className="mt-1">
              <span className="text-xs sm:text-sm font-bold bg-[#FF6B6B] text-white px-3 py-1 rounded uppercase tracking-wider shadow">
                VEJA AGORA! 🔥
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
