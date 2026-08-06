import React from 'react';

export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="bg-cardBg border border-cardBorder rounded-xl p-5 hover:border-primary/50 transition">
      <div className="h-32 bg-background rounded-lg flex items-center justify-center mb-4 text-3xl">
        🎬
      </div>
      <h3 className="text-lg font-semibold text-white mb-1 truncate">{project.name}</h3>
      <p className="text-xs text-primary font-medium mb-3">Nicho: {project.niche || 'Geral'}</p>
      
      <div className="flex justify-between items-center pt-3 border-t border-cardBorder/50">
        <span className="text-xs text-gray-400">
          {project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-BR') : 'Data n/a'}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(project.id)}
            className="text-xs text-red-400 hover:text-red-300 font-medium"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
