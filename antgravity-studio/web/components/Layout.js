import React from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="h-16 bg-cardBg border-b border-cardBorder px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <span>⚡</span> AntGravity Studio
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/create" className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-medium text-sm transition">
            + Criar Vídeo
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-cardBg border-r border-cardBorder p-4 hidden md:block">
          <nav className="space-y-2">
            <Link href="/" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-background hover:text-white transition">
              🏠 Dashboard
            </Link>
            <Link href="/projects" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-background hover:text-white transition">
              📁 Projetos
            </Link>
            <Link href="/videos" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-background hover:text-white transition">
              🎬 Vídeos Gerados
            </Link>
            <Link href="/settings" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-background hover:text-white transition">
              ⚙️ Configurações
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-cardBg border-t border-cardBorder py-4 text-center text-xs text-gray-500">
        © 2026 AntGravity Studio. Todos os direitos reservados.
      </footer>
    </div>
  );
}
