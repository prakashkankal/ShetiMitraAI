import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { registerSchema, loginSchema } from '../validators/auth.validator.js'
import { config } from '../config/env.js'

function signToken(userId) {
  return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN })
}

function sendTokenResponse(res, user, statusCode = 200) {
  const token = signToken(user._id)
  const cookieOptions = {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  res.cookie('token', token, cookieOptions)
  return res.status(statusCode).json(new ApiResponse(statusCode, 'Success', { token, user }))
}

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message, 'VALIDATION_ERROR')
  }

  const { name, email, password, preferredLanguage } = parsed.data
  const existing = await User.findOne({ email })
  if (existing) throw new ApiError(409, 'Email already registered', 'EMAIL_EXISTS')

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, passwordHash, preferredLanguage: preferredLanguage || 'en' })

  return sendTokenResponse(res, user, 201)
})

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message, 'VALIDATION_ERROR')
  }

  const { email, password } = parsed.data
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user) throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS')

  const isValid = await user.comparePassword(password)
  if (!isValid) throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS')

  return sendTokenResponse(res, user)
})

export const getMe = asyncHandler(async (req, res) => {
  return res.json(new ApiResponse(200, 'User profile', req.user))
})

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
  return res.json(new ApiResponse(200, 'Logged out successfully'))
})
