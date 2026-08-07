import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Tv, Plus, Youtube, Users, Video, BarChart3,
  ExternalLink, Trash2, RefreshCw, Upload, Check,
  Settings, Link as LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_CHANNELS = [
  { id: 'ch1', name: 'TechBrasil', handle: '@techbrasil_yt', subscribers: '245K', videos: 312, avgViews: '18K', connected: true, thumbnail: 'https://picsum.photos/seed/401/64/64' },
  { id: 'ch2', name: 'FinançasPRO', handle: '@financaspro', subscribers: '98K', videos: 156, avgViews: '9.2K', connected: true, thumbnail: 'https://picsum.photos/seed/402/64/64' },
];

const UPLOAD_QUEUE = [
  { id: 'u1', title: 'Como Investir em 2026', channel: 'TechBrasil', status: 'scheduled', scheduledAt: '2026-08-08 09:00', duration: '1:04' },
  { id: 'u2', title: '5 Apps de IA que Mudam Tudo', channel: 'FinançasPRO', status: 'uploading', progress: 67, duration: '0:58' },
  { id: 'u3', title: 'Segredos Milionários', channel: 'TechBrasil', status: 'done', publishedAt: '2026-08-06 14:30', views: '12.4K' },
];

function ChannelCard({ channel }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-card border border-border bg-bg-secondary hover:border-accent-red/30 transition">
      <img src={channel.thumbnail} alt="" className="w-12 h-12 rounded-full border-2 border-border" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-txt-primary">{channel.name}</p>
          {channel.connected && <Badge text="Conectado" variant="success" />}
        </div>
        <p className="text-xs text-txt-secondary">{channel.handle}</p>
        <div className="flex gap-3 mt-1">
          <span className="text-[11px] text-txt-secondary flex items-center gap-1"><Users size={10} /> {channel.subscribers}</span>
          <span className="text-[11px] text-txt-secondary flex items-center gap-1"><Video size={10} /> {channel.videos} vídeos</span>
          <span className="text-[11px] text-txt-secondary flex items-center gap-1"><BarChart3 size={10} /> {channel.avgViews} views/vídeo</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 rounded text-txt-secondary hover:text-accent-teal hover:bg-bg-tertiary transition" title="Configurações do Canal">
          <Settings size={14} />
        </button>
        <a href={`https://youtube.com/${channel.handle}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded text-txt-secondary hover:text-accent-red hover:bg-bg-tertiary transition" title="Abrir no YouTube">
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

export default function Channels() {
  const [channels, setChannels] = useState(MOCK_CHANNELS);
  const [uploadQueue, setUploadQueue] = useState(UPLOAD_QUEUE);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await new Promise(r => setTimeout(r, 1500));
    setConnecting(false);
    toast.success('Redirecionando para autenticação YouTube OAuth...');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-3">
              <Tv size={24} className="text-accent-red" /> Canais / Upload
            </h1>
            <p className="text-sm text-txt-secondary mt-1">Gerencie seus canais e agende publicações automáticas</p>
          </div>
          <Button variant="primary" size="sm" onClick={handleConnect} disabled={connecting}>
            {connecting ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
            {connecting ? 'Conectando...' : 'Conectar Canal'}
          </Button>
        </div>

        {/* Connected Channels */}
        <div>
          <h2 className="text-sm font-semibold text-txt-secondary uppercase tracking-wider mb-3">Canais Conectados</h2>
          <div className="space-y-3">
            {channels.map(ch => <ChannelCard key={ch.id} channel={ch} />)}
          </div>
        </div>

        {/* YouTube OAuth Info */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-red-500/10 flex items-center justify-center">
              <Youtube size={20} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-txt-primary">Conectar novo canal YouTube</p>
              <p className="text-xs text-txt-secondary">Configure sua YouTube Data API v3 key em Configurações e autorize com OAuth 2.0</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleConnect}>
              <LinkIcon size={14} /> Autorizar
            </Button>
          </div>
        </Card>

        {/* Upload Queue */}
        <div>
          <h2 className="text-sm font-semibold text-txt-secondary uppercase tracking-wider mb-3">Fila de Upload / Publicações</h2>
          <div className="space-y-2">
            {uploadQueue.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-4 rounded-card border border-border bg-bg-secondary">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  item.status === 'done' ? 'bg-success/10' : item.status === 'uploading' ? 'bg-warning/10' : 'bg-bg-tertiary'
                }`}>
                  {item.status === 'done' ? <Check size={16} className="text-success" /> : item.status === 'uploading' ? <Upload size={16} className="text-warning" /> : <RefreshCw size={16} className="text-txt-secondary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-txt-primary truncate">{item.title}</p>
                    <Badge
                      text={item.status === 'done' ? 'Publicado' : item.status === 'uploading' ? 'Enviando' : 'Agendado'}
                      variant={item.status === 'done' ? 'success' : item.status === 'uploading' ? 'warning' : 'default'}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-txt-secondary">
                    <Youtube size={10} className="text-red-500" />
                    <span>{item.channel}</span>
                    <span>·</span>
                    <span>{item.duration}</span>
                    {item.scheduledAt && <span>· 📅 {item.scheduledAt}</span>}
                    {item.publishedAt && <span>· Publicado {item.publishedAt}</span>}
                    {item.views && <span>· 👁 {item.views} views</span>}
                  </div>
                  {item.status === 'uploading' && item.progress && (
                    <div className="mt-1.5 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                      <div className="h-full bg-warning transition-all" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                </div>
                <button className="p-1.5 rounded text-txt-secondary hover:text-error hover:bg-error/10 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
