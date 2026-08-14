import React from 'react';
import Link from 'next/link';
import { Check, CheckCircle2, Clock, XCircle, AlertTriangle, ArrowRight, Settings, Brain, Sparkles, Mic2, ImageIcon, RefreshCw, Wrench } from 'lucide-react';
import useBadges, { formatConfiguredDate } from '../../hooks/useBadges';
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
  const { statusHistory, configuredDates, configuredCount } = useBadges();
  const isAllDone = configuredCount >= 5;

  return (
    <div
      className={cn(
        'bg-[#1E293B]/90 border border-[#334155] rounded-2xl p-5 sm:p-6 shadow-card space-y-5 relative overflow-hidden transition-all duration-300',
        className
      )}
    >
      {/* Background Accent */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-[#7C3AED]/10 via-[#6366F1]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Progress Counter */}
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

      {/* PROGRESSO LINEAR COM ETAPAS (Item 9) */}
      <div className="bg-[#0F172A]/80 border border-[#334155] rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="font-semibold text-white">Progresso Linear por Etapas</span>
          <span className="font-mono font-bold text-[#818CF8]">{configuredCount}/5 Etapas</span>
        </div>

        {/* Steps track */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {ESSENTIAL_APIS.map((api, idx) => {
            const isDone = statusHistory?.api_status?.[api.key]?.status === 'active';
            const isErr = statusHistory?.api_status?.[api.key]?.status === 'error';
            return (
              <div
                key={api.key}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  isDone
                    ? 'bg-gradient-to-r from-[#10B981] to-[#34D399]'
                    : isErr
                      ? 'bg-[#EF4444]'
                      : 'bg-[#334155]'
                )}
                title={`Etapa ${idx + 1}: ${api.name} (${isDone ? 'Concluída' : isErr ? 'Erro' : 'Pendente'})`}
              />
            );
          })}
        </div>

        {/* Steps labels */}
        <div className="grid grid-cols-5 gap-1 text-[10px] text-[#64748B] font-mono text-center pt-0.5">
          {ESSENTIAL_APIS.map((api, idx) => {
            const isDone = statusHistory?.api_status?.[api.key]?.status === 'active';
            return (
              <span key={api.key} className={cn('truncate', isDone ? 'text-[#10B981] font-bold' : 'text-[#64748B]')}>
                {idx + 1}. {api.name.split(' ')[0]}
              </span>
            );
          })}
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

          // Date formatting (Item 5)
          const dateStr = configuredDates?.api_configured_dates?.[api.key];
          const formattedDate = formatConfiguredDate(dateStr);

          // Expiration warning (Item 6)
          const expDays = apiData?.exp_days;

          return (
            <div
              key={api.key}
              className={cn(
                'flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group flex-wrap sm:flex-nowrap gap-3',
                isConfigured
                  ? 'bg-[#10B981]/5 border-[#10B981]/30 text-white shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                  : isError
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-white shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:border-[#EF4444]/60'
                    : 'bg-[#F59E0B]/5 border-[#F59E0B]/25 text-[#94A3B8] hover:border-[#F59E0B]/50'
              )}
            >
              {/* Left Side: Indicator Checkbox & Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Visual Indicator Checkbox */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                    isConfigured
                      ? 'bg-[#10B981] border-[#10B981] text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                      : isError
                        ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse'
                        : 'bg-[#F59E0B]/20 border-[#F59E0B]/60 text-[#FBBF24] shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                  )}
                  title={isConfigured ? 'API Configurada e Ativa' : isError ? 'Erro na API' : 'API Pendente'}
                >
                  {isConfigured && <CheckCircle2 size={15} strokeWidth={2.5} />}
                  {isError && <XCircle size={15} strokeWidth={2.5} />}
                  {!isConfigured && !isError && <Clock size={14} strokeWidth={2.5} className="animate-pulse" />}
                </div>

                {/* Service Icon */}
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center shrink-0 text-[#818CF8]">
                  <Icon size={15} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-white truncate">{api.name}</h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#334155]/40 text-[#94A3B8] font-medium hidden sm:inline-block">
                      {api.category}
                    </span>

                    {/* Expiration Notice (Item 6) */}
                    {isConfigured && expDays && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-[#F97316]/20 text-[#FB923C] border border-[#F97316]/40 flex items-center gap-1">
                        <AlertTriangle size={10} /> Expira em {expDays} dias
                      </span>
                    )}
                  </div>

                  {/* Configured Date formatted string (Item 5) */}
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {isConfigured && formattedDate
                      ? formattedDate
                      : isError
                        ? `❌ Erro: ${apiData?.error_msg || 'Chave com erro 401 ou expirada'}`
                        : api.desc}
                  </p>
                </div>
              </div>

              {/* Right Side: Adaptive Action Buttons (Item 7) */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  color={isConfigured ? 'green' : isError ? 'red' : 'yellow'}
                  tooltip={
                    isConfigured
                      ? `✓ ${api.name} ativa. ${formattedDate || ''}`
                      : isError
                        ? `❌ Falha ao conectar com ${api.name}`
                        : `⏳ ${api.name} pendente de configuração`
                  }
                >
                  {isConfigured ? '✓ Configurada' : isError ? '❌ Erro' : '⏳ Pendente'}
                </Badge>

                {/* Adaptive Action Buttons (Item 7) */}
                <Link href="/settings">
                  {isConfigured && (
                    <button
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white hover:border-[#6366F1]/50 font-semibold transition"
                      title="Editar ou atualizar chave de API"
                    >
                      <RefreshCw size={12} />
                      <span>↻ Atualizar chave</span>
                    </button>
                  )}

                  {!isConfigured && !isError && (
                    <button
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#FBBF24] hover:bg-[#F59E0B]/30 font-bold transition shadow-sm"
                      title="Ir direto para o campo de configuração"
                    >
                      <Wrench size={12} />
                      <span>🔧 Configurar agora</span>
                    </button>
                  )}

                  {isError && (
                    <button
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/30 font-bold transition shadow-sm"
                      title="Abrir tela de ajuda para renovação da chave"
                    >
                      <RefreshCw size={12} />
                      <span>🔄 Renovar chave</span>
                    </button>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
