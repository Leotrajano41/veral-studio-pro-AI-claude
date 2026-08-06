import { X, Play } from 'lucide-react';

export default function VideoPlayer({ videoUrl, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl">
        <button onClick={onClose} className="absolute -top-10 right-0 p-1 text-txt-secondary hover:text-white transition"><X size={24} /></button>
        <div className="bg-black rounded-card overflow-hidden aspect-[9/16] max-h-[80vh] mx-auto flex items-center justify-center border border-border">
          {videoUrl ? (
            <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
          ) : (
            <div className="text-center">
              <Play size={48} className="text-txt-secondary/30 mx-auto mb-2" />
              <p className="text-sm text-txt-secondary">Preview indisponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
