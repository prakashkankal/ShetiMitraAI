import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from './config/env.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import apiRouter from './routes/index.js'

const app = express()

// Security headers
app.use(helmet())

// CORS – allow frontend origin with credentials
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// HTTP logging
if (!config.isProduction) app.use(morgan('dev'))
else app.use(morgan('combined'))

// Body parsing
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// General rate limiter
app.use(generalLimiter)

// API routes
app.use('/api/v1', apiRouter)

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`, code: 'NOT_FOUND' })
})

// Centralized error handler
app.use(errorMiddleware)

export default app
