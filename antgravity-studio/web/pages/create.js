import React, { useState } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';

export default function Create() {
  const [tema, setTema] = useState('');
  const [nicho, setNicho] = useState('Finanças');
  const [idioma, setIdioma] = useState('pt-BR');
  const [duracao, setDuracao] = useState('60');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Vídeo enviado para processamento!');
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Criar Vídeo Automático</h1>
          <p className="text-sm text-gray-400 mb-6">Preencha os parâmetros para a inteligência artificial gerar seu conteúdo</p>

          <Form onSubmit={handleSubmit} submitText="✨ Gerar Vídeo" loading={loading}>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tema do Vídeo *</label>
              <input
                type="text"
                required
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: Como economizar dinheiro em 2026"
                className="w-full bg-cardBg border border-cardBorder rounded-lg p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Nicho</label>
              <select
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                className="w-full bg-cardBg border border-cardBorder rounded-lg p-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="Finanças">Finanças</option>
                <option value="Ciência">Ciência</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Saúde">Saúde</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Idioma</label>
              <select
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                className="w-full bg-cardBg border border-cardBorder rounded-lg p-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">Inglês (US)</option>
                <option value="es-ES">Espanhol</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Duração (segundos)</label>
              <input
                type="number"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                className="w-full bg-cardBg border border-cardBorder rounded-lg p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </Form>
        </div>

        {/* Live Preview Placeholder */}
        <div className="flex flex-col items-center justify-center bg-cardBg border border-cardBorder rounded-xl p-6 text-center">
          <div className="w-56 h-96 bg-black rounded-2xl border border-cardBorder flex flex-col items-center justify-center p-4 mb-4">
            <span className="text-4xl mb-2">📱</span>
            <span className="text-xs text-gray-500">Preview 9:16</span>
            <span className="text-sm font-semibold text-gray-300 mt-4 px-2 text-center">
              {tema || 'Seu título aparecerá aqui...'}
            </span>
          </div>
          <p className="text-xs text-gray-500">Formato otimizado para Shorts, Reels e TikTok</p>
        </div>
      </div>
    </Layout>
  );
}
