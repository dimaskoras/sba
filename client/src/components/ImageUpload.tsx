
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
}

export default function ImageUpload({ currentImage, onImageChange, label = "Изображение" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "");
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Предварительная проверка типа файла на клиенте
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Ошибка",
        description: "Недопустимый формат файла. Разрешены только JPEG, PNG и WebP",
        variant: "destructive",
      });
      return;
    }

    // Проверка размера файла (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Файл слишком большой. Максимальный размер: 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки');
      }

      const data = await response.json();
      
      if (data.success) {
        setPreviewUrl(data.imagePath);
        onImageChange(data.imagePath);
        toast({
          title: "Успех",
          description: "Изображение успешно загружено",
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Очищаем input для возможности повторной загрузки того же файла
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageChange("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-24 object-cover rounded border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <Label htmlFor="image-upload" asChild>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Загрузка..." : "Выбрать файл"}
          </Button>
        </Label>
      </div>
      
      <p className="text-xs text-gray-500">
        Поддерживаемые форматы: JPEG, PNG, WebP. Максимальный размер: 10MB.
        <br />
        Изображение будет автоматически оптимизировано до размера 300×200px.
      </p>
    </div>
  );
}
