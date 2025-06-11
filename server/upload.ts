
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

// Создаем папку для изображений если её нет
const uploadDir = path.join(process.cwd(), 'photosran');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка multer для загрузки в память
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB максимум
  },
  fileFilter: (req, file, cb) => {
    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый формат файла. Разрешены только JPEG, PNG и WebP'));
    }
  }
});

// Функция для обработки и сохранения изображения
export async function processAndSaveImage(buffer: Buffer, originalName: string): Promise<string> {
  try {
    // Генерируем уникальное имя файла
    const fileExtension = path.extname(originalName).toLowerCase() || '.jpg';
    const filename = `${uuidv4()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    // Обрабатываем изображение с помощью Sharp
    await sharp(buffer)
      .resize(300, 200, {
        fit: 'cover', // Обрезаем с сохранением пропорций
        position: 'center'
      })
      .jpeg({ quality: 85 }) // Конвертируем в JPEG с качеством 85%
      .toFile(filepath);

    // Возвращаем путь к файлу для сохранения в БД
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Ошибка при обработке изображения:', error);
    throw new Error('Не удалось обработать изображение');
  }
}

// Middleware для загрузки одного файла
export const uploadSingle = upload.single('image');

// Обработчик загрузки изображения
export async function handleImageUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    const imagePath = await processAndSaveImage(req.file.buffer, req.file.originalname);
    
    res.json({ 
      success: true, 
      imagePath,
      message: 'Изображение успешно загружено и обработано'
    });
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Файл слишком большой. Максимальный размер: 10MB' });
      }
    }
    
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Ошибка при загрузке изображения'
    });
  }
}
