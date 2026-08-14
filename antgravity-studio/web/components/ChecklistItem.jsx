import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, XCircle, AlertTriangle, ArrowRight, RefreshCw, Wrench } from 'lucide-react';
import Badge from './Badge';
import { cn } from '../lib/utils';

export default function ChecklistItem({
  api,
  isConfigured,
  isError,
  lastChecked,
  expDays,
}) {
  const Icon = api.icon;

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group flex-wrap sm:flex-nowrap gap-3',
        isConfigured
          ? 'bg-[#10B981]/5 border-[#10B981]/30 text-white shadow-[0_0_12px_rgba(16,185,129,0.08)]'
          : isError
            ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-white shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:border-[#EF4444]/60'
            : 'bg-[#F59E0B]/5 border-[#F59E0B]/25 text-[#94A3B8] hover:border-[#F59E0B]/50'
      )}
    >
      {/* Left Side: Indicator Checkbox & Service Info */}
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
          title={isConfigured ? 'API Configurada e Ativa' : isError ? 'Erro na API' : 'API Pendente de Configuração'}
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

            {/* Expiration Notice */}
            {isConfigured && expDays && (
              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-[#F97316]/20 text-[#FB923C] border border-[#F97316]/40 flex items-center gap-1">
                <AlertTriangle size={10} /> Expira em {expDays} dias
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#64748B] truncate mt-0.5">
            {isConfigured && lastChecked
              ? lastChecked
              : isError
                ? '❌ Erro: Chave com erro 401 ou expirada'
                : api.desc}
          </p>
        </div>
      </div>

      {/* Right Side: Status Badge & Adaptive Action Button */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          color={isConfigured ? 'green' : isError ? 'red' : 'yellow'}
          tooltip={
            isConfigured
              ? `✓ ${api.name} ativa e validada. Criptografada em AES-256.`
              : isError
                ? `❌ Falha ao conectar com ${api.name}`
                : `⏳ ${api.name} pendente. Clique em 'Configurar' para adicionar a chave.`
          }
        >
          {isConfigured ? '✓ Configurada' : isError ? '❌ Erro' : '⏳ Pendente'}
        </Badge>

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
}
