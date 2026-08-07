import Button from '../shared/Button';
import { FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PathInput({ label, value, onChange, placeholder, helpText, required }) {
  const handleBrowse = () => {
    toast(`📂 Selecionador de pastas: ${label}`);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-[#B0B0B0]">
          {label}
          {required && <span className="text-[#FF6B6B] ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          className="w-full bg-[#333333] border border-[#444444] rounded-input px-4 py-2.5 text-xs font-mono text-white placeholder-[#B0B0B0]/40 outline-none transition duration-180 focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/40 flex-1"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <Button variant="secondary" size="sm" onClick={handleBrowse} type="button">
          <FolderOpen size={14} /> Procurar
        </Button>
      </div>

      {helpText && (
        <p className="text-[11px] text-[#B0B0B0]/60">
          💡 {helpText}
        </p>
      )}
    </div>
  );
}
