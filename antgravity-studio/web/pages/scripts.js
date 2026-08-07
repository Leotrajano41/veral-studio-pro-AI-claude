import { useState } from 'react';
import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import useScripts from '../hooks/useScripts';
import ScriptGenerator from '../components/scripts/ScriptGenerator';
import ScriptResults from '../components/scripts/ScriptResults';
import ScriptModal from '../components/scripts/ScriptModal';
import { ScrollText } from 'lucide-react';

export default function ScriptsPage() {
  const { scripts, loading, generateScripts, updateScript, deleteScript } = useScripts();
  const [selectedScriptForModal, setSelectedScriptForModal] = useState(null);

  const handleViewScript = (script) => {
    setSelectedScriptForModal(script);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ScrollText size={24} className="text-[#FF6B6B]" /> 📝 Roteiros
            </h1>
            <p className="text-sm text-[#B0B0B0] mt-1">
              Gere roteiros virais e persuasivos usando Inteligência Artificial
            </p>
          </div>
          <Badge text={`${scripts.length} roteiro(s)`} variant="primary" />
        </div>

        {/* ── SEÇÃO 1: GERADOR DE ROTEIROS ── */}
        <ScriptGenerator onGenerate={generateScripts} loading={loading} />

        {/* ── SEÇÃO 2: RESULTADOS ── */}
        <ScriptResults
          scripts={scripts}
          onView={handleViewScript}
          onDelete={deleteScript}
        />

        {/* ── MODAL DE VISUALIZAÇÃO E EDIÇÃO ── */}
        {selectedScriptForModal && (
          <ScriptModal
            script={selectedScriptForModal}
            onClose={() => setSelectedScriptForModal(null)}
            onSaveContent={(id, newContent) => {
              updateScript(id, newContent);
              setSelectedScriptForModal(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}
