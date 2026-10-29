import request from 'supertest'
import app from '../src/app.js'

describe('GET /api/v1/health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/api/v1/health')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.status).toBe('ok')
    expect(res.body).toHaveProperty('timestamp')
    expect(res.body).toHaveProperty('version')
  })

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })
})
