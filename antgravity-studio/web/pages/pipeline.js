import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import HelpPopover from '../components/shared/HelpPopover';
import {
  Zap, Play, Upload, Link as LinkIcon, Rss, Wand2,
  Mic2, Video, Settings2, Type, Layers, Radio,
  Image as ImageIcon, Star, X, ChevronDown, Loader,
  ToggleLeft, ToggleRight, Volume2, Gauge, AlignCenter,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────
const LANGUAGES = [
  'Português (BR)', 'English (US)', 'English (UK)', 'Español', 'Français',
  'Deutsch', 'Italiano', 'Português (PT)', 'Nederlands', 'Polski',
  'Русский', 'Türkçe', 'العربية', '中文', '日本語', '한국어',
  'Hindi', 'Bengali', 'Urdu', 'Indonesian', 'Malay', 'Thai',
  'Vietnamese', 'Filipino', 'Swahili', 'Ukrainian', 'Romanian',
  'Czech', 'Slovak', 'Hungarian', 'Greek', 'Finnish',
];

const VOICES = [
  'Fernanda (Google PT-BR)', 'Ricardo (Google PT-BR)', 'Ana Wavenet (Google)',
  'Carlos Wavenet (Google)', 'Alloy (OpenAI)', 'Echo (OpenAI)', 'Nova (OpenAI)',
  'Onyx (OpenAI)', 'Voz Clonada 1 (XTTS)', 'Voz Clonada 2 (XTTS)',
];

const ORIENTATIONS = ['Horizontal (16:9)', 'Vertical (9:16)', 'Quadrado (1:1)'];
const CHUNK_SIZES = ['1.5s', '2s', '2.5s', '3s', '3.5s', '4s', '5s'];
const SUBTITLE_POSITIONS = ['Baixo', 'Centro', 'Cima', 'Karaoke (Realçado)'];
const OVERLAY_POSITIONS = ['Canto Superior Esq', 'Canto Superior Dir', 'Canto Inf Esq', 'Canto Inf Dir', 'Centro'];
const MEDIA_SOURCES = [
  { id: 'pixabay', label: 'Pixabay', icon: '🟡' },
  { id: 'pexels', label: 'Pexels', icon: '🟢' },
  { id: 'meta_ai', label: 'Meta AI', icon: '🔵' },
  { id: 'kie', label: 'Kie.ai', icon: '🟣' },
  { id: 'custom', label: 'Pasta Custom', icon: '📁' },
  { id: 'stock', label: 'Stock Local', icon: '💾' },
];

// ────────────────────────────────────────────────────────────
// Section Header
// ────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, label, color = 'text-accent-red' }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
      <Icon size={16} className={color} />
      <h3 className="text-sm font-semibold text-txt-primary">{label}</h3>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Field helpers
// ────────────────────────────────────────────────────────────
function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="text-xs font-medium text-txt-secondary mb-1 block">{label}</label>}
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative ${checked ? 'bg-accent-red' : 'bg-bg-tertiary border border-border'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow ${checked ? 'left-4' : 'left-0.5'}`} />
      </div>
      <span className="text-sm text-txt-secondary group-hover:text-txt-primary transition">{label}</span>
    </label>
  );
}

function RangeField({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-xs font-medium text-txt-secondary">{label}</label>
        <span className="text-xs text-txt-primary font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#FF6B6B]"
      />
      <div className="flex justify-between text-[10px] text-txt-secondary/40 mt-0.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────
export default function Pipeline() {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [forging, setForging] = useState(null); // which section is forging
  const [starting, setStarting] = useState(false);

  // Form State
  const [content, setContent] = useState({
    urls: '',
    useRealNews: false,
    uploadedScript: null,
  });
  const [tema, setTema] = useState({
    nicho: '',
    numVideos: 3,
    ordenacao: 'Recentes',
    promptExtra: '',
  });
  const [roteiros, setRoteiros] = useState({
    numVideos: 3,
    palavras: 1000,
    idioma: 'Português (BR)',
    voz: VOICES[0],
  });
  const [video, setVideo] = useState({
    orientacao: 'Horizontal (16:9)',
    chunkSize: '2.5s',
    queriesPorVideo: 3,
    videosPorQuery: 2,
    pastaMusicaFundo: '',
    pastaDestino: './output',
    volumeMusica: 20,
    velocidadeTTS: 1.0,
    pitch: 0,
  });
  const [legenda, setLegenda] = useState({
    enabled: true,
    posicao: 'Baixo',
    tamanhoFonte: 32,
  });
  const [overlays, setOverlays] = useState({
    inscrevase: true,
    idioma: 'Português (BR)',
    posicao: 'Canto Inf Dir',
    intervalo: 30,
    duracao: 5,
  });
  const [mediaSources, setMediaSources] = useState(['pixabay', 'pexels']);

  const handleForge = async (section) => {
    setForging(section);
    await new Promise(r => setTimeout(r, 1800));
    setForging(null);
    toast.success(`✨ ${section} forjado com IA!`);
  };

  const handleStartPipeline = async () => {
    if (!tema.nicho && !content.urls) {
      toast.error('Preencha o nicho ou adicione URLs de referência!');
      return;
    }
    setStarting(true);
    await new Promise(r => setTimeout(r, 1500));
    setStarting(false);
    toast.success('🚀 Pipeline iniciado! Acompanhe na Fila de produção.');
    setTimeout(() => { window.location.href = '/queue'; }, 1200);
  };

  const toggleMediaSource = (id) => {
    setMediaSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-32">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-3">
              <Zap size={24} className="text-accent-red" />
              ✨ Pipeline Mágico
            </h1>
            <p className="text-sm text-txt-secondary mt-1">
              Fluxo automatizado completo: Roteiros → TTS → Mídias → Picotador → Renderização → SEO → Thumbnail
            </p>
          </div>
          <div className="flex items-center gap-3">
            <HelpPopover
              moduleTitle="Pipeline Mágico"
              description="O Pipeline Mágico executa todo o processo de criação de vídeos de forma contínua em 5 a 7 fases."
              steps={[
                'Insira URLs de referência ou transcrições.',
                'Defina o nicho e número de vídeos.',
                'Escolha o idioma e a voz TTS.',
                'Selecione a orientação (16:9 ou 9:16).',
                'Clique em "🚀 INICIAR PIPELINE MÁGICO".',
              ]}
              tips={[
                'No modo Avançado você pode ajustar o tempo dos cortes (chunk size) e o modelo de Thumbnail.',
              ]}
            />
            <button
              onClick={() => setAdvancedMode(!advancedMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-card border text-sm font-medium transition ${advancedMode ? 'border-[#6366F1] text-[#6366F1] bg-[#6366F1]/10' : 'border-[#334155] text-[#94A3B8] hover:text-white'}`}
            >
              {advancedMode ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {advancedMode ? 'Avançado' : 'Simples'}
            </button>
          </div>
        </div>

        {/* ── 1. Conteúdo & Referências ── */}
        <Card>
          <SectionTitle icon={LinkIcon} label="Conteúdo & Referências" />
          <div className="space-y-3">
            <Field label="URLs de referência (canais ou vídeos, um por linha)">
              <textarea
                className="input-base resize-none text-sm font-mono"
                rows={4}
                placeholder="https://youtube.com/watch?v=...&#10;https://youtube.com/@canal..."
                value={content.urls}
                onChange={e => setContent(p => ({ ...p, urls: e.target.value }))}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Toggle
                label="Produzir notícias REAIS das fontes deste projeto"
                checked={content.useRealNews}
                onChange={v => setContent(p => ({ ...p, useRealNews: v }))}
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-card border border-dashed border-border hover:border-accent-red/30 cursor-pointer text-sm text-txt-secondary hover:text-txt-primary transition bg-bg-tertiary/30">
                <Upload size={16} />
                {content.uploadedScript ? content.uploadedScript.name : 'Upload .txt (roteiros prontos)'}
                <input type="file" accept=".txt" className="hidden" onChange={e => setContent(p => ({ ...p, uploadedScript: e.target.files[0] }))} />
              </label>
              {content.uploadedScript && (
                <button onClick={() => setContent(p => ({ ...p, uploadedScript: null }))} className="p-2 rounded text-error hover:bg-error/10 transition">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* ── 2. Tema / Nicho ── */}
        <Card>
          <SectionTitle icon={Radio} label="Tema / Nicho" color="text-accent-teal" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Tema / Nicho" className="col-span-2">
                <input
                  className="input-base"
                  placeholder="Ex: Finanças, Tecnologia, Saúde..."
                  value={tema.nicho}
                  onChange={e => setTema(p => ({ ...p, nicho: e.target.value }))}
                />
              </Field>
              <Field label="Nº de Vídeos">
                <input
                  type="number"
                  className="input-base"
                  min={1}
                  max={50}
                  value={tema.numVideos}
                  onChange={e => setTema(p => ({ ...p, numVideos: +e.target.value }))}
                />
              </Field>
              <Field label="Ordenação">
                <select className="input-base" value={tema.ordenacao} onChange={e => setTema(p => ({ ...p, ordenacao: e.target.value }))}>
                  {['Recentes', 'Popular', 'Antigos', 'Relevância'].map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Prompt extra (instrução adicional para o roteiro)">
              <div className="relative">
                <textarea
                  className="input-base resize-none text-sm pr-28"
                  rows={3}
                  placeholder="Ex: Sempre use exemplos práticos e cases reais de sucesso..."
                  value={tema.promptExtra}
                  onChange={e => setTema(p => ({ ...p, promptExtra: e.target.value }))}
                />
                <button
                  onClick={() => handleForge('Prompt extra')}
                  disabled={forging === 'Prompt extra'}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-gradient-to-r from-accent-red to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {forging === 'Prompt extra' ? <Loader size={12} className="animate-spin" /> : '🔥'}
                  Forjar com IA
                </button>
              </div>
            </Field>
          </div>
        </Card>

        {/* ── 3. Roteiros ── */}
        <Card>
          <SectionTitle icon={Type} label="Roteiros" color="text-purple-400" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Nº de Vídeos">
              <input type="number" className="input-base" min={1} max={50} value={roteiros.numVideos} onChange={e => setRoteiros(p => ({ ...p, numVideos: +e.target.value }))} />
            </Field>
            <Field label="Palavras/Roteiro">
              <input type="number" className="input-base" min={100} max={5000} step={100} value={roteiros.palavras} onChange={e => setRoteiros(p => ({ ...p, palavras: +e.target.value }))} />
            </Field>
            <Field label="Idioma" className="col-span-2 sm:col-span-1">
              <select className="input-base" value={roteiros.idioma} onChange={e => setRoteiros(p => ({ ...p, idioma: e.target.value }))}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Voz TTS" className="col-span-2 sm:col-span-1">
              <div className="flex gap-1">
                <select className="input-base flex-1 text-sm" value={roteiros.voz} onChange={e => setRoteiros(p => ({ ...p, voz: e.target.value }))}>
                  {VOICES.map(v => <option key={v}>{v}</option>)}
                </select>
                <button
                  onClick={() => toast('🔊 Reproduzindo amostra de voz...')}
                  className="p-2 rounded-input border border-border bg-bg-tertiary hover:bg-accent-teal/20 hover:text-accent-teal text-txt-secondary transition"
                  title="Testar voz"
                >
                  <Play size={14} />
                </button>
              </div>
            </Field>
          </div>
        </Card>

        {/* ── 4. Configurações de Vídeo ── */}
        <Card>
          <SectionTitle icon={Video} label="Configurações de Vídeo" color="text-orange-400" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Orientação" className="col-span-2 sm:col-span-1">
                <select className="input-base text-sm" value={video.orientacao} onChange={e => setVideo(p => ({ ...p, orientacao: e.target.value }))}>
                  {ORIENTATIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Chunk Size">
                <select className="input-base" value={video.chunkSize} onChange={e => setVideo(p => ({ ...p, chunkSize: e.target.value }))}>
                  {CHUNK_SIZES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Queries/Vídeo">
                <input type="number" className="input-base" min={1} max={20} value={video.queriesPorVideo} onChange={e => setVideo(p => ({ ...p, queriesPorVideo: +e.target.value }))} />
              </Field>
              <Field label="Vídeos/Query">
                <input type="number" className="input-base" min={1} max={20} value={video.videosPorQuery} onChange={e => setVideo(p => ({ ...p, videosPorQuery: +e.target.value }))} />
              </Field>
            </div>

            {advancedMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="📁 Pasta de música de fundo">
                  <input className="input-base text-sm font-mono" placeholder="./assets/music/" value={video.pastaMusicaFundo} onChange={e => setVideo(p => ({ ...p, pastaMusicaFundo: e.target.value }))} />
                </Field>
                <Field label="📁 Pasta de destino">
                  <input className="input-base text-sm font-mono" placeholder="./output/" value={video.pastaDestino} onChange={e => setVideo(p => ({ ...p, pastaDestino: e.target.value }))} />
                </Field>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RangeField label="Volume Música" value={video.volumeMusica} min={0} max={100} unit="%" onChange={v => setVideo(p => ({ ...p, volumeMusica: v }))} />
              <RangeField label="Velocidade TTS" value={video.velocidadeTTS} min={0.5} max={2.0} step={0.1} unit="x" onChange={v => setVideo(p => ({ ...p, velocidadeTTS: v }))} />
              <RangeField label="Pitch" value={video.pitch} min={-10} max={10} onChange={v => setVideo(p => ({ ...p, pitch: v }))} />
            </div>
          </div>
        </Card>

        {/* ── 5. Legenda ── */}
        <Card>
          <SectionTitle icon={AlignCenter} label="Legenda" color="text-blue-400" />
          <div className="space-y-3">
            <Toggle
              label="Usar legenda (AssemblyAI)"
              checked={legenda.enabled}
              onChange={v => setLegenda(p => ({ ...p, enabled: v }))}
            />
            {legenda.enabled && (
              <div className="grid grid-cols-2 gap-3 pl-3 border-l-2 border-blue-400/30">
                <Field label="Posição">
                  <select className="input-base" value={legenda.posicao} onChange={e => setLegenda(p => ({ ...p, posicao: e.target.value }))}>
                    {SUBTITLE_POSITIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <RangeField label="Tamanho da Fonte" value={legenda.tamanhoFonte} min={16} max={72} onChange={v => setLegenda(p => ({ ...p, tamanhoFonte: v }))} />
              </div>
            )}
          </div>
        </Card>

        {/* ── 6. Overlays ── */}
        {advancedMode && (
          <Card>
            <SectionTitle icon={Layers} label="Overlays" color="text-yellow-400" />
            <div className="space-y-3">
              <Toggle
                label="Adicionar overlay 'Inscreva-se'"
                checked={overlays.inscrevase}
                onChange={v => setOverlays(p => ({ ...p, inscrevase: v }))}
              />
              {overlays.inscrevase && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-3 border-l-2 border-yellow-400/30">
                  <Field label="Idioma">
                    <select className="input-base text-sm" value={overlays.idioma} onChange={e => setOverlays(p => ({ ...p, idioma: e.target.value }))}>
                      {LANGUAGES.slice(0, 10).map(l => <option key={l}>{l}</option>)}
                    </select>
                  </Field>
                  <Field label="Posição">
                    <select className="input-base text-sm" value={overlays.posicao} onChange={e => setOverlays(p => ({ ...p, posicao: e.target.value }))}>
                      {OVERLAY_POSITIONS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Intervalo (s)">
                    <input type="number" className="input-base" min={10} max={120} value={overlays.intervalo} onChange={e => setOverlays(p => ({ ...p, intervalo: +e.target.value }))} />
                  </Field>
                  <Field label="Duração (s)">
                    <input type="number" className="input-base" min={1} max={30} value={overlays.duracao} onChange={e => setOverlays(p => ({ ...p, duracao: +e.target.value }))} />
                  </Field>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ── 7. Fonte de Mídia ── */}
        <Card>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-accent-teal" />
              <h3 className="text-sm font-semibold text-txt-primary">Fonte de Mídia</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMediaSources(MEDIA_SOURCES.map(m => m.id))}
                className="text-xs px-2 py-1 rounded bg-warning/20 text-warning hover:bg-warning/30 transition flex items-center gap-1"
              >
                <Star size={11} /> ALL
              </button>
              <button
                onClick={() => setMediaSources([])}
                className="text-xs px-2 py-1 rounded bg-bg-tertiary text-txt-secondary hover:text-txt-primary hover:bg-border transition flex items-center gap-1"
              >
                <X size={11} /> Limpar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MEDIA_SOURCES.map(src => (
              <button
                key={src.id}
                onClick={() => toggleMediaSource(src.id)}
                className={`flex items-center gap-2.5 p-3 rounded-card border transition ${mediaSources.includes(src.id) ? 'border-accent-red bg-accent-red/10 text-txt-primary' : 'border-border bg-bg-secondary text-txt-secondary hover:border-accent-red/30'}`}
              >
                <span className="text-base">{src.icon}</span>
                <span className="text-sm font-medium">{src.label}</span>
                {mediaSources.includes(src.id) && (
                  <span className="ml-auto w-4 h-4 rounded-full bg-accent-red flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
          {mediaSources.length === 0 && (
            <p className="text-xs text-error mt-2">⚠️ Selecione ao menos uma fonte de mídia!</p>
          )}
        </Card>

        {/* ── BOTÃO INICIAR ── */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-60 z-20 p-4 bg-bg-primary/80 backdrop-blur-md border-t border-border">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleStartPipeline}
              disabled={starting || mediaSources.length === 0}
              className="w-full py-4 rounded-card font-bold text-lg text-white transition disabled:opacity-50 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)' }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
              {starting ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader size={20} className="animate-spin" />
                  Iniciando Pipeline...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Zap size={20} />
                  ✨ INICIAR PIPELINE MÁGICO
                  <Zap size={20} />
                </span>
              )}
            </button>
            <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-txt-secondary/50">
              <span>🎬 {roteiros.numVideos} vídeo(s)</span>
              <span>·</span>
              <span>📝 {roteiros.palavras} palavras/roteiro</span>
              <span>·</span>
              <span>🌐 {roteiros.idioma.split(' ')[0]}</span>
              <span>·</span>
              <span>📺 {video.orientacao.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
