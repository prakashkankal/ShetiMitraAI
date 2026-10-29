import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from './config/env.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import apiRouter from './routes/index.js'
import voiceRoutes from './routes/voice.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS – allow frontend origin with credentials
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// HTTP logging
if (!config.isProduction) app.use(morgan('dev'))
else app.use(morgan('combined'))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Serve static generated audio files
app.use('/static/audio', express.static(path.resolve(__dirname, '../public/audio')))

// General rate limiter
app.use(generalLimiter)

// Primary API routes
app.use('/api/v1', apiRouter)

// Direct compatibility routes for Voice Assistant module
app.use('/api/chat', (req, res, next) => {
  req.url = '/chat'
  voiceRoutes(req, res, next)
})
app.use('/api/voice', voiceRoutes)
app.use('/api/health', (req, res, next) => {
  req.url = '/health'
  voiceRoutes(req, res, next)
})

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`, code: 'NOT_FOUND' })
})

// Centralized error handler
app.use(errorMiddleware)

export default app
