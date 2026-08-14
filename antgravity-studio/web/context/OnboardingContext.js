import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MASTER_STATE_KEY = 'vsp_onboarding_master_state';
const MASTER_EVENT = 'vsp_master_state_change';

const DEFAULT_MASTER_STATE = {
  wizard: {
    completed: false,
    current_step: 1,
  },
  onboarding: {
    animations_disabled: false,
    current_step: 'configuracoes',
  },
  badges: {
    novo_visto: false,
    setup_completed: false,
  },
  setup_status: {
    openai: true,
    gemini: true,
    openrouter: true,
    assembly: true,
    pixabay: true,
    configured_count: 5,
  },
};

const OnboardingMasterContext = createContext({
  masterState: DEFAULT_MASTER_STATE,
  nextWizardStep: () => {},
  prevWizardStep: () => {},
  skipWizard: () => {},
  resetWizard: () => {},
  markStepComplete: () => {},
  toggleAnimations: () => {},
  markNovoBadgeSeen: () => {},
  updateApiState: () => {},
});

export function OnboardingProvider({ children }) {
  const [masterState, setMasterState] = useState(DEFAULT_MASTER_STATE);

  const syncMasterState = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(MASTER_STATE_KEY);
      if (raw) {
        setMasterState(JSON.parse(raw));
      } else {
        localStorage.setItem(MASTER_STATE_KEY, JSON.stringify(DEFAULT_MASTER_STATE));
        setMasterState(DEFAULT_MASTER_STATE);
      }
    } catch (e) {
      console.error('OnboardingContext: erro ao sincronizar localStorage', e);
    }
  }, []);

  useEffect(() => {
    syncMasterState();
    window.addEventListener(MASTER_EVENT, syncMasterState);
    window.addEventListener('vsp_wizard_reset', syncMasterState);
    window.addEventListener('vsp_badge_status_change', syncMasterState);
    window.addEventListener('vsp_setup_status_change', syncMasterState);
    return () => {
      window.removeEventListener(MASTER_EVENT, syncMasterState);
      window.removeEventListener('vsp_wizard_reset', syncMasterState);
      window.removeEventListener('vsp_badge_status_change', syncMasterState);
      window.removeEventListener('vsp_setup_status_change', syncMasterState);
    };
  }, [syncMasterState]);

  const saveState = (newState) => {
    setMasterState(newState);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MASTER_STATE_KEY, JSON.stringify(newState));
        window.dispatchEvent(new Event(MASTER_EVENT));
        window.dispatchEvent(new Event('vsp_badge_status_change'));
        window.dispatchEvent(new Event('vsp_api_count_change'));
      } catch (e) {
        console.error('OnboardingContext: erro ao salvar masterState', e);
      }
    }
  };

  // Wizard methods
  const nextWizardStep = () => {
    setMasterState((prev) => {
      const nextStep = Math.min((prev.wizard.current_step || 1) + 1, 5);
      const isCompleted = nextStep >= 5;
      const updated = {
        ...prev,
        wizard: {
          completed: isCompleted,
          current_step: nextStep,
        },
      };
      saveState(updated);
      return updated;
    });
  };

  const prevWizardStep = () => {
    setMasterState((prev) => {
      const prevStep = Math.max((prev.wizard.current_step || 1) - 1, 1);
      const updated = {
        ...prev,
        wizard: {
          ...prev.wizard,
          current_step: prevStep,
        },
      };
      saveState(updated);
      return updated;
    });
  };

  const skipWizard = () => {
    setMasterState((prev) => {
      const updated = {
        ...prev,
        wizard: {
          completed: true,
          current_step: 5,
        },
      };
      saveState(updated);
      return updated;
    });
  };

  const resetWizard = () => {
    const resetObj = {
      ...masterState,
      wizard: {
        completed: false,
        current_step: 1,
      },
    };
    saveState(resetObj);
  };

  // Onboarding & Animations methods
  const markStepComplete = (stepName) => {
    setMasterState((prev) => {
      const updated = {
        ...prev,
        onboarding: {
          ...prev.onboarding,
          current_step: stepName,
        },
      };
      saveState(updated);
      return updated;
    });
  };

  const toggleAnimations = (disabled) => {
    setMasterState((prev) => {
      const updated = {
        ...prev,
        onboarding: {
          ...prev.onboarding,
          animations_disabled: disabled,
        },
      };
      saveState(updated);
      return updated;
    });
  };

  // Badges methods
  const markNovoBadgeSeen = () => {
    setMasterState((prev) => {
      const updated = {
        ...prev,
        badges: {
          ...prev.badges,
          novo_visto: true,
        },
      };
      saveState(updated);
      return updated;
    });
  };

  // Setup Status methods
  const updateApiState = (apiKey, isConfigured) => {
    setMasterState((prev) => {
      const essential = ['openai', 'gemini', 'openrouter', 'assembly', 'pixabay'];
      const updatedSetup = {
        ...prev.setup_status,
        [apiKey]: isConfigured,
      };
      const activeCount = essential.filter((k) => updatedSetup[k] === true).length;
      updatedSetup.configured_count = activeCount;

      const updated = {
        ...prev,
        badges: {
          ...prev.badges,
          setup_completed: activeCount >= 5,
        },
        setup_status: updatedSetup,
      };

      saveState(updated);
      return updated;
    });
  };

  return (
    <OnboardingMasterContext.Provider
      value={{
        masterState,
        nextWizardStep,
        prevWizardStep,
        skipWizard,
        resetWizard,
        markStepComplete,
        toggleAnimations,
        markNovoBadgeSeen,
        updateApiState,
      }}
    >
      {children}
    </OnboardingMasterContext.Provider>
  );
}

export function useOnboardingMaster() {
  return useContext(OnboardingMasterContext);
}
