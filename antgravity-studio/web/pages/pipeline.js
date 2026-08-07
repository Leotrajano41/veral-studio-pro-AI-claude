import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import FormField from '../components/shared/FormField';
import Dropdown from '../components/shared/Dropdown';
import Textarea from '../components/shared/Textarea';
import HelpPopover from '../components/shared/HelpPopover';
import {
  Zap, Play, Upload, Link as LinkIcon, Rss, Wand2,
  Mic2, Video, Settings2, Type, Layers, Radio,
  Image as ImageIcon, Star, X, ChevronDown, Loader,
  ToggleLeft, ToggleRight, Volume2, Gauge, AlignCenter,
  Tv, LayoutTemplate, Sparkles, Check, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────
const LANGUAGES = [
  'Português (BR)', 'English (US)', 'English (UK)', 'Español', 'Français',
  'Deutsch', 'Italiano', 'Português (PT)', 'Nederlands', 'Polski',
  'Русский', 'Türkçe', 'العربية', '中文', '日本語', '한국어',
];

const VOICES = [
  'Fernanda (Google PT-BR)', 'Ricardo (Google PT-BR)', 'Ana Wavenet (Google)',
  'Carlos Wavenet (Google)', 'Alloy (OpenAI)', 'Echo (OpenAI)', 'Nova (OpenAI)',
  'Onyx (OpenAI)', 'Voz Clonada 1 (XTTS)', 'Voz Clonada 2 (XTTS)',
];

const ORIENTATIONS = ['Horizontal (16:9)', 'Vertical (9:16)', 'Quadrado (1:1)'];
const CHUNK_SIZES = ['1.5s', '2s', '2.5s', '3s', '3.5s', '4s', '5s'];
const SUBTITLE_STYLES = ['Amarelo Destaque (Original)', 'Neon Roxo (Viral)', 'Minimalista Branco', 'TikTok Impacto'];
const SUBTITLE_POSITIONS = ['Baixo', 'Centro', 'Cima', 'Karaoke (Realçado)'];
const OVERLAY_POSITIONS = ['Canto Superior Esq', 'Canto Superior Dir', 'Canto Inf Esq', 'Canto Inf Dir', 'Centro'];
const THUMBNAIL_MODELS = [
  '✨ Automático (IA escolhe melhor estilo)',
  '🎨 Nano Banana 2 (Gemini Image)',
  '🎨 Grok Imagine (xAI)',
  '🎨 Seedream 4.5 (Bytedance)',
  '🆓 Meta AI (imagem via cookies)',
  '📷 Pixabay Stock HD',
];
const YOUTUBE_ACCOUNTS = ['Conta Principal (@viralchannel)', 'Conta Secundária (@shorts_viral)'];
const VISIBILITIES = ['🌐 Público', '🔗 Não listado', '🔒 Privado'];

const MEDIA_SOURCES = [
  { id: 'pixabay', label: 'Pixabay', icon: '📷' },
  { id: 'pexels', label: 'Pexels', icon: '📸' },
  { id: 'meta_ai', label: 'Meta AI', icon: '🆓' },
  { id: 'kie', label: 'Kie.ai', icon: '🎨' },
  { id: 'custom', label: 'Pasta Custom', icon: '📂' },
  { id: 'stock', label: 'Stock Local', icon: '📦' },
];

// ────────────────────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, label, color = 'text-[#6366F1]' }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#334155]">
      <Icon size={18} className={color} />
      <h3 className="text-sm font-bold text-white tracking-tight">{label}</h3>
    </div>
  );
}

