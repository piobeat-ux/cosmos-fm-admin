import { useState, useEffect } from 'react';
import { hostsApi } from '../api/client';
import { Pencil, Trash2, Users, Plus } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';

export function Hosts() {
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    shows: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showsInput, setShowsInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    try {
      const { data } = await hostsApi.getAll();
      setHosts(data);
    } catch (error) {
      console.error('Ошибка загрузки ведущих:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await hostsApi.update(editingId, form);
      } else {
        await hostsApi.create(form);
      }
      setForm({ name: '', role: '', bio: '', image: '', shows: [] });
      setShowsInput('');
      setEditingId(null);
      setShowForm(false);
      loadHosts();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleEdit = (host: any) => {
    setForm({
      name: host.name || '',
      role: host.role || '',
      bio: host.bio || '',
      image: host.image || '',
      shows: host.shows || [],
    });
    setShowsInput((host.shows || []).join(', '));
    setEditingId(host.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить ведущего?')) return;
    try {
      await hostsApi.delete(id);
      loadHosts();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleShowsChange = (value: string) => {
    setShowsInput(value);
    setForm({
      ...form,
      shows: value.split(',').map(s => s.trim()).filter(s => s),
    });
  };

  const handleCancel = () => {
    setForm({ name: '', role: '', bio: '', image: '', shows: [] });
    setShowsInput('');
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-gray-500">Загрузка ведущих...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-green-500" />
          Управление ведущими
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Добавить ведущего
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Редактировать ведущего' : 'Добавить ведущего'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Фото ведущего"
              />
            </div>
            <input
              type="text"
              placeholder="Имя"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              placeholder="Роль"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              placeholder="Передачи (через запятую)"
              value={showsInput}
              onChange={e => handleShowsChange(e.target.value)}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2"
            />
            <textarea
              placeholder="Биография"
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {editingId ? 'Сохранить' : 'Добавить'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Фото</th>
              <th className="text-left p-4">Имя</th>
              <th className="text-left p-4">Роль</th>
              <th className="text-left p-4">Передачи</th>
              <th className="text-left p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {hosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  Нет ведущих. Нажмите "Добавить ведущего"
                </td>
              </tr>
            ) : (
              hosts.map((host: any) => (
                <tr key={host.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    {host.image ? (
                      <img
                        src={host.image}
                        alt={host.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{host.name}</td>
                  <td className="p-4">{host.role}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {host.shows?.length > 0 ? (
                        host.shows.map((show: string, i: number) => (
                          <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {show}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(host)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(host.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}