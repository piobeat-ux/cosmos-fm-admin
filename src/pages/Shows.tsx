import { useState, useEffect } from 'react';
import { showsApi } from '../api/client';
import { Pencil, Trash2, Radio } from 'lucide-react';

export function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    host: '',
    time: '',
    category: '',
    dayOfWeek: [],
    isLive: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    const { data } = await showsApi.getAll();
    setShows(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await showsApi.update(editingId, form);
    } else {
      await showsApi.create(form);
    }
    setForm({ title: '', host: '', time: '', category: '', dayOfWeek: [], isLive: false });
    setEditingId(null);
    loadShows();
  };

  const handleEdit = (show: any) => {
    setForm(show);
    setEditingId(show.id);
  };

  const handleDelete = async (id: string) => {
  if (!window.confirm('Удалить передачу?')) return;
    await showsApi.delete(id);
    loadShows();
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Radio className="w-8 h-8" />
        Управление передачами
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Редактировать' : 'Добавить передачу'}</h2>
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
            type="time"
            value={form.time}
            onChange={e => setForm({...form, time: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Категория"
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
        </div>
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={form.isLive}
            onChange={e => setForm({...form, isLive: e.target.checked})}
          />
          <span>Сейчас в эфире (LIVE)</span>
        </label>
        <div className="flex gap-2">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', host: '', time: '', category: '', dayOfWeek: [], isLive: false }); }} className="px-6 py-2 border rounded-lg">
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
              <th className="text-left p-4">Название</th>
              <th className="text-left p-4">Ведущий</th>
              <th className="text-left p-4">Время</th>
              <th className="text-left p-4">Категория</th>
              <th className="text-left p-4">Статус</th>
              <th className="text-left p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show: any) => (
              <tr key={show.id} className="border-t">
                <td className="p-4 font-medium">{show.title}</td>
                <td className="p-4">{show.host}</td>
                <td className="p-4">{show.time}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {show.category}
                  </span>
                </td>
                <td className="p-4">
                  {show.isLive ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(show)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(show.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
