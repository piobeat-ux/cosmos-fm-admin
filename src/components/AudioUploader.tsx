import { useState, useRef } from 'react';
import { Upload, Play, Pause, Trash2, Music } from 'lucide-react';

interface AudioUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export function AudioUploader({ value, onChange, label }: AudioUploaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Пожалуйста, загрузите аудиофайл');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('Размер файла не должен превышать 50MB');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('https://cosmosfm-production.up.railway.app/api/upload/audio', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      // Fallback: base64 для демо
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {value ? (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <audio
            ref={audioRef}
            src={value}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={togglePlay}
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <button
              onClick={() => onChange('')}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-purple-500 hover:bg-gray-50"
        >
          <Music className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Загрузить аудио</span>
          <span className="text-xs text-gray-400">MP3, WAV до 50MB</span>
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}