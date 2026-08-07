import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Zap, FolderKanban, ListOrdered, TrendingUp, Newspaper,
  ScrollText, Mic2, Image as ImageIcon, Clapperboard, LayoutTemplate,
  FolderOpen, Film, Tv, Settings, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/pipeline', label: 'Pipeline Mágico', icon: Zap, badge: 'HOT' },
  { href: '/projects', label: 'Projetos', icon: FolderKanban },
  { href: '/queue', label: 'Fila', icon: ListOrdered },
  { href: '/trends', label: 'Tendências', icon: TrendingUp },
  { href: '/news', label: 'Notícias', icon: Newspaper },
  { href: '/scripts', label: 'Roteiros', icon: ScrollText },
  { href: '/voiceovers', label: 'Narrações', icon: Mic2 },
  { href: '/medias', label: 'Mídias', icon: ImageIcon },
  { href: '/render', label: 'Renderizar', icon: Clapperboard },
  { href: '/thumbnail', label: 'Thumbnail', icon: LayoutTemplate },
  { href: '/files', label: 'Arquivos', icon: FolderOpen },
  { href: '/vsl', label: 'VSL Cinematográfica', icon: Film, badge: '42 P' },
  { href: '/channels', label: 'Canais / Upload', icon: Tv },
  { href: '/docs', label: 'Documentação', icon: BookOpen },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-30 bg-[#0F172A] border-r border-[#334155] hidden lg:flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#94A3B8] hover:text-white transition z-10"
          aria-label={collapsed ? 'Expandir Sidebar' : 'Colapsar Sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Navigation List (16 Menu Links) */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const active = router.pathname === item.href ||
              (item.href === '/voiceovers' && router.pathname === '/narrations') ||
              (item.href === '/medias' && router.pathname === '/media');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-card text-xs font-semibold transition relative group',
                  active
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-glow'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                )}
              >
                <Icon size={16} className={cn('shrink-0', active ? 'text-white' : 'text-[#94A3B8] group-hover:text-white')} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className={cn(
                    'ml-auto text-[9px] px-1.5 py-0.2 rounded font-bold uppercase',
                    active ? 'bg-white/20 text-white' : 'bg-[#6366F1]/20 text-[#6366F1]'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Bar Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A] border-t border-[#334155] px-2 py-1.5 flex items-center justify-around overflow-x-auto">
        {navItems.slice(0, 5).map((item) => {
          const active = router.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 p-1 rounded text-[10px] font-semibold transition',
                active ? 'text-[#6366F1]' : 'text-[#94A3B8]'
              )}
            >
              <Icon size={18} />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
