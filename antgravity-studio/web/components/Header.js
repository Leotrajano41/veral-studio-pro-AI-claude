import Link from 'next/link';
import { Video, Settings, LogOut, ShieldCheck, Zap } from 'lucide-react';
import Button from './shared/Button';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#1a1a1a] border-b border-[#444444] px-4 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-card bg-gradient-to-br from-[#FF6B6B] to-[#A78BFA] flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition duration-180">
            <Video size={20} className="fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Viral Studio Pro AI <span className="text-[10px] bg-[#FF6B6B] text-white px-1.5 py-0.2 rounded font-mono">v2.0 PRO</span>
            </span>
            <span className="text-[10px] text-[#B0B0B0] hidden sm:block">Plataforma Profissional de Automação de Vídeos IA</span>
          </div>
        </Link>
      </div>

      {/* Serial do Usuário & Ações */}
      <div className="flex items-center gap-3">
        {/* Serial Mascarado / Ativo */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-card bg-[#2a2a2a] border border-[#444444] text-xs">
          <ShieldCheck size={14} className="text-[#10B981]" />
          <span className="text-[#B0B0B0]">Serial:</span>
          <span className="font-mono font-semibold text-white">AG-2026-PRO-7X4K</span>
          <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.2 rounded font-bold">ATIVADO</span>
        </div>

        {/* Botão Configurações */}
        <Link href="/settings">
          <Button variant="secondary" size="sm" className="text-xs">
            <Settings size={14} /> <span className="hidden sm:inline">Configurações</span>
          </Button>
        </Link>

        {/* Botão Encerrar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (typeof window !== 'undefined' && window.confirm('Deseja encerrar a sessão no Viral Studio Pro AI?')) {
              window.location.href = '/settings';
            }
          }}
          className="text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
        >
          <LogOut size={14} /> <span className="hidden sm:inline">Encerrar</span>
        </Button>
      </div>
    </header>
  );
}
