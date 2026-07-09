import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define target directories
const UPLOADS_DIR = './uploads';
const folders = ['resumes', 'photos', 'logos', 'brochures', 'notifications'];

// Ensure directories exist
folders.forEach((folder) => {
  const dir = path.join(UPLOADS_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = UPLOADS_DIR;

    if (file.fieldname === 'resume') {
      dest = path.join(UPLOADS_DIR, 'resumes');
    } else if (file.fieldname === 'photo') {
      dest = path.join(UPLOADS_DIR, 'photos');
    } else if (file.fieldname === 'logo') {
      dest = path.join(UPLOADS_DIR, 'logos');
    } else if (file.fieldname === 'brochure') {
      dest = path.join(UPLOADS_DIR, 'brochures');
    } else if (file.fieldname === 'pdfNotification') {
      dest = path.join(UPLOADS_DIR, 'notifications');
    }

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Generate unique name: Fieldname-Timestamp-RandomNumber.Ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter validator
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedPdfTypes = /pdf/;

  const extname = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'resume' || file.fieldname === 'brochure' || file.fieldname === 'pdfNotification') {
    const isPdf = allowedPdfTypes.test(extname);
    if (isPdf) {
      return cb(null, true);
    } else {
      return cb(new Error('Only PDF files are allowed for resumes, brochures, and notifications!'), false);
    }
  } else if (file.fieldname === 'photo' || file.fieldname === 'logo') {
    const isImage = allowedImageTypes.test(extname) || allowedImageTypes.test(file.mimetype);
    if (isImage) {
      return cb(null, true);
    } else {
      return cb(new Error('Only images (JPEG, JPG, PNG, WEBP) are allowed!'), false);
    }
  }

  cb(new Error('Invalid field upload!'), false);
};

// Initialize multer upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
