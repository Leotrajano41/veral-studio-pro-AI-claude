import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const MOCK_INITIAL_THUMBS = [
  {
    id: 'th1',
    theme: '5 Segredos para Investir em 2026',
    source: '🎨 Nano Banana 2 (Gemini Image)',
    imagePath: 'https://picsum.photos/seed/thumb1/1280/720',
    generatedAt: '07 de ago. de 2026 10:30',
    position: 'Inferior esquerda',
    colors: '⚪🟡 Branco + Amarelo',
    style: '💥 Impacto (contorno grosso)',
    variation: 'Versão A (Principal)',
  },
  {
    id: 'th2',
    theme: '5 Segredos para Investir em 2026 (Teste B)',
    source: '🎨 Nano Banana 2 (Gemini Image)',
    imagePath: 'https://picsum.photos/seed/thumb2/1280/720',
    generatedAt: '07 de ago. de 2026 10:31',
    position: 'Inferior centro',
    colors: '⚪🔴 Branco + Vermelho',
    style: '✨ Neon (brilho na cor)',
    variation: 'Versão B (Teste A/B)',
  },
];

export function useThumbnail() {
  const [thumbnails, setThumbnails] = useState(MOCK_INITIAL_THUMBS);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateThumbnails = useCallback(async (config) => {
    if (!config.theme.trim()) {
      toast.error('O Tema do Vídeo é obrigatório para gerar a thumbnail!');
      return;
    }

    setLoading(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 25) {
      await new Promise(r => setTimeout(r, 250));
      setProgress(i);
    }

    const count = parseInt(config.count) || 1;
    const newItems = [];

    for (let i = 0; i < count; i++) {
      const varLetter = String.fromCharCode(65 + i); // A, B, C
      newItems.push({
        id: `th-${Date.now()}-${i}`,
        theme: config.theme,
        source: config.source,
        imagePath: `https://picsum.photos/seed/gen_${Date.now()}_${i}/1280/720`,
        generatedAt: new Date().toLocaleString('pt-BR'),
        position: config.position,
        colors: config.colors,
        style: config.style,
        variation: count > 1 ? `Versão ${varLetter} (Teste A/B/${varLetter})` : 'Versão Principal',
      });
    }

    setThumbnails(prev => [...newItems, ...prev]);
    setLoading(false);
    setProgress(100);
    toast.success(`🎨 ${count} thumbnail(s) gerada(s) com sucesso!`);
  }, []);

  const downloadThumbnail = useCallback((thumb) => {
    toast.success(`⬇️ Baixando thumbnail em alta definição PNG: ${thumb.theme}`);
  }, []);

  const deleteThumbnail = useCallback((id) => {
    setThumbnails(prev => prev.filter(t => t.id !== id));
    toast('Thumbnail deletada.');
  }, []);

  return {
    thumbnails,
    loading,
    progress,
    generateThumbnails,
    downloadThumbnail,
    deleteThumbnail,
  };
}

export default useThumbnail;
