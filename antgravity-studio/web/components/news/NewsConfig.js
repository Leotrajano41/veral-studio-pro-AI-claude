import { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import Dropdown from '../shared/Dropdown';
import { Clapperboard, CheckSquare, Square, Film, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const FORMATS = ['Horizontal (16:9)', 'Vertical (9:16)'];
const BANNER_COLORS = [
  '🟣 Roxo',
  '🔴 Vermelho',
  '🔵 Azul',
  '⚫ Preto',
  '🟢 Verde',
  '🟠 Laranja',
];

export default function NewsConfig({ onProduceSelected }) {
  const [videosPerRound, setVideosPerRound] = useState(3);
  const [videosPerNews, setVideosPerNews] = useState(1);
  const [wordsPerScript, setWordsPerScript] = useState(700);
  const [format, setFormat] = useState('Horizontal (16:9)');
  const [bannerColor, setBannerColor] = useState('🟣 Roxo');
  const [useArticleMedia, setUseArticleMedia] = useState(true);
  const [downloadEmbeddedYoutube, setDownloadEmbeddedYoutube] = useState(true);
  const [selectAll, setSelectAll] = useState(true);

  const handleProduce = () => {
    onProduceSelected({
      videosPerRound,
      videosPerNews,
      wordsPerScript,
      format,
      bannerColor,
      useArticleMedia,
      downloadEmbeddedYoutube,
    });
  };

  return (
    <Card title="⚙️ Configurações para Geração de Vídeos" subtitle="Defina as regras automáticas de produção em massa para a pauta deste canal">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            label="Quantos vídeos nesta rodada"
            type="number"
            min={1}
            max={20}
            value={videosPerRound}
            onChange={e => setVideosPerRound(+e.target.value)}
            helpText="Cada um de um veículo diferente"
          />

          <FormField
            label="Vídeos por notícia"
            type="number"
            min={1}
            max={10}
            value={videosPerNews}
            onChange={e => setVideosPerNews(+e.target.value)}
          />

          <FormField
            label="Palavras/roteiro"
            type="number"
            min={100}
            max={3000}
            step={50}
            value={wordsPerScript}
            onChange={e => setWordsPerScript(+e.target.value)}
          />

          <Dropdown
            label="Formato"
            options={FORMATS}
            value={format}
            onChange={e => setFormat(e.target.value)}
          />

          <Dropdown
            label="Cor da tarja da capa"
            options={BANNER_COLORS}
            value={bannerColor}
            onChange={e => setBannerColor(e.target.value)}
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-2 border-t border-[#444444]/40">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#FF6B6B] rounded cursor-pointer"
              checked={useArticleMedia}
              onChange={e => setUseArticleMedia(e.target.checked)}
            />
            <span className="text-xs text-[#B0B0B0] group-hover:text-white transition">
              Usar fotos e vídeos da própria matéria (web scraping)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#FF6B6B] rounded cursor-pointer"
              checked={downloadEmbeddedYoutube}
              onChange={e => setDownloadEmbeddedYoutube(e.target.checked)}
            />
            <span className="text-xs text-[#B0B0B0] group-hover:text-white transition">
              Baixar também vídeos do YouTube embutidos na página
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-[#444444]">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setSelectAll(true); toast.success('✅ Todas as notícias selecionadas!'); }}
            >
              ✅ Selecionar todas
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setSelectAll(false); toast('❌ Seleção limpa.'); }}
            >
              ❌ Limpar seleção
            </Button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleProduce}
            className="w-full sm:w-auto font-bold py-3 text-base"
          >
            <Clapperboard size={18} /> 🎬 PRODUZIR SELECIONADAS
          </Button>
        </div>
      </div>
    </Card>
  );
}
