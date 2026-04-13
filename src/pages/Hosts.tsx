import { useState, useEffect } from 'react';
import { hostsApi } from '../api/client';
import { Pencil, Trash2, Users } from 'lucide-react';

export function Hosts() {
  const [hosts, setHosts] = useState([]);
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

  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    const { data } = await hostsApi.getAll();
    setHosts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await hostsApi.update(editingId, form);
    } else {
      await hostsApi.create(form);
    }
    setForm({ name: '', role: '', bio: '', image: '', shows: [] });
    setShowsInput('');
    setEditingId(null);
    loadHosts();
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
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить ведущего?')) return;
    await hostsApi.delete(id);
    loadHosts();
  };

  const handleShowsChange = (value: string) => {
    setShowsInput(value);
    setForm({
      ...form,
      shows: value.split(',').map(s => s.trim()).filter(s => s),
    });
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Users className="w-8 h-8" />
        Управление ведущими
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Редактировать' : 'Добавить ведущего'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Имя"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Роль"
            value={form.role}
            onChange={e => setForm({...form, role: e.target.value})}
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
          <input
            type="text"
            placeholder="Передачи (через запятую)"
            value={showsInput}
            onChange={e => handleShowsChange(e.target.value)}
            className="p-3 border rounded-lg"
          />
          <textarea
            placeholder="Биография"
            value={form.bio}
            onChange={e => setForm({...form, bio: e.target.value})}
            className="p-3 border rounded-lg col-span-2"
            rows={3}
            required
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', role: '', bio: '', image: '', shows: [] }); setShowsInput(''); }} className="px-6 py-2 border rounded-lg">
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
              <th className="text-left p-4">Фото</th>
              <th className="text-left p-4">Имя</th>
              <th className="text-left p-4">Роль</th>
              <th className="text-left p-4">Передачи</th>
              <th className="text-left p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((host: any) => (
              <tr key={host.id} className="border-t">
                <td className="p-4">
                  {host.image ? (
                    <img src={host.image} alt={host.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium">{host.name}</td>
                <td className="p-4">{host.role}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {host.shows?.map((show: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {show}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(host)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(host.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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