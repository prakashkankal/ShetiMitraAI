import 'dotenv/config'

function requireEnv(key) {
  const val = process.env[key]
  if (!val && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return val || ''
}

function optionalEnv(key, fallback = '') {
  return process.env[key] || fallback
}

export const config = Object.freeze({
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  PORT: parseInt(optionalEnv('PORT', '5000'), 10),
  FRONTEND_URL: optionalEnv('FRONTEND_URL', 'http://localhost:5173'),

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shetimitra',
  JWT_SECRET: process.env.JWT_SECRET || 'shetimitra-dev-jwt-secret-min-32-chars-long!',
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),

  CLOUDINARY_CLOUD_NAME: optionalEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: optionalEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: optionalEnv('CLOUDINARY_API_SECRET'),

  WEATHER_API_KEY: optionalEnv('WEATHER_API_KEY'),

  AI_PROVIDER: optionalEnv('AI_PROVIDER', 'gemini'),
  AI_API_KEY: optionalEnv('AI_API_KEY'),
  AI_MODEL: optionalEnv('AI_MODEL', 'gemini-1.5-flash'),

  get isProduction() { return this.NODE_ENV === 'production' },
  get hasCloudinary() {
    return !!(this.CLOUDINARY_CLOUD_NAME && this.CLOUDINARY_API_KEY && this.CLOUDINARY_API_SECRET)
  },
  get hasWeatherKey() { return !!this.WEATHER_API_KEY },
  get hasAiKey() { return !!this.AI_API_KEY },
})
