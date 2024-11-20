import multer from 'multer';
import path from 'path';
import cloudinary from "./cloudinaryConfig.js";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'acetrack', // Folder name on Cloudinary
    public_id: (req, file) => {
      // Create custom file name, without file extension (Cloudinary handles the extension)
      const timestamp = Date.now();
      const fileName = `${timestamp}_${path.parse(file.originalname).name}`;
      return fileName;
    },
    allowed_formats: ['jpg', 'jpeg', 'png'], // Only allow these formats
  },
});

// Create multer instance with the storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    // Allow only jpeg, jpg, and png file types
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true); // File is valid
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed!')); // Reject the file
    }
  }
});
export default upload;
