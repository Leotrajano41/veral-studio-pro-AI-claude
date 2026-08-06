export const NICHES = [
  { value: 'games', label: 'Games' },
  { value: 'finance', label: 'Finanças' },
  { value: 'education', label: 'Educação' },
  { value: 'food', label: 'Culinária' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'entertainment', label: 'Entretenimento' },
];

export const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

export const VIDEO_QUALITIES = [
  { value: '720p', label: '720p (HD)' },
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '4k', label: '4K (Ultra HD)' },
];

export const VIDEO_STATUSES = {
  pending: { label: 'Na Fila', color: 'warning' },
  processing: { label: 'Processando', color: 'info' },
  done: { label: 'Concluído', color: 'success' },
  error: { label: 'Erro', color: 'error' },
};

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/projects', label: 'Projetos', icon: 'FolderKanban' },
  { href: '/create', label: 'Criar Vídeo', icon: 'Sparkles' },
  { href: '/videos', label: 'Vídeos', icon: 'Film' },
  { href: '/antigravity', label: 'Antigravity', icon: 'Cpu' },
  { href: '/settings', label: 'Configurações', icon: 'Settings' },
];
