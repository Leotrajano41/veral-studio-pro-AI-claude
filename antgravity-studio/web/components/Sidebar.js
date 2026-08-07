import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Zap, ListOrdered, FolderKanban, TrendingUp, Newspaper,
  Film, Tv, ScrollText, Mic2, Image as ImageIcon, Clapperboard,
  LayoutTemplate, FolderOpen, Settings, ChevronLeft, ChevronRight,
  LayoutDashboard, AudioWaveform,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navGroups = [
  {
    label: 'Produção',
    items: [
      { href: '/pipeline', label: 'Pipeline Mágico', icon: Zap, badge: 'HOT' },
      { href: '/queue', label: 'Fila', icon: ListOrdered },
      { href: '/projects', label: 'Projetos', icon: FolderKanban },
    ],
  },
  {
    label: 'Descoberta',
    items: [
      { href: '/trends', label: 'Tendências', icon: TrendingUp },
      { href: '/news', label: 'Notícias', icon: Newspaper },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { href: '/scripts', label: 'Roteiros', icon: ScrollText },
      { href: '/narrations', label: 'Narrações', icon: Mic2 },
      { href: '/voices', label: 'Vozes Clonadas', icon: AudioWaveform, badge: 'XTTS' },
      { href: '/media', label: 'Mídias', icon: ImageIcon },
      { href: '/render', label: 'Renderizar', icon: Clapperboard },
      { href: '/thumbnail', label: 'Thumbnail', icon: LayoutTemplate },
    ],
  },
  {
    label: 'Avançado',
    items: [
      { href: '/vsl', label: 'VSL Cinematográfica', icon: Film },
      { href: '/channels', label: 'Canais / Upload', icon: Tv },
      { href: '/files', label: 'Arquivos', icon: FolderOpen },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/settings', label: 'Configurações', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-30 bg-bg-secondary border-r border-border hidden lg:flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-txt-secondary hover:text-txt-primary transition z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-2">
              {!collapsed && (
                <p className="text-[10px] font-semibold text-txt-secondary/50 uppercase tracking-widest px-3 mb-1">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const active = router.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-medium transition relative group',
                      active
                        ? 'bg-accent-red/10 text-accent-red'
                        : 'text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary'
                    )}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-[9px] font-bold bg-accent-red text-white px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <div className="absolute left-14 bg-bg-tertiary border border-border text-txt-primary text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
              {!collapsed && <div className="border-t border-border/30 mt-2" />}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-3 m-2 rounded-card bg-gradient-to-r from-accent-red/10 to-accent-teal/10 border border-border text-center">
            <p className="text-[10px] text-txt-secondary">Viral Studio Pro AI</p>
            <p className="text-[9px] text-accent-red font-semibold">v2.0 PRO</p>
          </div>
        )}
      </aside>

      {/* Mobile: Bottom Tab Bar for key sections */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-bg-secondary border-t border-border flex lg:hidden items-center justify-around px-2 py-2">
        {[
          { href: '/', icon: LayoutDashboard, label: 'Home' },
          { href: '/pipeline', icon: Zap, label: 'Pipeline' },
          { href: '/projects', icon: FolderKanban, label: 'Projetos' },
          { href: '/queue', icon: ListOrdered, label: 'Fila' },
          { href: '/settings', icon: Settings, label: 'Config' },
        ].map(({ href, icon: Icon, label }) => {
          const active = router.pathname === href;
          return (
            <Link key={href} href={href} className={cn('flex flex-col items-center gap-0.5 px-3 py-1 rounded-card transition', active ? 'text-accent-red' : 'text-txt-secondary')}>
              <Icon size={20} />
              <span className="text-[9px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
