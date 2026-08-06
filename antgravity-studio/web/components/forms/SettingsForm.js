import { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../common/Card';
import Select from '../common/Select';
import Button from '../common/Button';
import { LANGUAGES, VIDEO_QUALITIES } from '../../lib/constants';

export default function SettingsForm() {
  const [language, setLanguage] = useState('pt-BR');
  const [quality, setQuality] = useState('1080p');
  const [autoDelete, setAutoDelete] = useState(false);

  const handleSave = () => {
    toast.success('Preferências salvas com sucesso!');
  };

  return (
    <Card title="Preferências de Vídeo">
      <div className="space-y-4">
        <Select label="Idioma Padrão" options={LANGUAGES} value={language} onChange={(e) => setLanguage(e.target.value)} />
        <Select label="Qualidade de Vídeo" options={VIDEO_QUALITIES} value={quality} onChange={(e) => setQuality(e.target.value)} />
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-txt-primary">Auto-delete vídeos antigos</p>
            <p className="text-xs text-txt-secondary">Remove vídeos com mais de 30 dias automaticamente</p>
          </div>
          <button
            onClick={() => setAutoDelete(!autoDelete)}
            className={`w-11 h-6 rounded-full relative transition ${autoDelete ? 'bg-accent-red' : 'bg-bg-tertiary border border-border'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${autoDelete ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <Button variant="primary" size="sm" onClick={handleSave}>Salvar Preferências</Button>
      </div>
    </Card>
  );
}
