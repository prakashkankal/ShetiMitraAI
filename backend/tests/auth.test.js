import request from 'supertest'
import { jest } from '@jest/globals'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { User } from '../src/models/User.model.js'
import { config } from '../src/config/env.js'

describe('Auth API', () => {
  const validUser = {
    name: 'Test Farmer',
    email: 'farmer@test.com',
    password: 'password123',
  }

  const mockDbUser = {
    _id: '507f1f77bcf86cd799439099',
    name: 'Test Farmer',
    email: 'farmer@test.com',
    preferredLanguage: 'en',
    role: 'user',
    comparePassword: async (pwd) => pwd === 'password123',
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null)
      jest.spyOn(User, 'create').mockResolvedValue(mockDbUser)

      const res = await request(app).post('/api/v1/auth/register').send(validUser)
      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.user.email).toBe(validUser.email)
      expect(res.body.data.token).toBeDefined()
    })

    it('should reject duplicate email', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(mockDbUser)

      const res = await request(app).post('/api/v1/auth/register').send(validUser)
      expect(res.status).toBe(409)
      expect(res.body.success).toBe(false)
    })

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, password: '123' })
      expect(res.status).toBe(400)
    })

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, email: 'not-an-email' })
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      jest.spyOn(User, 'findOne').mockReturnValue({
        select: async () => mockDbUser,
      })

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: validUser.password })
      expect(res.status).toBe(200)
      expect(res.body.data.token).toBeDefined()
    })

    it('should reject wrong password', async () => {
      jest.spyOn(User, 'findOne').mockReturnValue({
        select: async () => mockDbUser,
      })

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' })
      expect(res.status).toBe(401)
    })

    it('should reject non-existent email', async () => {
      jest.spyOn(User, 'findOne').mockReturnValue({
        select: async () => null,
      })

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'ghost@test.com', password: 'password123' })
      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/v1/auth/me', () => {
    it('should return user for valid token', async () => {
      const token = jwt.sign({ id: mockDbUser._id }, config.JWT_SECRET || 'test_secret')
      jest.spyOn(User, 'findById').mockReturnValue({
        select: async () => mockDbUser,
      })

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.email).toBe(validUser.email)
    })

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/v1/auth/me')
      expect(res.status).toBe(401)
    })
  })
})
