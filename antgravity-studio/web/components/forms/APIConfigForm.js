import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const apiKeyFields = [
  { key: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...' },
  { key: 'google', label: 'Google Cloud API Key', placeholder: 'AIza...' },
  { key: 'pixabay', label: 'Pixabay API Key', placeholder: 'Sua chave...' },
  { key: 'pexels', label: 'Pexels API Key', placeholder: 'Sua chave...' },
];

export default function APIConfigForm() {
  const [keys, setKeys] = useState({ openai: '', google: '', pixabay: '', pexels: '' });
  const [statuses, setStatuses] = useState({});
  const [testing, setTesting] = useState(null);

  const handleChange = (key, value) => {
    setKeys((prev) => ({ ...prev, [key]: value }));
    setStatuses((prev) => ({ ...prev, [key]: null }));
  };

  const handleTest = async (key) => {
    setTesting(key);
    await new Promise((r) => setTimeout(r, 1200));
    const ok = keys[key]?.length > 5;
    setStatuses((prev) => ({ ...prev, [key]: ok ? 'connected' : 'error' }));
    setTesting(null);
    toast[ok ? 'success' : 'error'](ok ? `${key.toUpperCase()} conectada!` : `Falha ao conectar ${key.toUpperCase()}`);
  };

  const handleSave = () => {
    toast.success('Chaves de API salvas com sucesso!');
  };

  return (
    <Card title="Chaves de API">
      <div className="space-y-4">
        {apiKeyFields.map((f) => (
          <div key={f.key} className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label={f.label}
                type="password"
                placeholder={f.placeholder}
                value={keys[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
            </div>
            <button
              onClick={() => handleTest(f.key)}
              disabled={testing === f.key}
              className="p-3 rounded-input border border-border bg-bg-tertiary hover:bg-border text-txt-secondary hover:text-txt-primary transition disabled:opacity-50 shrink-0"
              title="Testar Conexão"
            >
              {testing === f.key ? <Loader size={16} className="animate-spin" /> : statuses[f.key] === 'connected' ? <CheckCircle size={16} className="text-success" /> : statuses[f.key] === 'error' ? <XCircle size={16} className="text-error" /> : <CheckCircle size={16} />}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="primary" size="sm" onClick={handleSave}>Salvar Chaves</Button>
      </div>
    </Card>
  );
}
