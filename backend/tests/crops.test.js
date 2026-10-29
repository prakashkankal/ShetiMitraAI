import request from 'supertest'
import { jest } from '@jest/globals'
import app from '../src/app.js'
import { Crop } from '../src/models/Crop.model.js'

describe('Crops API', () => {
  const mockCrops = [
    {
      _id: '507f1f77bcf86cd799439011',
      slug: 'tomato-early-blight',
      crop: 'Tomato',
      name: 'Early Blight',
      scientificName: 'Alternaria solani',
      pathogenType: 'Fungal Pathogen',
      symptoms: ['Target spots'],
      cultural: ['Crop rotation'],
      chemical: ['Mancozeb'],
    },
    {
      _id: '507f1f77bcf86cd799439012',
      slug: 'cotton-pink-bollworm',
      crop: 'Cotton',
      name: 'Pink Bollworm',
      scientificName: 'Pectinophora gossypiella',
      pathogenType: 'Insect Pest',
      symptoms: ['Rosetted flowers'],
      cultural: ['Pheromone traps'],
      chemical: ['Emamectin Benzoate'],
    },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('GET /api/v1/crops should return all crops', async () => {
    jest.spyOn(Crop, 'find').mockReturnValue({
      sort: () => ({
        lean: async () => mockCrops,
      }),
    })

    const res = await request(app).get('/api/v1/crops')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(2)
  })

  it('GET /api/v1/crops?crop=tomato should filter', async () => {
    const tomatoCrops = mockCrops.filter((c) => c.crop === 'Tomato')
    jest.spyOn(Crop, 'find').mockReturnValue({
      sort: () => ({
        lean: async () => tomatoCrops,
      }),
    })

    const res = await request(app).get('/api/v1/crops?crop=tomato')
    expect(res.status).toBe(200)
    expect(res.body.data.every((c) => c.crop === 'Tomato')).toBe(true)
  })

  it('GET /api/v1/crops/:id should return single crop', async () => {
    jest.spyOn(Crop, 'findById').mockReturnValue({
      lean: async () => mockCrops[0],
    })

    const res = await request(app).get('/api/v1/crops/507f1f77bcf86cd799439011')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe('Early Blight')
  })

  it('GET /api/v1/crops/:id should return 404 for missing crop', async () => {
    jest.spyOn(Crop, 'findById').mockReturnValue({
      lean: async () => null,
    })

    const res = await request(app).get('/api/v1/crops/000000000000000000000000')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })
})
