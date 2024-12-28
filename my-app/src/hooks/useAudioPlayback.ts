import { useState, useEffect, useRef } from 'react';

interface UseAudioPlaybackProps {
  onEnded?: () => void;
}

export function useAudioPlayback({ onEnded }: UseAudioPlaybackProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ende

        