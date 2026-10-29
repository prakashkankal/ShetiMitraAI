import { config } from '../config/env.js'

// Simple in-memory cache (5 minute TTL)
const cache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000

function calculateDiseaseRisk(temp, humidity) {
  // Early Blight risk: temp 22-28°C, humidity > 80%
  if (temp >= 22 && temp <= 28 && humidity > 80) {
    return { level: 'High', disease: 'Early Blight (Alternaria solani)', severity: 'High', percentage: 85 }
  }
  // Late Blight risk: temp 15-22°C, humidity > 85%
  if (temp >= 15 && temp <= 22 && humidity > 85) {
    return { level: 'High', disease: 'Late Blight (Phytophthora infestans)', severity: 'High', percentage: 90 }
  }
  // Moderate risk
  if (humidity > 75) {
    return { level: 'Moderate', disease: 'Early Blight (Alternaria solani)', severity: 'Medium', percentage: 68 }
  }
  return { level: 'Low', disease: null, severity: 'Low', percentage: 15 }
}

export async function getWeatherData(location = 'Pune') {
  const cacheKey = location.toLowerCase().trim()
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data
  }

  if (!config.hasWeatherKey) {
    return {
      available: false,
      reason: 'WEATHER_KEY_NOT_CONFIGURED',
      location,
    }
  }

  try {
    const { default: fetch } = await import('node-fetch')
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${config.WEATHER_API_KEY}&units=metric`
    const res = await fetch(url)

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || `Weather API ${res.status}`)
    }

    const raw = await res.json()
    const temp = Math.round(raw.main.temp)
    const humidity = raw.main.humidity
    const risk = calculateDiseaseRisk(temp, humidity)

    const data = {
      available: true,
      location: `${raw.name}, ${raw.sys.country}`,
      temperature: temp,
      feelsLike: Math.round(raw.main.feels_like),
      humidity,
      windSpeed: Math.round(raw.wind.speed * 3.6), // m/s to km/h
      rainfall: raw.rain?.['1h'] || 0,
      condition: raw.weather?.[0]?.description || '',
      diseaseRisk: risk,
      updatedAt: new Date().toISOString(),
    }

    cache.set(cacheKey, { data, fetchedAt: Date.now() })
    return data
  } catch (err) {
    console.error('[Weather] Fetch failed:', err.message)
    return { available: false, reason: 'WEATHER_FETCH_FAILED', error: err.message, location }
  }
}
