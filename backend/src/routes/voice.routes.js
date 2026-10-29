import { Router } from 'express'
import multer from 'multer'
import {
  getVoiceHealth,
  chatVoice,
  processVoice,
  removeVoiceAudio,
} from '../controllers/voice.controller.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
})

router.get('/health', getVoiceHealth)
router.post('/chat', chatVoice)
router.post('/', upload.single('audio'), processVoice)
router.delete('/audio/:filename', removeVoiceAudio)

export default router
