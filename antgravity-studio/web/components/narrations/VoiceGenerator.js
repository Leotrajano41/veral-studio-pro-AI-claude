import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Textarea from '../shared/Textarea';
import Dropdown from '../shared/Dropdown';
import { Mic, Play, Square, Sliders, Volume2, Flame, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const VOICES_30_PLUS = [
  'Antonio ♂ (pt-BR)',
  'Francisca ♀ (pt-BR)',
  'Thalita ♀ (pt-BR)',
  'Humberto ♂ (pt-BR)',
  'Brenda ♀ (pt-BR)',
  'Andrew ♂ (Multilingual)',
  'Emma ♀ (Multilingual)',
  'Brian ♂ (en-US)',
  'Jenny ♀ (en-US)',
  'Guy ♂ (en-US)',
  'Aria ♀ (en-US)',
  'Christopher ♂ (en-US)',
  'Eric ♂ (en-US)',
  'Steffan ♂ (en-US)',
  'Elvira ♀ (es-ES)',
  'Alvaro ♂ (es-ES)',
  'Dalia ♀ (es-MX)',
  'Jorge ♂ (es-MX)',
  'Denise ♀ (fr-FR)',
  'Henri ♂ (fr-FR)',
  'Katja ♀ (de-DE)',
  'Conrad ♂ (de-DE)',
  'Elsa ♀ (it-IT)',
  'Diego ♂ (it-IT)',
  'Nanami ♀ (ja-JP)',
  'Keita ♂ (ja-JP)',
  'Xiaoxiao ♀ (zh-CN)',
  'Yunxi ♂ (zh-CN)',
  'Svetlana ♀ (ru-RU)',
  'Dmitry ♂ (ru-RU)',
];

export default function VoiceGenerator({
  onGenerate,
  onPlayPreview,
  onStopPreview,
  previewingVoice,
  loading,
  progress,
}) {
  const [scriptsRaw, setScriptsRaw] = useState(
    'Você sabia que 98% das pessoas cometem um erro fatal ao investir em 2026?\n---\nSe você não está usando estas 5 ferramentas de IA em 2026, está trabalhando 3 vezes mais!'
  );
  const [selectedVoice, setSelectedVoice] = useState(VOICES_30_PLUS[0]);
  const [speed, setSpeed] = useState(0); // -50 a +50
  const [pitch, setPitch] = useState(0); // -20 a +20
  const [volume, setVolume] = useState(80); // 0 a 100

  const handleGenerate = () => {
    onGenerate({
      scriptsRaw,
      voice: selectedVoice,
      speed,
      pitch,
      volume,
    });
  };

  const detectedCount = scriptsRaw.split(/(?:\r?\n|---)+/).filter(l => l.trim()).length;

  return (
    <Card title="🎙️ Gerador de Narrações (TTS)" subtitle="Converta roteiros em faixas de áudio narradas por vozes neurais realistas">
      <div className="space-y-6">
        
        {/* Input de Roteiros */}
        <div className="space-y-1.5">
          <Textarea
            label="Seus Roteiros *"
            rows={5}
            placeholder="Cole um roteiro por texto ou separe com ---..."
            value={scriptsRaw}
            onChange={e => setScriptsRaw(e.target.value)}
            helpText="💡 Cada roteiro ou bloco separado por --- virará um arquivo de áudio individual"
          />
          <p className="text-[11px] text-[#A78BFA] font-semibold text-right">
            {detectedCount} roteiro(s) detectado(s)
          </p>
        </div>

        {/* Configurações de Voz + Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2 border-t border-[#444444]/40">
          <div className="sm:col-span-2">
            <Dropdown
              label="Voz TTS (30+ opções neurais)"
              options={VOICES_30_PLUS}
              value={selectedVoice}
              onChange={e => setSelectedVoice(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onPlayPreview(selectedVoice)}
              disabled={!!previewingVoice}
            >
              <Play size={12} className="text-[#10B981]" /> 🔊 Play
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
              onClick={onStopPreview}
              disabled={!previewingVoice}
            >
              <Square size={12} className="text-[#EF4444]" /> ⏹️ Stop
            </Button>
          </div>
        </div>

        {/* Configurações Avançadas (Sliders) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-card bg-[#333333]/40 border border-[#444444]">
          {/* Slider 1: Velocidade TTS */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Velocidade TTS (%)</span>
              <span className="font-mono font-bold text-white">{speed > 0 ? `+${speed}` : speed}%</span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              step={5}
              value={speed}
              onChange={e => setSpeed(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#B0B0B0]/50 font-mono">
              <span>-50%</span><span>0% (Normal)</span><span>+50%</span>
            </div>
          </div>

          {/* Slider 2: Pitch da voz */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Pitch da voz</span>
              <span className="font-mono font-bold text-white">{pitch > 0 ? `+${pitch}` : pitch}</span>
            </div>
            <input
              type="range"
              min={-20}
              max={20}
              step={1}
              value={pitch}
              onChange={e => setPitch(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#B0B0B0]/50 font-mono">
              <span>-20 (Grave)</span><span>0</span><span>+20 (Agudo)</span>
            </div>
          </div>

          {/* Slider 3: Volume da voz */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Volume da voz (%)</span>
              <span className="font-mono font-bold text-white">{volume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={volume}
              onChange={e => setVolume(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#B0B0B0]/50 font-mono">
              <span>0%</span><span>80% (Padrão)</span><span>100%</span>
            </div>
          </div>
        </div>

        {/* Loading Progress Bar */}
        {loading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-[#FF6B6B]">
              <span>Gerando áudios via Google Cloud TTS...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-[#333333] rounded-full overflow-hidden w-full">
              <div
                className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#A78BFA] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Botão Grande Gradiente */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 rounded-card font-bold text-base text-white transition-all duration-180 disabled:opacity-50 shadow-glow hover:shadow-purpleGlow flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #A78BFA 100%)' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin" /> Gerando Narrações...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mic size={18} /> 🎙️ GERAR NARRAÇÕES ({detectedCount})
            </span>
          )}
        </button>
      </div>
    </Card>
  );
}
