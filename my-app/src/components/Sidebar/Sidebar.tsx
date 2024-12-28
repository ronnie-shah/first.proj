import React, { useState } from 'react';
import { Plus, Music, Loader2 } from 'lucide-react';
import { useMixGeneration } from '@/hooks/useMixGeneration';
import { Track } from '@/lib/types';

const Sidebar: React.FC = () => {
  const [songs, setSongs] = useState<Track[]>([]);
  const [newSong, setNewSong] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addTrack, error } = useMixGeneration();

  const handleAddSong = async () => {
    if (!newSong) return;
    
    try {
      setIsLoading(true);
      const track = await addTrack(newSong);
      setSongs([...songs, track]);
      setNewSong('');
    } catch (err) {
      console.error('Failed to add track:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 bg-[#181818] p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Song List</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newSong}
          onChange={(e) => setNewSong(e.target.value)}
          placeholder="Paste YouTube link"
          className="w-full p-2 bg-[#333333] text-white rounded"
          disabled={isLoading}
        />
        <button
          onClick={handleAddSong}
          disabled={isLoading || !newSong}
          className="mt-2 w-full bg-[#1DB954] text-white p-2 rounded flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={18} className="mr-2 animate-spin" />
          ) : (
            <Plus size={18} className="mr-2" />
          )}
          Add Song
        </button>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
      <ul>
        {songs.map((song) => (
          <li key={song.id} className="flex items-center mb-2 p-2 bg-[#282828] rounded">
            <Music size={18} className="mr-2" />
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{song.title}</span>
              <span className="truncate text-xs text-gray-400">{song.artist}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
