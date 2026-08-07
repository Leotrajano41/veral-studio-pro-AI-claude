import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  FolderKanban, Plus, Search, Edit2, Trash2, Copy,
  Zap, MoreVertical, Globe, Clock, Layers, CheckCircle2,
  X, Wand2, Loader, Rss, Link as LinkIcon, ChevronRight,
  Youtube, Eye, EyeOff, Radio,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────
const NICHES = ['Tecnologia', 'Finanças', 'Saúde', 'Motivação', 'Culinária', 'Marketing', 'Educação', 'Entretenimento', 'Política', 'Esportes', 'Ciência', 'Negócios'];
const LANGUAGES = ['pt-br', 'en', 'es', 'fr', 'de', 'it', 'pt-pt'];
const LANGUAGE_LABELS = { 'pt-br': 'Português (BR)', 'en': 'English', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch', 'it': 'Italiano', 'pt-pt': 'Português (PT)' };
const VOICES = ['Fernanda (Google PT-BR)', 'Ricardo (Google PT-BR)', 'Ana Wavenet', 'Alloy (OpenAI)', 'Nova (OpenAI)', 'Voz Clonada (XTTS)'];
const VISIBILITIES = [{ v: 'public', label: '🌐 Público' }, { v: 'unlisted', label: '🔗 Não listado' }, { v: 'private', label: '🔒 Privado' }];
const YOUTUBE_ACCOUNTS = ['Conta Principal', 'Conta Secundária'];
const CHANNELS = ['Canal Principal', 'Canal de Nicho 1', 'Canal de Nicho 2'];

const TABS = [
  { id: 'basico', label: 'Básico', icon: '📋' },
  { id: 'conteudo', label: 'Conteúdo', icon: '✍️' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'capa', label: 'Capa', icon: '🖼️' },
  { id: 'upload', label: 'Upload', icon: '🚀' },
];

const EMPTY_PROJECT = {
  name: '',
  nicho: 'Tecnologia',
  tema_padrao: '',
  idioma: 'pt-br',
  voz_padrao: VOICES[0],
  orientacao: 'horizontal',
  qtd_videos_padrao: 3,
  palavras_roteiro: 1000,
  urls_referencia: '',
  fontes_rss: '',
  prompt_mestre: '',
  prompt_seo: '',
  prompt_capa: '',
  cta_fixa: '',
  randomizar_cta: false,
  subir_youtube: false,
  conta_youtube: YOUTUBE_ACCOUNTS[0],
  canal_youtube: CHANNELS[0],
  visibilidade: 'public',
};

const MOCK_PROJECTS = [
  { id: '1', name: 'Finanças para Iniciantes', nicho: 'Finanças', idioma: 'pt-br', qtd_videos_padrao: 5, palavras_roteiro: 1200, orientacao: 'horizontal', subir_youtube: true, visibilidade: 'public', created_at: '2026-08-05' },
  { id: '2', name: 'Tech Viral BR', nicho: 'Tecnologia', idioma: 'pt-br', qtd_videos_padrao: 3, palavras_roteiro: 800, orientacao: 'vertical', subir_youtube: false, visibilidade: 'unlisted', created_at: '2026-08-04' },
  { id: '3', name: 'Saúde & Bem-estar', nicho: 'Saúde', idioma: 'pt-br', qtd_videos_padrao: 4, palavras_roteiro: 1000, orientacao: 'horizontal', subir_youtube: true, visibilidade: 'public', created_at: '2026-08-06' },
  { id: '4', name: 'Motivation Daily EN', nicho: 'Motivação', idioma: 'en', qtd_videos_padrao: 7, palavras_roteiro: 600, orientacao: 'vertical', subir_youtube: true, visibilidade: 'public', created_at: '2026-08-03' },
];

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
function Field({ label, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-medium text-txt-secondary mb-1 block">
          {label}
          {required && <span className="text-accent-red ml-1">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function ForgeButton({ section, forging, onForge }) {
  const isForging = forging === section;
  return (
    <button
      onClick={() => onForge(section)}
      disabled={isForging}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-card text-xs font-semibold text-white transition disabled:opacity-60 shadow-glow"
      style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
    >
      {isForging ? <Loader size={12} className="animate-spin" /> : '🔥'}
      {isForging ? 'Forjando...' : 'Forjar com IA'}
    </button>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition relative ${checked ? 'bg-[#6366F1]' : 'bg-bg-tertiary border border-border'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow ${checked ? 'left-4' : 'left-0.5'}`} />
      </div>
      <span className="text-sm text-txt-secondary group-hover:text-txt-primary transition">{label}</span>
    </label>
  );
}

// ────────────────────────────────────────────────────────────
// Project Form (5 Tabs)
// ────────────────────────────────────────────────────────────
function ProjectForm({ project, onClose, onSave }) {
  const [data, setData] = useState(project || EMPTY_PROJECT);
  const [activeTab, setActiveTab] = useState('basico');
  const [forging, setForging] = useState(null);
  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setData(p => ({ ...p, [k]: v }));

  const handleForge = async (section) => {
    setForging(section);
    await new Promise(r => setTimeout(r, 1800));
    const generated = {
      prompt_mestre: `Você é um criador de conteúdo especialista em ${data.nicho}. Crie roteiros virais em ${LANGUAGE_LABELS[data.idioma] || data.idioma} com tom ${data.tema_padrao || 'profissional'}, sempre com gancho forte nos primeiros 5 segundos, desenvolvimento com valor real e CTA impactante no final. Priorize títulos com números e emoções.`,
      prompt_seo: `Otimize o título e descrição para SEO no YouTube. Use palavras-chave de alto volume para o nicho ${data.nicho}. Títulos devem ter 60-70 caracteres. Descrição com 150-200 palavras. Inclua hashtags relevantes no final.`,
      prompt_capa: `Thumbnail viral para vídeo de ${data.nicho}. Fundo de cor vibrante (vermelho ou laranja), rosto expressivo em close, texto grande em letras maiúsculas com no máximo 4 palavras, contraste alto, elementos de urgência ou curiosidade. Estilo YouTube top brasileiro.`,
    };
    if (section === 'prompt_mestre') upd('prompt_mestre', generated.prompt_mestre);
    else if (section === 'prompt_seo') upd('prompt_seo', generated.prompt_seo);
    else if (section === 'prompt_capa') upd('prompt_capa', generated.prompt_capa);
    setForging(null);
    toast.success(`✨ ${section === 'prompt_mestre' ? 'Prompt Mestre' : section === 'prompt_seo' ? 'Prompt SEO' : 'Prompt Capa'} forjado!`);
  };

  const handleDetectRSS = async () => {
    await new Promise(r => setTimeout(r, 1000));
    const mockRSS = data.urls_referencia
      .split('\n')
      .filter(u => u.trim())
      .map(u => `https://www.youtube.com/feeds/videos.xml?channel_id=UCXXXXXX`)
      .join('\n');
    upd('fontes_rss', mockRSS || 'https://feeds.feedburner.com/TechCrunch\nhttps://rss.nytimes.com/services/xml/rss/nyt/Technology.xml');
    toast.success('RSS detectados das URLs!');
  };

  const handleInsertRSSNews = async () => {
    const newsSources = [
      'https://feeds.bbci.co.uk/portuguese/rss.xml',
      'https://g1.globo.com/rss/g1/',
      'https://rss.tecmundo.com.br/feed',
      'https://www.infomoney.com.br/feed/',
    ];
    upd('fontes_rss', (data.fontes_rss ? data.fontes_rss + '\n' : '') + newsSources.join('\n'));
    toast.success('Fontes de notícia reais inseridas!');
  };

  const handleSave = async () => {
    if (!data.name.trim()) { toast.error('Nome do projeto é obrigatório!'); setActiveTab('basico'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-bg-secondary border border-border rounded-card shadow-card flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-txt-primary">
            {project ? `✏️ Editar: ${project.name}` : '📂 Novo Projeto'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-bg-tertiary transition text-txt-secondary">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab.id ? 'border-accent-red text-accent-red' : 'border-transparent text-txt-secondary hover:text-txt-primary hover:border-border'}`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── ABA 1: BÁSICO ── */}
          {activeTab === 'basico' && (
            <>
              <Field label="Nome do Projeto" required>
                <input className="input-base" placeholder="Ex: Finanças para Iniciantes" value={data.name} onChange={e => upd('name', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nicho">
                  <select className="input-base" value={data.nicho} onChange={e => upd('nicho', e.target.value)}>
                    {NICHES.map(n => <option key={n}>{n}</option>)}
                  </select>
                </Field>
                <Field label="Tema Padrão">
                  <input className="input-base" placeholder="Ex: Dicas de investimento" value={data.tema_padrao} onChange={e => upd('tema_padrao', e.target.value)} />
                </Field>
                <Field label="Idioma">
                  <select className="input-base" value={data.idioma} onChange={e => upd('idioma', e.target.value)}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>)}
                  </select>
                </Field>
                <Field label="Voz Padrão">
                  <select className="input-base text-sm" value={data.voz_padrao} onChange={e => upd('voz_padrao', e.target.value)}>
                    {VOICES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
              <div>
                <Field label="Orientação do Vídeo">
                  <div className="flex gap-3 mt-1">
                    {[
                      { v: 'horizontal', label: '📺 Horizontal (16:9)', desc: 'YouTube padrão' },
                      { v: 'vertical', label: '📱 Vertical (9:16)', desc: 'Shorts / Reels' },
                    ].map(opt => (
                      <button
                        key={opt.v}
                        onClick={() => upd('orientacao', opt.v)}
                        className={`flex-1 p-3 rounded-card border text-left transition ${data.orientacao === opt.v ? 'border-accent-red bg-accent-red/10' : 'border-border hover:border-accent-red/30'}`}
                      >
                        <p className="text-sm font-medium text-txt-primary">{opt.label}</p>
                        <p className="text-[11px] text-txt-secondary">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Qtd. de Vídeos Padrão">
                  <input type="number" className="input-base" min={1} max={50} value={data.qtd_videos_padrao} onChange={e => upd('qtd_videos_padrao', +e.target.value)} />
                </Field>
                <Field label="Palavras por Roteiro">
                  <input type="number" className="input-base" min={100} max={5000} step={100} value={data.palavras_roteiro} onChange={e => upd('palavras_roteiro', +e.target.value)} />
                </Field>
              </div>
            </>
          )}

          {/* ── ABA 2: CONTEÚDO ── */}
          {activeTab === 'conteudo' && (
            <>
              <div>
                <Field label="URLs / Canais de Referência (um por linha)">
                  <textarea
                    className="input-base resize-none font-mono text-sm"
                    rows={4}
                    placeholder="https://youtube.com/@canalreferencia&#10;https://youtube.com/watch?v=..."
                    value={data.urls_referencia}
                    onChange={e => upd('urls_referencia', e.target.value)}
                  />
                </Field>
                <button
                  onClick={handleDetectRSS}
                  className="mt-2 flex items-center gap-1.5 text-xs text-accent-teal hover:underline"
                >
                  <Rss size={12} /> Detectar RSS do que colei
                </button>
              </div>

              <div>
                <Field label="Fontes de Notícia RSS (um por linha)">
                  <textarea
                    className="input-base resize-none font-mono text-sm"
                    rows={4}
                    placeholder="https://feeds.bbci.co.uk/portuguese/rss.xml&#10;https://g1.globo.com/rss/g1/"
                    value={data.fontes_rss}
                    onChange={e => upd('fontes_rss', e.target.value)}
                  />
                </Field>
                <button
                  onClick={handleInsertRSSNews}
                  className="mt-2 flex items-center gap-1.5 text-xs text-accent-teal hover:underline"
                >
                  <Rss size={12} /> Inserir fontes de notícia reais
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-txt-secondary">Prompt Mestre</label>
                  <ForgeButton section="prompt_mestre" forging={forging} onForge={handleForge} />
                </div>
                <textarea
                  className="input-base resize-none text-sm"
                  rows={6}
                  placeholder="Instrução mestra que guia TODOS os roteiros deste projeto..."
                  value={data.prompt_mestre}
                  onChange={e => upd('prompt_mestre', e.target.value)}
                />
              </div>
            </>
          )}

          {/* ── ABA 3: SEO ── */}
          {activeTab === 'seo' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-txt-primary">Pré-prompt de SEO</h3>
                  <p className="text-xs text-txt-secondary">Instrução para otimização de títulos, descrições e tags no YouTube</p>
                </div>
                <ForgeButton section="prompt_seo" forging={forging} onForge={handleForge} />
              </div>
              <textarea
                className="input-base resize-none text-sm"
                rows={10}
                placeholder="Ex: Otimize o título para SEO. Use palavras-chave de alto volume. Títulos com 60-70 caracteres..."
                value={data.prompt_seo}
                onChange={e => upd('prompt_seo', e.target.value)}
              />
              <p className="text-xs text-txt-secondary/50 mt-2">💡 O prompt SEO é aplicado automaticamente em cada vídeo gerado por este projeto.</p>
            </div>
          )}

          {/* ── ABA 4: CAPA ── */}
          {activeTab === 'capa' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-txt-primary">Prompt Universal da Capa</h3>
                  <p className="text-xs text-txt-secondary">Template de prompt para geração de thumbnails deste projeto</p>
                </div>
                <ForgeButton section="prompt_capa" forging={forging} onForge={handleForge} />
              </div>
              <textarea
                className="input-base resize-none text-sm"
                rows={10}
                placeholder="Ex: Thumbnail viral com fundo vermelho, rosto expressivo, texto grande em caixa alta, estilo YouTube brasileiro..."
                value={data.prompt_capa}
                onChange={e => upd('prompt_capa', e.target.value)}
              />
              <p className="text-xs text-txt-secondary/50 mt-2">💡 Este prompt é enviado ao gerador de imagens (DALL-E / OpenRouter) para criar as capas.</p>
            </div>
          )}

          {/* ── ABA 5: UPLOAD ── */}
          {activeTab === 'upload' && (
            <>
              <Toggle
                label="Randomizar CTA entre vídeos"
                checked={data.randomizar_cta}
                onChange={v => upd('randomizar_cta', v)}
              />
              <Field label="CTA Fixa (chamada para ação)">
                <input
                  className="input-base"
                  placeholder="Ex: Inscreva-se e ative o sininho para mais dicas!"
                  value={data.cta_fixa}
                  onChange={e => upd('cta_fixa', e.target.value)}
                  disabled={data.randomizar_cta}
                />
                {data.randomizar_cta && <p className="text-xs text-txt-secondary/50 mt-1">CTA será randomizada automaticamente.</p>}
              </Field>

              <div className="pt-2 border-t border-border">
                <Toggle
                  label="Subir automaticamente para YouTube"
                  checked={data.subir_youtube}
                  onChange={v => upd('subir_youtube', v)}
                />
              </div>

              {data.subir_youtube && (
                <div className="pl-3 border-l-2 border-red-500/30 space-y-3">
                  <Field label="Conta YouTube">
                    <select className="input-base" value={data.conta_youtube} onChange={e => upd('conta_youtube', e.target.value)}>
                      {YOUTUBE_ACCOUNTS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </Field>
                  <Field label="Canal">
                    <select className="input-base" value={data.canal_youtube} onChange={e => upd('canal_youtube', e.target.value)}>
                      {CHANNELS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Visibilidade">
                    <div className="flex gap-2">
                      {VISIBILITIES.map(vis => (
                        <button
                          key={vis.v}
                          onClick={() => upd('visibilidade', vis.v)}
                          className={`flex-1 py-2 px-3 rounded-card border text-sm transition ${data.visibilidade === vis.v ? 'border-accent-red bg-accent-red/10 text-txt-primary' : 'border-border text-txt-secondary hover:border-accent-red/30'}`}
                        >
                          {vis.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tab Navigation + Actions */}
        <div className="flex items-center justify-between p-5 border-t border-border shrink-0">
          <div className="flex gap-2">
            {activeTab !== 'basico' && (
              <button
                onClick={() => {
                  const idx = TABS.findIndex(t => t.id === activeTab);
                  if (idx > 0) setActiveTab(TABS[idx - 1].id);
                }}
                className="px-3 py-1.5 rounded-card border border-border text-sm text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary transition"
              >
                ← Anterior
              </button>
            )}
            {activeTab !== 'upload' && (
              <button
                onClick={() => {
                  const idx = TABS.findIndex(t => t.id === activeTab);
                  if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
                }}
                className="px-3 py-1.5 rounded-card border border-border text-sm text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary transition"
              >
                Próximo →
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {saving ? 'Salvando...' : project ? '💾 Salvar' : '💾 Criar Projeto'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Project Card
// ────────────────────────────────────────────────────────────
function ProjectCard({ project, onEdit, onDelete, onDuplicate, onPipeline }) {
  return (
    <div className="rounded-card border border-border bg-bg-secondary hover:border-accent-red/30 transition group flex flex-col">
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-txt-primary truncate">{project.name}</h3>
            <p className="text-xs text-accent-teal">{project.nicho}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {project.subir_youtube && (
              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Youtube size={9} /> YT
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1 text-txt-secondary">
            <Globe size={10} /> {LANGUAGE_LABELS[project.idioma] || project.idioma}
          </div>
          <div className="flex items-center gap-1 text-txt-secondary">
            {project.orientacao === 'horizontal' ? '📺' : '📱'} {project.orientacao === 'horizontal' ? '16:9' : '9:16'}
          </div>
          <div className="flex items-center gap-1 text-txt-secondary">
            🎬 {project.qtd_videos_padrao} vídeos/ciclo
          </div>
          <div className="flex items-center gap-1 text-txt-secondary">
            📝 {project.palavras_roteiro} palavras
          </div>
          <div className="flex items-center gap-1 text-txt-secondary col-span-2">
            <Clock size={10} /> Criado em {project.created_at}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-3 flex gap-1.5">
        <Button variant="primary" size="sm" className="flex-1" onClick={() => onPipeline(project)}>
          <Zap size={12} /> Pipeline
        </Button>
        <button onClick={() => onEdit(project)} className="p-2 rounded-card border border-border text-txt-secondary hover:text-accent-teal hover:border-accent-teal/30 hover:bg-accent-teal/10 transition" title="Editar">
          <Edit2 size={14} />
        </button>
        <button onClick={() => onDuplicate(project)} className="p-2 rounded-card border border-border text-txt-secondary hover:text-success hover:border-success/30 hover:bg-success/10 transition" title="Duplicar">
          <Copy size={14} />
        </button>
        <button onClick={() => onDelete(project.id)} className="p-2 rounded-card border border-border text-txt-secondary hover:text-error hover:border-error/30 hover:bg-error/10 transition" title="Deletar">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────
export default function Projects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const filtered = projects.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.nicho.toLowerCase().includes(query.toLowerCase())
  );

  const handleSave = (data) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...data } : p));
      toast.success('Projeto atualizado!');
    } else {
      setProjects(prev => [{ ...data, id: String(Date.now()), created_at: new Date().toISOString().slice(0, 10) }, ...prev]);
      toast.success('Projeto criado!');
    }
    setEditingProject(null);
  };

  const handleDelete = (id) => {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Projeto removido.');
  };

  const handleDuplicate = (project) => {
    const dupe = { ...project, id: String(Date.now()), name: `${project.name} (Cópia)`, created_at: new Date().toISOString().slice(0, 10) };
    setProjects(prev => [dupe, ...prev]);
    toast.success('Projeto duplicado!');
  };

  const handlePipeline = (project) => {
    toast(`🚀 Abrindo pipeline para: ${project.name}`);
    setTimeout(() => { window.location.href = '/pipeline'; }, 800);
  };

  const openNew = () => { setEditingProject(null); setShowForm(true); };
  const openEdit = (p) => { setEditingProject(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingProject(null); };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-3">
              <FolderKanban size={24} className="text-accent-red" /> Projetos
            </h1>
            <p className="text-sm text-txt-secondary mt-1">
              {projects.length} projeto(s) — cada projeto agrupa configurações para produção em lote
            </p>
          </div>
          <Button variant="primary" onClick={openNew}>
            <Plus size={16} /> + Novo Projeto
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary/50" />
          <input
            className="input-base pl-9 py-2"
            placeholder="Buscar projetos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card className="text-center py-16">
            <FolderKanban size={48} className="text-txt-secondary/20 mx-auto mb-4" />
            {projects.length === 0 ? (
              <>
                <p className="text-txt-secondary font-medium">Nenhum projeto ainda.</p>
                <p className="text-txt-secondary/50 text-sm mt-1">Crie um projeto para começar a produzir vídeos em lote.</p>
                <Button variant="primary" size="sm" className="mt-5" onClick={openNew}>
                  <Plus size={14} /> Criar Primeiro Projeto
                </Button>
              </>
            ) : (
              <p className="text-txt-secondary">Nenhum projeto encontrado para &quot;{query}&quot;</p>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={openEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onPipeline={handlePipeline}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}
