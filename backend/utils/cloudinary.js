import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary only if environment variables are set
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary successfully configured for file storage.');
} else {
  console.log('Cloudinary credentials missing. Falling back to local disk storage.');
}

/**
 * Upload a local file (saved by Multer) to Cloudinary and delete the local file.
 * If Cloudinary is not configured, it returns the local fallback path and leaves the file.
 * 
 * @param {Object} file - The file object from req.files[name][0]
 * @param {string} folder - The Cloudinary folder name (e.g., 'logos', 'resumes')
 * @param {string} fallbackPath - The local path to return if Cloudinary is not configured
 * @returns {Promise<string>} The Cloudinary secure URL, or the local fallback path
 */
export const uploadFileToCloud = async (file, folder, fallbackPath) => {
  if (!file) return '';

  if (!isCloudinaryConfigured) {
    return fallbackPath;
  }

  try {
    const isPdf = file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';
    
    const uploadOptions = {
      folder: `InstituteConnection/${folder}`,
      resource_type: resourceType,
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, uploadOptions);

    // Safely delete local file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${file.filename} to Cloudinary:`, error);
    // On failure, fallback to the local path and keep the file
    return fallbackPath;
  }
};
