import Link from 'next/link';
import { Rocket } from 'lucide-react';
import Button from '../common/Button';

export default function CTASection() {
  return (
    <section className="py-16">
      <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/10 via-transparent to-accent-teal/10 pointer-events-none" />
        <div className="relative z-10">
          <Rocket size={40} className="text-accent-red mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-txt-primary mb-4">Pronto para criar conteúdo viral?</h2>
          <p className="text-txt-secondary mb-8 max-w-lg mx-auto">Comece agora mesmo a produzir vídeos profissionais automaticamente com inteligência artificial.</p>
          <Link href="/create">
            <Button variant="primary" size="lg">Criar Meu Primeiro Vídeo</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
