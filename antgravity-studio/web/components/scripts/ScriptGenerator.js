import { useState, useRef } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Textarea from '../shared/Textarea';
import Dropdown from '../shared/Dropdown';
import { Sparkles, Upload, FileText, Link as LinkIcon, Flame, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  '🇧🇷 Português (Brasil)',
  '🇵🇹 Português (Portugal)',
  '🇺🇸 English (US)',
  '🇬🇧 English (UK)',
  '🇪🇸 Español',
  '🇲🇽 Español (México)',
  '🇫🇷 Français',
  '🇩🇪 Deutsch',
  '🇮🇹 Italiano',
  '🇯🇵 日本語 (Japanese)',
  '🇨🇳 中文 (Chinese)',
  '🇷🇺 Русский (Russian)',
  '🇦🇷 Español (Argentina)',
  '🇨🇱 Español (Chile)',
];

export default function ScriptGenerator({ onGenerate, loading }) {
  // Input Options
  const [urls, setUrls] = useState('');
  const [directContent, setDirectContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Settings
  const [numScripts, setNumScripts] = useState(2);
  const [wordsPerScript, setWordsPerScript] = useState(1200);
  const [language, setLanguage] = useState('🇧🇷 Português (Brasil)');
  const [customPrompt, setCustomPrompt] = useState('');

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDirectContent(event.target.result);
        toast.success(`📄 Arquivo "${file.name}" carregado com sucesso!`);
      };
      reader.readAsText(file);
    }
  };

  const handleForge = () => {
    if (!urls.trim() && !directContent.trim()) {
      toast.error('Preencha as URLs de referência ou insira o conteúdo direto!');
      return;
    }
    onGenerate({
      urls,
      directContent,
      numScripts,
      wordsPerScript,
      language,
      customPrompt,
    });
  };

  return (
    <Card title="✨ Gerador de Roteiros por IA" subtitle="Extraia conteúdos de vídeos do YouTube, artigos da web ou arquivos .txt para criar roteiros virais">
      <div className="space-y-6">
        
        {/* OPÇÃO A: Extrair de URL / YouTube / .txt */}
        <div className="space-y-2">
          <Textarea
            label="Opção A: URLs de Referência"
            rows={3}
            placeholder="https://www.youtube.com/watch?v=...&#10;https://www.youtube.com/@canal&#10;ou envie um arquivo .txt abaixo"
            value={urls}
            onChange={e => setUrls(e.target.value)}
          />

          <div className="p-3 rounded-card bg-[#333333]/50 border border-[#444444] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-[#B0B0B0] flex items-center gap-1.5">
              <Info size={14} className="text-[#4ECDC4] shrink-0" />
              💡 Aceita: links de vídeos, URLs de canais (@canal), ou arquivo .txt com roteiros.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-card bg-[#333333] hover:bg-[#444444] text-[#B0B0B0] hover:text-white border border-[#444444] text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Upload size={12} /> {uploadedFileName || 'Upload de Arquivo .txt'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>

        {/* OPÇÃO B: Inserir Conteúdo Direto */}
        <Textarea
          label="Opção B: Inserir Conteúdo Direto"
          rows={4}
          placeholder="Cole aqui texto, artigo, resumo ou estrutura prévia..."
          value={directContent}
          onChange={e => setDirectContent(e.target.value)}
        />

        {/* Configurações */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#444444]/40">
          <FormField
            label="Nº de Roteiros"
            type="number"
            min={1}
            max={10}
            value={numScripts}
            onChange={e => setNumScripts(+e.target.value)}
          />

          <FormField
            label="Palavras por Roteiro"
            type="number"
            min={100}
            max={4000}
            step={100}
            value={wordsPerScript}
            onChange={e => setWordsPerScript(+e.target.value)}
          />

          <Dropdown
            label="Idioma (40+ idiomas)"
            options={LANGUAGES}
            value={language}
            onChange={e => setLanguage(e.target.value)}
          />
        </div>

        {/* Contexto / Prompt Extra */}
        <Textarea
          label="Contexto / Prompt Extra (opcional)"
          rows={2}
          placeholder="Instruções adicionais, ângulo desejado, público-alvo, tom dramático/engraçado..."
          value={customPrompt}
          onChange={e => setCustomPrompt(e.target.value)}
        />

        {/* Botão de Forjar */}
        <Button
          variant="primary"
          size="lg"
          className="w-full font-bold py-3.5"
          onClick={handleForge}
          loading={loading}
          ariaLabel="Forjar Roteiros com IA"
        >
          <Flame size={18} /> 🔥 FORJAR COM IA
        </Button>
      </div>
    </Card>
  );
}
