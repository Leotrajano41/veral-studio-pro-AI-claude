import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center">
      <p className="text-xs text-txt-secondary flex items-center justify-center gap-1">
        © {new Date().getFullYear()} AntGravity Studio — Feito com <Heart size={12} className="text-accent-red" /> e Inteligência Artificial
      </p>
    </footer>
  );
}
