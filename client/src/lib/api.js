/**
 * ShetiMitra AI – Frontend API client
 * Wraps fetch with base URL, credentials, JSON parsing, and error normalization.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        ...options.headers,
      },
      ...options,
    })

    let data
    try {
      data = await response.json()
    } catch {
      data = { success: false, message: 'Server returned non-JSON response' }
    }

    if (!response.ok) {
      const err = new Error(data.message || `HTTP ${response.status}`)
      err.code = data.code || 'HTTP_ERROR'
      err.statusCode = response.status
      throw err
    }

    return data
  }

  get(path, params) {
    const url = params
      ? `${path}?${new URLSearchParams(params).toString()}`
      : path
    return this.request(url, { method: 'GET' })
  }

  post(path, body) {
    return this.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  postFormData(path, formData) {
    return this.request(path, {
      method: 'POST',
      body: formData, // no Content-Type header – browser sets multipart boundary
    })
  }

  patch(path, body) {
    return this.request(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  delete(path) {
    return this.request(path, { method: 'DELETE' })
  }
}

const api = new ApiClient(BASE_URL)

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function apiRegister(name, email, password, preferredLanguage = 'en') {
  return api.post('/auth/register', { name, email, password, preferredLanguage })
}

export async function apiLogin(email, password) {
  return api.post('/auth/login', { email, password })
}

export async function apiLogout() {
  return api.post('/auth/logout', {})
}

export async function apiGetMe() {
  return api.get('/auth/me')
}

// ── Detections ────────────────────────────────────────────────────────────────

/**
 * Submit an image file for AI disease detection.
 * @param {File|Blob} imageFile
 * @param {string} cropType
 * @param {string} selectedLanguage
 */
export async function apiCreateDetection(imageFile, cropType, selectedLanguage = 'en') {
  const form = new FormData()
  form.append('image', imageFile)
  form.append('cropType', cropType)
  form.append('selectedLanguage', selectedLanguage)
  return api.postFormData('/detections', form)
}

export async function apiListDetections(page = 1, limit = 20) {
  return api.get('/detections', { page, limit })
}

export async function apiGetSampleDetections() {
  return api.get('/detections/samples')
}

export async function apiGetDetection(id) {
  return api.get(`/detections/${id}`)
}

export async function apiDeleteDetection(id) {
  return api.delete(`/detections/${id}`)
}

// ── Crops / Disease DB ────────────────────────────────────────────────────────

export async function apiListCrops(cropFilter) {
  return api.get('/crops', cropFilter ? { crop: cropFilter } : undefined)
}

export async function apiGetCrop(id) {
  return api.get(`/crops/${id}`)
}

// ── Weather ───────────────────────────────────────────────────────────────────

export async function apiGetWeather(location = 'Pune') {
  return api.get('/weather', { location })
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function apiHealthCheck() {
  return api.get('/health')
}

export default api
