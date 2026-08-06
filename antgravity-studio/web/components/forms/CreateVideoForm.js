import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { NICHES, LANGUAGES } from '../../lib/constants';

export default function CreateVideoForm({ onGenerate }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { tema: '', nicho: 'entertainment', idioma: 'pt-BR', duracao: 60, prompt: '' },
  });
  const [loading, setLoading] = useState(false);
  const watchTema = watch('tema');
  const watchDuracao = watch('duracao');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onGenerate(data);
      toast.success('Vídeo enviado para geração!');
    } catch {
      toast.error('Falha ao iniciar geração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-txt-secondary">Tema do Vídeo *</label>
          <input
            className="input-base"
            placeholder="Ex: 5 dicas para economizar dinheiro"
            {...register('tema', { required: 'Tema é obrigatório' })}
          />
          {errors.tema && <p className="text-xs text-error">{errors.tema.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-txt-secondary">Nicho *</label>
          <select className="input-base appearance-none cursor-pointer" {...register('nicho', { required: true })}>
            {NICHES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-txt-secondary">Idioma *</label>
          <select className="input-base appearance-none cursor-pointer" {...register('idioma', { required: true })}>
            {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-txt-secondary">Duração: <span className="text-accent-red font-bold">{watchDuracao}s</span></label>
          <input type="range" min="10" max="600" step="5" className="w-full accent-accent-red cursor-pointer" {...register('duracao')} />
          <div className="flex justify-between text-xs text-txt-secondary"><span>10s</span><span>600s</span></div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-txt-secondary">Prompt Customizado (opcional)</label>
          <textarea className="input-base min-h-[100px] resize-none" placeholder="Instruções adicionais para a IA..." {...register('prompt')} />
        </div>

        <Button variant="primary" size="lg" type="submit" disabled={loading} className="w-full">
          {loading ? <><Spinner size="sm" /> Gerando...</> : '✨ Gerar Vídeo com IA'}
        </Button>
      </form>

      {/* Live Preview */}
      <div className="flex flex-col items-center justify-center">
        <div className="w-52 sm:w-60 aspect-[9/16] bg-bg-secondary border border-border rounded-2xl flex flex-col items-center justify-center p-5 shadow-card">
          <span className="text-3xl mb-3">📱</span>
          <span className="text-[10px] text-txt-secondary mb-4 uppercase tracking-wider">Preview 9:16</span>
          <p className="text-sm font-semibold text-txt-primary text-center px-2 leading-snug">
            {watchTema || 'Seu título aparecerá aqui…'}
          </p>
          <span className="mt-4 text-xs text-accent-red font-medium">{watchDuracao}s</span>
        </div>
        <p className="text-xs text-txt-secondary mt-4">Shorts · Reels · TikTok</p>
      </div>
    </div>
  );
}
