import { useState, useEffect } from 'react';
import { showsApi, podcastsApi, hostsApi } from '../api/client';
import { Radio, Podcast, Users, Activity } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({ shows: 0, podcasts: 0, hosts: 0, loading: true });

  useEffect(() => {
    Promise.all([
      showsApi.getAll(),
      podcastsApi.getAll(),
      hostsApi.getAll(),
    ]).then(([shows, podcasts, hosts]) => {
      setStats({
        shows: shows.data.length,
        podcasts: podcasts.data.length,
        hosts: hosts.data.length,
        loading: false,
      });
    });
  }, []);

  if (stats.loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Cosmos FM Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Radio}
          title="Передачи"
          value={stats.shows}
          color="bg-blue-500"
        />
        <StatCard
          icon={Podcast}
          title="Подкасты"
          value={stats.podcasts}
          color="bg-purple-500"
        />
        <StatCard
          icon={Users}
          title="Ведущие"
          value={stats.hosts}
          color="bg-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Быстрые действия
        </h2>
        <div className="flex gap-4">
          <a href="/shows" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Управление передачами
          </a>
          <a href="/podcasts" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Управление подкастами
          </a>
          <a href="/hosts" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Управление ведущими
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}