import { useState } from 'react';
import Card from '../shared/Card';
import Table from '../shared/Table';
import Badge from '../shared/Badge';
import FormField from '../shared/FormField';
import { FolderOpen, Link as LinkIcon, Trash2, Search, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MediaLibrary({ items = [], onDeleteItem }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenFolder = (item) => {
    toast(`📂 Abrindo pasta do arquivo: ${item.localPath}`);
  };

  const handleCopyPath = (item) => {
    navigator.clipboard.writeText(item.localPath);
    toast.success('🔗 Caminho do arquivo copiado!');
  };

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const columns = [
    {
      header: 'Mídia Baixada',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.thumb} alt="" className="w-12 h-7 object-cover rounded bg-[#333333] shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-white truncate max-w-[200px]" title={row.name}>{row.name}</p>
            <p className="text-[10px] font-mono text-[#B0B0B0] truncate max-w-[200px]">{row.localPath}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Tipo',
      cell: (row) => <Badge text={row.type === 'video' ? '🎬 Vídeo' : '🖼️ Imagem'} variant={row.type === 'video' ? 'primary' : 'secondary'} />,
    },
    {
      header: 'Fonte',
      cell: (row) => <span className="text-[#B0B0B0] font-semibold">{row.source}</span>,
    },
    {
      header: 'Tamanho',
      cell: (row) => <span className="font-mono text-[#B0B0B0]">{row.size}</span>,
    },
    {
      header: 'Data Download',
      cell: (row) => <span className="font-mono text-[#B0B0B0]">{row.downloadedAt}</span>,
    },
    {
      header: 'Ações',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleOpenFolder(row)}
            className="p-1.5 rounded hover:bg-[#333333] text-[#B0B0B0] hover:text-[#4ECDC4] transition"
            title="📂 Abrir pasta"
          >
            <FolderOpen size={14} />
          </button>

          <button
            onClick={() => handleCopyPath(row)}
            className="p-1.5 rounded hover:bg-[#333333] text-[#B0B0B0] hover:text-white transition"
            title="🔗 Copiar caminho"
          >
            <LinkIcon size={14} />
          </button>

          <button
            onClick={() => onDeleteItem(row.id)}
            className="p-1.5 rounded hover:bg-[#EF4444]/20 text-[#B0B0B0] hover:text-[#EF4444] transition"
            title="🗑️ Deletar localmente"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Busca rápida na Biblioteca */}
      <Card title="📁 Biblioteca de Arquivos Baixados" subtitle="Gerencie mídias salvas localmente no diretório de downloads">
        <FormField
          label="Filtrar mídias da biblioteca"
          placeholder="Digite o nome do arquivo baixado..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Card>

      <Table
        columns={columns}
        data={filteredItems}
        emptyMessage="Nenhum arquivo encontrado na biblioteca local."
      />
    </div>
  );
}
