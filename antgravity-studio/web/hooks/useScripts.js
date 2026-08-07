import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const MOCK_INITIAL_SCRIPTS = [
  {
    id: 'sc1',
    title: 'O Erro Fatal ao Investir em 2026',
    preview: 'Você sabia que 98% das pessoas cometem um erro fatal ao investir em 2026? Esse erro está custando milhares de reais todo mês...',
    content: `[GANCHO - 0 a 5 segundos]
Você sabia que 98% das pessoas cometem um erro fatal ao investir em 2026? E esse erro está custando MILHARES de reais todo mês na sua conta bancária. Nos próximos 60 segundos, vou te mostrar o método exato dos grandes investidores.

[DESENVOLVIMENTO]
Primeiro: a inflação silenciosa. Deixar dinheiro parado na poupança em 2026 é garantia de perda de poder de compra.
Segundo: falta de diversificação em ativos de tecnologia e inteligência artificial.
Terceiro: pagar taxas abusivas de administração sem perceber.

[SOLUÇÃO]
A chave é alocar em uma carteira balanceada de renda fixa prefixada e fundos globais.

[CHAMADA PARA AÇÃO - CTA]
Gostou dessa revelação? Inscreva-se no canal agora e ative o sininho para não perder nenhuma oportunidade!`,
    wordsCount: 1240,
    language: '🇧🇷 Português (Brasil)',
    generatedAt: '07 de ago. de 2026 10:30',
  },
  {
    id: 'sc2',
    title: '5 Ferramentas de IA que Vão Mudar Sua Vida em 2026',
    preview: 'Se você não está usando estas 5 ferramentas de inteligência artificial em 2026, você está trabalhando 3 vezes mais do que deveria...',
    content: `[GANCHO]
Se você não está usando estas 5 ferramentas de inteligência artificial em 2026, você está trabalhando 3 vezes mais do que deveria!

[CONTEÚDO]
1. Gerador de Vídeos Automático: Cria roteiros, vozes e edição em 2 minutos.
2. Assistente de Código IA: Digita programas completos sem erros.
3. Transcritor de Reuniões: Resume horas de conversas em tópicos práticos.

[CTA]
Curtiu? Comente "IA" para receber o link direto de cada ferramenta no seu direct!`,
    wordsCount: 980,
    language: '🇧🇷 Português (Brasil)',
    generatedAt: '07 de ago. de 2026 09:15',
  },
];

export function useScripts() {
  const [scripts, setScripts] = useState(MOCK_INITIAL_SCRIPTS);
  const [loading, setLoading] = useState(false);

  // Gerar Roteiros via OpenAI API Mock
  const generateScripts = useCallback(async ({ urls, directContent, numScripts, wordsPerScript, language, customPrompt }) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));

    const generated = [];
    for (let i = 0; i < numScripts; i++) {
      const topicTitle = directContent
        ? directContent.slice(0, 35) + '...'
        : urls
        ? `Extraído de URL (${i + 1})`
        : `Roteiro Viral de IA (${i + 1})`;

      generated.push({
        id: String(Date.now() + i),
        title: `Roteiro: ${topicTitle}`,
        preview: `[GANCHO] Descubra o segredo supremo sobre ${topicTitle} em 2026. Preste atenção nos próximos segundos...`,
        content: `[GANCHO - 0 a 5s]\nQuer saber como dominar ${topicTitle} em 2026? Preste atenção nos próximos segundos!\n\n[DESENVOLVIMENTO]\n${directContent || 'Conteúdo extraído com sucesso das referências enviadas.'}\n\nInstruções extras aplicadas: ${customPrompt || 'Nenhuma'}.\n\n[CTA]\nSiga o canal para mais novidades diárias!`,
        wordsCount: wordsPerScript || 1200,
        language: language || '🇧🇷 Português (Brasil)',
        generatedAt: new Date().toLocaleString('pt-BR'),
      });
    }

    setScripts(prev => [...generated, ...prev]);
    setLoading(false);
    toast.success(`🔥 ${numScripts} roteiro(s) gerado(s) com sucesso!`);
  }, []);

  const updateScript = useCallback((id, updatedContent) => {
    setScripts(prev => prev.map(s => {
      if (s.id === id) {
        const wordsCount = updatedContent.trim().split(/\s+/).length;
        return { ...s, content: updatedContent, wordsCount };
      }
      return s;
    }));
    toast.success('Roteiro atualizado com sucesso!');
  }, []);

  const deleteScript = useCallback((id) => {
    setScripts(prev => prev.filter(s => s.id !== id));
    toast('Roteiro deletado.');
  }, []);

  return {
    scripts,
    loading,
    generateScripts,
    updateScript,
    deleteScript,
  };
}

export default useScripts;
