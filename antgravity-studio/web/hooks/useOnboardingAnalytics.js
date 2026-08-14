import { useState, useEffect, useCallback } from 'react';

const ANALYTICS_KEY = 'vsp_onboarding_analytics';
const ANALYTICS_EVENT = 'vsp_analytics_change';

const DEFAULT_ANALYTICS = {
  total_sessions: 1,
  wizard_starts: 1,
  wizard_completions: 0,
  wizard_skips: 0,
  wizard_dropoffs: { step_1: 0, step_2: 0, step_3: 0, step_4: 0, step_5: 0 },
  animations_disabled_count: 0,
  setup_completed_count: 0,
  events_log: [],
};

export default function useOnboardingAnalytics() {
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);

  const syncAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(ANALYTICS_KEY);
      if (raw) {
        setAnalytics(JSON.parse(raw));
      } else {
        const initialObj = {
          ...DEFAULT_ANALYTICS,
          events_log: [{ event: 'session_started', timestamp: new Date().toISOString() }],
        };
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(initialObj));
        setAnalytics(initialObj);
      }
    } catch (e) {
      console.error('useOnboardingAnalytics: erro ao carregar localStorage', e);
    }
  }, []);

  useEffect(() => {
    syncAnalytics();
    window.addEventListener(ANALYTICS_EVENT, syncAnalytics);
    return () => window.removeEventListener(ANALYTICS_EVENT, syncAnalytics);
  }, [syncAnalytics]);

  const notifyChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(ANALYTICS_EVENT));
    }
  };

  const trackEvent = useCallback((eventName, payload = {}) => {
    if (typeof window === 'undefined') return;
    try {
      const current = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || JSON.stringify(DEFAULT_ANALYTICS));
      const newLog = [
        ...(current.events_log || []).slice(-49), // Keep last 50 events
        { event: eventName, timestamp: new Date().toISOString(), ...payload },
      ];

      const updated = {
        ...current,
        events_log: newLog,
      };

      if (eventName === 'wizard_completed') updated.wizard_completions = (updated.wizard_completions || 0) + 1;
      if (eventName === 'wizard_skipped') updated.wizard_skips = (updated.wizard_skips || 0) + 1;
      if (eventName === 'setup_completed_5_5') updated.setup_completed_count = (updated.setup_completed_count || 0) + 1;
      if (eventName === 'animations_toggled' && payload.disabled) updated.animations_disabled_count = (updated.animations_disabled_count || 0) + 1;

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('useOnboardingAnalytics: erro ao registrar evento', e);
    }
    notifyChange();
  }, []);

  const trackWizardDropoff = useCallback((stepNumber) => {
    if (typeof window === 'undefined') return;
    try {
      const current = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || JSON.stringify(DEFAULT_ANALYTICS));
      const dropKey = `step_${stepNumber}`;
      const dropoffs = current.wizard_dropoffs || {};
      dropoffs[dropKey] = (dropoffs[dropKey] || 0) + 1;

      const updated = {
        ...current,
        wizard_dropoffs: dropoffs,
        events_log: [
          ...(current.events_log || []).slice(-49),
          { event: 'wizard_dropoff', step: stepNumber, timestamp: new Date().toISOString() },
        ],
      };

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('useOnboardingAnalytics: erro ao registrar dropoff', e);
    }
    notifyChange();
  }, []);

  const resetAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(DEFAULT_ANALYTICS));
    } catch (_) {}
    notifyChange();
  }, []);

  return {
    analytics,
    trackEvent,
    trackWizardDropoff,
    resetAnalytics,
  };
}
