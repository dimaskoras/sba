
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

// Убедимся, что папка существует
const uploadDir = 'photosran';

// Настройка multer для временного хранения
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены'));
    }
  },
});

export const uploadImage = upload.single('image');

export async function processAndSaveImage(buffer: Buffer, originalName: string): Promise<string> {
  try {
    // Убедимся, что папка существует
    await fs.mkdir(uploadDir, { recursive: true });

    // Генерируем уникальное имя файла
    const fileExtension = path.extname(originalName).toLowerCase() || '.jpg';
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Оптимизируем изображение с помощью Sharp
    await sharp(buffer)
      .resize(400, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(filePath);

    // Возвращаем URL для доступа к изображению
    return `/images/${fileName}`;
  } catch (error) {
    console.error('Ошибка обработки изображения:', error);
    throw new Error('Не удалось обработать изображение');
  }
}
