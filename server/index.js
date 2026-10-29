/**
 * Express.js entry point for the ShetiMitra Voice Assistant module.
 * Converted from Python FastAPI to Node.js / Express.js.
 */

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import { getAdvisory } from './advisoryService.js'
import {
  SpeechService,
  SUPPORTED_LANGUAGES,
  SUPPORTED_AUDIO_EXTENSIONS,
  SUPPORTED_AUDIO_MIME_TYPES,
} from './speechService.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUDIO_DIR = path.resolve(__dirname, 'generated_audio')

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true })
}

const app = express()
const PORT = process.env.PORT || 8000
const speech = new SpeechService(AUDIO_DIR)

// CORS setup
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origins.includes(origin)) {
        callback(null, true)
      } else {
        callback(null, true) // Allow during development
      }
    },
    credentials: false,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static audio files serving
app.use('/static/audio', express.static(AUDIO_DIR))

// Multer memory storage for audio uploads (up to 25 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
})

// ── GET /api/health ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ShetiMitra Voice Assistant (Node.js/Express)',
    speech_configured: speech.configured,
    whisper_available: true,
    gtts_available: speech.ttsAvailable,
    ffmpeg_available: true,
    supported_languages: SUPPORTED_LANGUAGES,
  })
})

// ── POST /api/chat ──────────────────────────────────────────────────────────
app.post('/api/chat', (req, res) => {
  const { text, language = 'en' } = req.body || {}

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ detail: 'Text prompt cannot be empty.' })
  }

  const selectedLang = SUPPORTED_LANGUAGES[language] ? language : 'en'
  const reply = getAdvisory(text, selectedLang)

  res.json({
    selected_language: selectedLang,
    assistant_reply: reply,
    status: 'completed',
  })
})

// ── POST /api/voice ─────────────────────────────────────────────────────────
app.post('/api/voice', upload.single('audio'), async (req, res) => {
  const language = req.body?.language || 'en'

  if (!SUPPORTED_LANGUAGES[language]) {
    return res.status(422).json({ detail: 'Language must be mr, hi, or en.' })
  }

  if (!req.file) {
    return res.status(400).json({ detail: 'An audio file is required.' })
  }

  const ext = path.extname(req.file.originalname || '').toLowerCase()
  const mime = (req.file.mimetype || '').split(';')[0].trim().toLowerCase()

  const validExt = SUPPORTED_AUDIO_EXTENSIONS.includes(ext) || ext === ''
  const validMime = Object.values(SUPPORTED_AUDIO_MIME_TYPES).flat().includes(mime)

  if (!validExt && !validMime) {
    return res.status(415).json({
      detail: 'Unsupported audio format. Use WAV, MP3, WebM, OGG, or M4A.',
    })
  }

  try {
    const recognized = await speech.transcribe(req.file.buffer, language, req.file.originalname)
    const reply = getAdvisory(recognized, language)
    const filename = await speech.generateSpeech(reply, language)

    return res.json({
      selected_language: language,
      transcription: recognized,
      assistant_reply: reply,
      audio_url: `/static/audio/${filename}`,
      status: 'completed',
    })
  } catch (err) {
    console.error('[Voice Assistant] Processing error:', err.message)
    return res.status(503).json({ detail: err.message || 'Voice processing unavailable.' })
  }
})

// ── DELETE /api/audio/:filename ─────────────────────────────────────────────
app.delete('/api/audio/:filename', async (req, res) => {
  const { filename } = req.params
  try {
    const deleted = await speech.deleteAudio(filename)
    if (!deleted) {
      return res.status(404).json({ detail: 'Audio file not found.' })
    }
    return res.json({ status: 'deleted' })
  } catch (err) {
    return res.status(400).json({ detail: err.message || 'Invalid audio filename.' })
  }
})

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[ShetiMitra Voice Assistant] Express server running at http://localhost:${PORT}`)
  })
}

export default app
