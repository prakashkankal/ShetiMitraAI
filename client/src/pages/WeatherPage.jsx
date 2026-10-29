import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'
import { apiGetWeather } from '../lib/api.js'
import backImg from '../../../img/backimg.png'
import './WeatherPage.css'

const forecast = [
  { day: 'Today', date: 'Oct 29', icon: 'weather', high: '28°', low: '18°', rain: '0%' },
  { day: 'Thu', date: 'Oct 30', icon: 'sun', high: '30°', low: '19°', rain: '0%' },
  { day: 'Fri', date: 'Oct 31', icon: 'rain', high: '27°', low: '17°', rain: '60%' },
  { day: 'Sat', date: 'Nov 1', icon: 'cloud', high: '26°', low: '16°', rain: '40%' },
  { day: 'Sun', date: 'Nov 2', icon: 'sun', high: '29°', low: '18°', rain: '10%' },
  { day: 'Mon', date: 'Nov 3', icon: 'sun', high: '31°', low: '19°', rain: '0%' },
  { day: 'Tue', date: 'Nov 4', icon: 'cloud', high: '28°', low: '18°', rain: '30%' },
]

function WeatherIcon({ type, size = 27 }) {
  if (type === 'sun') {
    return <span className="wp-sun-icon" style={{ fontSize: size }} aria-hidden="true">☀</span>
  }
  if (type === 'rain') {
    return <span className="wp-rain-icon" style={{ fontSize: size }} aria-hidden="true">🌧</span>
  }
  return <Icon name={type === 'cloud' ? 'cloud' : 'weather'} size={size} />
}

// Static fallback data used when the weather API is not configured
const STATIC_WEATHER = {
  temperature: 28,
  feelsLike: 31,
  humidity: 78,
  windSpeed: 8,
  rainfall: 0,
  condition: 'Partly Cloudy',
  diseaseRisk: {
    level: 'Moderate',
    disease: 'Early Blight (Alternaria solani)',
    severity: 'Medium',
    percentage: 68,
  },
}

