import { useState } from 'react';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import Dropdown from '../shared/Dropdown';
import { Eye, Copy, FolderPlus, Trash2, Check, Clock, ScrollText } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_PROJECTS = ['Finanças para Iniciantes', 'Tech Viral BR', 'Saúde & Bem-estar', 'Motivação Daily EN'];

export default function ScriptResults({ scripts = [], onView, onDelete }) {
  const [copiedId, setCopiedId] = useState(null);
  const [useProjectScript, setUseProjectScript] = useState(null);
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);

  const handleCopy = (script) => {
    navigator.clipboard.writeText(script.content);
    setCopiedId(script.id);
    toast.success('📋 Roteiro copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmUseInProject = () => {
    toast.success(`📤 Roteiro "${useProjectScript.title.slice(0, 25)}..." vinculado ao projeto "${selectedProject}"!`);
    setUseProjectScript(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-wider">
        Roteiros Gerados ({scripts.length})
      </h2>

      <div className="space-y-4">
        {scripts.map(script => (
          <div
            key={script.id}
            className="p-4 rounded-card border border-[#444444] bg-[#2a2a2a] hover:border-[#FF6B6B]/30 transition duration-180 space-y-3"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#444444]/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ScrollText size={16} className="text-[#FF6B6B]" /> {script.title}
                </h3>
                <p className="text-[11px] text-[#B0B0B0] mt-0.5 font-mono">
                  Gerado em: {script.generatedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge text={`${script.wordsCount} palavras`} variant="primary" />
                <Badge text={script.language} variant="default" />
              </div>
            </div>

            {/* Preview do Texto (primeiras 3 linhas) */}
            <div className="bg-[#333333]/60 p-3 rounded font-mono text-xs text-[#B0B0B0] line-clamp-3 leading-relaxed">
              {script.preview || script.content}
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onView(script)}
                ariaLabel="Visualizar Roteiro Completo"
              >
                <Eye size={14} /> 👁️ Visualizar
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy(script)}
                ariaLabel="Copiar Roteiro"
              >
                {copiedId === script.id ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} />}
                {copiedId === script.id ? 'Copiado!' : '📋 Copiar'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setUseProjectScript(script)}
                ariaLabel="Usar este Roteiro no Projeto"
              >
                <FolderPlus size={14} /> 📤 Usar neste Projeto
              </Button>

              <button
                onClick={() => onDelete(script.id)}
                className="p-2 rounded-card text-[#B0B0B0] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#444444] transition"
                title="Deletar roteiro"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {scripts.length === 0 && (
          <div className="text-center py-12 text-[#B0B0B0] text-xs bg-[#2a2a2a] rounded-card border border-[#444444]">
            Nenhum roteiro gerado ainda. Utilize o gerador acima!
          </div>
        )}
      </div>

      {/* Modal: Usar neste Projeto */}
      {useProjectScript && (
        <Modal title="📤 Vincular Roteiro ao Projeto" onClose={() => setUseProjectScript(null)} size="md">
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white">{useProjectScript.title}</p>

            <Dropdown
              label="Selecione o Projeto de Destino"
              options={MOCK_PROJECTS}
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#444444]">
              <Button variant="secondary" size="sm" onClick={() => setUseProjectScript(null)}>
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
