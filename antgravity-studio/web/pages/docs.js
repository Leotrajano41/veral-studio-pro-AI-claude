import { useState } from 'react';
import Layout from '../components/Layout';
import Badge from '../components/shared/Badge';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import OnboardingTour from '../components/onboarding/OnboardingTour';
import {
  BookOpen, Zap, FolderKanban, ListOrdered, TrendingUp, Newspaper,
  ScrollText, Mic2, Image as ImageIcon, Clapperboard, LayoutTemplate,
  FolderOpen, Film, Tv, Settings, HelpCircle, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

const MODULE_DOCS = [
  {
    id: 'pipeline',
    title: '⚡ Pipeline Mágico (/pipeline)',
    icon: Zap,
    description: 'Fluxo 100% automatizado em 5 passos para gerar vídeos completos sem esforço.',
    steps: [
      'Selecione a fonte de conteúdo (YouTube, Canal ou Transcrição .txt).',
      'Informe o tema e o tom desejado (Ex: Notícias rápidas, Mistério, Finanças).',
      'O sistema forja o roteiro com GPT-4o-mini e sintetiza a narração via TTS neural.',
      'Busca mídias stock correspondentes no Pixabay/Pexels.',
      'Renderiza e envia diretamente para a Fila de Produção.',
    ],
  },
  {
    id: 'projects',
    title: '📁 Gestão de Projetos (/projects)',
    icon: FolderKanban,
    description: 'Agrupe configurações e dados de produção por canal ou cliente.',
    steps: [
      'Clique em "Criar Novo Projeto".',
      'Preencha o Nome e o Nicho do canal (obrigatórios).',
      'Configure vozes padrão, modelos de capa e credenciais do YouTube.',
      'Use os botões "🔥 Forjar com IA" em cada seção para gerar descrições e SEO.',
    ],
  },
  {
    id: 'queue',
    title: '📊 Fila de Produção (/queue)',
    icon: ListOrdered,
    description: 'Acompanhe todas as renderizações ativas com atualização automática a cada 5 segundos.',
    steps: [
      'Filtre os jobs por status: Em Execução, Na Fila, Concluídos, Erros.',
      'Pause ou retome a fila inteira usando os botões superiores.',
      'Baixe os vídeos prontos ou abra a pasta de saída local.',
    ],
  },
  {
    id: 'trends',
    title: '📈 Tendências (/trends)',
    icon: TrendingUp,
    description: 'Busque o que está viralizando no YouTube, Google News e redes sociais.',
    steps: [
      'Digite um tema de interesse (min 3 caracteres).',
      'Selecione a fonte (YouTube, Notícias, Google) e o idioma.',
      'Clique em "Criar Projeto" no card da tendência para importar os dados instantaneamente.',
    ],
  },
  {
    id: 'news',
    title: '📰 Notícias (/news)',
    icon: Newspaper,
    description: 'Gere jornais e shorts jornalísticos automáticos a partir de pautas de notícias.',
    steps: [
      'Busque notícias de hoje por palavras-chave.',
      'Adicione manchetes à pauta do seu canal de notícias.',
      'Clique em "Produzir Pauta" na aba 4 para enfileirar a renderização.',
    ],
  },
  {
    id: 'scripts',
    title: '📝 Roteiros (/scripts)',
    icon: ScrollText,
    description: 'Forje roteiros persuasivos com contagem de palavras e idioma personalizável.',
    steps: [
      'Cole uma URL de referência ou insira a ideia básica do vídeo.',
      'Defina o número de palavras (Ex: 1200 palavras = ~6 min) e idioma.',
      'Clique em "🔥 FORJAR ROTEIRO COM IA".',
    ],
  },
  {
    id: 'voiceovers',
    title: '🎤 Narrações TTS (/voiceovers)',
    icon: Mic2,
    description: 'Sintetize vozes humanas de alta fidelidade com ajuste de tom e velocidade.',
    steps: [
      'Cole os parágrafos do roteiro.',
      'Selecione uma das 30+ vozes neurais (Antonio, Francisca, Andrew, etc.).',
      'Ouça o preview de áudio e clique em "🎙️ GERAR NARRAÇÕES".',
    ],
  },
  {
    id: 'medias',
    title: '🎬 Mídias Stock (/medias)',
    icon: ImageIcon,
    description: 'Pesquise e baixe vídeos/imagens 4K e HD das APIs Pixabay e Pexels.',
    steps: [
      'Busque por palavras-chave (Ex: praia paradisíaca, tecnologia 4k).',
      'Filtre por orientações (16:9 Horizontal ou 9:16 Vertical).',
      'Selecione múltiplos arquivos e clique em "Baixar Selecionadas".',
    ],
  },
  {
    id: 'render',
    title: '📺 Renderizar (/render)',
    icon: Clapperboard,
    description: 'Montagem manual via FFmpeg unindo áudio + B-roll + música de fundo + legendas.',
    steps: [
      'Informe o caminho das pastas locais de Áudios e Mídias.',
      'Ajuste o volume da trilha de fundo e opção de legendas.',
      'Clique em "🎬 RENDERIZAR VÍDEO".',
    ],
  },
  {
    id: 'thumbnail',
    title: '🖼️ Thumbnails IA (/thumbnail)',
    icon: LayoutTemplate,
    description: 'Gere capas automáticas de alto impacto para YouTube com inteligência generativa.',
    steps: [
      'Digite o título/tema do vídeo.',
      'Selecione o modelo de IA (Nano Banana 2, Grok Imagine, etc.).',
      'Escolha gerar 1, 2 ou 3 variações para Teste A/B.',
    ],
  },
  {
    id: 'vsl',
    title: '💎 VSL Cinematográfica (/vsl)',
    icon: Film,
    description: 'Gere scripts de vendas altamente persuasivos baseados no framework de 42 passos.',
    steps: [
      'Preencha o Nome do Produto e a Promessa Principal.',
      'O motor de IA compõe a VSL dividida em ganchos, histórias e ofertas.',
    ],
  },
  {
    id: 'channels',
    title: '📱 Canais & Upload (/channels)',
    icon: Tv,
    description: 'Conecte suas contas do YouTube via OAuth 2.0 e gerencie envios em massa.',
    steps: [
      'Clique em "Conectar Canal do YouTube".',
      'Monitore a fila de envio e o histórico de agendamentos.',
    ],
  },
];

const FAQS = [
  {
    q: 'Como configurar as chaves de API?',
    a: 'Vá até o menu ⚙️ Configurações (/settings) e preencha suas chaves da OpenAI, Pixabay, Pexels e YouTube. As chaves são criptografadas em AES-256 no seu navegador.',
  },
  {
    q: 'Os vídeos gerados possuem direitos autorais?',
    a: 'Não. Todas as mídias puxadas pelo módulo /medias vêm das licenças livres do Pixabay e Pexels.',
  },
  {
    q: 'Como reiniciar o Tour de Boas-Vindas?',
    a: 'Você pode clicar no botão "Reiniciar Tour Guiado" no topo desta página de documentação ou nas Configurações.',
  },
];

export default function DocsPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showTour, setShowTour] = useState(false);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen size={24} className="text-[#6366F1]" /> 📚 Central de Documentação & Tutoriais
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Guia completo de uso, passo a passo dos 14 módulos e boas práticas do Viral Studio Pro AI
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => setShowTour(true)}>
              <HelpCircle size={14} /> Reiniciar Tour Guiado
            </Button>
          </div>
        </div>

        {/* ── SEÇÃO DE TUTORIAIS DOS 14 MÓDULOS ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
            Manuais dos Módulos ({MODULE_DOCS.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODULE_DOCS.map(doc => {
              const Icon = doc.icon;
              return (
                <Card key={doc.id} className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#334155]">
                    <div className="p-2 rounded bg-[#6366F1]/10 text-[#6366F1]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                      <p className="text-[11px] text-[#94A3B8]">{doc.description}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#6366F1] uppercase">Passos recomendados:</span>
                    <ol className="list-decimal pl-4 space-y-1 text-xs text-[#94A3B8]">
                      {doc.steps.map((step, idx) => (
                        <li key={idx} className="text-[#F8FAFC]">{step}</li>
                      ))}
                    </ol>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── SEÇÃO DE FAQ (PERGUNTAS FREQUENTES) ── */}
        <div className="space-y-4 pt-4 border-t border-[#334155]">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
            ❓ Perguntas Frequentes & Solução de Problemas
          </h2>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-white flex items-center justify-between hover:bg-[#334155]/40 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={14} className="text-[#6366F1]" /> : <ChevronDown size={14} className="text-[#94A3B8]" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#94A3B8] leading-relaxed border-t border-[#334155]/60 bg-[#0F172A]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tour Component */}
        {showTour && <OnboardingTour forceShow={true} onClose={() => setShowTour(false)} />}
      </div>
    </Layout>
  );
}
