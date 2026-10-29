import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/User.model.js'

export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) throw new ApiError(401, 'Authentication required', 'NOT_AUTHENTICATED')

  const decoded = jwt.verify(token, config.JWT_SECRET)
  const user = await User.findById(decoded.id).select('-passwordHash')
  if (!user) throw new ApiError(401, 'User no longer exists', 'USER_NOT_FOUND')

  req.user = user
  next()
})

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-passwordHash')
      if (user) req.user = user
    } catch {
      // Token invalid – continue as anonymous
    }
  }

  next()
})
