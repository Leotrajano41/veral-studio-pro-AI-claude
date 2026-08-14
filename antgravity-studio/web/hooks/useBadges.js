import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  HISTORY: 'vsp_api_status_history',
  DATES: 'api_configured_dates',
  NOVO_SEEN: 'badge_novo_visto',
};

const BADGE_EVENT = 'vsp_badge_status_change';

const DEFAULT_STATUS_MAP = {
  openai: { status: 'active', last_checked: '2026-08-14', exp_days: 90 },
  gemini: { status: 'active', last_checked: '2026-08-14', exp_days: null },
  openrouter: { status: 'active', last_checked: '2026-08-14', exp_days: null },
  assembly: { status: 'active', last_checked: '2026-08-14', exp_days: null },
  pixabay: { status: 'active', last_checked: '2026-08-14', exp_days: 30 },
  pexels: { status: 'pending', last_checked: null, exp_days: null },
  kie: { status: 'pending', last_checked: null, exp_days: null },
  meta: { status: 'pending', last_checked: null, exp_days: null },
};

const DEFAULT_DATES_MAP = {
  openai: '2026-08-14',
  gemini: '2026-08-14',
  openrouter: '2026-08-14',
  assembly: '2026-08-14',
  pixabay: '2026-08-14',
  pexels: null,
  kie: null,
  meta: null,
};

export function formatConfiguredDate(dateStr) {
  if (!dateStr) return null;
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ];
      return `Configurada em ${day} de ${months[monthIndex]} de ${year}`;
    }
  } catch (_) {}
  return `Configurada em ${dateStr}`;
}

export default function useBadges() {
  const [statusHistory, setStatusHistory] = useState({ api_status: DEFAULT_STATUS_MAP });
  const [configuredDates, setConfiguredDates] = useState({ api_configured_dates: DEFAULT_DATES_MAP });
  const [novoBadgeSeen, setNovoBadgeSeen] = useState(false);

  // Sync state from localStorage
  const syncBadges = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      // 1. Sync Novo Badge
      const seen = localStorage.getItem(STORAGE_KEYS.NOVO_SEEN) === 'true';
      setNovoBadgeSeen(seen);

      // 2. Sync Status History Schema
      const rawHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (rawHistory) {
        setStatusHistory(JSON.parse(rawHistory));
      } else {
        const initialObj = { api_status: DEFAULT_STATUS_MAP };
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initialObj));
        setStatusHistory(initialObj);
      }

      // 3. Sync Configured Dates Schema (Prompt 4 - Item 5)
      const rawDates = localStorage.getItem(STORAGE_KEYS.DATES);
      if (rawDates) {
        setConfiguredDates(JSON.parse(rawDates));
      } else {
        const initialDates = { api_configured_dates: DEFAULT_DATES_MAP };
        localStorage.setItem(STORAGE_KEYS.DATES, JSON.stringify(initialDates));
        setConfiguredDates(initialDates);
      }
    } catch (e) {
      console.error('useBadges: erro ao sincronizar localStorage', e);
    }
  }, []);

  useEffect(() => {
    syncBadges();
    window.addEventListener(BADGE_EVENT, syncBadges);
    return () => window.removeEventListener(BADGE_EVENT, syncBadges);
  }, [syncBadges]);

  const notifyChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(BADGE_EVENT));
      window.dispatchEvent(new Event('vsp_api_count_change'));
    }
  };

  const activeApis = ['openai', 'gemini', 'openrouter', 'assembly', 'pixabay'];
  const configuredCount = activeApis.filter(
    (key) => statusHistory.api_status?.[key]?.status === 'active'
  ).length;

  const hasError = Object.values(statusHistory.api_status || {}).some(
    (item) => item.status === 'error'
  );

  const updateApiStatus = useCallback((apiKey, status, errorMsg = null) => {
    if (typeof window === 'undefined') return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const prevHistory = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.HISTORY) || '{"api_status":{}}'
      );
      const prevDates = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DATES) || '{"api_configured_dates":{}}'
      );

      const updatedHistoryMap = {
        ...prevHistory.api_status,
        [apiKey]: {
          status,
          last_checked: status === 'active' ? today : prevHistory.api_status?.[apiKey]?.last_checked || null,
          exp_days: apiKey === 'pixabay' ? 30 : apiKey === 'openai' ? 90 : null,
          ...(errorMsg ? { error_msg: errorMsg } : {}),
        },
      };

      const updatedDatesMap = {
        ...prevDates.api_configured_dates,
        [apiKey]: status === 'active' ? today : null,
      };

      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify({ api_status: updatedHistoryMap }));
      localStorage.setItem(STORAGE_KEYS.DATES, JSON.stringify({ api_configured_dates: updatedDatesMap }));

      const newActiveCount = activeApis.filter((k) => updatedHistoryMap[k]?.status === 'active').length;
      localStorage.setItem('vsp_configured_apis_count', newActiveCount.toString());
      localStorage.setItem('vsp_api_has_error', Object.values(updatedHistoryMap).some((x) => x.status === 'error') ? 'true' : 'false');
    } catch (e) {
      console.error('useBadges: erro ao atualizar API status', e);
    }
    notifyChange();
  }, []);

  const deleteApiKey = useCallback((apiKey) => {
    updateApiStatus(apiKey, 'pending', 'Chave removida pelo usuário');
  }, [updateApiStatus]);

  const markNovoSeen = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.NOVO_SEEN, 'true');
    } catch (e) {
      console.error('useBadges: erro ao marcar novo badge como visto', e);
    }
    notifyChange();
  }, []);

  return {
    statusHistory,
    configuredDates,
    configuredCount,
    hasError,
    novoBadgeSeen,
    updateApiStatus,
    deleteApiKey,
    markNovoSeen,
    formatConfiguredDate,
  };
}
