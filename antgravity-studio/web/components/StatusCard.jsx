import React from 'react';
import Link from 'next/link';
import { Key, ShieldCheck, Zap, Mic2, Settings, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import useBadges from '../hooks/useBadges';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import { cn } from '../lib/utils';

export default function StatusCard({ className }) {
  const { configuredCount, hasError, statusHistory } = useBadges();
  const isFullyReady = configuredCount >= 5 && !hasError;

  return (
    <div
      className={cn(
        'bg-[#1E293B]/80 border border-[#334155] rounded-2xl p-5 shadow-card space-y-4 relative overflow-hidden transition-all duration-300',
        className
      )}
    >
      {/* Background Glow Accent */}
      <div
        className={cn(
          'absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-500',
          hasError ? 'bg-[#EF4444]' : isFullyReady ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
        )}
      />

      {/* Main Banner Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0 transition-colors duration-300',
              hasError
                ? 'bg-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : isFullyReady
                  ? 'bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] shadow-[0_0_15px_rgba(245,158,11,0.4)]'
            )}
          >
            {hasError ? <AlertTriangle size={20} /> : isFullyReady ? <CheckCircle2 size={20} /> : <Settings size={20} className="animate-spin-slow" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Indicador de Status Global
              </h2>
              <Badge
                color={hasError ? 'red' : isFullyReady ? 'green' : 'yellow'}
                tooltip={hasError ? 'Chave de API com erro de conexão' : isFullyReady ? 'Todas as 5 APIs prontas' : 'Configuração em andamento'}
              >
                {hasError ? '⚠️ Atenção Exigida' : isFullyReady ? '🟢 100% Operacional' : '🟡 Setup Pendente'}
              </Badge>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {hasError
                ? 'Detectada falha em uma das chaves configuradas. Clique para corrigir.'
                : isFullyReady
                  ? 'Todas as 5 APIs essenciais estão ativas e validadas no sistema.'
                  : `Configuração em andamento (${configuredCount}/5 APIs salvas). Conclua o setup para liberar a automação total.`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/settings">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-glow transition active:scale-95">
            <Settings size={14} />
            <span>Gerenciar APIs</span>
            <ArrowRight size={13} />
          </button>
        </Link>
      </div>

      {/* 4 Status Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: APIs */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">APIs Salvas</span>
            <Key size={14} className="text-[#a855f7]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-white font-mono">{configuredCount}/5</span>
            <ProgressBar value={configuredCount} max={5} />
          </div>
        </div>

        {/* Metric 2: Pipeline */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">Pipeline Mágico</span>
            <Zap size={14} className="text-[#F59E0B]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">
              {isFullyReady ? '⚡ Prontidão Total' : '🟡 Modo Parcial'}
            </span>
            <Badge color="purple" tooltip="HOT — Comece aqui após setup">HOT</Badge>
          </div>
        </div>

        {/* Metric 3: TTS Engine */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">Vozes TTS</span>
            <Mic2 size={14} className="text-[#38BDF8]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">Edge Neural</span>
            <Badge color="green">✓ Ativo</Badge>
          </div>
        </div>

        {/* Metric 4: Security */}
        <div className="bg-[#0F172A]/70 border border-[#334155] rounded-xl p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span className="font-semibold">Segurança</span>
            <ShieldCheck size={14} className="text-[#10B981]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">AES-256</span>
            <Badge color="green">✓ Seguro</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
