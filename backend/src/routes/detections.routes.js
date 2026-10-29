import { Router } from 'express'
import {
  createDetection,
  listDetections,
  getDetection,
  deleteDetection,
  getSampleDetections,
} from '../controllers/detections.controller.js'
import { protect, optionalAuth } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'
import { detectionLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/samples', getSampleDetections)
router.post('/', detectionLimiter, optionalAuth, upload.single('image'), createDetection)
router.get('/', optionalAuth, listDetections)
router.get('/:id', protect, getDetection)
router.delete('/:id', protect, deleteDetection)

export default router
