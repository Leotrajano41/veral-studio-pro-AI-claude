import Layout from '../components/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturesGrid from '../components/home/FeaturesGrid';
import CTASection from '../components/home/CTASection';
import OnboardingTour from '../components/onboarding/OnboardingTour';
import HelpPopover from '../components/shared/HelpPopover';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top bar com ajuda contextual */}
        <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
          <span className="text-xs text-[#94A3B8] font-medium">✨ Visão Geral dos Módulos</span>
          <HelpPopover
            moduleTitle="Home & Visão Geral"
            description="Esta é a sua central principal. Aqui você tem acesso aos 14 módulos de criação e automação de vídeos com IA."
            steps={[
              'Clique em "⚡ Iniciar Pipeline Mágico" para criar seu primeiro vídeo automatizado.',
              'Ou navegue pela Sidebar esquerda para acessar módulos isolados (Roteiros, Narrações, Mídias).',
              'Consulte o guia interativo caso tenha dúvidas em qualquer etapa.',
            ]}
            tips={[
              'Sempre configure suas chaves em ⚙️ Configurações (/settings) para obter o máximo desempenho da OpenAI e Pixabay.',
              'Use o módulo /queue para acompanhar seus vídeos em tempo real.',
            ]}
          />
        </div>

        <HeroSection />
        <FeaturesGrid />
        <CTASection />

        {/* Tour Onboarding Automático na Primeira Visita */}
        <OnboardingTour />
      </div>
    </Layout>
  );
}
