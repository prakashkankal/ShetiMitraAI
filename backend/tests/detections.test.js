import request from 'supertest'
import { jest } from '@jest/globals'
import app from '../src/app.js'
import { Detection } from '../src/models/Detection.model.js'

describe('Detections API', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('POST /api/v1/detections', () => {
    it('should reject requests without cropType', async () => {
      const res = await request(app)
        .post('/api/v1/detections')
        .attach('image', Buffer.from('fake-image-bytes'), 'leaf.jpg')
      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('should reject requests without image', async () => {
      const res = await request(app)
        .post('/api/v1/detections')
        .field('cropType', 'tomato')
      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('should return 503 when AI key is unconfigured', async () => {
      const res = await request(app)
        .post('/api/v1/detections')
        .field('cropType', 'tomato')
        .attach('image', Buffer.from('fake-image-bytes'), 'leaf.jpg')

      expect(res.status).toBe(503)
      expect(res.body.data.available).toBe(false)
    })
  })

  describe('GET /api/v1/detections', () => {
    it('should return demo detections when unauthenticated', async () => {
      const mockDetections = [
        {
          _id: '507f1f77bcf86cd799439001',
          cropType: 'Tomato',
          diseaseName: 'Tomato Early Blight',
          confidence: 94,
          status: 'high',
          isDemo: true,
        },
      ]

      jest.spyOn(Detection, 'find').mockReturnValue({
        sort: () => ({
          skip: () => ({
            limit: () => ({
              lean: async () => mockDetections,
            }),
          }),
        }),
      })
      jest.spyOn(Detection, 'countDocuments').mockResolvedValue(1)

      const res = await request(app).get('/api/v1/detections')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.items.length).toBe(1)
    })
  })

  describe('GET /api/v1/detections/samples', () => {
    it('should return sample leaves for scanner', async () => {
      const mockSamples = [
        {
          _id: '507f1f77bcf86cd799439001',
          cropType: 'Tomato',
          sampleKey: 'sampleEarlyBlight',
          diseaseName: 'Tomato Early Blight',
          isDemo: true,
        },
      ]

      jest.spyOn(Detection, 'find').mockReturnValue({
        sort: () => ({
          lean: async () => mockSamples,
        }),
      })

      const res = await request(app).get('/api/v1/detections/samples')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe('DELETE /api/v1/detections/:id', () => {
    it('should require authentication', async () => {
      const res = await request(app).delete('/api/v1/detections/123')
      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
    })
  })
})
