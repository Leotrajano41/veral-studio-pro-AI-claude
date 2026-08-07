import { useState } from 'react';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import Modal from '../shared/Modal';
import Dropdown from '../shared/Dropdown';
import { Download, Maximize2, Trash2, FolderPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_PROJECTS = ['Finanças para Iniciantes', 'Tech Viral BR', 'Saúde & Bem-estar', 'Motivação Daily EN'];

export default function ThumbnailResults({ thumbnails = [], onDownload, onDelete }) {
  const [fullscreenThumb, setFullscreenThumb] = useState(null);
  const [useProjectThumb, setUseProjectThumb] = useState(null);
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);

  const handleConfirmUseInProject = () => {
    toast.success(`📋 Thumbnail "${useProjectThumb.variation}" vinculada ao projeto "${selectedProject}"!`);
    setUseProjectThumb(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-wider">
        Thumbnails Geradas ({thumbnails.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {thumbnails.map(thumb => (
          <div
            key={thumb.id}
            className="rounded-card border border-[#444444] bg-[#2a2a2a] overflow-hidden hover:border-[#FF6B6B]/40 transition duration-180 flex flex-col justify-between"
          >
            {/* Preview 16:9 */}
            <div className="relative aspect-video bg-[#333333] overflow-hidden group">
              <img
                src={thumb.imagePath}
                alt={thumb.theme}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-2 left-2">
                <span className="text-[10px] font-bold bg-[#FF6B6B] text-white px-2 py-0.5 rounded shadow">
                  {thumb.variation}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-[9px] font-bold bg-black/80 text-[#4ECDC4] px-2 py-0.5 rounded backdrop-blur">
                  {thumb.source}
                </span>
              </div>
            </div>

            {/* Info & Actions */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-white truncate" title={thumb.theme}>{thumb.theme}</p>
                <p className="text-[11px] text-[#B0B0B0] mt-0.5 font-mono">
                  {thumb.style} · {thumb.position}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#444444]/40">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFullscreenThumb(thumb)}
                  ariaLabel="Abrir Fullscreen"
                >
                  <Maximize2 size={13} /> 👁️ Fullscreen
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDownload(thumb)}
                  ariaLabel="Download PNG"
                >
                  <Download size={13} /> ⬇️ Download PNG
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setUseProjectThumb(thumb)}
                  ariaLabel="Usar no Projeto"
                >
                  <FolderPlus size={13} /> 📋 Usar no Projeto
                </Button>

                <button
                  onClick={() => onDelete(thumb.id)}
                  className="p-2 rounded-card text-[#B0B0B0] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#444444] transition"
                  title="Deletar thumbnail"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Fullscreen Preview */}
      {fullscreenThumb && (
        <Modal title={`👁️ Fullscreen: ${fullscreenThumb.theme}`} onClose={() => setFullscreenThumb(null)} size="xl">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-card overflow-hidden bg-black border border-[#444444]">
              <img src={fullscreenThumb.imagePath} alt="" className="w-full h-full object-contain" />
            </div>

            <div className="flex justify-between items-center text-xs text-[#B0B0B0]">
              <span>{fullscreenThumb.source} · {fullscreenThumb.variation}</span>
              <Button variant="primary" size="sm" onClick={() => onDownload(fullscreenThumb)}>
                <Download size={14} /> Download Alta Definição PNG
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Usar no Projeto */}
      {useProjectThumb && (
        <Modal title="📋 Associar Thumbnail ao Projeto" onClose={() => setUseProjectThumb(null)} size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-2 rounded bg-[#333333]">
              <img src={useProjectThumb.imagePath} alt="" className="w-20 h-12 object-cover rounded" />
              <p className="text-xs font-semibold text-white truncate">{useProjectThumb.theme}</p>
            </div>

            <Dropdown
              label="Selecione o Projeto de Destino"
              options={MOCK_PROJECTS}
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#444444]">
              <Button variant="secondary" size="sm" onClick={() => setUseProjectThumb(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmUseInProject}>
                Salvar no Projeto
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
