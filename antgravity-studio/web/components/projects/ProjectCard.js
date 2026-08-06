import { FolderKanban, Trash2, Pencil, Film } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="glass-card p-5 group hover:border-accent-red/30 hover:shadow-glow transition-all duration-300">
      <div className="h-28 bg-bg-tertiary rounded-card flex items-center justify-center mb-4 group-hover:bg-accent-red/5 transition">
        <FolderKanban size={32} className="text-txt-secondary/40 group-hover:text-accent-red/60 transition" />
      </div>

      <h3 className="text-base font-semibold text-txt-primary mb-1 truncate">{project.name}</h3>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-accent-red bg-accent-red/10 px-2 py-0.5 rounded-full">{project.niche || 'Geral'}</span>
        <span className="text-xs text-txt-secondary flex items-center gap-1"><Film size={10} /> {project.videoCount ?? 0}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-txt-secondary">{formatDate(project.createdAt)}</span>
        <div className="flex gap-1">
          <button className="p-1.5 rounded hover:bg-bg-tertiary transition text-txt-secondary hover:text-accent-teal" title="Editar">
            <Pencil size={14} />
          </button>
          {onDelete && (
            <button onClick={() => onDelete(project.id)} className="p-1.5 rounded hover:bg-error/10 transition text-txt-secondary hover:text-error" title="Excluir">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
