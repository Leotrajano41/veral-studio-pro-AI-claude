import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Automação Inteligente de Vídeos com <span className="text-primary">AntGravity Studio</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Crie roteiros virais, sintetize voz neural e renderize vídeos verticais em segundos com o poder da inteligência artificial.
        </p>

        <div className="flex justify-center gap-4 mb-16">
          <Link href="/create" className="bg-primary hover:bg-primaryHover text-white px-8 py-3.5 rounded-xl font-bold text-lg transition">
            Começar Agora ✨
          </Link>
          <Link href="/projects" className="bg-cardBg border border-cardBorder text-gray-200 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-cardBorder transition">
            Ver Meus Projetos
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-cardBg p-6 rounded-xl border border-cardBorder">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-bold text-white mb-2">Roteiros com IA</h3>
            <p className="text-sm text-gray-400">Geração automatizada de scripts focados em retenção e engajamento.</p>
          </div>
          <div className="bg-cardBg p-6 rounded-xl border border-cardBorder">
            <div className="text-3xl mb-3">🎙️</div>
            <h3 className="text-lg font-bold text-white mb-2">Voz Ultra-Realista</h3>
            <p className="text-sm text-gray-400">Síntese de voz com inteligência artificial para narrações naturais.</p>
          </div>
          <div className="bg-cardBg p-6 rounded-xl border border-cardBorder">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="text-lg font-bold text-white mb-2">Renderização Rápida</h3>
            <p className="text-sm text-gray-400">Edição de mídia, legendas e concatenação totalmente no backend.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
