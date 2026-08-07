import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  FolderOpen, File, Video, Music, Image as ImageIcon,
  Folder, Trash2, Download, Eye, Upload, Search,
  Grid, List, ChevronRight, ChevronDown, HardDrive,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_FILES = [
  { id: '1', name: 'roteiros', type: 'folder', count: 12, modified: '2026-08-07' },
  { id: '2', name: 'narracoes', type: 'folder', count: 8, modified: '2026-08-06' },
  { id: '3', name: 'videos-finais', type: 'folder', count: 5, modified: '2026-08-07' },
  { id: '4', name: 'Como Investir em 2026.mp4', type: 'video', size: '48 MB', modified: '2026-08-07', thumbnail: 'https://picsum.photos/seed/501/120/68' },
  { id: '5', name: 'Como Investir em 2026 - narração.mp3', type: 'audio', size: '2.4 MB', modified: '2026-08-07' },
  { id: '6', name: 'thumbnail-final.png', type: 'image', size: '420 KB', modified: '2026-08-06', thumbnail: 'https://picsum.photos/seed/502/120/68' },
  { id: '7', name: 'roteiro-investimentos.txt', type: 'text', size: '12 KB', modified: '2026-08-06' },
  { id: '8', name: '5 Apps de IA.mp4', type: 'video', size: '34 MB', modified: '2026-08-05', thumbnail: 'https://picsum.photos/seed/503/120/68' },
  { id: '9', name: '5 Apps - thumbnail.jpg', type: 'image', size: '380 KB', modified: '2026-08-05', thumbnail: 'https://picsum.photos/seed/504/120/68' },
  { id: '10', name: 'musica-fundo-cinematic.mp3', type: 'audio', size: '5.2 MB', modified: '2026-08-04' },
];

const FILE_ICONS = {
  folder: { icon: Folder, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  video: { icon: Video, color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
  audio: { icon: Music, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  image: { icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  text: { icon: File, color: 'text-txt-secondary', bg: 'bg-bg-tertiary' },
};

const DISK_USED_MB = 94;
const DISK_TOTAL_MB = 500;

function FileRow({ file, onDelete, onDownload }) {
  const meta = FILE_ICONS[file.type] || FILE_ICONS.text;
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-3 p-3 rounded-card hover:bg-bg-tertiary/50 transition group border border-transparent hover:border-border/50">
      <div className={`w-8 h-8 rounded flex items-center justify-center ${meta.bg} shrink-0`}>
        <Icon size={16} className={meta.color} />
      </div>
      {file.thumbnail && (
        <img src={file.thumbnail} alt="" className="w-12 h-7 object-cover rounded hidden sm:block" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-txt-primary truncate">{file.name}</p>
        <div className="flex items-center gap-2">
          {file.count !== undefined && <span className="text-[11px] text-txt-secondary">{file.count} arquivos</span>}
          {file.size && <span className="text-[11px] text-txt-secondary">{file.size}</span>}
          <span className="text-[11px] text-txt-secondary">{file.modified}</span>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
        {file.type !== 'folder' && (
          <button onClick={() => toast(`Pré-visualizando ${file.name}`)} className="p-1.5 rounded text-txt-secondary hover:text-accent-teal hover:bg-bg-tertiary transition">
            <Eye size={14} />
          </button>
        )}
        {file.type !== 'folder' && (
          <button onClick={() => onDownload(file)} className="p-1.5 rounded text-txt-secondary hover:text-success hover:bg-bg-tertiary transition">
            <Download size={14} />
          </button>
        )}
        <button onClick={() => onDelete(file.id)} className="p-1.5 rounded text-txt-secondary hover:text-error hover:bg-error/10 transition">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Files() {
  const [files, setFiles] = useState(MOCK_FILES);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = files.filter(f => {
    const nameOk = !query || f.name.toLowerCase().includes(query.toLowerCase());
    const typeOk = typeFilter === 'all' || f.type === typeFilter;
    return nameOk && typeOk;
  });

  const handleDelete = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.success('Arquivo removido.');
  };

  const handleDownload = (file) => toast.success(`Baixando ${file.name}...`);

  const diskPercent = Math.round((DISK_USED_MB / DISK_TOTAL_MB) * 100);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-3">
              <FolderOpen size={24} className="text-accent-red" /> Arquivos
            </h1>
            <p className="text-sm text-txt-secondary mt-1">Gerencie todos os assets dos seus projetos</p>
          </div>
          <Button variant="secondary" size="sm">
            <Upload size={14} /> Upload
          </Button>
        </div>

        {/* Disk Usage */}
        <Card>
          <div className="flex items-center gap-4">
            <HardDrive size={20} className="text-accent-teal shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-txt-primary font-medium">Armazenamento</span>
                <span className="text-sm text-txt-secondary">{DISK_USED_MB} MB / {DISK_TOTAL_MB} MB ({diskPercent}%)</span>
              </div>
              <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${diskPercent > 80 ? 'bg-error' : diskPercent > 60 ? 'bg-warning' : 'bg-accent-teal'}`}
                  style={{ width: `${diskPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 relative min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary/50" />
            <input className="input-base pl-9 py-2" placeholder="Buscar arquivos..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="input-base py-2 w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="folder">Pastas</option>
            <option value="video">Vídeos</option>
            <option value="audio">Áudios</option>
            <option value="image">Imagens</option>
            <option value="text">Textos</option>
          </select>
          <div className="flex gap-1">
            <button onClick={() => setView('list')} className={`p-2 rounded transition ${view === 'list' ? 'bg-accent-red/20 text-accent-red' : 'text-txt-secondary hover:text-txt-primary'}`}>
              <List size={16} />
            </button>
            <button onClick={() => setView('grid')} className={`p-2 rounded transition ${view === 'grid' ? 'bg-accent-red/20 text-accent-red' : 'text-txt-secondary hover:text-txt-primary'}`}>
              <Grid size={16} />
            </button>
          </div>
          <Badge text={`${filtered.length} items`} variant="default" />
        </div>

        {/* Files */}
        <Card>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-txt-secondary mb-4 pb-3 border-b border-border">
            <FolderOpen size={12} className="text-accent-red" />
            <ChevronRight size={10} />
            <span className="text-txt-primary">Todos os Arquivos</span>
          </div>

          {view === 'list' ? (
            <div className="space-y-1">
              {filtered.map(f => (
                <FileRow key={f.id} file={f} onDelete={handleDelete} onDownload={handleDownload} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(f => {
                const meta = FILE_ICONS[f.type] || FILE_ICONS.text;
                const Icon = meta.icon;
                return (
                  <div key={f.id} className="p-3 rounded-card border border-border hover:border-accent-red/30 transition cursor-pointer bg-bg-secondary group">
                    {f.thumbnail ? (
                      <img src={f.thumbnail} alt="" className="w-full aspect-video object-cover rounded mb-2" />
                    ) : (
                      <div className={`w-full aspect-video flex items-center justify-center rounded mb-2 ${meta.bg}`}>
                        <Icon size={28} className={meta.color} />
                      </div>
                    )}
                    <p className="text-xs font-medium text-txt-primary truncate">{f.name}</p>
                    <p className="text-[10px] text-txt-secondary">{f.size || `${f.count} arquivos`}</p>
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-10">
              <FolderOpen size={36} className="text-txt-secondary/30 mx-auto mb-2" />
              <p className="text-txt-secondary text-sm">Nenhum arquivo encontrado.</p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
