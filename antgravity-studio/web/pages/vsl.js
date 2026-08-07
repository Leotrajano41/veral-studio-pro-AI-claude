import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Film, Play, Settings2, Zap, ChevronRight, Sparkles,
  Monitor, Clock, BookOpen, Mic2, Image as ImageIcon, Clapperboard,
} from 'lucide-react';
import toast from 'react-hot-toast';

const VSL_TEMPLATES = [
  { id: 'problem-agitate', label: 'Problema-Agitação-Solução', desc: 'Clássico da persuasão, alta conversão', duration: '5-10min', color: 'text-accent-red', bg: 'bg-accent-red/10' },
  { id: 'story-reveal', label: 'História + Revelação', desc: 'Storytelling emocional com revelação no final', duration: '8-15min', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'results-first', label: 'Resultados Primeiro', desc: 'Mostra resultados e depois explica como', duration: '6-12min', color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
  { id: 'documentary', label: 'Documentário', desc: 'Estilo Netflix, narração profissional', duration: '10-20min', color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

const VSL_STEPS = [
  { icon: BookOpen, label: 'Roteiro VSL', desc: 'Estrutura de vendas em formato longo' },
  { icon: Mic2, label: 'Narração Pro', desc: 'Voz dramatizada com pausas estratégicas' },
  { icon: ImageIcon, label: 'Visuals Cinematográficos', desc: 'Imagens e vídeos de alta qualidade' },
  { icon: Clapperboard, label: 'Edição Avançada', desc: 'Cortes, transições e efeitos cinematográficos' },
];

export default function VSL() {
  const [template, setTemplate] = useState('problem-agitate');
  const [config, setConfig] = useState({
    product: '', audience: '', mainProblem: '', solution: '', price: '', guarantee: '',
  });
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!config.product || !config.audience) { toast.error('Preencha ao menos o produto e o público!'); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    toast.success('🎬 VSL Cinematográfica iniciada no Pipeline!');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-card border border-border bg-gradient-to-br from-bg-secondary via-bg-secondary to-accent-red/5 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Film size={20} className="text-accent-red" />
              <Badge text="PRO" variant="error" />
            </div>
            <h1 className="text-3xl font-bold text-txt-primary mb-2">VSL Cinematográfica</h1>
            <p className="text-txt-secondary max-w-xl">Pipeline especializado para criar Video Sales Letters (VSL) de alta conversão com produção cinematográfica. Integra roteiro persuasivo, narração dramática e visuais premium.</p>
          </div>
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-sm font-semibold text-txt-secondary uppercase tracking-wider mb-4">Escolha o Template VSL</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VSL_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`p-4 rounded-card border text-left transition ${template === t.id ? 'border-accent-red bg-accent-red/5 ring-1 ring-accent-red/20' : 'border-border bg-bg-secondary hover:border-accent-red/30'}`}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${t.bg} ${t.color}`}>
                  <Film size={11} /> {t.label}
                </div>
                <p className="text-sm text-txt-primary font-medium">{t.label}</p>
                <p className="text-xs text-txt-secondary mt-1">{t.desc}</p>
                <p className="text-[11px] text-txt-secondary/50 mt-2 flex items-center gap-1">
                  <Clock size={11} /> Duração típica: {t.duration}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Config + Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Config Form */}
          <Card title="Configurar VSL">
            <div className="space-y-4">
              {[
                { key: 'product', label: 'Produto / Serviço *', placeholder: 'Ex: Curso de Investimentos' },
                { key: 'audience', label: 'Público-alvo *', placeholder: 'Ex: Pessoas que querem sair das dívidas' },
                { key: 'mainProblem', label: 'Problema Principal', placeholder: 'Ex: Gastam mais do que ganham' },
                { key: 'solution', label: 'Sua Solução', placeholder: 'Ex: Método de controle financeiro em 30 dias' },
                { key: 'price', label: 'Preço (opcional)', placeholder: 'Ex: R$ 97 ou 12x R$ 9,70' },
                { key: 'guarantee', label: 'Garantia', placeholder: 'Ex: 7 dias ou dinheiro de volta' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-txt-secondary mb-1 block">{f.label}</label>
                  <input className="input-base" placeholder={f.placeholder} value={config[f.key]} onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
          </Card>

          {/* Pipeline Preview */}
          <div className="space-y-4">
            <Card title="Pipeline VSL">
              <div className="space-y-3">
                {VSL_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-card bg-bg-tertiary/50">
                      <div className="w-8 h-8 rounded-full bg-accent-red/10 flex items-center justify-center">
                        <Icon size={16} className="text-accent-red" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-txt-primary">{step.label}</p>
                        <p className="text-[11px] text-txt-secondary">{step.desc}</p>
                      </div>
                      <span className="text-[10px] text-txt-secondary/50 font-mono">#{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Estimativa de Produção">
              <div className="space-y-2">
                {[
                  { label: 'Roteiro', time: '~30s (IA)' },
                  { label: 'Narração', time: '~2min (TTS)' },
                  { label: 'Busca de Mídias', time: '~1min (API)' },
                  { label: 'Renderização', time: '~5-15min' },
                ].map(e => (
                  <div key={e.label} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                    <span className="text-xs text-txt-secondary">{e.label}</span>
                    <span className="text-xs font-medium text-txt-primary">{e.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Button variant="primary" className="w-full" onClick={handleGenerate} disabled={generating}>
              {generating ? <Sparkles size={16} className="animate-spin" /> : <Zap size={16} />}
              {generating ? 'Iniciando VSL...' : '🎬 Criar VSL Cinematográfica'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
