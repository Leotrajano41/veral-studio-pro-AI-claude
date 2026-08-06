import Layout from '../components/Layout';
import APIConfigForm from '../components/forms/APIConfigForm';
import SettingsForm from '../components/forms/SettingsForm';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { LogOut, User, Mail, Upload } from 'lucide-react';

export default function Settings() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Configurações</h1>
          <p className="text-sm text-txt-secondary">Gerencie chaves de API, preferências e perfil</p>
        </div>

        <APIConfigForm />
        <SettingsForm />

        <Card title="Perfil do Usuário">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-accent-red/10 border-2 border-accent-red/30 flex items-center justify-center">
                <User size={28} className="text-accent-red" />
              </div>
              <button className="text-xs text-accent-teal hover:underline flex items-center gap-1"><Upload size={12} /> Alterar avatar</button>
            </div>
            <Input label="Nome" placeholder="Seu nome completo" defaultValue="Leonardo Trajano" />
            <Input label="Email" type="email" placeholder="email@exemplo.com" defaultValue="leonardo@antgravity.studio" />
          </div>
          <div className="mt-6">
            <Button variant="primary" size="sm">Salvar Perfil</Button>
          </div>
        </Card>

        <Card>
          <Button variant="danger" className="w-full">
            <LogOut size={16} /> Encerrar Sessão
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
