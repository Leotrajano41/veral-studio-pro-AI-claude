import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { ExternalLink, Eye, MessageSquare, Flame, PlusCircle, Check } from 'lucide-react';

export default function TrendCard({ trend, onCreateProject }) {
  return (
    <div className="rounded-card border border-[#444444] bg-[#2a2a2a] overflow-hidden hover:border-[#FF6B6B]/40 transition duration-180 flex flex-col justify-between group">
      {/* Thumbnail & Score Badge */}
      <div className="relative aspect-video bg-[#333333] overflow-hidden">
        <img
          src={trend.thumbnail}
          alt={trend.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Score Badge (%) */}
        <div className="absolute top-2 right-2">
          <span className="text-[11px] font-bold bg-[#FF6B6B] text-white px-2 py-0.5 rounded shadow flex items-center gap-1">
            <Flame size={12} /> {trend.score}% Hot
          </span>
        </div>
        {/* Source Badge */}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-bold bg-black/75 text-white px-2 py-0.5 rounded backdrop-blur">
            {trend.source}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2" title={trend.title}>
            {trend.title}
          </h3>
          <p className="text-xs text-[#B0B0B0] line-clamp-2">
            {trend.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-[11px] text-[#B0B0B0] pt-2 border-t border-[#444444]/40">
          <span className="flex items-center gap-1 font-mono">
            <Eye size={12} className="text-[#FF6B6B]" /> {trend.views}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <MessageSquare size={12} className="text-[#A78BFA]" /> {trend.comments}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <a
            href={trend.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-2 rounded-card bg-[#333333] hover:bg-[#444444] text-[#B0B0B0] hover:text-white text-xs font-semibold transition border border-[#444444] flex items-center justify-center gap-1 truncate"
            title={`Ver no ${trend.source}`}
          >
            <ExternalLink size={12} /> Ver no {trend.source.split(' ')[0]}
          </a>

          <Button
            variant="primary"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onCreateProject(trend)}
            ariaLabel="Criar Projeto a partir da tendência"
          >
            <PlusCircle size={12} /> ✅ Criar Projeto
          </Button>
        </div>
      </div>
    </div>
  );
}
