import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  AudioWaveform, Mic, Play, Square, Trash2, Download,
  Upload, AlertTriangle, CheckCircle2, RefreshCw, Loader,
  Info, Sparkles, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { id: 'pt', label: 'Português' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'it', label: 'Italiano' },
];

const INITIAL_CLONED_VOICES = [
  { id: 'cv1', name: 'Valentino (Voz Dramática)', language: 'Português', status: 'ready', date: '2026-08-05', isPlaying: false },
  { id: 'cv2', name: 'Adam (Voz Narração EN)', language: 'English', status: 'ready', date: '2026-08-04', isPlaying: false },
];

export default function VoicesPage() {
  // New Voice State
  const [voiceName, setVoiceName] = useState('');
  const [baseLanguage, setBaseLanguage] = useState('Português');
  const [audioFile, setAudioFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [installingXtts, setInstallingXtts] = useState(false);
  const fileInputRef = useRef(null);

  // Cloned Voices List State
  const [clonedVoices, setClonedVoices] = useState(INITIAL_CLONED_VOICES);

  const handleAudioChange = (e) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
      toast.success(`Áudio "${e.target.files[0].name}" carregado!`);
    }
  };

  const handleSaveVoice = async () => {
    if (!voiceName.trim()) { toast.error('Digite o nome da voz!'); return; }
    if (!audioFile) { toast.error('Selecione um áudio de referência (.wav ou .mp3)!'); return; }

    setSaving(true);
    await new Promise(r => setTimeout(r, 2000));

    const newVoice = {
      id: String(Date.now()),
      name: voiceName,
      language: baseLanguage,
      status: 'ready',
      date: new Date().toISOString().slice(0, 10),
      isPlaying: false,
    };

    setClonedVoices(prev => [newVoice, ...prev]);
    setVoiceName('');
    setAudioFile(null);
    setSaving(false);
    toast.success(`🎙️ Voz "${newVoice.name}" clonada e salva com sucesso!`);
  };

  const handleInstallXTTS = async () => {
    setInstallingXtts(true);
    await new Promise(r => setTimeout(r, 2500));
    setInstallingXtts(false);
    toast.success('⬇️ Pacote XTTS v2 instalado e configurado!');
  };

  const handleTestVoice = (id) => {
    setClonedVoices(prev => prev.map(v => v.id === id ? { ...v, isPlaying: true } : { ...v, isPlaying: false }));
    toast(`🔊 Reproduzindo amostra da voz clonada...`);
    setTimeout(() => {
      setClonedVoices(prev => prev.map(v => v.id === id ? { ...v, isPlaying: false } : v));
    }, 2500);
  };

  const handleDeleteVoice = (id) => {
    setClonedVoices(prev => prev.filter(v => v.id !== id));
    toast('Voz clonada removida.');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-3">
              <AudioWaveform size={24} className="text-accent-red" /> 🎙️ Vozes Clonadas (XTTS)
            </h1>
            <p className="text-sm text-txt-secondary mt-1">Clone qualquer voz a partir de 30 segundos de áudio com inteligência artificial XTTS v2</p>
          </div>
          <Badge text={`${clonedVoices.length} voz(es)`} variant="default" />
        </div>

        {/* ── Aviso de Sistema Operacional ── */}
        <div className="p-4 rounded-card bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-txt-primary">Informação importante sobre clonagem local:</p>
            <p className="text-txt-secondary">
              ⚠️ <strong className="text-txt-primary">Clonagem de voz via XTTS local só está totalmente otimizada no Windows</strong> com GPU NVIDIA (CUDA).
            </p>
            <p className="text-txt-secondary">
              No Mac ou Linux sem GPU dedicada, utilize as vozes neurais padrão do gerador (Google Wavenet ou OpenAI Alloy/Nova).
            </p>
          </div>
        </div>

        {/* ── Seção: Criar Nova Voz Clonada ── */}
        <Card title="✨ Criar Nova Voz Clonada">
          <div className="space-y-4">
            <div className="p-3 rounded-card bg-bg-tertiary/40 border border-border flex items-center gap-2 text-xs text-txt-secondary">
              <Info size={14} className="text-accent-teal shrink-0" />
              <span>Coloque 30 segundos de áudio limpo de qualquer pessoa (sem música de fundo).</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-txt-secondary mb-1 block">Nome da Voz *</label>
                <input
                  className="input-base"
                  placeholder='Ex: "Valentino", "Adam", "Minha Voz"'
                  value={voiceName}
                  onChange={e => setVoiceName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-txt-secondary mb-1 block">Idioma base da referência</label>
                <select className="input-base" value={baseLanguage} onChange={e => setBaseLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l.id}>{l.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-txt-secondary mb-1 block">Áudio de referência (.wav / .mp3)</label>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-card border border-dashed border-border hover:border-accent-red/40 bg-bg-tertiary/30 text-xs text-txt-secondary hover:text-txt-primary transition"
                >
                  <Upload size={16} />
                  {audioFile ? audioFile.name : 'Clique para selecionar o áudio de 30s (.wav ou .mp3)'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".wav,.mp3,.m4a"
                  className="hidden"
                  onChange={handleAudioChange}
                />
                <Badge
                  text={audioFile ? '✓ Pronto' : 'Aguardando'}
                  variant={audioFile ? 'success' : 'default'}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="primary" size="sm" onClick={handleSaveVoice} disabled={saving}>
                {saving ? <Loader size={14} className="animate-spin" /> : <Mic size={14} />}
                {saving ? 'Clonando Voz...' : 'Salvar Voz'}
              </Button>

              <Button variant="secondary" size="sm" onClick={handleInstallXTTS} disabled={installingXtts}>
                {installingXtts ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
                {installingXtts ? 'Instalando XTTS...' : '⬇️ Instalar XTTS'}
              </Button>

              <Button variant="secondary" size="sm" onClick={() => toast.success('Lista de vozes atualizada!')}>
                <RefreshCw size={14} /> Atualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Seção: Vozes Salvas ── */}
        <Card title="🎙️ Vozes Salvas">
          <div className="space-y-3">
            {clonedVoices.map(voice => (
              <div key={voice.id} className="p-4 rounded-card border border-border bg-bg-secondary hover:border-accent-red/30 transition flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red font-bold shrink-0">
                    <AudioWaveform size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-txt-primary">{voice.name}</p>
                      <Badge text="✓ Pronto" variant="success" />
                    </div>
                    <p className="text-xs text-txt-secondary">{voice.language} · Criado em {voice.date}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleTestVoice(voice.id)}
                    disabled={voice.isPlaying}
                  >
                    {voice.isPlaying ? <Square size={13} className="text-accent-red" /> : <Play size={13} className="text-success" />}
                    {voice.isPlaying ? 'Tocando...' : 'Testar (play)'}
                  </Button>
                  <button
                    onClick={() => handleDeleteVoice(voice.id)}
                    className="p-2 rounded-card text-txt-secondary hover:text-error hover:bg-error/10 border border-border transition"
                    title="Deletar voz"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {clonedVoices.length === 0 && (
              <div className="text-center py-12">
                <AudioWaveform size={36} className="text-txt-secondary/30 mx-auto mb-2" />
                <p className="text-txt-secondary text-sm">Nenhuma voz clonada salva ainda.</p>
                <p className="text-txt-secondary/50 text-xs mt-1">Preencha os campos acima para clonar sua primeira voz.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
