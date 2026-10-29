import { Router } from 'express'
import authRoutes from './auth.routes.js'
import detectionRoutes from './detections.routes.js'
import cropRoutes from './crops.routes.js'
import weatherRoutes from './weather.routes.js'
import voiceRoutes from './voice.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

router.use('/auth', authRoutes)
router.use('/detections', detectionRoutes)
router.use('/crops', cropRoutes)
router.use('/weather', weatherRoutes)
router.use('/voice', voiceRoutes)

export default router
