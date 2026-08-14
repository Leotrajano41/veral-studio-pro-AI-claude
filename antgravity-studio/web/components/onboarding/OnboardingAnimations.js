import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Sparkles, Hand } from 'lucide-react';
import useOnboarding from '../../hooks/useOnboarding';

export default function OnboardingAnimations() {
  const router = useRouter();
  const {
    step1Completed,
    animationsDisabled,
    showTooltip,
    showHandPointer,
    completeStep,
  } = useOnboarding();

  // If user is on /settings, complete step 1 automatically
  useEffect(() => {
    if (router.pathname === '/settings' && !step1Completed) {
      completeStep(1);
    }
  }, [router.pathname, step1Completed, completeStep]);

  // Don't render animations if disabled or step 1 completed
  if (animationsDisabled || step1Completed) return null;

  return (
    <div className="pointer-events-none fixed z-50">
      {/* Contextual Tooltip element - styled for Home & Navigation placement */}
      {showTooltip && (
        <div
          className="fixed left-64 top-24 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-[0_0_25px_rgba(124,58,237,0.5)] border border-white/20 animate-onboarding-fade-in-out pointer-events-auto cursor-pointer"
          onClick={() => {
            completeStep(1);
            router.push('/settings');
          }}
        >
          <Sparkles size={14} className="animate-spin text-amber-300 shrink-0" />
          <span>👉 Clique aqui para configurar suas APIs</span>
          <ArrowLeft size={14} className="animate-pulse ml-1" />
        </div>
      )}

      {/* Hand Pointer Animation Element */}
      {showHandPointer && (
        <div
          className="fixed left-56 top-28 z-50 text-2xl text-[#818CF8] drop-shadow-[0_0_10px_rgba(124,58,237,0.8)] animate-hand-tap pointer-events-auto cursor-pointer"
          onClick={() => {
            completeStep(1);
            router.push('/settings');
          }}
          title="Clique para ir a Configurações"
        >
          👈
        </div>
      )}
    </div>
  );
}
