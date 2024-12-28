import { useState } from 'react';
import { Track, Mix, TransitionPoint } from '@/lib/types';
import { audioProcessor } from '@/lib/audio-processor';
import { supabase } from '@/lib/supabase';
import { youtubeService } from '@/lib/youtube';

interface UseMixGenerationProps {
  onProgress?: (progress: number) => void;
}

export function useMixGeneration({ onProgress }: UseMixGenerationProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMix = async (tracks: Track[], targetBpm: number, tone: string) => {
    try {
      setIsGenerating(true);
      setError(null);

      // Analyze tracks if not already analyzed
      const unanalyzedTracks = tracks.filter(track => !track.bpm);
      if (unanalyzedTracks.length > 0) {
        const analyses = await audioProcessor.analyzeTracks(unanalyzedTracks);
        tracks = tracks.map((track, i) => ({
          ...track,
          bpm: analyses[i].bpm,
          key: analyses[i].key,
        }));
      }

      // Generate optimal track order based on tone and BPM
      const orderedTracks = optimizeTrackOrder(tracks, targetBpm, tone);

      // Generate transition points
      const transitions = generateTransitionPoints(orderedTracks);

      // Generate the final mix
      const mixBuffer = await audioProcessor.generateMix(
        orderedTracks,
        transitions,
        targetBpm
      );

      // Save mix to Supabase
      const { data: mix, error: saveError } = await supabase
        .from('mixes')
        .insert({
          tracks: orderedTracks,
          targetBpm,
          tone,
          transitions,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      return mix;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate mix');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const addTrack = async (youtubeUrl: string): Promise<Track> => {
    try {
      // Extract video details
      const details = await youtubeService.getVideoDetails(youtubeUrl);
      
      // Create track object
      const track: Track = {
        id: crypto.randomUUID(),
        youtubeUrl,
        title: details.title || 'Unknown Title',
        artist: details.artist || 'Unknown Artist',
        duration: details.duration || 0,
        bpm: 0, // Will be analyzed later
        key: '', // Will be analyzed later
        tone: '', // Will be set during analysis
      };

      return track;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add track');
      throw err;
    }
  };

  return {
    generateMix,
    addTrack,
    isGenerating,
    error,
  };
}

// Helper functions
function optimizeTrackOrder(
  tracks: Track[],
  targetBpm
  