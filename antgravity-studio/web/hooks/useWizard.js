import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vsp_wizard_completed';
const RESET_EVENT = 'vsp_wizard_reset';
const TOTAL_STEPS = 5;

/**
 * Static helper — can be called from any component without the hook.
 * Clears localStorage and dispatches the reset event so the global
 * wizard instance (mounted in _app.js) reopens.
 */
export function resetWizard() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
  window.dispatchEvent(new Event(RESET_EVENT));
}

export default function useWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Check localStorage on mount (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (completed !== 'true') {
        // Small delay so the page renders first
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error('useWizard: erro ao ler localStorage', e);
    } finally {
      setHasCheckedStorage(true);
    }
  }, []);

  // Listen for external reset events (fired by resetWizard())
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      setStep(1);
      setIsOpen(true);
    };
    window.addEventListener(RESET_EVENT, handler);
    return () => window.removeEventListener(RESET_EVENT, handler);
  }, []);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const goToStep = useCallback((n) => {
    setStep(Math.max(1, Math.min(n, TOTAL_STEPS)));
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Don't mark as completed — will reappear on next visit
  }, []);

  const complete = useCallback(() => {
    setIsOpen(false);
    setStep(1);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.error('useWizard: erro ao salvar no localStorage', e);
    }
  }, []);

  const reset = useCallback(() => {
    resetWizard();
  }, []);

  return {
    isOpen,
    step,
    totalSteps: TOTAL_STEPS,
    hasCheckedStorage,
    next,
    prev,
    goToStep,
    close,
    complete,
    reset,
  };
}

