const API_PREFIX = ''
const AUDIO_EXTENSIONS = {
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_PREFIX}${path}`, options)
  } catch {
    throw new Error('Cannot reach the FastAPI backend. Make sure uvicorn is running on port 8000.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = data?.detail
    throw new Error(typeof detail === 'string' ? detail : `Backend request failed (${response.status}).`)
  }
  return data
}

export function checkHealth() {
  return request('/api/health')
}

export function sendChat(text, language) {
  return request('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  })
}

export function sendVoice(audioBlob, language) {
  const mimeType = audioBlob.type.split(';', 1)[0].trim().toLowerCase()
  const extension = AUDIO_EXTENSIONS[mimeType]
  if (!extension) {
    throw new Error('Unsupported audio format. Use WAV, MP3, WebM, OGG, or M4A.')
  }
  const form = new FormData()
  form.append('language', language)
  form.append('audio', audioBlob, `recording.${extension}`)
  return request('/api/voice', { method: 'POST', body: form })
}
