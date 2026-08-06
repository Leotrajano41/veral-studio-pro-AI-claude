import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-red/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent-red/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} />
          Pipeline Completo de Geração com IA
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-txt-primary leading-tight mb-6">
          🚀 AntGravity <span className="text-accent-red">Studio</span>
        </h1>

        <p className="text-lg md:text-xl text-txt-secondary mb-4 max-w-2xl mx-auto">
          Crie vídeos virais com IA em segundos
        </p>
        <p className="text-sm text-txt-secondary/70 mb-10 max-w-xl mx-auto">
          Pipeline automático completo: roteiros inteligentes, voz neural ultra-realista, mídias de alta qualidade e renderização profissional via FFmpeg.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/create">
            <Button variant="primary" size="lg">
              Começar Agora <Sparkles size={16} />
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="secondary" size="lg">
              Ver Meus Projetos <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
