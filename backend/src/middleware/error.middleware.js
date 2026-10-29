import { ApiError } from '../utils/ApiError.js'
import { config } from '../config/env.js'

// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
      code: 'VALIDATION_ERROR',
    })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      code: 'DUPLICATE_ERROR',
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token', code: 'INVALID_TOKEN' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' })
  }

  // Operational API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    })
  }

  // Unknown errors – hide details in production
  console.error('[Error]', err)
  return res.status(500).json({
    success: false,
    message: config.isProduction ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
    ...(config.isProduction ? {} : { stack: err.stack }),
  })
}
