

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// If Cloudinary not configured, use local storage as fallback
const useLocalStorage = !process.env.CLOUDINARY_CLOUD_NAME;

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for local storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

// Upload function with fallback
export const uploadToCloudinary = async (filePath: string, folder: string = 'medicare'): Promise<string> => {
  try {
    if (useLocalStorage) {
      // Return relative path for local storage
      return `/uploads/${path.basename(filePath)}`;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);
    
    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    
    // Fallback to local storage
    if (fs.existsSync(filePath)) {
      return `/uploads/${path.basename(filePath)}`;
    }
    
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    if (fileUrl.includes('cloudinary.com') && !useLocalStorage) {
      const publicId = fileUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } else {
      // Delete local file
      const fileName = fileUrl.split('/').pop();
      const filePath = path.join(uploadDir, fileName || '');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error('Delete file error:', error);
  }
};

export default cloudinary;
