import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Cpu, Wifi, WifiOff, Rocket, Zap, ScrollText, Clock } from 'lucide-react';

const logs = [
  { id: 1, text: '[SDK] Conectado à Antgravity Engine v2.4', time: '10:00:15', type: 'info' },
  { id: 2, text: '[Otimização] Cache de mídias reindexado (+45% velocidade)', time: '10:02:40', type: 'success' },
  { id: 3, text: '[Deploy] Auto-deploy do microserviço de TTS efetuado', time: '10:15:00', type: 'success' },
  { id: 4, text: '[Performance] Latência média: 120ms ↓ 85ms', time: '10:30:12', type: 'info' },
  { id: 5, text: '[Aviso] Quota de chamadas OpenAI a 78%', time: '11:00:00', type: 'warning' },
];

const deploys = [
  { id: 1, date: '2026-08-05 14:30', status: 'done', duration: '42s', service: 'Backend API' },
  { id: 2, date: '2026-08-04 09:15', status: 'done', duration: '1m 12s', service: 'Web Dashboard' },
  { id: 3, date: '2026-08-03 18:00', status: 'error', duration: '28s', service: 'TTS Worker' },
];

export default function Antigravity() {
  const [connected, setConnected] = useState(true);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-3">
            <Cpu size={24} className="text-accent-red" /> Antigravity Engine
          </h1>
          <p className="text-sm text-txt-secondary">Painel de controle, logs e deploys automatizados</p>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-card flex items-center justify-center ${connected ? 'bg-success/10' : 'bg-error/10'}`}>
              {connected ? <Wifi size={22} className="text-success" /> : <WifiOff size={22} className="text-error" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-txt-primary">Status da Engine</p>
              <Badge text={connected ? 'Conectado' : 'Desconectado'} variant={connected ? 'success' : 'error'} />
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-card bg-accent-teal/10 flex items-center justify-center">
              <Clock size={22} className="text-accent-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-txt-primary">Última Sincronização</p>
              <p className="text-xs text-txt-secondary">Hoje às 10:30:12</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-card bg-warning/10 flex items-center justify-center">
              <Zap size={22} className="text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-txt-primary">Performance Score</p>
              <p className="text-xl font-bold text-accent-red">98.5</p>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant={connected ? 'danger' : 'primary'} size="sm" onClick={() => { setConnected(!connected); toast.success(connected ? 'Desconectado' : 'Conectado!'); }}>
            {connected ? <WifiOff size={14} /> : <Wifi size={14} />} {connected ? 'Desconectar' : 'Conectar ao Antigravity'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast.success('Otimização iniciada!')}>
            <Zap size={14} /> Otimizar Código
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast.success('Deploy iniciado!')}>
            <Rocket size={14} /> Deploy Automático
          </Button>
        </div>

        {/* Logs */}
        <Card title="Logs de Otimização">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {logs.map((log) => (
              <div key={log.id} className={`flex items-start gap-3 p-3 rounded-card bg-bg-tertiary/50 border-l-2 ${log.type === 'success' ? 'border-success' : log.type === 'warning' ? 'border-warning' : 'border-accent-teal'}`}>
                <span className="text-[10px] text-txt-secondary font-mono whitespace-nowrap pt-0.5">{log.time}</span>
                <p className="text-sm text-txt-primary">{log.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Deploy History */}
        <Card title="Histórico de Deploys">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-txt-secondary border-b border-border">
                <tr>
                  <th className="py-3 pr-4">Serviço</th>
                  <th className="py-3 pr-4">Data</th>
                  <th className="py-3 pr-4">Duração</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {deploys.map((d) => (
                  <tr key={d.id} className="hover:bg-bg-tertiary/30 transition">
                    <td className="py-3 pr-4 font-medium text-txt-primary">{d.service}</td>
                    <td className="py-3 pr-4 text-txt-secondary">{d.date}</td>
                    <td className="py-3 pr-4 text-txt-secondary">{d.duration}</td>
                    <td className="py-3"><Badge text={d.status === 'done' ? 'Sucesso' : 'Erro'} variant={d.status === 'done' ? 'success' : 'error'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
