import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import {
  X, ChevronRight, ChevronLeft, Sparkles, Settings, TrendingUp,
  FolderKanban, Zap, CheckCircle, Rocket, ArrowRight, SkipForward
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Step Configuration
   ═══════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    id: 1,
    emoji: '🎯',
    title: 'Bem-vindo ao Viral Studio Pro AI!',
    description: 'Vamos configurar sua ferramenta em 5 passos simples para você criar vídeos virais automatizados com IA.',
    detail: 'Esta é a sua central profissional para gerar Shorts, Reels, TikToks e VSLs de forma 100% automatizada. Roteiro, narração, mídias, legendas, thumbnail e upload — tudo no piloto automático.',
    icon: Rocket,
    navigateTo: null,
    buttonLabel: null,
  },
  {
    id: 2,
    emoji: '⚙️',
    title: 'Configurar APIs',
    description: 'Você precisa de chaves de API para IA, voz, mídias e legendas. Elas são gratuitas e leva apenas 2 minutos.',
    detail: 'APIs necessárias: OpenAI (roteiros), Google TTS ou ElevenLabs (narração), Pixabay/Pexels (mídias), AssemblyAI (legendas) e YouTube Data API (upload).',
    icon: Settings,
    navigateTo: '/settings',
    buttonLabel: 'Ir para Configurações',
    hasSkipCheckbox: true,
    skipLabel: 'Já configurei minhas APIs',
  },
  {
    id: 3,
    emoji: '📈',
    title: 'Encontre Ideias de Conteúdo',
    description: 'Use o módulo Tendências para descobrir tópicos quentes e nichos lucrativos para seus vídeos.',
    detail: 'O sistema busca tendências em tempo real do Google Trends, YouTube e redes sociais para te dar ideias comprovadas de alto engajamento.',
    icon: TrendingUp,
    navigateTo: '/trends',
    buttonLabel: 'Ir para Tendências',
  },
  {
    id: 4,
    emoji: '📁',
    title: 'Crie seu Primeiro Projeto',
    description: 'Organize seus vídeos em projetos separados por nicho, campanha ou cliente.',
    detail: 'Cada projeto armazena roteiros, mídias, configurações e vídeos renderizados. Isso facilita a gestão quando você tiver dezenas de vídeos.',
    icon: FolderKanban,
    navigateTo: '/projects',
    buttonLabel: 'Ir para Projetos',
  },
  {
    id: 5,
    emoji: '⚡',
    title: 'Você está pronto!',
    description: 'Clique em Pipeline Mágico para gerar seu primeiro vídeo automatizado de ponta a ponta.',
    detail: 'O Pipeline executa 7 etapas automaticamente: pesquisa → roteiro → narração → mídias → renderização → legendas → thumbnail. Tudo em um clique.',
    icon: Zap,
    navigateTo: '/pipeline',
    buttonLabel: 'Ir para Pipeline Mágico',
  },
];

/* ═══════════════════════════════════════════════════════════════
   Progress Bar
   ═══════════════════════════════════════════════════════════════ */
