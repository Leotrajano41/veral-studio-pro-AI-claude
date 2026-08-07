import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Dropdown from '../shared/Dropdown';
import PathInput from './PathInput';
import { Clapperboard, Sliders, Music, Film, FolderOutput, Loader } from 'lucide-react';

const ORIENTATIONS = ['🖥️ Horizontal (16:9)', '📱 Vertical (9:16)'];
const CHUNK_SIZES = ['2s', '2.5s', '3s', '4s', '5s'];

export default function RenderConfig({ onStartRender, rendering }) {
  // SEÇÃO 1: Configuração de Entrada
  const [audioPath, setAudioPath] = useState('/downloads/audios');
  const [musicPath, setMusicPath] = useState('/downloads/musics');
  const [musicVolume, setMusicVolume] = useState(40); // 0-100 default 40
  const [mediaPath, setMediaPath] = useState('/downloads/medias');

  // SEÇÃO 2: Configurações de Vídeo
  const [orientation, setOrientation] = useState('🖥️ Horizontal (16:9)');
  const [chunkSize, setChunkSize] = useState('2.5s');
  const [queriesPerVideo, setQueriesPerVideo] = useState(10);
  const [videosPerQuery, setVideosPerQuery] = useState(10);

  // SEÇÃO 3: Configurações Avançadas
  const [ttsSpeed, setTtsSpeed] = useState(0); // -50 a +50
  const [pitch, setPitch] = useState(0); // -20 a +20
  const [pitchSmoothness, setPitchSmoothness] = useState(40); // 0-100 default 40
  const [voiceVolume, setVoiceVolume] = useState(100); // 0-100 default 100

  // SEÇÃO 4: Saída
  const [outputPath, setOutputPath] = useState('./output');

  const handleRenderSubmit = () => {
    onStartRender({
      audioPath,
      musicPath,
      musicVolume,
      mediaPath,
      orientation,
      chunkSize,
      queriesPerVideo,
      videosPerQuery,
      ttsSpeed,
      pitch,
      pitchSmoothness,
      voiceVolume,
      outputPath,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── SEÇÃO 1: CONFIGURAÇÃO DE ENTRADA ── */}
      <Card title="1. 📥 Configuração de Entrada" subtitle="Defina onde estão localizados os arquivos de áudio, música de fundo e B-roll">
        <div className="space-y-4">
          <PathInput
            label="Pasta de Áudios *"
            required
            value={audioPath}
            onChange={setAudioPath}
            placeholder="/caminho/para/audios"
            helpText="Sua narração em .mp3 ou .wav"
          />

          <PathInput
            label="Pasta de Músicas de Fundo"
            value={musicPath}
            onChange={setMusicPath}
            placeholder="/caminho/para/musicas"
            helpText="Músicas .mp3 ou .wav"
          />

          {/* Volume da Música */}
          <div className="space-y-1 p-3 rounded-card bg-[#333333]/40 border border-[#444444]">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Volume Música (%)</span>
              <span className="font-mono font-bold text-white">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={musicVolume}
              onChange={e => setMusicVolume(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
            <p className="text-[10px] text-[#B0B0B0]/60">💡 Para não cobrir a voz principal (padrão: 40%)</p>
          </div>

          <PathInput
            label="Pasta de Mídias (Vídeos/Imagens) *"
            required
            value={mediaPath}
            onChange={setMediaPath}
            placeholder="/caminho/para/medias"
            helpText="Vídeos e imagens para o B-roll"
          />
        </div>
      </Card>

      {/* ── SEÇÃO 2: CONFIGURAÇÕES DE VÍDEO ── */}
      <Card title="2. 🎬 Configurações de Vídeo" subtitle="Formato, picotador de clipes e densidade de busca de mídias">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Dropdown
            label="Orientação"
            options={ORIENTATIONS}
            value={orientation}
            onChange={e => setOrientation(e.target.value)}
          />

          <Dropdown
            label="Chunk Size (Picotador)"
            options={CHUNK_SIZES}
            value={chunkSize}
            onChange={e => setChunkSize(e.target.value)}
          />

          <FormField
            label="Queries por Vídeo"
            type="number"
            min={1}
            max={50}
            value={queriesPerVideo}
            onChange={e => setQueriesPerVideo(+e.target.value)}
            helpText="Quantas buscas para encontrar mídia"
          />

          <FormField
            label="Vídeos por Query"
            type="number"
            min={1}
            max={50}
            value={videosPerQuery}
            onChange={e => setVideosPerQuery(+e.target.value)}
          />
        </div>
      </Card>

      {/* ── SEÇÃO 3: CONFIGURAÇÕES AVANÇADAS ── */}
      <Card title="3. ⚙️ Configurações Avançadas" subtitle="Ajuste fino de áudio, pitch e volume da voz">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Velocidade TTS */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Velocidade TTS (%)</span>
              <span className="font-mono font-bold text-white">{ttsSpeed > 0 ? `+${ttsSpeed}` : ttsSpeed}%</span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={ttsSpeed}
              onChange={e => setTtsSpeed(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
          </div>

          {/* Pitch */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Pitch</span>
              <span className="font-mono font-bold text-white">{pitch > 0 ? `+${pitch}` : pitch}</span>
            </div>
            <input
              type="range"
              min={-20}
              max={20}
              value={pitch}
              onChange={e => setPitch(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
          </div>

          {/* Suavidade do Pitch */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Suavidade do Pitch</span>
              <span className="font-mono font-bold text-white">{pitchSmoothness}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={pitchSmoothness}
              onChange={e => setPitchSmoothness(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
          </div>

          {/* Volume da Voz */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#B0B0B0]">
              <span>Volume da Voz (%)</span>
              <span className="font-mono font-bold text-white">{voiceVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={voiceVolume}
              onChange={e => setVoiceVolume(+e.target.value)}
              className="w-full accent-[#FF6B6B] cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* ── SEÇÃO 4: SAÍDA ── */}
      <Card title="4. 📁 Pasta de Saída" subtitle="Local no disco rígido onde o arquivo final .mp4 será salvo">
        <PathInput
          label="Pasta de Destino (onde salvar)"
          value={outputPath}
          onChange={setOutputPath}
          placeholder="Padrão: pasta output do app"
          helpText="Se vazio, salva em ./output dentro do projeto"
        />
      </Card>

      {/* ── SEÇÃO 5: BOTÃO GRANDE DE RENDERIZAR ── */}
      <button
        onClick={handleRenderSubmit}
        disabled={rendering}
        className="w-full py-4 rounded-card font-bold text-lg text-white transition-all duration-180 disabled:opacity-50 shadow-glow hover:shadow-purpleGlow flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #A78BFA 100%)' }}
      >
        {rendering ? (
          <span className="flex items-center gap-2">
            <Loader size={20} className="animate-spin" /> Renderizando com FFmpeg...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Clapperboard size={22} /> 🎬 RENDERIZAR VÍDEO FINAL
          </span>
        )}
      </button>
    </div>
  );
}
