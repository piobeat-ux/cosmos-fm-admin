import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Shows } from './pages/Shows';
import { Podcasts } from './pages/Podcasts';
import { Hosts } from './pages/Hosts';
import { Settings } from './pages/Settings';
import { Radio, Podcast, Users, Settings as SettingsIcon } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white">
          <div className="p-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Radio className="text-blue-500" />
              Cosmos FM Admin
            </h1>
          </div>
          <nav className="px-4 space-y-2">
            <NavLink to="/" icon={Radio} label="Дашборд" />
            <NavLink to="/shows" icon={Radio} label="Передачи" />
            <NavLink to="/podcasts" icon={Podcast} label="Подкасты" />
            <NavLink to="/hosts" icon={Users} label="Ведущие" />
            <NavLink to="/settings" icon={SettingsIcon} label="Настройки" />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/hosts" element={<Hosts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NavLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors"
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}

export default App;