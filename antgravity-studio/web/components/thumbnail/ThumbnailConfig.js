import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Textarea from '../shared/Textarea';
import Dropdown from '../shared/Dropdown';
import { Palette, Sparkles, Flame, Loader, Wand2 } from 'lucide-react';

const SOURCES = [
  '✨ Automático (IA gera)',
  '🌐 Openverse (grátis, CC)',
  '📷 Pixabay',
  '📸 Pexels',
  '🆓 Meta AI (imagem grátis via cookies)',
  '🎨 Nano Banana 2 (Gemini Image) - melhor thumb',
  '🎨 Grok Imagine (xAI) - mais barato',
  '🎨 Seedream 4.5 (Bytedance)',
];

const COUNTS = [
  '1 thumbnail (recomendado)',
  '2 thumbnails (teste A/B)',
  '3 thumbnails (teste A/B/C)',
];

const POSITIONS = [
  'Inferior esquerda',
  'Inferior centro',
  'Inferior direita',
  'Superior esquerda',
  'Superior centro',
  'Superior direita',
  'Centro',
];

const HIGHLIGHT_COLORS = [
  '🟡 Amarelo',
  '🔴 Vermelho',
  '🔵 Ciano',
  '🟢 Verde-limão',
  '🟠 Laranja',
  '🩷 Rosa',
  '⚪ Branco',
];

const TEXT_COLORS = [
  '⚪🟡 Branco + Amarelo',
  '⚪🔵 Branco + Ciano',
  '⚪🔴 Branco + Vermelho',
  '🟡⚫ Amarelo + Preto',
  '⚪🟢 Branco + Verde',
];

const STYLES = [
  '💥 Impacto (contorno grosso)',
  '📰 Barra (tarja sólida)',
  '✨ Neon (brilho na cor)',
  '🫧 Limpo (sem faixa escura)',
];

export default function ThumbnailConfig({
  onGenerate,
  onChangePreview,
  loading,
  progress,
}) {
  // SEÇÃO 1: CONFIGURAÇÃO
  const [theme, setTheme] = useState('5 Segredos para Investir em 2026');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('✨ Automático (IA gera)');
  const [count, setCount] = useState('1 thumbnail (recomendado)');

  // SEÇÃO 2: DESIGN
  const [position, setPosition] = useState('Inferior esquerda');
  const [highlightColor, setHighlightColor] = useState('🟡 Amarelo');
  const [textColors, setTextColors] = useState('⚪🟡 Branco + Amarelo');
  const [style, setStyle] = useState('💥 Impacto (contorno grosso)');
  const [universalPrompt, setUniversalPrompt] = useState('');

  const updatePreview = (newTheme, newPos, newCol, newSty) => {
    onChangePreview({
      theme: newTheme !== undefined ? newTheme : theme,
      position: newPos !== undefined ? newPos : position,
      colors: newCol !== undefined ? newCol : textColors,
      style: newSty !== undefined ? newSty : style,
    });
  };

  const handleGenerateClick = () => {
    onGenerate({
      theme,
      description,
      source,
      count: count.includes('2') ? 2 : count.includes('3') ? 3 : 1,
      position,
      highlightColor,
      colors: textColors,
      style,
      universalPrompt,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── SEÇÃO 1: CONFIGURAÇÃO ── */}
      <Card title="1. ⚙️ Configuração Principal" subtitle="Defina o tema do vídeo e o provedor de IA generativa de imagens">
        <div className="space-y-4">
          <FormField
            label="Tema do Vídeo *"
            required
            placeholder="Ex: 5 Segredos para Investir"
            value={theme}
            onChange={e => {
              setTheme(e.target.value);
              updatePreview(e.target.value, undefined, undefined, undefined);
            }}
            helpText="Será usado para gerar a capa e o texto de alto impacto"
          />

          <Textarea
            label="Descrição Adicional (opcional)"
            rows={2}
            placeholder="Informações extras que ajudam no design (ex: homem chocado apontando para um gráfico subindo)..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label="Fonte Primária de Imagem"
              options={SOURCES}
              value={source}
              onChange={e => setSource(e.target.value)}
            />

            <Dropdown
              label="Quantas thumbnails gerar?"
              options={COUNTS}
              value={count}
              onChange={e => setCount(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* ── SEÇÃO 2: DESIGN ── */}
      <Card title="2. 🎨 Design & Estilização do Texto" subtitle="Ajuste a posição, esquema de cores e estilo visual da capa">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Dropdown
              label="Posição do Texto"
              options={POSITIONS}
              value={position}
              onChange={e => {
                setPosition(e.target.value);
                updatePreview(undefined, e.target.value, undefined, undefined);
              }}
            />

            <Dropdown
              label="Cor de Destaque"
              options={HIGHLIGHT_COLORS}
              value={highlightColor}
              onChange={e => setHighlightColor(e.target.value)}
            />

            <Dropdown
              label="Cores do Texto (2 contrastantes)"
              options={TEXT_COLORS}
              value={textColors}
              onChange={e => {
                setTextColors(e.target.value);
                updatePreview(undefined, undefined, e.target.value, undefined);
              }}
            />

            <Dropdown
              label="Estilo do Texto"
              options={STYLES}
              value={style}
              onChange={e => {
                setStyle(e.target.value);
                updatePreview(undefined, undefined, undefined, e.target.value);
              }}
            />
          </div>

          <Textarea
            label="Prompt Universal da Capa (opcional)"
            rows={2}
            placeholder="Personalização de design (ex: estilo cyberpunk com luzes de neon azuis e amarelas)..."
            value={universalPrompt}
            onChange={e => setUniversalPrompt(e.target.value)}
            helpText="Deixe em branco para usar a fórmula padrão do AntGravity"
          />
        </div>
      </Card>

      {/* Loading Progress */}
      {loading && (
        <div className="space-y-1.5 p-4 rounded-card bg-[#2a2a2a] border border-[#444444]">
          <div className="flex justify-between text-xs font-mono text-[#FF6B6B]">
            <span>Gerando imagem via {source}...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2.5 bg-[#333333] rounded-full overflow-hidden w-full">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#A78BFA] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── BOTÃO GRANDE DE GERAÇÃO ── */}
      <button
        onClick={handleGenerateClick}
        disabled={loading}
        className="w-full py-4 rounded-card font-bold text-lg text-white transition-all duration-180 disabled:opacity-50 shadow-glow hover:shadow-purpleGlow flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #A78BFA 100%)' }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader size={20} className="animate-spin" /> Processando com IA...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wand2 size={22} /> 🎨 GERAR THUMBNAILS
          </span>
        )}
      </button>
    </div>
  );
}
