import { useState, useEffect } from 'react';
import { settingsApi } from '../api/client';
import { Save, Globe, Mail, Phone, MapPin, Radio } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Cosmos FM',
    siteDescription: 'Официальное радио отеля Cosmos Moscow',
    streamUrl: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    social: {
      vk: '',
      telegram: '',
      mave: '',
    },
    seo: {
      title: 'Cosmos FM — Радио отеля Cosmos',
      description: 'Слушайте любимые шоу, подкасты и музыку 24/7',
      keywords: 'радио, отель, cosmos, музыка, подкасты',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await settingsApi.get();
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({
          ...prev,
          ...data,
          social: { ...prev.social, ...(data.social || {}) },
          seo: { ...prev.seo, ...(data.seo || {}) },
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await settingsApi.update(settings);
      setMessage({ type: 'success', text: 'Настройки сохранены!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setMessage({ type: 'error', text: 'Ошибка при сохранении' });
    } finally {
      setSaving(false);
    }
  };

  const updateSocial = (key: string, value: string) => {
    setSettings({
      ...settings,
      social: { ...settings.social, [key]: value },
    });
  };

  const updateSeo = (key: string, value: string) => {
    setSettings({
      ...settings,
      seo: { ...settings.seo, [key]: value },
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-gray-500">Загрузка настроек...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Radio className="w-8 h-8 text-blue-500" />
          Настройки сайта
        </h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Сохранение...' : 'Сохранить все'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основные настройки */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Основные настройки
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Название сайта</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание сайта</label>
              <textarea
                value={settings.siteDescription}
                onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL потока радио</label>
              <input
                type="text"
                value={settings.streamUrl || ''}
                onChange={e => setSettings({ ...settings, streamUrl: e.target.value })}
                placeholder="https://stream.example.com/radio"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Контакты */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-500" />
            Контактная информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" /> Email
              </label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="info@cosmosfm.ru"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" /> Телефон
              </label>
              <input
                type="text"
                value={settings.contactPhone || ''}
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+7 (495) 123-45-67"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" /> Адрес
              </label>
              <input
                type="text"
                value={settings.contactAddress || ''}
                onChange={e => setSettings({ ...settings, contactAddress: e.target.value })}
                placeholder="г. Москва, пр. Мира, 150"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Социальные сети */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Социальные сети и платформы</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🔵 ВКонтакте (VK)
              </label>
              <input
                type="text"
                value={settings.social?.vk || ''}
                onChange={e => updateSocial('vk', e.target.value)}
                placeholder="https://vk.com/cosmosfm"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💬 Telegram
              </label>
              <input
                type="text"
                value={settings.social?.telegram || ''}
                onChange={e => updateSocial('telegram', e.target.value)}
                placeholder="https://t.me/cosmosfm"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🎧 Mave (MAXX)
              </label>
              <input
                type="text"
                value={settings.social?.mave || ''}
                onChange={e => updateSocial('mave', e.target.value)}
                placeholder="https://mave.digital/@cosmosfm"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">SEO настройки</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (заголовок)</label>
              <input
                type="text"
                value={settings.seo?.title || ''}
                onChange={e => updateSeo('title', e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (описание)</label>
              <textarea
                value={settings.seo?.description || ''}
                onChange={e => updateSeo('description', e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (ключевые слова)</label>
              <input
                type="text"
                value={settings.seo?.keywords || ''}
                onChange={e => updateSeo('keywords', e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-lg"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Сохранение...' : 'Сохранить все настройки'}
          </button>
        </div>
      </form>
    </div>
  );
}