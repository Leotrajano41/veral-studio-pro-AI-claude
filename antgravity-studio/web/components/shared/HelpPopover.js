import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, X, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import Modal from './Modal';

export default function HelpPopover({
  moduleTitle = 'Ajuda do Módulo',
  description = 'Aprenda como utilizar este módulo da melhor forma.',
  steps = [],
  tips = [],
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão de Ajuda "?" */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#6366F1] hover:text-white hover:bg-[#6366F1] transition shadow-sm group"
        title="Ajuda e Tutorial deste Módulo"
        aria-label="Ajuda e Tutorial deste Módulo"
      >
        <HelpCircle size={18} className="group-hover:scale-110 transition duration-150" />
      </button>

      {/* Modal / Popover de Ajuda Contextual */}
      {isOpen && (
        <Modal
          title={`❓ Como Usar — ${moduleTitle}`}
          onClose={() => setIsOpen(false)}
          size="md"
        >
          <div className="space-y-4 text-xs">
            {/* Descrição */}
            <p className="text-[#F8FAFC] leading-relaxed bg-[#0F172A] p-3 rounded-card border border-[#334155]">
              {description}
            </p>

            {/* Passo a Passo Numerado */}
            {steps.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#10B981]" /> Passo a Passo Recomendado:
                </h4>
                <div className="space-y-1.5 pl-1">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[#94A3B8]">
                      <span className="font-bold text-[#6366F1] shrink-0 font-mono">{idx + 1}.</span>
                      <span className="text-[#F8FAFC]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dicas Pro */}
            {tips.length > 0 && (
              <div className="p-3 bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-card space-y-1.5">
                <h4 className="font-bold text-[#6366F1] flex items-center gap-1.5">
                  <Lightbulb size={14} /> Dicas Pro:
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[#94A3B8]">
                  {tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer com link para a Central de Documentação /docs */}
            <div className="pt-3 border-t border-[#334155] flex items-center justify-between">
              <Link
                href="/docs"
                className="text-[#6366F1] hover:underline flex items-center gap-1.5 font-semibold"
              >
                <BookOpen size={14} /> Abrir Central de Documentação completa (/docs)
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-[#334155] text-white rounded hover:bg-[#475569] transition"
              >
                Entendi
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
