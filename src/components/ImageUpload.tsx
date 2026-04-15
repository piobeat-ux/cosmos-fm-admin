import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валидация
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, загрузите изображение');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setUploading(true);
    
    // Создаём FormData для загрузки
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Загрузка на сервер (нужно добавить endpoint на бэкенде)
      const response = await fetch('https://cosmosfm-production.up.railway.app/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setPreview(data.url);
      onChange(data.url);
    } catch (error) {
      // Fallback: base64 для демо
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onChange(base64);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {preview ? (
        <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => {
              setPreview('');
              onChange('');
            }}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-gray-50 transition-colors"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Нажмите для загрузки</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG до 5MB</span>
            </>
          )}
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}