
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUploader({ onImageUpload, currentImage, label = "Изображение" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл изображения",
        variant: "destructive",
      });
      return;
    }

    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      const data = await response.json();
      setPreviewUrl(data.url);
      onImageUpload(data.url);

      toast({
        title: "Успех",
        description: "Изображение успешно загружено",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Нажмите для выбора изображения</p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP до 5MB</p>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? 'Загрузка...' : 'Выбрать файл'}
      </Button>
    </div>
  );
}
