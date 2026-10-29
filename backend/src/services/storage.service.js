import { cloudinary } from '../config/cloudinary.js'
import { config } from '../config/env.js'

export async function uploadImage(buffer, folder = 'shetimitra/detections') {
  if (!config.hasCloudinary) return { url: null, thumbnailUrl: null, publicId: null }

  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => {
        if (error) {
          console.warn('[Cloudinary] Upload failed, proceeding without cloud storage:', error.message)
          return resolve({ url: null, thumbnailUrl: null, publicId: null })
        }
        const thumbnailUrl = cloudinary.url(result.public_id, {
          width: 200, height: 200, crop: 'fill', quality: 'auto', fetch_format: 'auto',
        })
        resolve({ url: result.secure_url, thumbnailUrl, publicId: result.public_id })
      }
    )
    stream.end(buffer)
  })
}

export async function deleteImage(publicId) {
  if (!config.hasCloudinary || !publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.warn('[Cloudinary] Delete failed:', err.message)
  }
}
