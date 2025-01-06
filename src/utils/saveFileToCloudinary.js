// src/utils/saveFileToCloudinary.js

import cloudinary from 'cloudinary';
import fs from 'fs/promises'; 
import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.v2.uploader.upload(file.path);

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Failed to delete file:', err.message);
      } else {
        console.log('File deleted successfully');
      }
    });

    return response.secure_url;
  } catch {
    throw createHttpError(500, 'Failed to upload image to Cloudinary');
  }
};