import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import VideoGrid from '../components/videos/VideoGrid';
import VideoPlayer from '../components/videos/VideoPlayer';
import { cn } from '../lib/utils';

const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Na Fila' },
  { value: 'processing', label: 'Processando' },
  { value: 'done', label: 'Concluídos' },
  { value: 'error', label: 'Erros' },
];

const seed = [
  { id: '1', title: '5 Segredos para Investir', status: 'done', duracao: 58, createdAt: '2026-08-04T10:00:00Z' },
  { id: '2', title: 'Curiosidades Sobre Marte', status: 'processing', duracao: 45, createdAt: '2026-08-05T12:00:00Z' },
  { id: '3', title: 'Receita Bolo de Caneca', status: 'done', duracao: 32, createdAt: '2026-08-03T14:30:00Z' },
  { id: '4', title: 'Top 10 Games de 2026', status: 'pending', duracao: 90, createdAt: '2026-08-06T08:00:00Z' },
  { id: '5', title: 'Treino HIIT 5 Minutos', status: 'error', duracao: 60, createdAt: '2026-08-02T11:00:00Z' },
  { id: '6', title: 'Como funciona o ChatGPT', status: 'done', duracao: 75, createdAt: '2026-08-01T09:00:00Z' },
];

export default function Videos() {
  const [videos, setVideos] = useState(seed);
  const [filter, setFilter] = useState('all');
  const [playerVideo, setPlayerVideo] = useState(null);

  const filtered = filter === 'all' ? videos : videos.filter((v) => v.status === filter);

  const handleDelete = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    toast.success('Vídeo removido.');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-txt-primary">Vídeos Gerados</h1>
          <p className="text-sm text-txt-secondary">{videos.length} vídeos no histórico</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold border transition',
                filter === f.value ? 'bg-accent-red text-white border-accent-red' : 'bg-bg-tertiary text-txt-secondary border-border hover:border-txt-secondary'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <VideoGrid videos={filtered} onDelete={handleDelete} onPlay={(v) => setPlayerVideo(v)} />

        {playerVideo && (
          <VideoPlayer videoUrl={playerVideo.videoPath} onClose={() => setPlayerVideo(null)} />
        )}
      </div>
    </Layout>
  );
}
