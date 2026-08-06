import React from 'react';
import Layout from '../components/Layout';

const mockVideos = [
  { id: '1', title: '5 Segredos para Investir Melhor', status: 'done', duration: '60s', date: new Date().toISOString() },
  { id: '2', title: 'Curiosidades Sobre Marte', status: 'processing', duration: '45s', date: new Date().toISOString() },
  { id: '3', title: 'Receita de Bolo de Caneca', status: 'pending', duration: '30s', date: new Date().toISOString() },
];

export default function Videos() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Vídeos Gerados</h1>
        <p className="text-sm text-gray-400">Histórico e downloads dos vídeos renderizados</p>
      </div>

      <div className="bg-cardBg border border-cardBorder rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-background text-gray-400 border-b border-cardBorder">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Status</th>
              <th className="p-4">Duração</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder/50 text-gray-200">
            {mockVideos.map((video) => (
              <tr key={video.id} className="hover:bg-background/50 transition">
                <td className="p-4 font-medium text-white">{video.title}</td>
                <td className="p-4">
                  {video.status === 'done' && <span className="text-green-400 font-semibold">🟢 Concluído</span>}
                  {video.status === 'processing' && <span className="text-yellow-400 font-semibold">⏳ Processando</span>}
                  {video.status === 'pending' && <span className="text-gray-400 font-semibold">🕒 Na Fila</span>}
                </td>
                <td className="p-4">{video.duration}</td>
                <td className="p-4">{new Date(video.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 text-right">
                  {video.status === 'done' ? (
                    <button className="bg-primary hover:bg-primaryHover text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                      ⬇️ Baixar
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">Aguarde</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
