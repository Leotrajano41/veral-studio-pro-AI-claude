import React from 'react';
import Link from 'next/link';
import { Check, CheckCircle2, Clock, XCircle, Info, ArrowRight, Settings, Brain, Sparkles, Mic2, ImageIcon, Key } from 'lucide-react';
import useBadges from '../../hooks/useBadges';
import Badge from '../Badge';
import ProgressBar from '../ProgressBar';
import { cn } from '../../lib/utils';

const ESSENTIAL_APIS = [
  {
    key: 'openai',
    name: 'OpenAI (GPT-4o-mini)',
    desc: 'Geração de roteiros e prompts de mídia',
    icon: Brain,
    category: 'Inteligência Artificial',
  },
  {
    key: 'gemini',
    name: 'Google Gemini',
    desc: 'LLM alternativa para revisão e análise',
    icon: Sparkles,
    category: 'Inteligência Artificial',
  },
  {
    key: 'openrouter',
    name: 'OpenRouter',
    desc: 'Geração de thumbnails e capas em HD',
    icon: Sparkles,
    category: 'Imagens & Capas',
  },
  {
    key: 'assembly',
    name: 'Assembly AI',
    desc: 'Transcrição e legendagem sincronizada',
    icon: Mic2,
    category: 'Áudio & Legendas',
  },
  {
    key: 'pixabay',
    name: 'Pixabay',
    desc: 'Download de vídeos de fundo stock em 4K/HD',
    icon: ImageIcon,
    category: 'Mídia Stock',
  },
];

export default function SetupChecklistCard({ className }) {
  const { statusHistory, configuredCount } = useBadges();
  const isAllDone = configuredCount >= 5;

  return (
    <div
      className={cn(
        'bg-[#1E293B]/90 border border-[#334155] rounded-2xl p-5 sm:p-6 shadow-card space-y-5 relative overflow-hidden transition-all duration-300',
        className
      )}
    >
      {/* Background Subtle Accent */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-[#7C3AED]/10 via-[#6366F1]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Progress Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#334155]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Seu Setup — Rastreamento de APIs
            </h2>
            <Badge color={isAllDone ? 'green' : 'yellow'}>
              {isAllDone ? '✓ Setup 100% Concluído' : `${configuredCount}/5 APIs Prontas`}
            </Badge>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Rastreie abaixo quais das 5 APIs essenciais já estão validadas para liberar automação completa.
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 bg-[#0F172A] px-4 py-2 rounded-xl border border-[#334155]">
          <div className="text-right">
            <p className="text-xs font-bold text-white font-mono">{configuredCount} de 5 APIs</p>
            <p className="text-[10px] text-[#94A3B8]">{Math.round((configuredCount / 5) * 100)}% concluído</p>
          </div>
          <ProgressBar value={configuredCount} max={5} className="w-16 h-2" />
        </div>
      </div>

      {/* Success Celebration Banner when all 5 are set */}
      {isAllDone && (
        <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-between gap-3 text-xs text-[#34D399]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#10B981] shrink-0" />
            <span className="font-semibold">Parabéns! Todas as 5 APIs estão ativas. O Pipeline Mágico está 100% pronto!</span>
          </div>
          <Link href="/pipeline">
            <button className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold transition text-xs shrink-0 shadow">
              ⚡ Ir para Pipeline
            </button>
          </Link>
        </div>
      )}

      {/* 5 Essential APIs Checklist Items Grid */}
      <div className="space-y-2.5">
        {ESSENTIAL_APIS.map((api) => {
          const apiData = statusHistory?.api_status?.[api.key];
          const isConfigured = apiData?.status === 'active';
          const isError = apiData?.status === 'error';
          const Icon = api.icon;
          const lastChecked = apiData?.last_checked || (isConfigured ? 'Hoje' : null);

          return (
            <div
              key={api.key}
              className={cn(
                'flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group',
                isConfigured
                  ? 'bg-[#10B981]/5 border-[#10B981]/30 text-white shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                  : isError
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-white shadow-[0_0_12px_rgba(239,68,68,0.08)]'
                    : 'bg-[#0F172A]/40 border-[#334155]/60 text-[#94A3B8] hover:border-[#6366F1]/40'
              )}
            >
              {/* Left Side: Indicator Checkbox & Info */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Visual Indicator Checkbox (Item 3 & Item 4) */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                    isConfigured
                      ? 'bg-[#10B981] border-[#10B981] text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                      : isError
                        ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                        : 'bg-[#1E293B] border-[#334155] text-[#F59E0B]'
                  )}
                  title={isConfigured ? 'API Configurada e Ativa' : isError ? 'Erro na API' : 'API Pendente de Configuração'}
                >
                  {isConfigured && <CheckCircle2 size={15} strokeWidth={2.5} />}
                  {isError && <XCircle size={15} strokeWidth={2.5} />}
                  {!isConfigured && !isError && <Clock size={14} strokeWidth={2.5} />}
                </div>

                {/* Icon & Details */}
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center shrink-0 text-[#818CF8]">
                  <Icon size={15} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{api.name}</h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#334155]/40 text-[#94A3B8] font-medium hidden sm:inline-block">
                      {api.category}
                    </span>
                    {isConfigured && lastChecked && (
                      <span className="text-[9px] text-[#10B981] font-mono hidden md:inline-block">
                        • Verificada: {lastChecked}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">{api.desc}</p>
                </div>
              </div>

              {/* Right Side: Status Badge & Action Link */}
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <Badge
                  color={isConfigured ? 'green' : isError ? 'red' : 'yellow'}
                  tooltip={
                    isConfigured
                      ? `✓ ${api.name} ativa e validada. Criptografada em AES-256.`
                      : isError
                        ? `❌ Falha ao conectar com ${api.name}`
                        : `⏳ ${api.name} pendente de configuração`
                  }
                >
                  {isConfigured ? '✓ Configurada' : isError ? '❌ Erro' : '⏳ Pendente'}
                </Badge>

                {!isConfigured && (
                  <Link href="/settings">
                    <button className="flex items-center gap-1 text-xs text-[#818CF8] hover:text-white hover:underline font-semibold transition">
                      <span>Configurar</span>
                      <ArrowRight size={12} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
