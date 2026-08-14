import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Zap, FolderKanban, ListOrdered, TrendingUp, Newspaper,
  ScrollText, Mic2, Image as ImageIcon, Clapperboard, LayoutTemplate,
  FolderOpen, Film, Tv, Settings, BookOpen, ChevronLeft, ChevronRight, ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import useOnboarding from '../hooks/useOnboarding';

const SPOTLIGHT_KEY = 'vsp_sidebar_spotlight_seen';
const ARROW_KEY = 'vsp_sidebar_arrow_clicked';
const WIZARD_KEY = 'vsp_wizard_completed';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/settings', label: 'Configurações', icon: Settings, stepId: 1 },
  { href: '/trends', label: 'Tendências', icon: TrendingUp, stepId: 2 },
  { href: '/news', label: 'Notícias', icon: Newspaper },
  { href: '/projects', label: 'Projetos', icon: FolderKanban, stepId: 3 },
  { href: '/queue', label: 'Fila', icon: ListOrdered },
  { href: '/pipeline', label: 'Pipeline Mágico', icon: Zap, badge: 'HOT', stepId: 4 },
  { href: '/scripts', label: 'Roteiros', icon: ScrollText },
  { href: '/voiceovers', label: 'Narrações', icon: Mic2 },
  { href: '/medias', label: 'Mídias', icon: ImageIcon },
  { href: '/render', label: 'Renderizar', icon: Clapperboard },
  { href: '/thumbnail', label: 'Thumbnail', icon: LayoutTemplate },
  { href: '/files', label: 'Arquivos', icon: FolderOpen },
  { href: '/vsl', label: 'VSL Cinematográfica', icon: Film, badge: '42 P' },
  { href: '/channels', label: 'Canais / Upload', icon: Tv },
  { href: '/docs', label: 'Documentação', icon: BookOpen },
];

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showArrowPointer, setShowArrowPointer] = useState(false);

  const { currentStep, step1Completed, animationsDisabled, completeStep } = useOnboarding();

  // Activate spotlight and arrow pointer for first-time users
  useEffect(() => {
    if (typeof window === 'undefined' || animationsDisabled) return;
    const wizardDone = localStorage.getItem(WIZARD_KEY) === 'true';
    const spotlightSeen = localStorage.getItem(SPOTLIGHT_KEY) === 'true';
    const arrowClicked = localStorage.getItem(ARROW_KEY) === 'true';

    if (!wizardDone && !spotlightSeen) {
      const showTimer = setTimeout(() => setShowSpotlight(true), 1200);
      const hideTimer = setTimeout(() => {
        setShowSpotlight(false);
        try { localStorage.setItem(SPOTLIGHT_KEY, 'true'); } catch (_) {}
      }, 4700);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }

    if (!arrowClicked && !step1Completed && router.pathname !== '/settings') {
      setShowArrowPointer(true);
    }
  }, [router.pathname, animationsDisabled, step1Completed]);

  // Dismiss arrow pointer and spotlight when user navigates to /settings or clicks
  const handleNavClick = (item) => {
    if (item.stepId) {
      completeStep(item.stepId);
    }
    if (item.href === '/settings') {
      setShowSpotlight(false);
      setShowArrowPointer(false);
      try {
        localStorage.setItem(SPOTLIGHT_KEY, 'true');
        localStorage.setItem(ARROW_KEY, 'true');
      } catch (_) {}
    }
  };

  useEffect(() => {
    if (router.pathname === '/settings') {
      setShowSpotlight(false);
      setShowArrowPointer(false);
      completeStep(1);
      try {
        localStorage.setItem(SPOTLIGHT_KEY, 'true');
        localStorage.setItem(ARROW_KEY, 'true');
      } catch (_) {}
    }
  }, [router.pathname, completeStep]);

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

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const active = router.pathname === item.href ||
              (item.href === '/voiceovers' && router.pathname === '/narrations') ||
              (item.href === '/medias' && router.pathname === '/media');
            const Icon = item.icon;

            const isCurrentOnboardingStep = !animationsDisabled && item.stepId === currentStep && !active;
            const isSpotlit = showSpotlight && item.stepId === 1 && !active && !animationsDisabled;
            const isArrowTarget = showArrowPointer && item.stepId === 1 && !active && !animationsDisabled;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-card text-xs font-semibold transition relative group',
                  active
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-glow'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]',
                  isSpotlit && 'sidebar-spotlight',
                  isCurrentOnboardingStep && 'animate-onboarding-pulse border border-[#7C3AED]',
                  isArrowTarget && 'border border-[#6366F1]/40'
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

                {/* Animated Arrow Pointing Tooltip Badge */}
                {isArrowTarget && !collapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white text-[11px] font-bold shadow-lg pointer-events-none z-50 animate-bounce-horizontal whitespace-nowrap border border-white/20">
                    <ArrowLeft size={13} className="animate-pulse" />
                    <span>Configure aqui</span>
                  </div>
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
          const isSpotlit = showSpotlight && item.stepId === 1 && !active && !animationsDisabled;
          const isArrowTarget = showArrowPointer && item.stepId === 1 && !active && !animationsDisabled;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item)}
              className={cn(
                'flex flex-col items-center gap-0.5 p-1 rounded text-[10px] font-semibold transition relative',
                active ? 'text-[#6366F1]' : 'text-[#94A3B8]',
                isSpotlit && 'sidebar-spotlight',
                !animationsDisabled && item.stepId === currentStep && 'animate-onboarding-pulse'
              )}
            >
              <Icon size={18} />
              <span>{item.label.split(' ')[0]}</span>
              {isArrowTarget && (
                <span className="absolute -top-6 bg-[#7C3AED] text-white text-[9px] px-1.5 py-0.5 rounded font-bold animate-bounce shadow">
                  ⚙️
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spotlight & Arrow Animation Styles */}
      <style jsx global>{`
        @keyframes sidebarSpotlightPulse {
          0%   { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.6); background-color: rgba(124, 58, 237, 0.08); }
          50%  { box-shadow: 0 0 16px 4px rgba(124, 58, 237, 0.45), 0 0 30px 8px rgba(139, 92, 246, 0.2); background-color: rgba(124, 58, 237, 0.15); }
          100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.6); background-color: rgba(124, 58, 237, 0.08); }
        }
        @keyframes bounceHorizontal {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50%      { transform: translateY(-50%) translateX(6px); }
        }
        .sidebar-spotlight {
          animation: sidebarSpotlightPulse 1s ease-in-out 3;
          border: 1px solid rgba(124, 58, 237, 0.4) !important;
          color: #E0E7FF !important;
        }
        .animate-bounce-horizontal {
          animation: bounceHorizontal 1.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}



