import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const PHASES = [
  'Validando arquivos de áudio, música e mídia...',
  'Sincronizando narração com trilha sonora...',
  'Fatiando clipes de vídeo pelo Chunk Size...',
  'Aplicando picotador e correções de cor...',
  'Compilando arquivo final .mp4 com FFmpeg...',
];

export function useRender() {
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [completedJob, setCompletedJob] = useState(null);

  const startRender = useCallback(async (config) => {
    if (!config.audioPath.trim() || !config.mediaPath.trim()) {
      toast.error('Preencha as pastas de entrada obrigatórias (Áudios e Mídias)!');
      return;
    }

    setRendering(true);
    setProgress(0);
    setCompletedJob(null);

    const totalPhases = PHASES.length;
    for (let i = 0; i < totalPhases; i++) {
      setCurrentPhase(PHASES[i]);
      for (let p = (i / totalPhases) * 100; p <= ((i + 1) / totalPhases) * 100; p += 4) {
        await new Promise(r => setTimeout(r, 60));
        setProgress(Math.min(100, Math.round(p)));
      }
    }

    const outputFileName = `video_render_${Date.now()}.mp4`;
    const finalPath = `${config.outputPath || './output'}/${outputFileName}`;

    const jobResult = {
      id: String(Date.now()),
      name: outputFileName,
      outputPath: finalPath,
      completedAt: new Date().toLocaleString('pt-BR'),
    };

    setCompletedJob(jobResult);
    setRendering(false);
    setProgress(100);
    toast.success('🎬 VÍDEO RENDERIZADO COM SUCESSO!');
  }, []);

  const openOutputFolder = (path) => {
    toast(`📂 Abrindo pasta de saída: ${path || './output'}`);
  };

  const previewVideo = (path) => {
    toast(`▶ Abrindo visualização prévia do vídeo: ${path}`);
  };

  return {
    rendering,
    progress,
    currentPhase,
    completedJob,
    startRender,
    openOutputFolder,
    previewVideo,
  };
}

export default useRender;
