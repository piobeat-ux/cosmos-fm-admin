import { useState, useEffect } from 'react';
import { podcastsApi } from '../api/client';
import { Pencil, Trash2, Headphones } from 'lucide-react';

export function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    host: '',
    episodes: 0,
    duration: '',
    description: '',
    image: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    const { data } = await podcastsApi.getAll();
    setPodcasts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await podcastsApi.update(editingId, form);
    } else {
      await podcastsApi.create(form);
    }
    setForm({ title: '', host: '', episodes: 0, duration: '', description: '', image: '' });
    setEditingId(null);
    loadPodcasts();
  };

  const handleEdit = (podcast: any) => {
    setForm({
      title: podcast.title || '',
      host: podcast.host || '',
      episodes: podcast.episodes || 0,
      duration: podcast.duration || '',
      description: podcast.description || '',
      image: podcast.image || '',
    });
    setEditingId(podcast.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить подкаст?')) return;
    await podcastsApi.delete(id);
    loadPodcasts();
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Headphones className="w-8 h-8" />
        Управление подкастами
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Редактировать' : 'Добавить подкаст'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Название"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Ведущий"
            value={form.host}
            onChange={e => setForm({...form, host: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Количество выпусков"
            value={form.episodes}
            onChange={e => setForm({...form, episodes: parseInt(e.target.value) || 0})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Длительность (например: 45 мин)"
            value={form.duration}
            onChange={e => setForm({...form, duration: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="URL изображения"
            value={form.image}
            onChange={e => setForm({...form, image: e.target.value})}
            className="p-3 border rounded-lg"
          />
          <textarea
            placeholder="Описание"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="p-3 border rounded-lg col-span-2"
            rows={3}
            required
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', host: '', episodes: 0, duration: '', description: '', image: '' }); }} className="px-6 py-2 border rounded-lg">
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Изображение</th>
              <th className="text-left p-4">Название</th>
              <th className="text-left p-4">Ведущий</th>
              <th className="text-left p-4">Выпусков</th>
              <th className="text-left p-4">Длительность</th>
              <th className="text-left p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {podcasts.map((podcast: any) => (
              <tr key={podcast.id} className="border-t">
                <td className="p-4">
                  {podcast.image ? (
                    <img src={podcast.image} alt={podcast.title} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium">{podcast.title}</td>
                <td className="p-4">{podcast.host}</td>
                <td className="p-4">{podcast.episodes}</td>
                <td className="p-4">{podcast.duration}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(podcast)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(podcast.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}