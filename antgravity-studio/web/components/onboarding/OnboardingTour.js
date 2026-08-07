import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, HelpCircle, CheckCircle2, Play } from 'lucide-react';
import Button from '../shared/Button';

const TOUR_STEPS = [
  {
    title: '⚡ 1. Pipeline Mágico (/pipeline)',
    description: 'A forma mais rápida de criar vídeos virais. Preencha 5 passos guiados e o sistema faz o download de referências, forja roteiros, gera áudio TTS, busca B-rolls e faz renderização automática!',
    target: 'pipeline-card',
    tip: '💡 Dica: Ideal para produção em massa diária sem esforço manual.',
  },
  {
    title: '📁 2. Gestão de Projetos (/projects)',
    description: 'Organize e agrupe suas configurações para canais específicos. Salve nichos, vozes padrão, modelos de capas e credenciais de upload.',
    target: 'projects-card',
    tip: '💡 Dica: Você pode forjar novos roteiros e ideias com 1 clique usando IA.',
  },
  {
    title: '📈 3. Tendências & Notícias (/trends & /news)',
    description: 'Consulte temas em alta no YouTube, Google News e redes sociais em tempo real para capturar a atenção da audiência antes da concorrência.',
    target: 'trends-card',
    tip: '💡 Dica: Transforme matérias e notícias virais diretamente em pautas de canal.',
  },
  {
    title: '🎙️ 4. Narrações & Roteiros (/narrations & /scripts)',
    description: 'Gere roteiros persuasivos com GPT-4o-mini e sintetize áudios neurais (TTS) com mais de 30 vozes de alta definição.',
    target: 'voiceovers-card',
    tip: '💡 Dica: Personalize tom, pitch, velocidade e exporte em áudio .mp3.',
  },
  {
    title: '🎬 5. Renderizar & Mídias (/render & /media)',
    description: 'Pesquise mídias em 4K no Pixabay e Pexels e monte vídeos completos mesclando áudio, trilha sonora, recortes e legendas via FFmpeg.',
    target: 'render-card',
    tip: '💡 Dica: Exporte para telas horizontais (16:9) ou verticais (9:16 Shorts/Reels).',
  },
  {
    title: '📊 6. Fila de Produção & Canais (/queue & /channels)',
    description: 'Monitore o status em tempo real de cada renderização e realize upload automático em massa diretamente para o YouTube via OAuth 2.0.',
    target: 'queue-card',
    tip: '💡 Dica: Agende uploads para os melhores horários do seu canal.',
  },
];

export default function OnboardingTour({ forceShow = false, onClose }) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [inTour, setInTour] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onboarded = localStorage.getItem('viral_studio_onboarded');
      if (forceShow || !onboarded) {
        setShowWelcomeModal(true);
      }
    }
  }, [forceShow]);

  const handleStartTour = () => {
    setShowWelcomeModal(false);
    setInTour(true);
    setCurrentStepIndex(0);
  };

  const handleSkip = () => {
    setShowWelcomeModal(false);
    setInTour(false);
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem('viral_studio_onboarded', 'true');
    }
    if (onClose) onClose();
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleCompleteTour();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCompleteTour = () => {
    setInTour(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viral_studio_onboarded', 'true');
    }
    if (onClose) onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!inTour) return;
      if (e.key === 'Escape') handleSkip();
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inTour, currentStepIndex]);

  const step = TOUR_STEPS[currentStepIndex];

  return (
    <>
      {/* ── MODAL 1: BOAS-VINDAS INICIAL ── */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleSkip} />
          
          <div className="relative w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-card shadow-card p-6 z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-card bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white shadow-glow">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Bem-vindo ao Viral Studio Pro AI</h2>
                  <p className="text-xs text-[#94A3B8]">Versão v2.0 PRO — Automação Completa de Vídeos</p>
                </div>
              </div>
              <button onClick={handleSkip} className="text-[#94A3B8] hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#F8FAFC] leading-relaxed">
              O <strong className="text-[#6366F1]">Viral Studio Pro AI</strong> é a sua central definitiva para criar, automatizar e publicar vídeos virais para YouTube, Shorts, TikTok e Reels com Inteligência Artificial Generativa.
            </p>

            <div className="space-y-2 p-3 bg-[#0F172A] rounded-card border border-[#334155] text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#10B981]" /> <span>14 Módulos Integrados em um só lugar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#10B981]" /> <span>Roteiros com GPT-4o-mini + Narrações com 30+ Vozes Neurais</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#10B981]" /> <span>Renderização via FFmpeg & Uploads Automáticos</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
              <label className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={e => setDontShowAgain(e.target.checked)}
                  className="rounded border-[#334155] accent-[#6366F1]"
                />
                Não mostrar este aviso novamente
              </label>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={handleSkip}>
                  Pular
                </Button>
                <Button variant="primary" size="sm" onClick={handleStartTour}>
                  <Play size={13} /> Iniciar Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: TOUR PASSO A PASSO (GUIADO) ── */}
      {inTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-[#1E293B] border-2 border-[#6366F1] rounded-card shadow-card p-6 z-10 space-y-4 shadow-glow">
            {/* Header com Progresso */}
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6366F1]">
                <HelpCircle size={16} /> Passo {currentStepIndex + 1} de {TOUR_STEPS.length}
              </div>
              <button onClick={handleSkip} className="text-[#94A3B8] hover:text-white p-1" title="Pular Tour">
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo do Passo */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">{step.title}</h3>
              <p className="text-xs text-[#F8FAFC] leading-relaxed">{step.description}</p>
              
              <div className="p-3 bg-[#0F172A] rounded-card border border-[#6366F1]/30 text-xs text-[#94A3B8]">
                {step.tip}
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-[#0F172A] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Ações de Navegação */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-[#94A3B8]">
                Pular Tour
              </Button>

              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <Button variant="secondary" size="sm" onClick={handlePrev}>
                    <ArrowLeft size={13} /> Anterior
                  </Button>
                )}

                <Button variant="primary" size="sm" onClick={handleNext}>
                  {currentStepIndex === TOUR_STEPS.length - 1 ? (
                    'Concluir Tour 🎉'
                  ) : (
                    <>
                      Próximo <ArrowRight size={13} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
