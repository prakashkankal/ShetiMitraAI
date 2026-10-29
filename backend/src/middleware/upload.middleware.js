import multer from 'multer'
import { ApiError } from '../utils/ApiError.js'

const storage = multer.memoryStorage()

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ApiError(415, 'Only JPEG, PNG, and WebP images are allowed', 'INVALID_FILE_TYPE'))
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
})
