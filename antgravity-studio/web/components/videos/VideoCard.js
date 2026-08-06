import { Play, Download, Trash2, Share2 } from 'lucide-react';
import { formatDate, formatDuration } from '../../lib/utils';
import StatusBadge from './StatusBadge';

export default function VideoCard({ video, onDelete, onPlay }) {
  const isDone = video.status === 'done';
  return (
    <div className="glass-card overflow-hidden group hover:border-accent-red/30 transition-all duration-300">
      <div
        className="h-40 bg-bg-tertiary flex items-center justify-center cursor-pointer relative"
        onClick={() => isDone && onPlay && onPlay(video)}
      >
        <Play size={32} className="text-txt-secondary/30 group-hover:text-accent-red/60 transition" />
        {isDone && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-accent-red/80 flex items-center justify-center"><Play size={20} className="text-white ml-0.5" /></div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-txt-primary truncate flex-1 mr-2">{video.title || 'Sem título'}</h3>
          <StatusBadge status={video.status} />
        </div>

        <div className="flex items-center gap-3 text-xs text-txt-secondary mb-3">
          <span>{formatDate(video.createdAt)}</span>
          <span>•</span>
          <span>{formatDuration(video.duracao)}</span>
        </div>

        <div className="flex items-center gap-1 pt-3 border-t border-border">
          {isDone && (
            <>
              <button className="p-1.5 rounded hover:bg-accent-teal/10 text-txt-secondary hover:text-accent-teal transition" title="Baixar"><Download size={14} /></button>
              <button className="p-1.5 rounded hover:bg-accent-red/10 text-txt-secondary hover:text-accent-red transition" title="Compartilhar"><Share2 size={14} /></button>
            </>
          )}
          {onDelete && (
            <button onClick={() => onDelete(video.id)} className="p-1.5 rounded hover:bg-error/10 text-txt-secondary hover:text-error transition ml-auto" title="Excluir"><Trash2 size={14} /></button>
          )}
        </div>
      </div>
    </div>
  );
}
