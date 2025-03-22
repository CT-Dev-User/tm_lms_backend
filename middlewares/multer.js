// middlewares/multer.js
import multer from 'multer';
import { v4 as uuid } from 'uuid';

// Temporary storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const id = uuid();
    const extName = file.originalname.split('.').pop();
    cb(null, `${id}.${extName}`);
  },
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (.jpg, .jpeg, .png) and videos (.mp4) allowed'), false);
  }
};

// Export multer middleware
export const uploadFiles = multer({ storage, fileFilter }).single('file');