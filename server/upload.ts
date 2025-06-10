
import { Client } from 'replit-object-storage';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

const client = new Client();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function uploadImage(buffer: Buffer, originalName: string): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(originalName).toLowerCase();
    const filename = `images/${timestamp}-${Math.random().toString(36).substring(7)}${ext}`;

    // Optimize image
    let optimizedBuffer: Buffer;
    if (ext === '.gif') {
      // Don't process GIFs to preserve animation
      optimizedBuffer = buffer;
    } else {
      optimizedBuffer = await sharp(buffer)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    // Upload to Object Storage
    await client.uploadFromBytes(filename, optimizedBuffer);
    
    // Return the URL
    return `/api/images/${filename}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function getImage(filename: string): Promise<Buffer> {
  try {
    return await client.downloadAsBytes(filename);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Image not found');
  }
}

export { upload };
