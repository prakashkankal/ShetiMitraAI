import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import {
  getVoiceAdvisory,
  transcribeVoiceAudio,
  generateSpeechAudio,
  deleteSpeechAudio,
  SUPPORTED_LANGUAGES,
} from '../services/voice.service.js'

export const getVoiceHealth = asyncHandler(async (_req, res) => {
  return res.json(
    new ApiResponse(200, 'Voice service healthy', {
      status: 'ok',
      service: 'ShetiMitra Voice Assistant (Node.js/Express)',
      speech_configured: true,
      supported_languages: SUPPORTED_LANGUAGES,
    })
  )
})

export const chatVoice = asyncHandler(async (req, res) => {
  const { text, language = 'en' } = req.body || {}
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new ApiError(400, 'Text prompt cannot be empty', 'EMPTY_TEXT')
  }

  const selectedLanguage = SUPPORTED_LANGUAGES[language] ? language : 'en'
  const reply = getVoiceAdvisory(text, selectedLanguage)

  return res.json(
    new ApiResponse(200, 'Advisory generated', {
      selected_language: selectedLanguage,
      assistant_reply: reply,
      status: 'completed',
    })
  )
})

export const processVoice = asyncHandler(async (req, res) => {
  const language = req.body?.language || 'en'
  if (!SUPPORTED_LANGUAGES[language]) {
    throw new ApiError(422, 'Language must be mr, hi, or en', 'INVALID_LANGUAGE')
  }

  if (!req.file) {
    throw new ApiError(400, 'Audio file is required', 'AUDIO_REQUIRED')
  }

  const transcribed = await transcribeVoiceAudio(req.file.buffer, language)
  const reply = getVoiceAdvisory(transcribed, language)
  const filename = await generateSpeechAudio(reply, language)

  return res.json(
    new ApiResponse(200, 'Voice processed', {
      selected_language: language,
      transcription: transcribed,
      assistant_reply: reply,
      audio_url: `/static/audio/${filename}`,
      status: 'completed',
    })
  )
})

export const removeVoiceAudio = asyncHandler(async (req, res) => {
  const { filename } = req.params
  const deleted = await deleteSpeechAudio(filename)
  if (!deleted) throw new ApiError(404, 'Audio file not found', 'NOT_FOUND')
  return res.json(new ApiResponse(200, 'Audio deleted', { status: 'deleted' }))
})

