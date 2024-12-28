export interface Track {
    id: string;
    youtubeUrl: string;
    title: string;
    artist: string;
    duration: number;
    bpm: number;
    key: string;
    tone: string;
  }
  
  export interface Mix {
    id: string;
    userId: string;
    name: string;
    tracks: Track[];
    targetBpm: number;
    tone: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TransitionPoint {
    trackIdFrom: string;
    trackIdTo: string;
    startTime: number;
    duration: number;
    type: 'fade' | 'cut' | 'loop';
  }
  
  export interface AudioAnalysis {
    bpm: number;
    key: string;
    segments: {
      start: number;
      duration: number;
      loudness: number;
    }[];
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    preferences: {
      defaultTransitionDuration: number;
      preferredBpm: number;
    };
  }
  