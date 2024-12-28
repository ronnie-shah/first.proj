import React, { useState } from 'react';
import TopBar from '@/components/TopBar/TopBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import MixingArea from '@/components/MixingArea/MixingArea';
import BottomBar from '@/components/BottomBar/BottomBar';
import { useMixGeneration } from '@/hooks/useMixGeneration';
import { Track } from '@/lib/types';

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { generateMix, isGenerating, error } = useMixGeneration({
    onProgress: (progress) => {
      console.log('Mix generation progress:', progress);
    },
  });

  const handleGenerateMix = async () => {
    if (tracks.length < 2) {
      alert('Please add at least 2 tracks to generate a mix');
      return;
    }

    try {
      const mix = await generateMix(tracks, 120, 'energetic');
      console.log('Generated mix:', mix);
      // Handle successful mix generation (e.g., show download button)
    } catch (err) {
      console.error('Failed to generate mix:', err);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-[#B3B3B3]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MixingArea />
      </div>
      <BottomBar
        onGenerateMix={handleGenerateMix}
        isGenerating={isGenerating}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
    </div>
  );
}
