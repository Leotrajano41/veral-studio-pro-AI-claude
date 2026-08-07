import Link from 'next/link';
import { Video, Settings, LogOut, ShieldCheck, HelpCircle, BookOpen } from 'lucide-react';
import Button from './shared/Button';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0F172A] border-b border-[#334155] px-4 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-card bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition duration-180">
            <Video size={20} className="fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Viral Studio Pro AI <span className="text-[10px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-1.5 py-0.2 rounded font-mono">v2.0 PRO</span>
            </span>
            <span className="text-[10px] text-[#94A3B8] hidden sm:block">Plataforma Profissional de Automação de Vídeos IA</span>
          </div>
        </Link>
      </div>

      {/* Serial do Usuário & Ações */}
      <div className="flex items-center gap-3">
        {/* Serial Mascarado / Ativo */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-card bg-[#1E293B] border border-[#334155] text-xs">
          <ShieldCheck size={14} className="text-[#10B981]" />
          <span className="text-[#94A3B8]">Serial:</span>
          <span className="font-mono font-semibold text-white">AG-2026-PRO-7X4K</span>
          <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.2 rounded font-bold">ATIVADO</span>
        </div>

        {/* Botão de Documentação / Ajuda */}
        <Link href="/docs" title="Central de Ajuda e Tutoriais">
          <Button variant="secondary" size="sm" className="text-xs">
            <BookOpen size={14} className="text-[#6366F1]" /> <span className="hidden sm:inline">Docs</span>
          </Button>
        </Link>

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
