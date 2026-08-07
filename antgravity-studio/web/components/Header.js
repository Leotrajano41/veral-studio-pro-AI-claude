import Link from 'next/link';
import { Zap, Settings, LogOut, Hash } from 'lucide-react';

const USER_SERIAL = 'AG-2026-PRO-7X4K';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-bg-secondary/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-accent-red to-pink-600 rounded-lg flex items-center justify-center group-hover:shadow-glow transition">
          <Zap size={18} className="text-white" />
        </div>
        <div className="hidden sm:block">
          <span className="text-base font-bold text-txt-primary leading-none">
            AntGravity <span className="text-accent-red">Studio</span>
          </span>
          <p className="text-[9px] text-txt-secondary/50 font-mono tracking-widest">VIRAL STUDIO PRO AI</p>
        </div>
      </Link>

      {/* Serial + Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Serial */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-tertiary border border-border">
          <Hash size={11} className="text-accent-teal" />
          <span className="text-[11px] font-mono text-txt-secondary">{USER_SERIAL}</span>
        </div>

        {/* Config */}
        <Link
          href="/settings"
          className="p-2 rounded-card hover:bg-bg-tertiary transition text-txt-secondary hover:text-txt-primary"
          title="Configurações"
        >
          <Settings size={18} />
        </Link>

        {/* Encerrar */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              if (confirm('Deseja encerrar a sessão?')) {
                window.location.href = '/';
              }
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-card text-xs font-medium text-error border border-error/20 hover:bg-error/10 transition"
          title="Encerrar sessão"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Encerrar</span>
        </button>
      </div>
    </header>
  );
}
