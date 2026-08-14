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

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────
const MOCK_API_KEYS = [
  { key: 'openai', label: 'OpenAI (GPT-4o-mini)', desc: 'Geração de roteiros e prompts', icon: Brain, status: 'valid', secret: 'sk-pro-98f7d6a5c4b3a2ilEA', docs: 'https://platform.openai.com/api-keys' },
  { key: 'gemini', label: 'Google Gemini', desc: 'LLM alternativa para textos e análise', icon: Sparkles, status: 'valid', secret: 'AIzaSyA8b7c6d5e4f3g2h1ilEA', docs: 'https://aistudio.google.com' },
  { key: 'openrouter', label: 'OpenRouter', desc: 'Geração de thumbnails e imagens', icon: Sparkles, status: 'valid', secret: 'sk-or-v1-9988776655443322ilEA', docs: 'https://openrouter.ai/keys' },
  { key: 'assembly', label: 'Assembly AI', desc: 'Transcrição e legendagem sincronizada', icon: Mic2, status: 'valid', secret: 'a8f7e6d5c4b3a2f1e09876ilEA', docs: 'https://www.assemblyai.com' },
  { key: 'pixabay', label: 'Pixabay', desc: 'Imagens e vídeos stock gratuitos', icon: ImageIcon, status: 'valid', secret: '458921-a7f8e9d0c1b2a3f4e5ilEA', docs: 'https://pixabay.com/api/docs/' },
  { key: 'pexels', label: 'Pexels', desc: 'Mídias em alta definição', icon: ImageIcon, status: 'valid', secret: '56728190a1b2c3d4e5f6g7h8ilEA', docs: 'https://www.pexels.com/api/' },
  { key: 'kie', label: 'Kie.ai', desc: 'Avatares fotorrealistas e vídeos', icon: Film, status: 'not_set', secret: '', docs: 'https://kie.ai' },
  { key: 'meta', label: 'Meta AI', desc: 'Modelos LLaMA (login via cookie)', icon: Brain, status: 'not_set', secret: '', docs: 'https://ai.meta.com' },
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('keys'); // 'backup' | 'licenca' | 'keys' | 'tts' | 'cache' | 'sobre'
  const { animationsDisabled, setAnimationsDisabled, resetOnboarding } = useOnboarding();

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
    setApiKeys(prev => prev.map(k => k.key === serviceKey ? { ...k, secret: newSecret, status: newSecret ? 'valid' : 'not_set' } : k));
    toast.success(`Chave ${serviceKey.toUpperCase()} salva!`);
  };
  const handleUpdateFromServer = async () => {
    toast.success('🔄 Chaves de API sincronizadas com o servidor!');
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
                return (
                  <div key={item.key} className="p-4 rounded-card border border-border bg-bg-secondary hover:border-accent-red/20 transition space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-bg-tertiary flex items-center justify-center">
                          <Icon size={16} className="text-accent-red" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-txt-primary">{item.label}</p>
                            <Badge
                              text={item.status === 'valid' ? '✓ OK' : '✗ Não configurada'}
                              variant={item.status === 'valid' ? 'success' : 'error'}
                            />
                          </div>
                          <p className="text-xs text-txt-secondary">{item.desc}</p>
                        </div>
                      </div>

                      <a
                        href={item.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent-teal hover:underline flex items-center gap-1 shrink-0"
                      >
                        📖 Tutorial →
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={isShowing ? 'text' : 'password'}
                          className="input-base font-mono text-xs pr-9"
                          value={isShowing ? item.secret : maskKey(item.secret)}
                          onChange={e => {
                            const val = e.target.value;
                            setApiKeys(prev => prev.map(k => k.key === item.key ? { ...k, secret: val } : k));
                          }}
                          placeholder="Cole sua chave aqui..."
                        />
                        <button
                          onClick={() => toggleShowSecret(item.key)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-secondary hover:text-txt-primary transition"
                        >
                          {isShowing ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
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
