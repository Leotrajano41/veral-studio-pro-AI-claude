import { useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function AudioPlayer({ audioPath, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 5;
        });
      }, 300);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-card bg-[#333333]/70 border border-[#444444] min-w-[200px]">
      <button
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white flex items-center justify-center transition shrink-0 shadow-glow"
        aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
      >
        {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
      </button>

      {/* Wave animation quando estiver tocando */}
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-0.5 h-4 justify-between px-1">
          {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 85, 45].map((h, i) => (
            <div
              key={i}
              className={`w-0.5 rounded-full bg-[#FF6B6B] transition-all duration-200 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
              style={{ height: isPlaying ? `${Math.max(20, (h * (progress + i * 5)) % 100)}%` : '30%' }}
            />
          ))}
        </div>

        {/* Progress line */}
        <div className="h-1 bg-[#444444] rounded-full overflow-hidden w-full">
          <div
            className="h-full bg-[#FF6B6B] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
