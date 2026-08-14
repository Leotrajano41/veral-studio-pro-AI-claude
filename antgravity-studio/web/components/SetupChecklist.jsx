import React from 'react';
import Link from 'next/link';
import { Brain, Sparkles, Mic2, ImageIcon, CheckCircle2, Search, Download, Zap } from 'lucide-react';
import useSetupStatus from '../hooks/useSetupStatus';
import useBadges, { formatConfiguredDate } from '../hooks/useBadges';
import ProgressIndicator from './ProgressIndicator';
import ChecklistItem from './ChecklistItem';
import Badge from './Badge';
import { cn } from '../lib/utils';

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

export default function SetupChecklist({ className, isCompact = false }) {
  const { setupStatus, isVerifying, verifyAllApis, exportSetupConfig } = useSetupStatus();
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

      {/* Header & Progress Indicator */}
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

        {/* Progress Indicator */}
        <ProgressIndicator count={configuredCount} total={5} />
      </div>

      {/* Action Bar (Item 11 & Item 12) */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-[#0F172A]/70 p-3 rounded-xl border border-[#334155]">
        <div className="flex items-center gap-2">
          {/* Button Verification (Item 12) */}
          <button
            onClick={verifyAllApis}
            disabled={isVerifying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6366F1]/20 hover:bg-[#6366F1]/30 border border-[#6366F1]/40 text-[#818CF8] text-xs font-bold transition active:scale-95 disabled:opacity-50"
            title="Testar a resposta de cada uma das 5 APIs essenciais"
          >
            <Search size={13} className={isVerifying ? 'animate-spin' : ''} />
            <span>{isVerifying ? 'Verificando...' : '🔍 Verificar todas as APIs'}</span>
          </button>
        </div>

        {/* Button Export Configuration (Item 11) */}
        <button
          onClick={exportSetupConfig}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-bold transition active:scale-95"
          title="Baixar backup da lista de APIs em arquivo JSON"
        >
          <Download size={13} />
          <span>💾 Exportar configuração</span>
        </button>
      </div>

      {/* Steps Linear Track (Item 9) */}
      {!isCompact && (
        <div className="bg-[#0F172A]/80 border border-[#334155] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-semibold text-white">Progresso Linear por Etapas</span>
            <span className="font-mono font-bold text-[#818CF8]">{configuredCount}/5 Etapas</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {ESSENTIAL_APIS.map((api, idx) => {
              const isDone = setupStatus[api.key] === true || statusHistory?.api_status?.[api.key]?.status === 'active';
              return (
                <div
                  key={api.key}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500',
                    isDone ? 'bg-gradient-to-r from-[#10B981] to-[#34D399]' : 'bg-[#334155]'
                  )}
                  title={`Etapa ${idx + 1}: ${api.name}`}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-5 gap-1 text-[10px] text-[#64748B] font-mono text-center pt-0.5">
            {ESSENTIAL_APIS.map((api, idx) => {
              const isDone = setupStatus[api.key] === true || statusHistory?.api_status?.[api.key]?.status === 'active';
              return (
                <span key={api.key} className={cn('truncate', isDone ? 'text-[#10B981] font-bold' : 'text-[#64748B]')}>
                  {idx + 1}. {api.name.split(' ')[0]}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Celebration Banner when 5/5 completed */}
      {isAllDone && (
        <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-between gap-3 text-xs text-[#34D399]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#10B981] shrink-0" />
            <span className="font-semibold">🎉 Setup completo! Todas as 5 APIs estão 100% ativas!</span>
          </div>
          <Link href="/pipeline">
            <button className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold transition text-xs shrink-0 shadow">
              ⚡ Ir para Pipeline
            </button>
          </Link>
        </div>
      )}

      {/* 5 Checklist Items */}
      <div className="space-y-2.5">
        {ESSENTIAL_APIS.map((api) => {
          const apiData = statusHistory?.api_status?.[api.key];
          const isConfigured = setupStatus[api.key] === true || apiData?.status === 'active';
          const isError = apiData?.status === 'error';
          const dateStr = configuredDates?.api_configured_dates?.[api.key];
          const formattedDate = formatConfiguredDate(dateStr);
          const expDays = apiData?.exp_days;

          return (
            <ChecklistItem
              key={api.key}
              api={api}
              isConfigured={isConfigured}
              isError={isError}
              lastChecked={formattedDate}
              expDays={expDays}
            />
          );
        })}
      </div>
    </div>
  );
}
