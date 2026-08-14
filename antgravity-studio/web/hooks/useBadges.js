import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  HISTORY: 'vsp_api_status_history',
  NOVO_SEEN: 'badge_novo_visto',
};

const BADGE_EVENT = 'vsp_badge_status_change';

const DEFAULT_STATUS_MAP = {
  openai: { status: 'active', last_checked: '2026-08-14' },
  gemini: { status: 'active', last_checked: '2026-08-14' },
  openrouter: { status: 'active', last_checked: '2026-08-14' },
  assembly: { status: 'active', last_checked: '2026-08-14' },
  pixabay: { status: 'active', last_checked: '2026-08-14' },
  pexels: { status: 'pending', last_checked: null },
  kie: { status: 'pending', last_checked: null },
  meta: { status: 'pending', last_checked: null },
};

export default function useBadges() {
  const [statusHistory, setStatusHistory] = useState({ api_status: DEFAULT_STATUS_MAP });
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
        // Initialize default history in localStorage
        const initialObj = { api_status: DEFAULT_STATUS_MAP };
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initialObj));
        setStatusHistory(initialObj);
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

  // Active essential APIs count (OpenAI, Gemini, OpenRouter, AssemblyAI, Pixabay)
  const activeApis = ['openai', 'gemini', 'openrouter', 'assembly', 'pixabay'];
  const configuredCount = activeApis.filter(
    (key) => statusHistory.api_status?.[key]?.status === 'active'
  ).length;

  // Check if any active API has error status
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

      const updatedMap = {
        ...prevHistory.api_status,
        [apiKey]: {
          status, // 'active' | 'pending' | 'error'
          last_checked: status === 'active' ? today : prevHistory.api_status?.[apiKey]?.last_checked || null,
          ...(errorMsg ? { error_msg: errorMsg } : {}),
        },
      };

      const newHistory = { api_status: updatedMap };
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));

      // Also update vsp_configured_apis_count
      const newActiveCount = activeApis.filter((k) => updatedMap[k]?.status === 'active').length;
      localStorage.setItem('vsp_configured_apis_count', newActiveCount.toString());
      localStorage.setItem('vsp_api_has_error', Object.values(updatedMap).some((x) => x.status === 'error') ? 'true' : 'false');
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
    configuredCount,
    hasError,
    novoBadgeSeen,
    updateApiStatus,
    deleteApiKey,
    markNovoSeen,
  };
}
