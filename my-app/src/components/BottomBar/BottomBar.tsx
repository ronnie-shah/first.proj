import React, { useState } from 'react';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { useMixGeneration } from '@/hooks/useMixGeneration';

interface BottomBarProps {
  onGenerateMix: () => Promise<void>;
  isGenerating: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onGenerateMix,
  isGenerating,
  isPlaying,
  onPlayPause
}) => {
  const [volume, setVolume] = useState<number>(100);

  return (
    <div className="bg-[#181818] p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onPlayPause}
          className="p-2 bg-[#1DB954] text-white rounded-full hover:bg-[#1ed760] transition-colors"
          disabled={isGenerating}
        >
          {isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} />
          )}
        </button>
      </div>

      <button
        onClick={onGenerateMix}
        disabled={isGenerating}
        className="px-6 py-2 bg-[#1DB954] text-white rounded hover:bg-[#1ed760] transition-colors disabled:opacity-50 flex items-center"
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin mr-2" />
            Generating Mix...
          </>
        ) : (
          'Generate Mix'
        )}
      </button>

      <div className="flex items-center">
        <Volume2 size={24} className="mr-2" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="accent-[#1DB954]"
        />
      </div>
    </div>
  );
};

export default BottomBar;
