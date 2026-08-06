import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, FolderKanban, Sparkles, Film, Cpu, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const icons = { LayoutDashboard, FolderKanban, Sparkles, Film, Cpu, Settings };

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/projects', label: 'Projetos', icon: 'FolderKanban' },
  { href: '/create', label: 'Criar Vídeo', icon: 'Sparkles' },
  { href: '/videos', label: 'Vídeos', icon: 'Film' },
  { href: '/antigravity', label: 'Antigravity', icon: 'Cpu' },
  { href: '/settings', label: 'Configurações', icon: 'Settings' },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="fixed top-16 left-0 bottom-0 z-30 w-60 bg-bg-secondary border-r border-border p-4 hidden lg:flex flex-col justify-between">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = icons[item.icon];
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-medium transition',
                active
                  ? 'bg-accent-red/10 text-accent-red'
                  : 'text-txt-secondary hover:text-txt-primary hover:bg-bg-tertiary'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 rounded-card bg-bg-tertiary/50 border border-border text-center">
        <p className="text-xs text-txt-secondary">AntGravity Studio v2.0</p>
      </div>
    </aside>
  );
}
