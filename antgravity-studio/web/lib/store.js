import { createContext, useContext, useState, useEffect } from 'react';

const INITIAL_STATE = {
  user: {
    serial: 'AG-2026-PRO-7X4K',
    apiKeys: {},
    preferences: {
      defaultLanguage: 'pt-BR',
      defaultResolution: '1080p',
      defaultFps: 30,
      autoBackup: false,
    },
  },
  projects: [],
  currentProject: null,
  queue: [],
  trends: [],
  news: [],
  voices: [],
  isLoading: false,
  error: null,
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('antgravity_store');
        if (saved) return { ...INITIAL_STATE, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Erro ao carregar store do localStorage:', e);
      }
    }
    return INITIAL_STATE;
  });

  // Salva no localStorage a cada alteração
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('antgravity_store', JSON.stringify({
          user: state.user,
          projects: state.projects,
          voices: state.voices,
        }));
      } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
      }
    }
  }, [state.user, state.projects, state.voices]);

  // Actions
  const actions = {
    setUserSerial: (serial) => {
      setState(p => ({ ...p, user: { ...p.user, serial } }));
    },
    setApiKey: (service, key) => {
      setState(p => ({
        ...p,
        user: {
          ...p.user,
          apiKeys: { ...p.user.apiKeys, [service]: key },
        },
      }));
    },
    setProjects: (projects) => setState(p => ({ ...p, projects })),
    setCurrentProject: (project) => setState(p => ({ ...p, currentProject: project })),
    addProject: (project) => setState(p => ({ ...p, projects: [project, ...p.projects] })),
    setQueue: (queue) => setState(p => ({ ...p, queue })),
    setTrends: (trends) => setState(p => ({ ...p, trends })),
    setNews: (news) => setState(p => ({ ...p, news })),
    setVoices: (voices) => setState(p => ({ ...p, voices })),
    setLoading: (isLoading) => setState(p => ({ ...p, isLoading })),
    setError: (error) => setState(p => ({ ...p, error })),
  };

  return (
    <StoreContext.Provider value={{ state, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return context;
}
