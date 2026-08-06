import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function Settings() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Configurações salvas com sucesso!');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Configurações do Sistema</h1>
          <p className="text-sm text-gray-400">Gerencie suas chaves de API e preferências</p>
        </div>

        <form onSubmit={handleSave} className="bg-cardBg border border-cardBorder rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Chaves de API</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-background border border-cardBorder rounded-lg p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Google Cloud API Key</label>
            <input
              type="password"
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-background border border-cardBorder rounded-lg p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <button type="submit" className="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-lg font-medium transition">
            Salvar Chaves
          </button>
        </form>

        <div className="bg-cardBg border border-cardBorder rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Perfil do Usuário</h2>
          <p className="text-sm text-gray-400 mb-4">Conectado como: user@antgravity.studio</p>
          <button className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition">
            Encerrar Sessão
          </button>
        </div>
      </div>
    </Layout>
  );
}
