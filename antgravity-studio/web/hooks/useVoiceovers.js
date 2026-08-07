import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

const MOCK_INITIAL_RECORDINGS = [
  {
    id: 'rec1',
    scriptName: 'Roteiro 1 — O Erro Fatal ao Investir',
    scriptText: 'Você sabia que 98% das pessoas cometem um erro fatal ao investir em 2026?',
    voice: 'Antonio ♂ (pt-BR)',
    duration: '1:32',
    audioPath: '/audio/narration-1.mp3',
    createdAt: '07 de ago. de 2026 10:30',
    speed: 0,
    pitch: 0,
    volume: 80,
  },
  {
    id: 'rec2',
    scriptName: 'Roteiro 2 — 5 Apps de IA que Mudam Tudo',
    scriptText: 'Se você não está usando estas 5 ferramentas de IA em 2026, você está trabalhando 3x mais...',
    voice: 'Francisca ♀ (pt-BR)',
    duration: '0:48',
    audioPath: '/audio/narration-2.mp3',
    createdAt: '07 de ago. de 2026 09:15',
    speed: 0,
    pitch: 0,
    volume: 80,
  },
];

export function useVoiceovers() {
  const [recordings, setRecordings] = useState(MOCK_INITIAL_RECORDINGS);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewingVoice, setPreviewingVoice] = useState(null);

  const playPreview = useCallback((voiceName) => {
    setPreviewingVoice(voiceName);
    toast(`🔊 Reproduzindo amostra da voz: ${voiceName}`);
    setTimeout(() => {
      setPreviewingVoice(null);
    }, 3000);
  }, []);

  const stopPreview = useCallback(() => {
    setPreviewingVoice(null);
    toast('⏹️ Preview de voz interrompido.');
  }, []);

  const generateVoiceovers = useCallback(async ({ scriptsRaw, voice, speed, pitch, volume }) => {
    const lines = scriptsRaw
      .split(/(?:\r?\n|---)+/)
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      toast.error('Cole ao menos um roteiro para narrar!');
      return;
    }

    setLoading(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 300));
      setProgress(i);
    }

    const newRecordings = lines.map((text, idx) => ({
      id: String(Date.now() + idx),
      scriptName: `Roteiro ${recordings.length + idx + 1} — ${text.slice(0, 25)}...`,
      scriptText: text,
      voice,
      duration: `${Math.floor(text.length / 15)}s`,
      audioPath: `/audio/generated-${Date.now()}-${idx}.mp3`,
      createdAt: new Date().toLocaleString('pt-BR'),
      speed,
      pitch,
      volume,
    }));

    setRecordings(prev => [...newRecordings, ...prev]);
    setLoading(false);
    setProgress(100);
    toast.success(`🎙️ ${newRecordings.length} narração(ões) gerada(s) e adicionada(s) à lista!`);
  }, [recordings.length]);

  const downloadAudio = useCallback((rec) => {
    toast.success(`⬇️ Baixando narração: ${rec.scriptName}`);
  }, []);

  const deleteAudio = useCallback((id) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    toast('Narração removida.');
  }, []);

  return {
    recordings,
    loading,
    progress,
    previewingVoice,
    playPreview,
    stopPreview,
    generateVoiceovers,
    downloadAudio,
    deleteAudio,
  };
}

export default useVoiceovers;
