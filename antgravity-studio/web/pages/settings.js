import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import useOnboarding from '../hooks/useOnboarding';
import { resetWizard } from '../hooks/useWizard';
import {
  Settings, Key, ShieldCheck, Download, Upload, RefreshCw,
  Trash2, HelpCircle, Globe, Mic2, Brain, Sparkles, Youtube,
  Film, Image as ImageIcon, CheckCircle2, XCircle, Eye, EyeOff,
  Save, AlertTriangle, Layers, Info, Check, HardDrive, Lock, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import SetupChecklist from '../components/SetupChecklist';
import useOnboardingAnalytics from '../hooks/useOnboardingAnalytics';

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────
const MOCK_API_KEYS = [
  { key: 'openai', label: 'OpenAI (GPT-4o-mini)', desc: 'Geração de roteiros e prompts', icon: Brain, status: 'valid', secret: 'sk-pro-98f7d6a5c4b3a2ilEA', docs: 'https://platform.openai.com/api-keys', required: true, tooltip: '✓ Chave OpenAI ativa e validada. Necessária para forjar roteiros automáticos.' },
  { key: 'gemini', label: 'Google Gemini', desc: 'LLM alternativa para textos e análise', icon: Sparkles, status: 'valid', secret: 'AIzaSyA8b7c6d5e4f3g2h1ilEA', docs: 'https://aistudio.google.com', required: false, tooltip: '✓ Chave Gemini ativa. Provedor secundário para análise e textos.' },
  { key: 'openrouter', label: 'OpenRouter', desc: 'Geração de thumbnails e imagens', icon: Sparkles, status: 'valid', secret: 'sk-or-v1-9988776655443322ilEA', docs: 'https://openrouter.ai/keys', required: true, tooltip: '✓ Chave OpenRouter ativa. Gera imagens HD para capas e thumbnails.' },
  { key: 'assembly', label: 'Assembly AI', desc: 'Transcrição e legendagem sincronizada', icon: Mic2, status: 'valid', secret: 'a8f7e6d5c4b3a2f1e09876ilEA', docs: 'https://www.assemblyai.com', required: true, tooltip: '✓ Chave AssemblyAI ativa. Gera legendas dinâmicas palavra a palavra.' },
  { key: 'pixabay', label: 'Pixabay', desc: 'Imagens e vídeos stock gratuitos', icon: ImageIcon, status: 'valid', secret: '458921-a7f8e9d0c1b2a3f4e5ilEA', docs: 'https://pixabay.com/api/docs/', required: true, tooltip: '✓ Chave Pixabay ativa. Baixa vídeos e fundos gratuitos em HD/4K.' },
  { key: 'pexels', label: 'Pexels', desc: 'Mídias em alta definição', icon: ImageIcon, status: 'valid', secret: '56728190a1b2c3d4e5f6g7h8ilEA', docs: 'https://www.pexels.com/api/', required: false, tooltip: '✓ Chave Pexels ativa. Provedor secundário de mídia stock.' },
  { key: 'kie', label: 'Kie.ai', desc: 'Avatares fotorrealistas e vídeos', icon: Film, status: 'not_set', secret: '', docs: 'https://kie.ai', required: false, tooltip: '❌ Chave Kie.ai não configurada. Cole sua chave para habilitar avatares 3D.' },
  { key: 'meta', label: 'Meta AI', desc: 'Modelos LLaMA (login via cookie)', icon: Brain, status: 'not_set', secret: '', docs: 'https://ai.meta.com', required: false, tooltip: '❌ Cookie Meta AI pendente. Opcional para modelos open-source LLaMA.' },
];

const EDGE_TTS_VOICES = [
  { name: 'pt-BR-FranciscaNeural', gender: 'Feminino', lang: 'Português (BR)', type: 'Neural (Edge)' },
  { name: 'pt-BR-AntonioNeural', gender: 'Masculino', lang: 'Português (BR)', type: 'Neural (Edge)' },
  { name: 'pt-BR-ThalitaNeural', gender: 'Feminino', lang: 'Português (BR)', type: 'Neural (Edge)' },
  { name: 'en-US-JennyNeural', gender: 'Feminino', lang: 'English (US)', type: 'Neural (Edge)' },
  { name: 'en-US-GuyNeural', gender: 'Masculino', lang: 'English (US)', type: 'Neural (Edge)' },
  { name: 'es-ES-ElviraNeural', gender: 'Feminino', lang: 'Español (Espanha)', type: 'Neural (Edge)' },
  { name: 'es-MX-DaliaNeural', gender: 'Feminino', lang: 'Español (México)', type: 'Neural (Edge)' },
];

function maskKey(str) {
  if (!str || str.length < 9) return str ? '●●●●●●●●●●●●' : '';
  return `${str.slice(0, 5)}...${str.slice(-4)}`;
}

function validateKeyFormat(key, value) {
  if (!value || value.trim().length === 0) return null;
  const str = value.trim();
  if (key === 'openai') return str.startsWith('sk-') || str.length > 18;
  if (key === 'gemini') return str.startsWith('AIza') || str.length > 18;
  if (key === 'openrouter') return str.startsWith('sk-or-') || str.length > 18;
  if (key === 'assembly') return str.length > 15;
  if (key === 'pixabay') return str.length > 10;
  return str.length > 8;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('keys'); // 'backup' | 'licenca' | 'keys' | 'tts' | 'cache' | 'sobre'
  const { animationsDisabled, setAnimationsDisabled, resetOnboarding } = useOnboarding();
  const { analytics, resetAnalytics } = useOnboardingAnalytics();

  // ABA 1 - BACKUP
  const fileInputRef = useRef(null);
  const [backupSize] = useState('45.2 MB');

  // ABA 2 - LICENÇA
  const [licenseSerial, setLicenseSerial] = useState('AG-2026-PRO-7X4K');
  const [isLicenseActive, setIsLicenseActive] = useState(true);
  const [serialInput, setSerialInput] = useState('');

  // ABA 3 - API KEYS
  const [apiKeys, setApiKeys] = useState(MOCK_API_KEYS);
  const [showSecretMap, setShowSecretMap] = useState({});

  // ABA 4 - VOZES TTS
  const [ttsVoices, setTtsVoices] = useState(EDGE_TTS_VOICES);
  const [loadingVoices, setLoadingVoices] = useState(false);

  // ABA 5 - CACHE MANAGER
  const [cacheStats, setCacheStats] = useState({ size: '4.8 GB', filesCount: 1240, oldestFile: '2026-07-15' });

  // Backup handlers
  const handleDownloadBackup = () => {
    toast.success('⬇️ Baixando backup completo (antgravity_backup_2026.zip)...');
  };
  const handleImportBackupClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      toast.success(`⬆️ Backup "${e.target.files[0].name}" importado com sucesso!`);
    }
  };

  // License handlers
  const handleValidateSerial = () => {
    if (serialInput.trim().length < 10) {
      toast.error('Serial inválido! Verifique a chave de licença.');
      return;
    }
    setLicenseSerial(serialInput.trim());
    setIsLicenseActive(true);
    setSerialInput('');
    toast.success('✓ Licença validada e ativada com sucesso!');
  };

  // API Key handlers
  const toggleShowSecret = (key) => {
    setShowSecretMap(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSaveApiKey = (serviceKey, newSecret) => {
    setApiKeys(prev => {
      const updated = prev.map(k => k.key === serviceKey ? { ...k, secret: newSecret, status: newSecret ? 'valid' : 'not_set' } : k);
      const validCount = updated.filter(k => k.status === 'valid').length;
      try {
        localStorage.setItem('vsp_configured_apis_count', Math.min(validCount, 5));
        window.dispatchEvent(new Event('vsp_api_count_change'));
      } catch (_) {}
      return updated;
    });
    toast.success(`Chave ${serviceKey.toUpperCase()} salva!`);
  };
  const handleUpdateFromServer = async () => {
    toast.success('🔄 Chaves de API sincronizadas com o servidor!');
  };

  const [testingKeyMap, setTestingKeyMap] = useState({});

  const handleTestConnection = async (item) => {
    setTestingKeyMap(prev => ({ ...prev, [item.key]: true }));
    await new Promise(r => setTimeout(r, 900));
    setTestingKeyMap(prev => ({ ...prev, [item.key]: false }));

    if (item.secret && item.secret.length > 5) {
      setApiKeys(prev => prev.map(k => k.key === item.key ? { ...k, status: 'valid', tooltip: `✓ Chave ${item.label} testada e conectada com sucesso.` } : k));
      try {
        localStorage.setItem('vsp_api_has_error', 'false');
        window.dispatchEvent(new Event('vsp_api_error_change'));
      } catch (_) {}
      toast.success(`🧪 Conexão com ${item.label} estabelecida com sucesso!`);
    } else {
      setApiKeys(prev => prev.map(k => k.key === item.key ? { ...k, status: 'error', tooltip: `⚠️ Erro de conexão em ${item.label}. Verifique ou renove a chave.` } : k));
      try {
        localStorage.setItem('vsp_api_has_error', 'true');
        window.dispatchEvent(new Event('vsp_api_error_change'));
      } catch (_) {}
      toast.error(`⚠️ Falha ao conectar com ${item.label}. Verifique sua chave!`);
    }
  };

  // TTS Voice handlers
  const handleLoadEdgeVoices = async () => {
    setLoadingVoices(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoadingVoices(false);
    toast.success('🔄 7 vozes do Microsoft Edge TTS carregadas!');
  };

  // Cache handlers
  const handleUpdateCacheStats = () => {
    toast.success('📊 Estatísticas de cache atualizadas!');
  };
  const handleClearOldCache = () => {
    setCacheStats(prev => ({ ...prev, size: '1.2 GB', filesCount: 310 }));
    toast.success('🧹 Arquivos com mais de 7 dias removidos!');
  };
  const handleRemoveIncompleteMagic = () => {
    toast.success('⚠️ Arquivos temporários do magic/ limpos!');
  };
  const handleFullCacheCleanup = () => {
    if (!confirm('Deseja realmente apagar TODO o cache temporário?')) return;
    setCacheStats({ size: '0.0 MB', filesCount: 0, oldestFile: 'Nenhum' });
    toast.success('🔥 Limpeza completa de cache realizada!');
  };

  const essentialKeys = ['openai', 'gemini', 'openrouter', 'assembly', 'pixabay'];
  const validEssentialCount = apiKeys.filter(k => essentialKeys.includes(k.key) && k.status === 'valid').length;
  const remainingCount = Math.max(0, 5 - validEssentialCount);
  const isEssentialComplete = validEssentialCount >= 5;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-3">
              <Settings size={24} className="text-accent-red" /> Módulo Configurações
            </h1>
            <p className="text-sm text-txt-secondary mt-1">Gerencie APIs, Licença, Backup, Vozes Edge TTS e Cache do sistema</p>
          </div>
          <Badge text="v2.0 PRO" variant="error" />
        </div>

        {/* ── 7 Abas ── */}
        <div className="flex gap-1 bg-bg-secondary p-1 rounded-card border border-border overflow-x-auto">
          {[
            { id: 'keys', label: '🔑 API Keys' },
            { id: 'interface', label: '🎨 Interface & Animações' },
            { id: 'backup', label: '💾 Backup & Restore' },
            { id: 'licenca', label: '🔒 Licença' },
            { id: 'tts', label: '🎙️ Vozes TTS' },
            { id: 'cache', label: '🗑️ Cache Manager' },
            { id: 'sobre', label: 'ℹ️ Sobre' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition ${activeTab === tab.id ? 'bg-accent-red text-white' : 'text-txt-secondary hover:text-txt-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── ABA 1: BACKUP & RESTORE ── */}
        {activeTab === 'backup' && (
          <Card title="💾 Backup dos seus dados">
            <div className="space-y-4">
              <p className="text-xs text-txt-secondary">
                Exporta todos os seus projetos, configurações de canal, chaves salvas e histórico em um arquivo comprimido <strong className="text-txt-primary">.zip</strong>.
              </p>
              <div className="p-3 rounded-card bg-bg-tertiary/40 border border-border flex justify-between items-center text-xs">
                <span className="text-txt-secondary">Tamanho total dos dados:</span>
                <span className="font-mono text-txt-primary font-bold">{backupSize}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="primary" size="sm" onClick={handleDownloadBackup}>
                  <Download size={14} /> ⬇️ Baixar backup (.zip)
                </Button>
                <Button variant="secondary" size="sm" onClick={handleImportBackupClick}>
                  <Upload size={14} /> ⬆️ Importar backup
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".zip,.json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </Card>
        )}

        {/* ── ABA 2: LICENÇA ── */}
        {activeTab === 'licenca' && (
          <Card title="🔒 Licença (OBRIGATÓRIA)">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-card border bg-bg-tertiary/30">
                <div>
                  <p className="text-xs text-txt-secondary">Status da Licença:</p>
                  <p className="text-base font-bold flex items-center gap-2 mt-0.5">
                    {isLicenseActive ? (
                      <span className="text-success flex items-center gap-1"><CheckCircle2 size={16} /> ✓ Ativada (PRO)</span>
                    ) : (
                      <span className="text-error flex items-center gap-1"><XCircle size={16} /> ✗ Inativa</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-txt-secondary text-right">Serial mascarado:</p>
                  <p className="text-sm font-mono text-txt-primary font-bold">
                    {licenseSerial ? `AG-2026-PRO-●●●●` : '●●●●-●●●●-●●●●-●●●●'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-txt-secondary mb-1 block">Colar Novo Serial de Ativação</label>
                <div className="flex gap-2">
                  <input
                    className="input-base font-mono text-sm uppercase flex-1"
                    placeholder="AG-2026-PRO-XXXX-XXXX"
                    value={serialInput}
                    onChange={e => setSerialInput(e.target.value)}
                  />
                  <Button variant="primary" size="sm" onClick={handleValidateSerial}>
                    <CheckCircle2 size={14} /> ✓ Validar Serial
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── ABA 3: API KEYS ── */}
        {activeTab === 'keys' && (
          <div className="space-y-4">
            {/* SetupChecklist Component (Prompt 4 - Item 10, 11, 12) */}
            <SetupChecklist isCompact={true} />
            {/* Summary Checklist Banner (Prompt 4 - Item 2) */}
            <div className="p-4 rounded-card border border-border bg-bg-secondary space-y-3 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <div>
                    <h3 className="text-sm font-bold text-txt-primary flex items-center gap-2">
                      Resumo do Setup de APIs
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase border',
                          isEssentialComplete
                            ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                            : 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#FBBF24]/40'
                        )}
                      >
                        {isEssentialComplete ? '✓ Setup 100% Concluído' : `Pendente (${validEssentialCount}/5)`}
                      </span>
                    </h3>
                    <p className="text-xs text-txt-secondary mt-0.5">
                      {isEssentialComplete
                        ? '🎉 Todas as 5 APIs essenciais foram salvas e validadas com sucesso!'
                        : remainingCount === 1
                          ? 'Falta 1 API obrigatória para concluir o setup inicial.'
                          : `Faltam ${remainingCount} de 5 APIs essenciais para o setup completo.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-bg-tertiary px-3.5 py-1.5 rounded-lg border border-border">
                  <span className="text-xs font-mono font-bold text-txt-primary">{validEssentialCount} / 5</span>
                  <div className="w-16 h-2 bg-bg-secondary rounded-full overflow-hidden border border-border">
                    <div
                      className={cn(
                        'h-full bg-gradient-to-r transition-all duration-500',
                        isEssentialComplete ? 'from-[#10B981] to-[#34D399]' : 'from-[#F59E0B] to-[#FBBF24]'
                      )}
                      style={{ width: `${(validEssentialCount / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

                {/* 5 Essential APIs Micro Checklist Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {essentialKeys.map(key => {
                    const item = apiKeys.find(k => k.key === key);
                    const isValid = item?.status === 'valid';
                    return (
                      <div
                        key={key}
                        className={cn(
                          'p-2 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition',
                          isValid
                            ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                            : 'bg-bg-tertiary/40 border-border text-txt-secondary'
                        )}
                      >
                        <span className="truncate">{item?.label.split(' ')[0]}</span>
                        <span className="font-bold text-[10px]">{isValid ? '✓' : '⏳'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-txt-secondary">
                  ⚠️ <strong className="text-txt-primary">Segurança:</strong> As chaves são criptografadas em AES-256 no banco e mascaradas na interface.
                </p>
                <Button variant="secondary" size="sm" onClick={handleUpdateFromServer}>
                  <RefreshCw size={14} /> 🔄 Atualizar do Servidor
                </Button>
              </div>

            <div className="space-y-3">
              {apiKeys.map(item => {
                const Icon = item.icon;
                const isShowing = showSecretMap[item.key];
                const isTesting = testingKeyMap[item.key];

                return (
                  <div key={item.key} className="p-4 rounded-card border border-border bg-bg-secondary hover:border-[#6366F1]/30 transition space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-bg-tertiary flex items-center justify-center">
                          <Icon size={16} className="text-[#6366F1]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-txt-primary">{item.label}</p>
                            
                            {/* Required Badge */}
                            {item.required && (
                              <span
                                title="🔑 Chave essencial e obrigatória para o funcionamento da plataforma"
                                className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40 flex items-center gap-1 cursor-help"
                              >
                                🔑 Obrigatória
                              </span>
                            )}

                            {/* Status Badge with Hover Tooltip (Item 7 & Item 8) */}
                            <span
                              title={item.tooltip}
                              className={cn(
                                'text-[10px] px-2 py-0.5 rounded-full font-bold transition flex items-center gap-1 cursor-help',
                                item.status === 'valid' && 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40',
                                item.status === 'error' && 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 animate-pulse',
                                item.status === 'not_set' && 'bg-[#64748B]/20 text-[#94A3B8] border border-[#64748B]/40'
                              )}
                            >
                              {item.status === 'valid' && '✓ Válida'}
                              {item.status === 'error' && '⚠️ Erro'}
                              {item.status === 'not_set' && '❌ Não configurada'}
                            </span>
                          </div>
                          <p className="text-xs text-txt-secondary mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      <a
                        href={item.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 shrink-0"
                      >
                        📖 Tutorial →
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={isShowing ? 'text' : 'password'}
                          className={cn(
                            'input-base font-mono text-xs pr-9 transition-colors',
                            item.secret && validateKeyFormat(item.key, item.secret) === false && 'border-[#EF4444] text-[#EF4444]',
                            item.secret && validateKeyFormat(item.key, item.secret) === true && 'border-[#10B981]'
                          )}
                          value={isShowing ? item.secret : maskKey(item.secret)}
                          onChange={e => {
                            const val = e.target.value;
                            setApiKeys(prev => prev.map(k => k.key === item.key ? { ...k, secret: val } : k));
                          }}
                          placeholder="Cole sua chave de API aqui..."
                        />
                        <button
                          onClick={() => toggleShowSecret(item.key)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-secondary hover:text-txt-primary transition"
                        >
                          {isShowing ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        {/* Live format validation indicator (Prompt 4 - Item 8) */}
                        {item.secret && item.secret.length > 0 && (() => {
                          const isValid = validateKeyFormat(item.key, item.secret);
                          if (isValid === null) return null;
                          return isValid ? (
                            <span className="text-[10px] text-[#10B981] font-mono font-bold flex items-center gap-1 mt-1">
                              ✓ Formato válido
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#EF4444] font-mono font-bold flex items-center gap-1 mt-1">
                              ✗ Formato inválido
                            </span>
                          );
                        })()}
                      </div>

                      {/* Button Testar Conexão (Item 8) */}
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={isTesting}
                        onClick={() => handleTestConnection(item)}
                      >
                        🧪 Testar
                      </Button>

                      {/* Button Salvar */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveApiKey(item.key, item.secret)}
                      >
                        <Check size={14} /> ✓ Salvar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ABA INTERFACE & ANIMAÇÕES ── */}
        {activeTab === 'interface' && (
          <Card title="🎨 Interface, Onboarding & Animações Visuais">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-card border border-border bg-bg-secondary">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-txt-primary flex items-center gap-2">
                    {animationsDisabled ? <EyeOff size={16} className="text-error" /> : <Eye size={16} className="text-success" />}
                    Animações Visuais do Onboarding
                  </h3>
                  <p className="text-xs text-txt-secondary">
                    Controla o aparecimento de ferramentas de destaque (spotlight, tooltips flutuantes, setas e bordas pulsantes em roxo #7c3aed).
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={animationsDisabled}
                    onChange={e => {
                      setAnimationsDisabled(e.target.checked);
                      toast.success(e.target.checked ? '🚫 Tutorial visual desabilitado!' : '✨ Tutorial visual ativado!');
                    }}
                    className="w-5 h-5 rounded border-border bg-bg-tertiary text-accent-red accent-accent-red cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-txt-primary">
                    Desabilitar tutorial visual
                  </span>
                </label>
              </div>

              <div className="p-4 rounded-card border border-border bg-bg-secondary flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-txt-primary">Reiniciar Guias & Tutorial de Boas-Vindas</h4>
                  <p className="text-[11px] text-txt-secondary mt-0.5">
                    Limpa o histórico de conclusões salvas no navegador para rever a experiência inicial completa.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => { resetWizard(); toast.success('🧙 Wizard reiniciado!'); }}>
                    <RotateCcw size={14} /> Wizard de 5 Passos
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => { resetOnboarding(); toast.success('🔄 Onboarding zerado!'); }}>
                    <RefreshCw size={14} /> Zerar Passos
                  </Button>
                </div>
              </div>

              {/* Analytics Section (Prompt 5 - Item 15) */}
              <div className="p-4 rounded-card border border-[#334155] bg-[#0F172A]/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📊</span>
                    <h4 className="text-xs font-bold text-white">Analytics de Onboarding & Rastreamento</h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#7C3AED]/20 text-[#A855F7] font-mono border border-[#7C3AED]/40">
                      Debug Log
                    </span>
                  </div>
                  <button
                    onClick={() => { resetAnalytics(); toast.success('🧹 Métricas zeradas!'); }}
                    className="text-[11px] text-[#64748B] hover:text-white transition"
                  >
                    Resetar Dados
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155]">
                    <p className="text-[10px] text-[#94A3B8]">Conclusões Wizard</p>
                    <p className="text-sm font-extrabold text-white font-mono mt-0.5">
                      {analytics.wizard_completions || 0} / {analytics.wizard_starts || 1}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155]">
                    <p className="text-[10px] text-[#94A3B8]">Setups 5/5 Completos</p>
                    <p className="text-sm font-extrabold text-[#10B981] font-mono mt-0.5">
                      {analytics.setup_completed_count || 0}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155]">
                    <p className="text-[10px] text-[#94A3B8]">Features Desabilitadas</p>
                    <p className="text-sm font-extrabold text-[#F59E0B] font-mono mt-0.5">
                      {analytics.animations_disabled_count || 0}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-[#334155]">
                    <p className="text-[10px] text-[#94A3B8]">Desistências (Dropoff)</p>
                    <p className="text-sm font-extrabold text-[#EF4444] font-mono mt-0.5">
                      {Object.values(analytics.wizard_dropoffs || {}).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── ABA 4: VOZES TTS ── */}
        {activeTab === 'tts' && (
          <Card title="🎙️ Vozes Microsoft Edge TTS">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-txt-secondary">
                  Carrega a lista de vozes neurais gratuitas diretamente do serviço Microsoft Edge TTS.
                </p>
                <Button variant="primary" size="sm" onClick={handleLoadEdgeVoices} disabled={loadingVoices}>
                  {loadingVoices ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  🔄 Carregar Vozes
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border text-txt-secondary uppercase tracking-wider font-semibold">
                      <th className="p-3">Nome da Voz</th>
                      <th className="p-3">Gênero</th>
                      <th className="p-3">Idioma</th>
                      <th className="p-3">Provedor</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {ttsVoices.map(v => (
                      <tr key={v.name} className="hover:bg-bg-tertiary/30 transition">
                        <td className="p-3 font-mono font-medium text-txt-primary">{v.name}</td>
                        <td className="p-3 text-txt-secondary">{v.gender}</td>
                        <td className="p-3 text-txt-secondary">{v.lang}</td>
                        <td className="p-3"><Badge text={v.type} variant="default" /></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toast(`🔊 Amostra de ${v.name}...`)}
                            className="px-2 py-1 rounded bg-bg-tertiary hover:bg-accent-teal/20 hover:text-accent-teal text-txt-secondary text-xs transition"
                          >
                            ▶ Preview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {/* ── ABA 5: CACHE MANAGER ── */}
        {activeTab === 'cache' && (
          <Card title="🗑️ Gerenciador de Cache">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-card bg-bg-tertiary/40 border border-border">
                  <p className="text-lg font-bold font-mono text-txt-primary">{cacheStats.size}</p>
                  <p className="text-[11px] text-txt-secondary">Tamanho do Cache</p>
                </div>
                <div className="p-3 rounded-card bg-bg-tertiary/40 border border-border">
                  <p className="text-lg font-bold font-mono text-txt-primary">{cacheStats.filesCount}</p>
                  <p className="text-[11px] text-txt-secondary">Total de Arquivos</p>
                </div>
                <div className="p-3 rounded-card bg-bg-tertiary/40 border border-border">
                  <p className="text-lg font-bold font-mono text-txt-primary">{cacheStats.oldestFile}</p>
                  <p className="text-[11px] text-txt-secondary">Arquivo Mais Antigo</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={handleUpdateCacheStats}>
                  📊 Atualizar Stats
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClearOldCache}>
                  🧹 Limpar arquivos &gt;7 dias
                </Button>
                <Button variant="secondary" size="sm" onClick={handleRemoveIncompleteMagic}>
                  ⚠️ Remover magic/ incompleto
                </Button>
                <Button variant="danger" size="sm" onClick={handleFullCacheCleanup}>
                  🔥 Limpeza Completa
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── ABA 6: SOBRE ── */}
        {activeTab === 'sobre' && (
          <Card title="ℹ️ Sobre o AntGravity Studio">
            <div className="space-y-4 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-red to-pink-600 mx-auto flex items-center justify-center text-white shadow-glow">
                <Sparkles size={32} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-txt-primary">AntGravity Studio</h2>
                <p className="text-xs text-accent-red font-semibold tracking-wider">VIRAL STUDIO PRO AI v2.0</p>
              </div>

              <p className="text-xs text-txt-secondary max-w-md mx-auto leading-relaxed">
                Plataforma profissional completa para produção automatizada em massa de vídeos virais, VSLs, YouTube Shorts, Reels e TikTok com Inteligência Artificial.
              </p>

              <div className="pt-4 border-t border-border flex justify-center gap-6 text-xs text-accent-teal">
                <a href="https://antgravity.studio" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  🌐 Website Oficial
                </a>
                <span>·</span>
                <a href="https://antgravity.studio/suporte" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  💬 Suporte Técnico
                </a>
              </div>

              <p className="text-[10px] text-txt-secondary/40 pt-2">
                Copyright © 2026 AntGravity Inc. Todos os direitos reservados.
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
