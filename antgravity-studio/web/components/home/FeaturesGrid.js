import { Brain, Mic, Image, Cpu } from 'lucide-react';
import Card from '../common/Card';

const features = [
  {
    icon: Brain,
    title: 'Roteiros com IA',
    desc: 'Geração automática de scripts altamente engajantes otimizados para Shorts, Reels e TikTok utilizando GPT-4.',
    color: 'text-accent-red',
    bg: 'bg-accent-red/10',
  },
  {
    icon: Mic,
    title: 'Voz Ultra-Realista',
    desc: 'Narração neural de alta fidelidade usando Google Cloud Text-to-Speech com controle de tom e velocidade.',
    color: 'text-accent-teal',
    bg: 'bg-accent-teal/10',
  },
  {
    icon: Image,
    title: 'Mídia Automática',
    desc: 'Motor de busca paralelo integrado a Pexels e Pixabay para encontrar vídeos e imagens stock de alta qualidade.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Cpu,
    title: 'Antigravity Engine',
    desc: 'SDK proprietário para otimizações de pipeline, análise de performance e deploy automático com um clique.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-txt-primary text-center mb-10">Recursos Poderosos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <Card key={f.title} className="group hover:border-accent-red/30 hover:shadow-glow transition-all duration-300">
            <div className={`w-12 h-12 rounded-card ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <f.icon size={22} className={f.color} />
            </div>
            <h3 className="text-base font-bold text-txt-primary mb-2">{f.title}</h3>
            <p className="text-sm text-txt-secondary leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