function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-2 w-full">
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={stepNum} className="flex-1 flex items-center gap-1.5">
            {/* Dot */}
            <div
              className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300
                ${isDone
                  ? 'bg-[#22C55E] text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                  : isActive
                    ? 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_0_14px_rgba(99,102,241,0.5)] scale-110'
                    : 'bg-[#1E293B] text-[#64748B] border border-[#334155]'
                }
              `}
            >
              {isDone ? <CheckCircle size={14} /> : stepNum}
            </div>
            {/* Connector line */}
            {stepNum < total && (
              <div
                className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                  isDone ? 'bg-[#22C55E]' : 'bg-[#334155]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Animated Icon
   ═══════════════════════════════════════════════════════════════ */
function StepIcon({ stepData, direction }) {
  const Icon = stepData.icon;
  return (
    <div
      key={stepData.id}
      className="wizard-icon-enter"
      style={{ animationDirection: direction === 'back' ? 'reverse' : 'normal' }}
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[#6366F1]/30 flex items-center justify-center mx-auto mb-2">
        <span className="text-4xl">{stepData.emoji}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SetupWizard
   ═══════════════════════════════════════════════════════════════ */
export default function SetupWizard({ isOpen, step, totalSteps, next, prev, goToStep, close, complete }) {
  const router = useRouter();
  const [skipApis, setSkipApis] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    // If user checked "já configurei" on step 2, jump to step 5
    if (step === 2 && skipApis) {
      setDirection('forward');
      goToStep(5);
      return;
    }
    setDirection('forward');
    next();
  }, [step, skipApis, next, goToStep]);

  const handlePrev = useCallback(() => {
    setDirection('back');
    prev();
  }, [prev]);

  const handleNavigate = useCallback((path) => {
    close(); // close wizard (without completing — reopens next visit)
    router.push(path);
  }, [close, router]);

  const handleComplete = useCallback((navigateTo) => {
    complete();
    if (navigateTo) router.push(navigateTo);
  }, [complete, router]);

  if (!mounted || !isOpen) return null;

  const currentStep = STEPS[step - 1];
  const isFirst = step === 1;
  const isLast = step === totalSteps;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Wizard de Setup">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md wizard-backdrop-enter" onClick={close} />

      {/* Modal */}
      <div className="relative w-full max-w-[600px] max-h-[92vh] bg-[#0F172A] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden wizard-modal-enter" style={{ boxShadow: '0 0 60px rgba(99,102,241,0.15), 0 25px 50px rgba(0,0,0,0.6)' }}>

        {/* Header Gradient Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A855F7]" />

        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E293B] transition z-10"
          aria-label="Fechar Wizard"
        >
          <X size={18} />
        </button>

        {/* Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Progress */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider text-center">
              Etapa {step} de {totalSteps}
            </p>
            <ProgressBar current={step} total={totalSteps} />
          </div>

          {/* Step Content — animated */}
          <div key={step} className="wizard-step-enter space-y-4 text-center">
            <StepIcon stepData={currentStep} direction={direction} />

            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentStep.emoji} {currentStep.title}
            </h2>

            <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {currentStep.description}
            </p>

            <p className="text-[#64748B] text-xs leading-relaxed max-w-md mx-auto">
              {currentStep.detail}
            </p>

            {/* Navigate-to button */}
            {currentStep.navigateTo && !isLast && (
              <button
                onClick={() => handleNavigate(currentStep.navigateTo)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-semibold shadow-glow hover:from-[#4F46E5] hover:to-[#7C3AED] transition-all active:scale-[0.97]"
              >
                <currentStep.icon size={16} />
                {currentStep.buttonLabel}
                <ArrowRight size={14} />
              </button>
            )}

            {/* Step 2: skip checkbox */}
            {currentStep.hasSkipCheckbox && (
              <label className="flex items-center gap-2.5 justify-center cursor-pointer group mt-1">
                <input
                  type="checkbox"
                  checked={skipApis}
                  onChange={(e) => setSkipApis(e.target.checked)}
                  className="w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#6366F1] accent-[#6366F1] cursor-pointer"
                />
                <span className="text-sm text-[#94A3B8] group-hover:text-white transition">
                  {currentStep.skipLabel}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-[#1E293B] bg-[#0B1120] px-6 sm:px-8 py-4 flex items-center justify-between gap-3">
          {/* Left: Previous / Skip */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-[#1E293B] border border-[#334155] transition"
              >
                <ChevronLeft size={14} />
                Anterior
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Skip (only on middle steps) */}
            {!isFirst && !isLast && (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#94A3B8] transition"
              >
                <SkipForward size={12} />
                Pular
              </button>
            )}

            {/* Next / Complete */}
            {isLast ? (
              <button
                onClick={() => handleComplete(currentStep.navigateTo)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white text-sm font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_28px_rgba(34,197,94,0.5)] transition-all active:scale-[0.97]"
              >
                <Sparkles size={16} />
                Concluir e Ir para Pipeline
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-semibold shadow-glow hover:from-[#4F46E5] hover:to-[#7C3AED] transition-all active:scale-[0.97]"
              >
                {isFirst ? 'Começar' : 'Próximo'}
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CSS Animations (scoped via style tag) ── */}
      <style jsx>{`
        @keyframes wizardBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wizardModalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wizardStepIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes wizardIconPulse {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .wizard-backdrop-enter {
          animation: wizardBackdropIn 0.3s ease-out forwards;
        }
        .wizard-modal-enter {
          animation: wizardModalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .wizard-step-enter {
          animation: wizardStepIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .wizard-icon-enter {
          animation: wizardIconPulse 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );

  // Use portal to render above everything
  return createPortal(content, document.body);
}
