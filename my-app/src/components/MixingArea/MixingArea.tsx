import React, { useState } from 'react';
import { AudioWaveformIcon as Waveform, Loader2 } from 'lucide-react';
import { Track } from '@/lib/types';

interface WaveformVisualizerProps {
  isAnalyzing: boolean;
  tracks: Track[];
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isAnalyzing, tracks }) => {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Loader2 size={64} className="animate-spin text-[#1DB954] mb-4" />
        <p className="text-sm text-gray-400">Analyzing tracks...</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Waveform size={128} className="text-[#1DB954] mb-4" />
        <p className="text-sm text-gray-400">Add songs to start mixing</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {tracks.map((track, index) => (
        <div key={track.id} className="flex items-center mb-4 p-2 bg-[#282828] rounded">
          <span className="mr-4 text-sm">{index + 1}</span>
          <div className="flex-1">
            <div className="h-12 bg-[#333333] rounded relative">
              {/* Placeholder waveform visualization */}
              <div 
                className="absolute inset-0 bg-[#1DB954] opacity-20"
                style={{ 
                  clipPath: `polygon(${Array.from({ length: 20 }, 
                    () => `${Math.random() * 100}% ${Math.random() * 100}%`).join(', ')})` 
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs">{track.title}</span>
              <span className="text-xs">{track.bpm ? `${track.bpm} BPM` : 'Analyzing...'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MixingArea: React.FC = () => {
  const [bpm, setBpm] = useState<string>('120');
  const [tone, setTone] = useState<string>('energetic');
  const [transitionLength, setTransitionLength] = useState<number>(50);

  return (
    <div className="flex-1 p-4 bg-[#121212]">
      <div className="bg-[#181818] p-4 rounded-lg h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mixing Area</h2>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="tone" className="mr-2 text-sm">Tone:</label>
              <select 
                id="tone" 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-[#333333] text-white p-2 rounded text-sm"
              >
                <option value="energetic">Energetic</option>
                <option value="chill">Chill</option>
                <option value="happy">Happy</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label htmlFor="bpm" className="mr-2 text-sm">Target BPM:</label>
              <select
                id="bpm"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="bg-[#333333] text-white p-2 rounded text-sm"
              >
                <option value="120">120</option>
                <option value="128">128</option>
                <option value="140">140</option>
              </select>
            </div>
          </div>
        </div>

        <div className="h-[calc(100%-6rem)] overflow-y-auto">
          <WaveformVisualizer isAnalyzing={false} tracks={[]} />
        </div>

        <div className="mt-4">
          <label htmlFor="transition" className="text-sm">Transition Length:</label>
          <div className="flex items-center mt-1">
            <input
              type="range"
              id="transition"
              min="0"
              max="100"
              value={transitionLength}
              onChange={(e) => setTransitionLength(Number(e.target.value))}
              className="flex-1 accent-[#1DB954]"
            />
            <span className="ml-2 text-sm">{transitionLength}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixingArea;
