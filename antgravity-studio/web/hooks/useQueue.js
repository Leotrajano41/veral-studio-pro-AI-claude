import { useState, useEffect, useRef, useCallback } from 'react';
import { queueService } from '../lib/api';
import toast from 'react-hot-toast';

const ALL_STEPS = [
  { id: 'script', label: '📝 Roteiros' },
  { id: 'narration', label: '🎙️ Narração' },
  { id: 'search', label: '🔍 Buscando' },
  { id: 'download', label: '⬇️ Download' },
  { id: 'render', label: '🎬 Render' },
  { id: 'seo', label: '🔎 SEO' },
];

const INITIAL_JOBS = [
  {
    id: 'j1',
    project_id: 'p1',
    name: 'Como Investir em 2026 — Parte 1',
    project: 'Finanças para Iniciantes',
    status: 'processing',
    progress: 60,
    steps_completed: ['script', 'narration', 'search'],
    total_steps: 6,
    output_path: null,
    error_message: null,
    created_at: '03 de ago. de 2026 10:30',
    started_at: new Date(Date.now() - 932000).toISOString(),
    ended_at: null,
    elapsed_time: '15 min 32s',
  },
  {
    id: 'j2',
    project_id: 'p1',
    name: 'Como Investir em 2026 — Parte 2',
    project: 'Finanças para Iniciantes',
    status: 'pending',
    progress: 0,
    steps_completed: [],
    total_steps: 6,
    output_path: null,
    error_message: null,
    created_at: '03 de ago. de 2026 10:35',
    started_at: null,
    ended_at: null,
    elapsed_time: '0 min 0s',
  },
  {
    id: 'j3',
    project_id: 'p2',
    name: '5 Apps de IA que Mudam Tudo',
    project: 'Tech Viral BR',
    status: 'completed',
    progress: 100,
    steps_completed: ['script', 'narration', 'search', 'download', 'render', 'seo'],
    total_steps: 6,
    output_path: './output/5-apps-ia.mp4',
    error_message: null,
    created_at: '03 de ago. de 2026 09:15',
    started_at: new Date(Date.now() - 2712000).toISOString(),
    ended_at: new Date(Date.now() - 2000000).toISOString(),
    elapsed_time: '45 min 12s',
  },
  {
    id: 'j4',
    project_id: 'p3',
    name: 'Segredos dos Milionários',
    project: 'Motivação Daily',
    status: 'failed',
    progress: 35,
    steps_completed: ['script', 'narration'],
    total_steps: 6,
    output_path: null,
    error_message: 'Erro na API TTS: Quota diária excedida no Google Cloud.',
    created_at: '03 de ago. de 2026 08:40',
    started_at: new Date(Date.now() - 9900000).toISOString(),
    ended_at: new Date(Date.now() - 9800000).toISOString(),
    elapsed_time: '2h 45m',
  },
  {
    id: 'j5',
    project_id: 'p4',
    name: 'Dieta Cetogênica — A Verdade em 2026',
    project: 'Saúde & Bem-estar',
    status: 'cancelled',
    progress: 20,
    steps_completed: ['script'],
    total_steps: 6,
    output_path: null,
    error_message: null,
    created_at: '03 de ago. de 2026 08:00',
    started_at: new Date(Date.now() - 310000).toISOString(),
    ended_at: null,
    elapsed_time: '5 min 10s',
  },
];

export function useQueue(pollingIntervalMs = 5000) {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pollingTimerRef = useRef(null);

  // Polling automático (5s)
  const fetchJobs = useCallback(async () => {
    if (isGlobalPaused) return;
    try {
      // Simula polling automático com incremento suave
      setJobs(prev => prev.map(job => {
        if (job.status !== 'processing') return job;
        const newProgress = Math.min(job.progress + Math.floor(Math.random() * 4) + 1, 100);
        const stepsIdx = Math.floor((newProgress / 100) * ALL_STEPS.length);
        const steps_completed = ALL_STEPS.slice(0, stepsIdx).map(s => s.id);
        if (newProgress >= 100) {
          return {
            ...job,
            progress: 100,
            status: 'completed',
            steps_completed: ALL_STEPS.map(s => s.id),
            ended_at: new Date().toISOString(),
            elapsed_time: '18 min 05s',
          };
        }
        return { ...job, progress: newProgress, steps_completed };
      }));
    } catch (err) {
      console.error('[useQueue Polling Error]', err);
    }
  }, [isGlobalPaused]);

  useEffect(() => {
    pollingTimerRef.current = setInterval(fetchJobs, pollingIntervalMs);
    return () => clearInterval(pollingTimerRef.current);
  }, [fetchJobs, pollingIntervalMs]);

  // Global Actions
  const toggleGlobalPause = () => {
    setIsGlobalPaused(prev => {
      const next = !prev;
      toast(next ? '⏸ Fila de produção pausada!' : '▶ Fila de produção retomada!');
      return next;
    });
  };

  // Individual Actions
  const resumeJob = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'processing' } : j));
    toast.success('▶ Job retomado!');
  };

  const pauseJob = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'paused' } : j));
    toast('⏸ Job pausado!');
  };

  const cancelJob = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'cancelled' } : j));
    toast('✕ Job cancelado.');
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    toast('🗑️ Job removido da fila.');
  };

  return {
    jobs,
    isGlobalPaused,
    isLoading,
    toggleGlobalPause,
    resumeJob,
    pauseJob,
    cancelJob,
    deleteJob,
    fetchJobs,
  };
}

export default useQueue;
