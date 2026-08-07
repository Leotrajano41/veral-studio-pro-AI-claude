import Table from '../shared/Table';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import AudioPlayer from './AudioPlayer';
import { Download, Trash2, Music } from 'lucide-react';

export default function VoiceResults({ recordings = [], onDownload, onDelete }) {
  const columns = [
    {
      header: 'Nome do Roteiro / Áudio',
      cell: (row) => (
        <div>
          <p className="font-semibold text-white truncate max-w-[240px]">{row.scriptName}</p>
          <p className="text-[10px] text-[#B0B0B0] truncate max-w-[240px]">{row.scriptText}</p>
        </div>
      ),
    },
    {
      header: 'Voz TTS',
      cell: (row) => <Badge text={row.voice} variant="secondary" />,
    },
    {
      header: 'Duração',
      cell: (row) => <span className="font-mono text-[#B0B0B0]">{row.duration}</span>,
    },
    {
      header: 'Data Gerada',
      cell: (row) => <span className="font-mono text-[#B0B0B0]">{row.createdAt}</span>,
    },
    {
      header: 'Player & Ações',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          {/* Audio Player Inline com Wave Animation */}
          <AudioPlayer audioPath={row.audioPath} title={row.scriptName} />

          <button
            onClick={() => onDownload(row)}
            className="p-2 rounded-card bg-[#333333] hover:bg-[#444444] text-[#B0B0B0] hover:text-white border border-[#444444] transition"
            title="Download áudio"
          >
            <Download size={14} />
          </button>

          <button
            onClick={() => onDelete(row.id)}
            className="p-2 rounded-card text-[#B0B0B0] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#444444] transition"
            title="Deletar narração"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-wider">
        Áudios Gerados ({recordings.length})
      </h2>

      <Table
        columns={columns}
        data={recordings}
        emptyMessage="Nenhuma narração gerada ainda. Cole os roteiros acima e clique em Gerar Narrações!"
      />
    </div>
  );
}
