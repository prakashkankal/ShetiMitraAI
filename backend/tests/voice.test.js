import request from 'supertest'
import app from '../src/app.js'

describe('Voice Assistant Module API', () => {
  it('GET /api/v1/voice/health returns service status and supported languages', async () => {
    const res = await request(app).get('/api/v1/voice/health')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.status).toBe('ok')
    expect(res.body.data.supported_languages).toHaveProperty('mr')
    expect(res.body.data.supported_languages).toHaveProperty('hi')
    expect(res.body.data.supported_languages).toHaveProperty('en')
  })

  it('POST /api/v1/voice/chat generates agricultural guidance in Marathi', async () => {
    const res = await request(app)
      .post('/api/v1/voice/chat')
      .send({ text: 'टोमॅटोच्या पानांवर करपा रोग झाला आहे', language: 'mr' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.selected_language).toBe('mr')
    expect(res.body.data.assistant_reply).toContain('DEMO')
  })

  it('POST /api/v1/voice/chat rejects empty queries', async () => {
    const res = await request(app).post('/api/v1/voice/chat').send({ text: '', language: 'en' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('GET /api/health compatibility route functions correctly', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
  })
})
