import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sure cb is called with null for error and the directory path
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Ensure a unique file name
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  }
});

// Exporting the upload middleware with the storage configuration
export const upload = multer({ storage });
