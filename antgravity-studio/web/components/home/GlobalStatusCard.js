import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Key, Mic2, FolderKanban, CheckCircle2, AlertTriangle, ArrowRight, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

const API_COUNT_KEY = 'vsp_configured_apis_count';
const ERROR_KEY = 'vsp_api_has_error';

export default function GlobalStatusCard() {
  const [apiCount, setApiCount] = useState(1);
  const [hasError, setHasError] = useState(false);

  const syncStatus = () => {
    if (typeof window === 'undefined') return;
    try {
      const storedCount = localStorage.getItem(API_COUNT_KEY);
      setApiCount(storedCount !== null ? parseInt(storedCount, 10) : 1);
      setHasError(localStorage.getItem(ERROR_KEY) === 'true');
    } catch (_) {}
  };

  useEffect(() => {
    syncStatus();
    window.addEventListener('vsp_api_count_change', syncStatus);
    window.addEventListener('vsp_api_error_change', syncStatus);
    return () => {
      window.removeEventListener('vsp_api_count_change', syncStatus);
      window.removeEventListener('vsp_api_error_change', syncStatus);
    };
  }, []);

  const isFullyReady = apiCount >= 5 && !hasError;

  return (
    <div className="bg-[#1E293B]/80 border border-[#334155] rounded-2xl p-5 shadow-card space-y-4 relative overflow-hidden transition-all duration-300">
      {/* Glow background accent */}
      <div
        className={cn(
          'absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-500',
          hasError ? 'bg-[#EF4444]' : isFullyReady ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
        )}
      />

      {/* Main Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0 transition-colors duration-300',
              hasError
                ? 'bg-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : isFullyReady
                  ? 'bg-gradient-to-br from-[#22C55E] to-[#16A34A] shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                  : 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] shadow-[0_0_15px_rgba(245,158,11,0.4)]'
            )}
          >
            {hasError ? <AlertTriangle size={20} /> : isFullyReady ? <CheckCircle2 size={20} /> : <Settings size={20} className="animate-spin-slow" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Status Global do Sistema
              </h2>
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border animate-pulse',
                  hasError
                    ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
                    : isFullyReady
                      ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                      : 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#FBBF24]/40'
                )}
              >
                {hasError ? '⚠️ Atenção Exigida' : isFullyReady ? '🟢 100% Operacional' : '🟡 Setup Pendente'}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {hasError
                ? 'Detectado erro em uma ou mais chaves de API. Clique para corrigir.'
                : isFullyReady
                  ? 'Todas as 5 APIs principais estão ativas e validadas no sistema.'
                  : `Configuração em andamento (${apiCount}/5 APIs salvas). Conclua para liberar automação total.`}
            </p>
          </div>
        </div>

        {/* Quick action button */}
        <Link href="/settings">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-glow transition active:scale-95">
            <Settings size={14} />
            <span>Configurar APIs</span>
            <ArrowRight size={13} />
          </button>
        </Link>
      </div>

      {/* 4 Status Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: APIs */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">APIs Salvas</span>
            <Key size={14} className="text-[#818CF8]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-white font-mono">{apiCount}/5</span>
            <span className={cn('text-[10px] font-bold px-1.5 py-0.2 rounded', isFullyReady ? 'text-[#22C55E]' : 'text-[#FBBF24]')}>
              {isFullyReady ? '✓ Completo' : `${Math.round((apiCount / 5) * 100)}%`}
            </span>
          </div>
        </div>

        {/* Metric 2: Pipeline */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">Pipeline Mágico</span>
            <Zap size={14} className="text-[#F59E0B]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs font-extrabold text-white">
              {isFullyReady ? '⚡ Prontidão Total' : '🟡 Modo Parcial'}
            </span>
            <span className="text-[10px] text-[#A855F7] font-bold">HOT</span>
          </div>
        </div>

        {/* Metric 3: TTS Engine */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">Vozes TTS</span>
            <Mic2 size={14} className="text-[#38BDF8]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs font-extrabold text-white">Edge Neural</span>
            <span className="text-[10px] text-[#22C55E] font-bold">✓ Ativo</span>
          </div>
        </div>

        {/* Metric 4: Security */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">Criptografia</span>
            <ShieldCheck size={14} className="text-[#22C55E]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs font-extrabold text-white">AES-256</span>
            <span className="text-[10px] text-[#22C55E] font-bold">✓ Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