export default function WeatherPage() {
  const t = useTranslation()
  const { language } = useLanguage()

  const [location, setLocation] = useState('Pune, Maharashtra')
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationInput, setLocationInput] = useState(location)
  const [liveWeather, setLiveWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherUnavailable, setWeatherUnavailable] = useState(false)

  const fetchWeather = useCallback(async (loc) => {
    setWeatherLoading(true)
    try {
      const res = await apiGetWeather(loc)
      if (res.data?.available === false) {
        setWeatherUnavailable(true)
        setLiveWeather(null)
      } else {
        setLiveWeather(res.data)
        setWeatherUnavailable(false)
      }
    } catch {
      setWeatherUnavailable(true)
      setLiveWeather(null)
    } finally {
      setWeatherLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather(location)
  }, [location, fetchWeather])

  // Resolved values: live data if available, otherwise static fallback
  const weather = liveWeather || STATIC_WEATHER
  const risk = weather.diseaseRisk || STATIC_WEATHER.diseaseRisk
  const updatedLabel = liveWeather
    ? new Date(liveWeather.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '10:24 AM'

  function saveLocation(event) {
    event.preventDefault()
    const nextLocation = locationInput.trim()
    if (nextLocation) setLocation(nextLocation)
    setEditingLocation(false)
  }

  return (
    <div className="wp-view">
      <section
        className="wp-banner"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(14, 46, 31, 0.92) 0%, rgba(14, 46, 31, 0.72) 55%, rgba(14, 46, 31, 0.25) 100%), url(${backImg})`,
        }}
      >
        <div className="wp-banner-copy">
          <span className="wp-eyebrow">AGRO-METEOROLOGICAL INTELLIGENCE</span>
          <h1>{t('weatherCard')}</h1>
          <p>{t('weatherDesc')}</p>
        </div>

          <div className="wp-location-card">
          <span className="wp-location-pin">⌖</span>
          {editingLocation ? (
            <form className="wp-location-form" onSubmit={saveLocation}>
              <input
                aria-label="Location"
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
                autoFocus
              />
              <button type="submit">Save</button>
            </form>
          ) : (
            <>
              <strong>{liveWeather ? liveWeather.location : location}</strong>
              <button
                type="button"
                className="wp-change-location"
                onClick={() => {
                  setLocationInput(location)
                  setEditingLocation(true)
                }}
              >
                Change Location
              </button>
            </>
          )}
          {weatherLoading && <span style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '0.5rem' }}>Updating…</span>}
          {weatherUnavailable && !weatherLoading && (
            <span style={{ fontSize: '0.75rem', opacity: 0.65, marginLeft: '0.5rem' }}>
              (Static data – weather API not configured)
            </span>
          )}
        </div>
      </section>

      <div className="wp-top-row">
        <section className="wp-card wp-current-card">
          <div className="wp-card-heading">
            <span className="wp-card-icon weather">
              <Icon name="weather" size={20} />
            </span>
            <div>
              <h2>Current Field Conditions</h2>
              <p>{liveWeather ? liveWeather.location : location} <span>·</span> Updated {updatedLabel}</p>
            </div>
          </div>

          <div className="wp-current-grid">
            <div className="wp-current-data">
              <div className="wp-current-temp">
                <WeatherIcon type="weather" size={36} />
                <strong>{weather.temperature}°C</strong>
              </div>
              <p className="wp-current-condition">{weather.condition} • {risk.level} Spores Risk</p>
              <div className="wp-weather-details">
                <div><span><span className="wp-metric-dot humidity">●</span> Humidity</span><strong>{weather.humidity}%</strong></div>
                <div><span><span className="wp-metric-dot wind">●</span> Wind</span><strong>{weather.windSpeed} km/h</strong></div>
                <div><span><span className="wp-metric-dot rain">●</span> Rainfall</span><strong>{weather.rainfall} mm</strong></div>
                <div><span><span className="wp-metric-dot feels">●</span> Feels Like</span><strong>{weather.feelsLike}°C</strong></div>
              </div>
            </div>

            <div className="wp-crop-status">
              <span className="wp-status-icon"><Icon name="sprout" size={22} /></span>
              <span className="wp-status-label">DISEASE RISK INDEX</span>
              <strong>{risk.level} {risk.disease ? 'Blight Threat' : 'Risk'}</strong>
              <p>
                {risk.disease
                  ? `Relative humidity >${weather.humidity > 75 ? '75' : '70'}% with ${weather.temperature}°C temperatures increases foliar fungal sporulation in ${risk.disease.includes('Cotton') ? 'cotton' : 'tomato'} crops.`
                  : 'Current weather conditions are favourable for healthy crop growth.'}
              </p>
              {risk.disease && (
                <div className="wp-status-indicator"><span /> {risk.disease.split('(')[0].trim()} risk active</div>
              )}
            </div>
          </div>
        </section>

        <section className="wp-card wp-forecast-card">
          <div className="wp-card-heading">
            <span className="wp-card-icon forecast"><Icon name="history" size={19} /></span>
            <div>
              <h2>7-Day Agricultural Forecast</h2>
              <p>Plan spraying and irrigation rounds ahead</p>
            </div>
          </div>
          <div className="wp-forecast-grid">
            {forecast.map((day) => (
              <div className="wp-forecast-day" key={day.day}>
                <strong>{day.day}</strong>
                <span className="wp-forecast-date">{day.date}</span>
                <span className={`wp-forecast-icon ${day.icon}`}><WeatherIcon type={day.icon} /></span>
                <span className="wp-forecast-temp"><b>{day.high}</b><span>{day.low}</span></span>
                <span className="wp-forecast-rain"><span>↓</span> {day.rain}</span>
              </div>
            ))}
          </div>
          <div className="wp-forecast-legend">
            <span>Daily high</span>
            <span>Daily low</span>
            <span>Chance of rain</span>
          </div>
        </section>
      </div>

      <div className="wp-bottom-row">
        <section className="wp-card wp-risk-card">
          <div className="wp-section-title">
            <span className="wp-card-icon risk"><Icon name="info" size={20} /></span>
            <div>
              <h2>AI Crop Risk Prediction</h2>
              <p>Rules-based agro-meteorological disease model</p>
            </div>
          </div>

          <div className="wp-risk-summary">
            <span className="wp-risk-alert-icon">!</span>
            <div className="wp-risk-name">
              <strong>{risk.level} Risk Alert</strong>
              <span>for {risk.disease || 'Crop Disease'} in {risk.disease?.includes('Cotton') ? 'Cotton' : 'Tomato'}</span>
            </div>
            <div className="wp-severity"><span>Severity</span><strong>{risk.severity}</strong></div>
          </div>

          <div className="wp-risk-details">
            <div><span>Risk Level</span><strong className="wp-moderate">{risk.level} ({risk.percentage}%)</strong></div>
            <div><span>Window</span><strong>Next 2–3 days</strong></div>
            <div><span>Favorable Trigger</span><strong>Humidity &gt;{weather.humidity > 85 ? '85' : '75'}%</strong></div>
            <div><span>Target Crop</span><strong>{risk.disease?.includes('Cotton') ? 'Cotton (Gossypium)' : 'Tomato (Solanaceae)'}</strong></div>
          </div>
          <Link to="/guidance" className="wp-secondary-link">
            <span>View disease prevention protocol</span>
            <Icon name="arrow" size={15} />
          </Link>
        </section>

        <section className="wp-card wp-impact-card">
          <div className="wp-section-title">
            <span className="wp-card-icon impact"><Icon name="leaf" size={20} /></span>
            <div>
              <h2>Weather Causality Analysis</h2>
              <p>Why is your field under disease pressure?</p>
            </div>
          </div>

          <div className="wp-impact-disease">
            <div className="wp-impact-disease-icon"><Icon name="leaf" size={19} /></div>
            <div className="wp-impact-copy">
              <strong>Foliar Blight <span>(Tomato)</span></strong>
              <p>Continuous canopy moisture allows fungal conidia to germinate within 4 to 8 hours.</p>
            </div>
            <span className="wp-medium-badge">Active Alert</span>
          </div>

          <div className="wp-why-risk">
            <h3>Weather Factors:</h3>
            <ul>
              <li>High average humidity (78%) prolongs leaf wetness.</li>
              <li>Scattered rainfall forecast for Friday (60% probability).</li>
              <li>Day temperatures of 28–30°C provide optimal sporulation range.</li>
            </ul>
          </div>
        </section>

        <section className="wp-card wp-actions-card">
          <div className="wp-section-title">
            <span className="wp-card-icon actions"><Icon name="check" size={20} /></span>
            <div>
              <h2>Agronomist Action Checklist</h2>
              <p>Immediate steps to protect field yield</p>
            </div>
          </div>

          <ul className="wp-action-list">
            <li>
              <span className="wp-action-number">01</span>
              <span>
                <strong>Inspect lower leaves</strong>
                <small>Look for small concentric target spots on oldest foliage.</small>
              </span>
              <Icon name="arrow" size={15} />
            </li>
            <li>
              <span className="wp-action-number">02</span>
              <span>
                <strong>Preventive spray before rain</strong>
                <small>Apply Mancozeb 75% WP @ 2.5 g/L prior to Friday drizzle.</small>
              </span>
              <Icon name="arrow" size={15} />
            </li>
            <li>
              <span className="wp-action-number">03</span>
              <span>
                <strong>Halt overhead irrigation</strong>
                <small>Use only drip lines to prevent splashing soil onto leaves.</small>
              </span>
              <Icon name="arrow" size={15} />
            </li>
            <li>
              <span className="wp-action-number">04</span>
              <span>
                <strong>Prune ground-touching foliage</strong>
                <small>Improves ventilation and halts soil-borne spore transit.</small>
              </span>
              <Icon name="arrow" size={15} />
            </li>
          </ul>
        </section>
      </div>

      <p className="wp-footer-note">
        <Icon name="info" size={15} /> Weather risk warnings are predictive advisories based on documented agricultural rules and do not constitute a confirmed field diagnosis.
      </p>
    </div>
  )
}
