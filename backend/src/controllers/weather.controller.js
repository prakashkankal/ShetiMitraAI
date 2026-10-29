import { getWeatherData } from '../services/weather.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getWeather = asyncHandler(async (req, res) => {
  const location = (req.query.location || 'Pune').trim()
  const data = await getWeatherData(location)

  if (!data.available) {
    return res.status(503).json(new ApiResponse(503, 'Weather service unavailable', data))
  }

  return res.json(new ApiResponse(200, 'Weather data retrieved', data))
})
