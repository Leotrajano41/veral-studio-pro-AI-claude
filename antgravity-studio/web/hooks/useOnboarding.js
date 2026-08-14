import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  STEP_1: 'onboarding_step_1_completed',
  STEP_2: 'onboarding_step_2_completed',
  STEP_3: 'onboarding_step_3_completed',
  STEP_4: 'onboarding_step_4_completed',
  CURRENT_STEP: 'onboarding_current_step',
  ANIMATIONS_DISABLED: 'animations_disabled',
};

const ONBOARDING_EVENT = 'vsp_onboarding_change';

export default function useOnboarding() {
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);
  const [step4Completed, setStep4Completed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [animationsDisabled, setAnimationsDisabledState] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showHandPointer, setShowHandPointer] = useState(true);

  // Sync state with localStorage
  const syncFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const s1 = localStorage.getItem(STORAGE_KEYS.STEP_1) === 'true';
      const s2 = localStorage.getItem(STORAGE_KEYS.STEP_2) === 'true';
      const s3 = localStorage.getItem(STORAGE_KEYS.STEP_3) === 'true';
      const s4 = localStorage.getItem(STORAGE_KEYS.STEP_4) === 'true';
      const dis = localStorage.getItem(STORAGE_KEYS.ANIMATIONS_DISABLED) === 'true';
      const cur = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STEP) || '1', 10);

      setStep1Completed(s1);
      setStep2Completed(s2);
      setStep3Completed(s3);
      setStep4Completed(s4);
      setAnimationsDisabledState(dis);

      // Determine actual active step
      if (s4) setCurrentStep(4);
      else if (s3) setCurrentStep(4);
      else if (s2) setCurrentStep(3);
      else if (s1) setCurrentStep(2);
      else setCurrentStep(cur || 1);
    } catch (e) {
      console.error('useOnboarding: erro ao sincronizar com localStorage', e);
    }
  }, []);

  useEffect(() => {
    syncFromStorage();
    const handleCustomEvent = () => syncFromStorage();
    window.addEventListener(ONBOARDING_EVENT, handleCustomEvent);
    return () => window.removeEventListener(ONBOARDING_EVENT, handleCustomEvent);
  }, [syncFromStorage]);

  // Tooltip & Hand Pointer recurring 10s interval cycle
  useEffect(() => {
    if (typeof window === 'undefined' || animationsDisabled || step1Completed) {
      setShowTooltip(false);
      setShowHandPointer(false);
      return;
    }

    // Initial show
    setShowTooltip(true);
    setShowHandPointer(true);

    // Hide tooltip after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    // Cycle every 10 seconds (reappear for 5s)
    const cycleInterval = setInterval(() => {
      setShowTooltip(true);
      setShowHandPointer(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
    }, 10000);

    return () => {
      clearTimeout(hideTimer);
      clearInterval(cycleInterval);
    };
  }, [animationsDisabled, step1Completed]);

  // Notify all components of changes
  const notifyChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(ONBOARDING_EVENT));
    }
  };

  const completeStep = useCallback((stepNum) => {
    if (typeof window === 'undefined') return;
    try {
      if (stepNum >= 1) localStorage.setItem(STORAGE_KEYS.STEP_1, 'true');
      if (stepNum >= 2) localStorage.setItem(STORAGE_KEYS.STEP_2, 'true');
      if (stepNum >= 3) localStorage.setItem(STORAGE_KEYS.STEP_3, 'true');
      if (stepNum >= 4) localStorage.setItem(STORAGE_KEYS.STEP_4, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, Math.min(stepNum + 1, 4).toString());
    } catch (e) {
      console.error('useOnboarding: erro ao salvar step', e);
    }
    notifyChange();
  }, []);

  const setAnimationsDisabled = useCallback((disabled) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ANIMATIONS_DISABLED, disabled ? 'true' : 'false');
    } catch (e) {
      console.error('useOnboarding: erro ao salvar preference de animação', e);
    }
    notifyChange();
  }, []);

  const toggleAnimations = useCallback(() => {
    setAnimationsDisabled(!animationsDisabled);
  }, [animationsDisabled, setAnimationsDisabled]);

  const resetOnboarding = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.STEP_1);
      localStorage.removeItem(STORAGE_KEYS.STEP_2);
      localStorage.removeItem(STORAGE_KEYS.STEP_3);
      localStorage.removeItem(STORAGE_KEYS.STEP_4);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.ANIMATIONS_DISABLED);
    } catch (e) {
      console.error('useOnboarding: erro ao resetar', e);
    }
    notifyChange();
  }, []);

  return {
    currentStep,
    step1Completed,
    step2Completed,
    step3Completed,
    step4Completed,
    animationsDisabled,
    showTooltip: showTooltip && !step1Completed && !animationsDisabled,
    showHandPointer: showHandPointer && !step1Completed && !animationsDisabled,
    completeStep,
    setAnimationsDisabled,
    toggleAnimations,
    resetOnboarding,
  };
}
