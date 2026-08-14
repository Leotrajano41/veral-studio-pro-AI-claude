import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, Settings, TrendingUp, FolderKanban, Zap, EyeOff, Eye, Sparkles } from 'lucide-react';
import useOnboarding from '../../hooks/useOnboarding';
import { cn } from '../../lib/utils';

const STEPS = [
  {
    id: 1,
    title: 'Configurações',
    subtitle: 'Configurar chaves API',
    icon: Settings,
    href: '/settings',
    emoji: '⚙️',
  },
  {
    id: 2,
    title: 'Tendências',
    subtitle: 'Descobrir tópicos quentes',
    icon: TrendingUp,
    href: '/trends',
    emoji: '📈',
  },
  {
    id: 3,
    title: 'Projetos',
    subtitle: 'Criar primeiro projeto',
    icon: FolderKanban,
    href: '/projects',
    emoji: '📁',
  },
  {
    id: 4,
    title: 'Pipeline Mágico',
    subtitle: 'Gerar vídeos automáticos',
    icon: Zap,
    href: '/pipeline',
    emoji: '⚡',
  },
];

export default function ProgressDotsWidget() {
  const router = useRouter();
  const {
    currentStep,
    step1Completed,
    step2Completed,
    step3Completed,
    step4Completed,
    animationsDisabled,
    completeStep,
    toggleAnimations,
  } = useOnboarding();

  const isStepCompleted = (stepId) => {
    if (stepId === 1) return step1Completed;
    if (stepId === 2) return step2Completed;
    if (stepId === 3) return step3Completed;
    if (stepId === 4) return step4Completed;
    return false;
  };

  const handleStepClick = (step) => {
    completeStep(step.id);
    router.push(step.href);
  };

  return (
    <div className="bg-[#1E293B]/90 border border-[#334155] rounded-2xl p-5 sm:p-6 shadow-card space-y-4 relative overflow-hidden transition-all duration-300">
      {/* Top Header Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#334155]/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#6366F1]/20 border border-[#6366F1]/40 flex items-center justify-center text-[#818CF8]">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Guia de Configuração e Início Rápido
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Você está aqui: <span className="text-[#818CF8] font-bold">Passo {currentStep} de 4</span>
            </p>
          </div>
        </div>

        {/* Toggle Animations Control Button */}
        <button
          onClick={toggleAnimations}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white bg-[#0F172A] border border-[#334155] hover:border-[#6366F1]/40 transition active:scale-95"
          title={animationsDisabled ? 'Ativar tutorial visual' : 'Desabilitar tutorial visual'}
        >
          {animationsDisabled ? <Eye size={13} className="text-[#22C55E]" /> : <EyeOff size={13} className="text-[#EF4444]" />}
          <span>{animationsDisabled ? 'Ativar tutorial visual' : 'Desabilitar tutorial visual'}</span>
        </button>
      </div>

      {/* 4 Steps Interactive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((step) => {
          const completed = isStepCompleted(step.id);
          const isCurrent = currentStep === step.id && !completed;
          const isLocked = step.id > currentStep && !completed;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              className={cn(
                'flex flex-col p-3.5 rounded-xl border text-left transition-all duration-300 relative group cursor-pointer',
                completed && 'bg-[#0F172A]/70 border-[#22C55E]/40 text-[#94A3B8]',
                isCurrent && !animationsDisabled && 'bg-[#6366F1]/10 border-[#7C3AED] text-white animate-onboarding-pulse shadow-[0_0_20px_rgba(124,58,237,0.25)]',
                isCurrent && animationsDisabled && 'bg-[#6366F1]/15 border-[#6366F1] text-white',
                isLocked && 'bg-[#0F172A]/40 border-[#334155]/50 text-[#64748B] opacity-60 hover:opacity-80'
              )}
            >
              {/* Badge Number / Check */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{step.emoji}</span>
                <span
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors',
                    completed && 'bg-[#22C55E] border-[#22C55E] text-white',
                    isCurrent && 'bg-[#7C3AED] border-[#7C3AED] text-white animate-pulse',
                    isLocked && 'bg-[#1E293B] border-[#334155] text-[#64748B]'
                  )}
                >
                  {completed ? <Check size={12} /> : step.id}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h4 className={cn('text-xs font-bold truncate', isCurrent ? 'text-white' : completed ? 'text-[#CBD5E1]' : 'text-[#94A3B8]')}>
                {step.title}
              </h4>
              <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                {step.subtitle}
              </p>

              {/* Active Step Indicator Pill */}
              {isCurrent && (
                <span className="mt-2 text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A855F7] self-start animate-pulse">
                  Passo Atual
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
