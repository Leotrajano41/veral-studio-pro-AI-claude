import { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Textarea from '../shared/Textarea';
import { Edit2, Copy, Check, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScriptModal({ script, onClose, onSaveContent }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(script?.content || '');
  const [copied, setCopied] = useState(false);

  if (!script) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('📋 Conteúdo do roteiro copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveContent(script.id, content);
    setIsEditing(false);
  };

  return (
    <Modal title={`📄 ${script.title}`} onClose={onClose} size="xl">
      <div className="space-y-4">
        {/* Sub-header info */}
        <div className="flex items-center justify-between text-xs text-[#B0B0B0] pb-2 border-b border-[#444444]">
          <span>{script.wordsCount} palavras · {script.language}</span>
          <span>Gerado em: {script.generatedAt}</span>
        </div>

        {/* Content Area (Visualizar ou Editar) */}
        {isEditing ? (
          <Textarea
            rows={14}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="font-mono text-xs"
          />
        ) : (
          <div className="p-4 rounded-card bg-[#333333]/50 border border-[#444444] font-mono text-xs text-white whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
            {content}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-3 border-t border-[#444444]">
          <div className="flex gap-2">
            {isEditing ? (
              <Button variant="primary" size="sm" onClick={handleSave}>
                <Save size={14} /> Salvar Alterações
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 size={14} /> Editar
              </Button>
            )}

            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
