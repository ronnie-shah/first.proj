import { Track } from './types';

export class YoutubeService {
  private apiKey: string;

  constructor() {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('Missing Youtube API key');
    }
    this.apiKey = process.env.YOUTUBE_API_KEY;
  }

  async extractVideoId(url: string): Promise<string> {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (!match) throw new Error('Invalid YouTube URL');
    return match[1];
  }

  async getVideoDetails(url: string): Promise<Partial<Track>> {
    const videoId = await this.extractVideoId(url);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    const video = data.items[0];

    if (!video) {
      throw new Error('Video not found');
    }

    return {
      youtubeUrl: url,
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      duration: this.convertDuration(video.contentDetails.duration),
    };
  }

  private convertDuration(duration: string): number {
    // Convert ISO 8601 duration to seconds
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    
    const hours = (match[1] ? parseInt(match[1]) : 0) * 3600;
    const minutes = (match[2] ? parseInt(match[2]) : 0) * 60;
    const seconds = (match[3] ? parseInt(match[3]) : 0);
    
    return hours + minutes + seconds;
  }
}

export const youtubeService = new YoutubeService();
