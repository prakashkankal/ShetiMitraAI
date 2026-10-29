import { v2 as cloudinary } from 'cloudinary'
import { config } from './env.js'

if (config.hasCloudinary) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
  })
  console.log('[Cloudinary] Configured')
} else {
  console.warn('[Cloudinary] Credentials not set – image uploads will be skipped')
}

export { cloudinary }
