import Link from 'next/link';
import { Zap, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-bg-secondary/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center group-hover:shadow-glow transition">
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-txt-primary hidden sm:inline">AntGravity <span className="text-accent-red">Studio</span></span>
      </Link>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-card hover:bg-bg-tertiary transition text-txt-secondary hover:text-txt-primary relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-accent-red/20 border border-accent-red/30 flex items-center justify-center">
          <User size={16} className="text-accent-red" />
        </div>
      </div>
    </header>
  );
}