function Field({ label, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-medium text-[#94A3B8] mb-1 block">
          {label}
          {required && <span className="text-[#6366F1] ml-1">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative ${checked ? 'bg-[#6366F1]' : 'bg-[#0F172A] border border-[#334155]'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow ${checked ? 'left-4' : 'left-0.5'}`} />
      </div>
      <span className="text-xs text-[#94A3B8] group-hover:text-white transition">{label}</span>
    </label>
  );
}

function RangeField({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-xs font-medium text-[#94A3B8]">{label}</label>
        <span className="text-xs text-white font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#6366F1] cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-[#94A3B8]/60 mt-0.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Pipeline Component (1-Column Linear Layout)
// ────────────────────────────────────────────────────────────
export default function Pipeline() {
  const [advancedMode, setAdvancedMode] = useState(true);
  const [forging, setForging] = useState(null);
  const [starting, setStarting] = useState(false);

  // 1. Conteúdo & Referências
  const [content, setContent] = useState({
    urls: '',
    useRealNews: false,
    uploadedScript: null,
  });

  // 2. Tema / Nicho
  const [tema, setTema] = useState({
    nicho: 'Tecnologia & IA',
    numVideos: 3,
    ordenacao: 'Recentes',
    promptExtra: 'Focar em revelações impressionantes e tom entusiasta',
  });

  // 3. Roteiros
  const [roteiros, setRoteiros] = useState({
    numVideos: 3,
    palavras: 1200,
    idioma: 'Português (BR)',
    voz: VOICES[0],
  });

  // 4. Configurações de Vídeo
  const [video, setVideo] = useState({
    orientacao: 'Horizontal (16:9)',
    chunkSize: '2.5s',
    panZoom: true,
    queriesPorVideo: 3,
    videosPorQuery: 2,
    pastaMusicaFundo: './assets/music/',
    pastaDestino: './output/',
    volumeMusica: 30,
    velocidadeTTS: 1.0,
    pitch: 0,
  });

  // 5. Legenda (AssemblyAI)
  const [legenda, setLegenda] = useState({
    enabled: true,
    estilo: 'Amarelo Destaque (Original)',
    posicao: 'Baixo',
    tamanhoFonte: 32,
  });

  // 6. Fonte de Mídia
  const [mediaSources, setMediaSources] = useState(['pixabay', 'pexels', 'meta_ai', 'kie']);

  // 7. Overlays de Vídeo
  const [overlays, setOverlays] = useState({
    inscrevase: true,
    idioma: 'Português (BR)',
    posicao: 'Canto Inf Dir',
    intervalo: 30,
    duracao: 5,
    logoUrl: '',
    ctaText: 'Deixe seu Like e Inscreva-se!',
  });

  // 8. Thumbnail
  const [thumbnail, setThumbnail] = useState({
    enabled: true,
    modelo: THUMBNAIL_MODELS[0],
    estiloTexto: 'Impacto Neon (Contorno Grosso)',
  });

  // 9. Upload YouTube
  const [youtubeUpload, setYoutubeUpload] = useState({
    autoUpload: false,
    conta: YOUTUBE_ACCOUNTS[0],
    visibilidade: VISIBILITIES[0],
  });

  const handleForge = async (section) => {
    setForging(section);
    await new Promise(r => setTimeout(r, 1500));
    setForging(null);
    toast.success(`✨ ${section} forjado com Inteligência Artificial!`);
  };

  const handleStartPipeline = async () => {
    if (!tema.nicho && !content.urls) {
      toast.error('❌ Campo obrigatório: Preencha o Nicho ou insira URLs de referência!');
      return;
    }
    if (mediaSources.length === 0) {
      toast.error('❌ Selecione ao menos uma Fonte de Mídia!');
      return;
    }

    setStarting(true);
    await new Promise(r => setTimeout(r, 1500));
    setStarting(false);
    toast.success('🚀 Pipeline Mágico iniciado! Acompanhe na Fila de Produção.');
    setTimeout(() => { window.location.href = '/queue'; }, 1000);
  };

  const toggleMediaSource = (id) => {
    setMediaSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      {/* Container Full Width Single Column Linear */}
      <div className="max-w-4xl mx-auto space-y-6 pb-36">
        
        {/* ── HEADER DA PÁGINA ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap size={24} className="text-[#6366F1]" /> ✨ Pipeline Mágico
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Fluxo automatizado linear: Conteúdo → Tema → Roteiros → Vídeo → Legendas → Mídias → Overlays → Capas → YouTube
            </p>
          </div>

          <div className="flex items-center gap-3">
            <HelpPopover
              moduleTitle="Pipeline Mágico"
              description="O Pipeline Mágico executa a criação de vídeos completos de forma sequencial."
              steps={[
                'Insira referências ou palavras-chave de conteúdo.',
                'Defina o nicho e número de vídeos.',
                'Escolha o idioma, a voz TTS e a orientação.',
                'Selecione as fontes de mídias stock (Pixabay, Pexels, etc.).',
                'Clique em "✨ INICIAR PIPELINE MÁGICO" no final da página.',
              ]}
              tips={[
                'Você pode alternar entre o modo Simples e Avançado para personalizar overlays e legendas.',
              ]}
            />
            <button
              onClick={() => setAdvancedMode(!advancedMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-card border text-xs font-semibold transition ${advancedMode ? 'border-[#6366F1] text-[#6366F1] bg-[#6366F1]/10' : 'border-[#334155] text-[#94A3B8] hover:text-white'}`}
            >
              {advancedMode ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {advancedMode ? 'Modo Avançado' : 'Modo Simples'}
            </button>
          </div>
        </div>

        {/* ── 1. CONTEÚDO & REFERÊNCIAS ── */}
        <Card>
          <SectionTitle icon={LinkIcon} label="1. Conteúdo & Referências" color="text-[#6366F1]" />
          <div className="space-y-4">
            <Field label="URLs de referência (canais ou vídeos, um por linha)">
              <textarea
                className="w-full bg-[#0F172A] border border-[#334155] rounded-input p-3 text-xs text-white font-mono placeholder-[#64748B] focus:border-[#6366F1] focus:outline-none resize-none"
                rows={3}
                placeholder="https://www.youtube.com/watch?v=...&#10;https://www.youtube.com/@canal..."
                value={content.urls}
                onChange={e => setContent(p => ({ ...p, urls: e.target.value }))}
              />
            </Field>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Toggle
                label="Produzir notícias REAIS das fontes deste projeto"
                checked={content.useRealNews}
                onChange={v => setContent(p => ({ ...p, useRealNews: v }))}
              />

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-card border border-dashed border-[#334155] hover:border-[#6366F1] cursor-pointer text-xs text-[#94A3B8] hover:text-white transition bg-[#0F172A]">
                  <Upload size={14} />
                  {content.uploadedScript ? content.uploadedScript.name : 'Upload .txt (roteiros)'}
                  <input type="file" accept=".txt" className="hidden" onChange={e => setContent(p => ({ ...p, uploadedScript: e.target.files[0] }))} />
                </label>
                {content.uploadedScript && (
                  <button onClick={() => setContent(p => ({ ...p, uploadedScript: null }))} className="p-1 text-[#EF4444] hover:bg-[#EF4444]/10 rounded">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* ── 2. TEMA / NICHO ── */}
        <Card>
          <SectionTitle icon={Radio} label="2. Tema / Nicho" color="text-[#8B5CF6]" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Field label="Tema / Nicho *" required className="sm:col-span-2">
                <input
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white placeholder-[#64748B] focus:border-[#6366F1] focus:outline-none"
                  placeholder="Ex: Finanças, Tecnologia, Curiosidades..."
                  value={tema.nicho}
                  onChange={e => setTema(p => ({ ...p, nicho: e.target.value }))}
                />
              </Field>
              <Field label="Nº de Vídeos">
                <input
                  type="number"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                  min={1}
                  max={50}
                  value={tema.numVideos}
                  onChange={e => setTema(p => ({ ...p, numVideos: +e.target.value }))}
                />
              </Field>
              <Field label="Ordenação">
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                  value={tema.ordenacao}
                  onChange={e => setTema(p => ({ ...p, ordenacao: e.target.value }))}
                >
                  {['Recentes', 'Mais Populares', 'Relevância'].map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Prompt extra (instrução adicional para o roteiro)">
              <div className="relative">
                <textarea
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input p-3 pr-32 text-xs text-white placeholder-[#64748B] focus:border-[#6366F1] focus:outline-none resize-none"
                  rows={2}
                  placeholder="Ex: Focar em gatilhos de curiosidade nos 5 primeiros segundos..."
                  value={tema.promptExtra}
                  onChange={e => setTema(p => ({ ...p, promptExtra: e.target.value }))}
                />
                <button
                  onClick={() => handleForge('Prompt extra')}
                  disabled={forging === 'Prompt extra'}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-glow"
                >
                  {forging === 'Prompt extra' ? <Loader size={12} className="animate-spin" /> : '🔥'}
                  Forjar com IA
                </button>
              </div>
            </Field>
          </div>
        </Card>

        {/* ── 3. ROTEIROS ── */}
        <Card>
          <SectionTitle icon={Type} label="3. Roteiros" color="text-[#06B6D4]" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Field label="Nº de Vídeos">
              <input
                type="number"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                min={1}
                max={50}
                value={roteiros.numVideos}
                onChange={e => setRoteiros(p => ({ ...p, numVideos: +e.target.value }))}
              />
            </Field>
            <Field label="Palavras / Roteiro">
              <input
                type="number"
                className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                min={100}
                max={5000}
                step={100}
                value={roteiros.palavras}
                onChange={e => setRoteiros(p => ({ ...p, palavras: +e.target.value }))}
              />
            </Field>
            <Field label="Idioma">
              <select
                className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                value={roteiros.idioma}
                onChange={e => setRoteiros(p => ({ ...p, idioma: e.target.value }))}
              >
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Voz TTS Neural">
              <div className="flex gap-1">
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer truncate"
                  value={roteiros.voz}
                  onChange={e => setRoteiros(p => ({ ...p, voz: e.target.value }))}
                >
                  {VOICES.map(v => <option key={v}>{v}</option>)}
                </select>
                <button
                  onClick={() => toast('🔊 Reproduzindo amostra da voz...')}
                  className="p-2 rounded-input border border-[#334155] bg-[#0F172A] hover:bg-[#6366F1]/20 text-[#6366F1] transition"
                  title="Ouvir voz"
                >
                  <Play size={14} />
                </button>
              </div>
            </Field>
          </div>
        </Card>

        {/* ── 4. CONFIGURAÇÕES DE VÍDEO ── */}
        <Card>
          <SectionTitle icon={Video} label="4. Configurações de Vídeo" color="text-[#10B981]" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Field label="Orientação">
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                  value={video.orientacao}
                  onChange={e => setVideo(p => ({ ...p, orientacao: e.target.value }))}
                >
                  {ORIENTATIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Chunk Size (Cortes)">
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                  value={video.chunkSize}
                  onChange={e => setVideo(p => ({ ...p, chunkSize: e.target.value }))}
                >
                  {CHUNK_SIZES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Queries / Vídeo">
                <input
                  type="number"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                  min={1}
                  max={10}
                  value={video.queriesPorVideo}
                  onChange={e => setVideo(p => ({ ...p, queriesPorVideo: +e.target.value }))}
                />
              </Field>
              <Field label="Vídeos / Query">
                <input
                  type="number"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                  min={1}
                  max={10}
                  value={video.videosPorQuery}
                  onChange={e => setVideo(p => ({ ...p, videosPorQuery: +e.target.value }))}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#334155]/60">
              <RangeField label="Volume da Música (%)" value={video.volumeMusica} min={0} max={100} unit="%" onChange={v => setVideo(p => ({ ...p, volumeMusica: v }))} />
              <RangeField label="Velocidade TTS" value={video.velocidadeTTS} min={0.5} max={2.0} step={0.1} unit="x" onChange={v => setVideo(p => ({ ...p, velocidadeTTS: v }))} />
              <RangeField label="Pitch da Voz" value={video.pitch} min={-10} max={10} onChange={v => setVideo(p => ({ ...p, pitch: v }))} />
            </div>

            {advancedMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#334155]/60">
                <Field label="📁 Pasta de música de fundo">
                  <input
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white font-mono focus:border-[#6366F1] focus:outline-none"
                    placeholder="./assets/music/"
                    value={video.pastaMusicaFundo}
                    onChange={e => setVideo(p => ({ ...p, pastaMusicaFundo: e.target.value }))}
                  />
                </Field>
                <Field label="📁 Pasta de destino local">
                  <input
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white font-mono focus:border-[#6366F1] focus:outline-none"
                    placeholder="./output/"
                    value={video.pastaDestino}
                    onChange={e => setVideo(p => ({ ...p, pastaDestino: e.target.value }))}
                  />
                </Field>
              </div>
            )}
          </div>
        </Card>

        {/* ── 5. LEGENDA (ASSEMBLY AI) ── */}
        <Card>
          <SectionTitle icon={AlignCenter} label="5. Legenda (AssemblyAI)" color="text-[#F59E0B]" />
          <div className="space-y-3">
            <Toggle
              label="Gerar e Queimar Legendas Dinâmicas (AssemblyAI)"
              checked={legenda.enabled}
              onChange={v => setLegenda(p => ({ ...p, enabled: v }))}
            />

            {legenda.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-3 border-l-2 border-[#F59E0B] pt-2">
                <Field label="Estilo da Legenda">
                  <select
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                    value={legenda.estilo}
                    onChange={e => setLegenda(p => ({ ...p, estilo: e.target.value }))}
                  >
                    {SUBTITLE_STYLES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Posição na Tela">
                  <select
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                    value={legenda.posicao}
                    onChange={e => setLegenda(p => ({ ...p, posicao: e.target.value }))}
                  >
                    {SUBTITLE_POSITIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <RangeField label="Tamanho da Fonte (px)" value={legenda.tamanhoFonte} min={16} max={72} onChange={v => setLegenda(p => ({ ...p, tamanhoFonte: v }))} />
              </div>
            )}
          </div>
        </Card>

        {/* ── 6. FONTE DE MÍDIA (6 OPÇÕES) ── */}
        <Card>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#334155]">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-[#06B6D4]" />
              <h3 className="text-sm font-bold text-white tracking-tight">6. Fonte de Mídia (6 Bancos Integrados)</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMediaSources(MEDIA_SOURCES.map(m => m.id))}
                className="text-[11px] px-2 py-0.5 rounded bg-[#6366F1]/20 text-[#6366F1] hover:bg-[#6366F1]/30 transition font-semibold"
              >
                SELECIONAR TODAS
              </button>
              <button
                onClick={() => setMediaSources([])}
                className="text-[11px] px-2 py-0.5 rounded bg-[#334155] text-[#94A3B8] hover:text-white transition"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MEDIA_SOURCES.map(src => {
              const active = mediaSources.includes(src.id);
              return (
                <button
                  key={src.id}
                  onClick={() => toggleMediaSource(src.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-card border transition ${active ? 'border-[#6366F1] bg-[#6366F1]/10 text-white shadow-glow' : 'border-[#334155] bg-[#0F172A] text-[#94A3B8] hover:border-[#6366F1]/50'}`}
                >
                  <span className="text-base">{src.icon}</span>
                  <span className="text-xs font-semibold">{src.label}</span>
                  {active && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
          {mediaSources.length === 0 && (
            <p className="text-xs text-[#EF4444] mt-2 font-medium">⚠️ Selecione ao menos uma fonte de mídia!</p>
          )}
        </Card>

        {/* ── 7. OVERLAYS DE VÍDEO ── */}
        <Card>
          <SectionTitle icon={Layers} label="7. Overlays de Vídeo (Subscribe & CTA)" color="text-[#EC4899]" />
          <div className="space-y-3">
            <Toggle
              label="Adicionar animação overlay 'Inscreva-se'"
              checked={overlays.inscrevase}
              onChange={v => setOverlays(p => ({ ...p, inscrevase: v }))}
            />

            {overlays.inscrevase && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pl-3 border-l-2 border-[#EC4899] pt-2">
                <Field label="Idioma do Overlay">
                  <select
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                    value={overlays.idioma}
                    onChange={e => setOverlays(p => ({ ...p, idioma: e.target.value }))}
                  >
                    {LANGUAGES.slice(0, 8).map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Posição na Tela">
                  <select
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                    value={overlays.posicao}
                    onChange={e => setOverlays(p => ({ ...p, posicao: e.target.value }))}
                  >
                    {OVERLAY_POSITIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Intervalo (s)">
                  <input
                    type="number"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                    min={10}
                    max={120}
                    value={overlays.intervalo}
                    onChange={e => setOverlays(p => ({ ...p, intervalo: +e.target.value }))}
                  />
                </Field>
                <Field label="Duração (s)">
                  <input
                    type="number"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                    min={1}
                    max={15}
                    value={overlays.duracao}
                    onChange={e => setOverlays(p => ({ ...p, duracao: +e.target.value }))}
                  />
                </Field>
              </div>
            )}
          </div>
        </Card>

        {/* ── 8. THUMBNAIL ── */}
        <Card>
          <SectionTitle icon={LayoutTemplate} label="8. Thumbnail (Capas IA)" color="text-[#8B5CF6]" />
          <div className="space-y-3">
            <Toggle
              label="Gerar Thumbnails Automáticas com IA"
              checked={thumbnail.enabled}
              onChange={v => setThumbnail(p => ({ ...p, enabled: v }))}
            />

            {thumbnail.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 border-l-2 border-[#8B5CF6] pt-2">
                <Field label="Modelo de IA Generativa">
                  <select
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                    value={thumbnail.modelo}
                    onChange={e => setThumbnail(p => ({ ...p, modelo: e.target.value }))}
                  >
                    {THUMBNAIL_MODELS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Estilo do Texto da Capa">
                  <input
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none"
                    value={thumbnail.estiloTexto}
                    onChange={e => setThumbnail(p => ({ ...p, estiloTexto: e.target.value }))}
                  />
                </Field>
              </div>
            )}
          </div>
        </Card>

        {/* ── 9. UPLOAD YOUTUBE ── */}
        <Card>
          <SectionTitle icon={Tv} label="9. Upload YouTube (OAuth 2.0)" color="text-[#10B981]" />
          <div className="space-y-3">
            <Toggle
              label="Subir pro YouTube automaticamente quando o vídeo estiver renderizado"
              checked={youtubeUpload.autoUpload}
              onChange={v => setYoutubeUpload(p => ({ ...p, autoUpload: v }))}
            />

            {youtubeUpload.autoUpload && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 border-l-2 border-[#10B981] pt-2">
                <Field label="Conta do YouTube Conectada">
                  <select
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                    value={youtubeUpload.conta}
                    onChange={e => setYoutubeUpload(p => ({ ...p, conta: e.target.value }))}
                  >
                    {YOUTUBE_ACCOUNTS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Visibilidade Inicial">
                  <select
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-input px-3 py-2 text-xs text-white focus:border-[#6366F1] focus:outline-none cursor-pointer"
                    value={youtubeUpload.visibilidade}
                    onChange={e => setYoutubeUpload(p => ({ ...p, visibilidade: e.target.value }))}
                  >
                    {VISIBILITIES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            )}
          </div>
        </Card>

        {/* ── 10. BOTÃO "✨ INICIAR PIPELINE MÁGICO" (NO FINAL DA PÁGINA COM GRADIENTE ROXO/CIANO) ── */}
        <div className="pt-4">
          <button
            onClick={handleStartPipeline}
            disabled={starting || mediaSources.length === 0}
            className="w-full py-4 rounded-card font-bold text-lg text-white transition duration-200 disabled:opacity-50 relative overflow-hidden group shadow-glow cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)' }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
            {starting ? (
              <span className="flex items-center justify-center gap-3">
                <Loader size={22} className="animate-spin" />
                Iniciando Pipeline...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Zap size={22} />
                ✨ INICIAR PIPELINE MÁGICO
                <Zap size={22} />
              </span>
            )}
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-[#94A3B8]">
            <span>🎬 {roteiros.numVideos} vídeo(s)</span>
            <span>·</span>
            <span>📝 {roteiros.palavras} palavras/roteiro</span>
            <span>·</span>
            <span>🌐 {roteiros.idioma.split(' ')[0]}</span>
            <span>·</span>
            <span>📺 {video.orientacao.split(' ')[0]}</span>
            <span>·</span>
            <span>📷 {mediaSources.length} fonte(s) de mídia</span>
          </div>
        </div>

      </div>
    </Layout>
  );
}
