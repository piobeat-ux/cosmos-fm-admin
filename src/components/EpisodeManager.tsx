import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { AudioUploader } from './AudioUploader';

interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishedAt: string;
  order: number;
}

interface EpisodeManagerProps {
  episodes: Episode[];
  onChange: (episodes: Episode[]) => void;
}

export function EpisodeManager({ episodes, onChange }: EpisodeManagerProps) {
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  const addEpisode = () => {
    const newEpisode: Episode = {
      id: Date.now().toString(),
      title: '',
      description: '',
      audioUrl: '',
      duration: '',
      publishedAt: new Date().toISOString().split('T')[0],
      order: episodes.length,
    };
    onChange([...episodes, newEpisode]);
    setEditingEpisode(newEpisode);
  };

  const updateEpisode = (id: string, updates: Partial<Episode>) => {
    const updated = episodes.map(ep => 
      ep.id === id ? { ...ep, ...updates } : ep
    );
    onChange(updated);
    if (editingEpisode?.id === id) {
      setEditingEpisode({ ...editingEpisode, ...updates });
    }
  };

  const deleteEpisode = (id: string) => {
    onChange(episodes.filter(ep => ep.id !== id));
    if (editingEpisode?.id === id) {
      setEditingEpisode(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Эпизоды ({episodes.length})</h3>
        <button
          onClick={addEpisode}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} />
          Добавить эпизод
        </button>
      </div>

      <div className="space-y-2">
        {episodes.map((episode, index) => (
          <div
            key={episode.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              editingEpisode?.id === episode.id ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => setEditingEpisode(episode)}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="font-medium">{episode.title || 'Без названия'}</p>
                <p className="text-sm text-gray-500">
                  {episode.duration} • {episode.publishedAt}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEpisode(episode.id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingEpisode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Редактирование эпизода</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название эпизода</label>
                <input
                  type="text"
                  value={editingEpisode.title}
                  onChange={(e) => updateEpisode(editingEpisode.id, { title: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Например: Выпуск 1 - Знакомство"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <textarea
                  value={editingEpisode.description}
                  onChange={(e) => updateEpisode(editingEpisode.id, { description: e.target.value })}
                  className="w-full p-3 border rounded-lg h-24"
                  placeholder="Описание содержания эпизода..."
                />
              </div>

              <AudioUploader
                value={editingEpisode.audioUrl}
                onChange={(url) => updateEpisode(editingEpisode.id, { audioUrl: url })}
                label="Аудио файл эпизода"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Длительность</label>
                  <input
                    type="text"
                    value={editingEpisode.duration}
                    onChange={(e) => updateEpisode(editingEpisode.id, { duration: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="45:30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Дата публикации</label>
                  <input
                    type="date"
                    value={editingEpisode.publishedAt}
                    onChange={(e) => updateEpisode(editingEpisode.id, { publishedAt: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingEpisode(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}