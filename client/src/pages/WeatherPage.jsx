import "./WeatherPage.css";
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { useTranslation } from '../i18n.jsx'
import backImg from '../../../img/backimg.png'

const navigation = [
  { label: 'navHome', to: '/', icon: 'home', end: true },
  { label: 'navAssistant', to: '/assistant', icon: 'mic' },
  { label: 'navDetection', to: '/scan', icon: 'scan' },
  { label: 'navAdvisory', to: '/guidance', icon: 'leaf' },
  { label: 'navWeather', to: '/weather', icon: 'weather' },
  { label: 'navHistory', to: '/history', icon: 'history' },
  { label: 'navSettings', to: '/settings', icon: 'settings' },
]

const forecast = [
  { day: 'forecastToday', date: 'forecastDateToday', icon: 'weather', high: '28°', low: '18°', rain: '0%' },
  { day: 'forecastThu', date: 'forecastDateThu', icon: 'sun', high: '30°', low: '19°', rain: '0%' },
  { day: 'forecastFri', date: 'forecastDateFri', icon: 'rain', high: '27°', low: '17°', rain: '60%' },
  { day: 'forecastSat', date: 'forecastDateSat', icon: 'cloud', high: '26°', low: '16°', rain: '40%' },
  { day: 'forecastSun', date: 'forecastDateSun', icon: 'sun', high: '29°', low: '18°', rain: '10%' },
  { day: 'forecastMon', date: 'forecastDateMon', icon: 'sun', high: '31°', low: '19°', rain: '0%' },
  { day: 'forecastTue', date: 'forecastDateTue', icon: 'cloud', high: '28°', low: '18°', rain: '30%' },
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

export default function WeatherPage() {
  const t = useTranslation()
  const [location, setLocation] = useState('Pune, Maharashtra')
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationInput, setLocationInput] = useState(location)

  function saveLocation(event) {
    event.preventDefault()
    const nextLocation = locationInput.trim()
    if (nextLocation) setLocation(nextLocation)
    setEditingLocation(false)
  }

  return (
    <div className="wp-page">
      <aside className="wp-sidebar">
        <Link to="/" className="wp-brand">
          <span className="wp-brand-icon"><Icon name="leaf" size={24} /></span>
          <span><strong>ShetiMitra AI</strong><small>{t('dashboardTagline')}</small></span>
        </Link>

        <nav className="wp-navigation" aria-label={t('menu')}>
          {navigation.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `wp-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={icon} size={19} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="wp-sidebar-image">
          <img src={backImg} alt={t('weatherFieldAlt')} />
          <p>{t('sidebarQuote')}</p>
        </div>
      </aside>

      <main className="wp-main">
        <div className="wp-toolbar">
          <LanguageSwitcher />
        </div>
        <section
          className="wp-banner"
          style={{ backgroundImage: `url(${backImg})` }}
        >
          <div className="wp-banner-copy">
            <span className="wp-eyebrow">{t('weatherEyebrow')}</span>
            <h1>{t('weatherHeadline')}</h1>
            <p>{t('weatherDescription')}</p>
          </div>
          <div className="wp-location-card">
            <span className="wp-location-pin">⌖</span>
            {editingLocation ? (
              <form className="wp-location-form" onSubmit={saveLocation}>
                <input
                  aria-label={t('location')}
                  value={locationInput}
                  onChange={(event) => setLocationInput(event.target.value)}
                  autoFocus
                />
                <button type="submit">{t('save')}</button>
              </form>
            ) : (
              <>
                <strong>{location}</strong>
                <button
                  type="button"
                  className="wp-change-location"
                  onClick={() => {
                    setLocationInput(location)
                    setEditingLocation(true)
                  }}
                >
                  {t('changeLocation')}
                </button>
              </>
            )}
          </div>
        </section>

        <div className="wp-top-row">
          <section className="wp-card wp-current-card">
            <div className="wp-card-heading">
              <span className="wp-card-icon weather"><Icon name="weather" size={20} /></span>
              <div>
                <h2>{t('currentWeather')}</h2>
                <p>{location} <span>·</span> {t('updatedTime')}</p>
              </div>
            </div>

            <div className="wp-current-grid">
              <div className="wp-current-data">
                <div className="wp-current-temp">
                  <WeatherIcon type="weather" size={36} />
                  <strong>28°</strong>
                </div>
                <p className="wp-current-condition">{t('partlyCloudy')}</p>
                <div className="wp-weather-details">
                  <div><span><span className="wp-metric-dot humidity">●</span> {t('humidity')}</span><strong>78%</strong></div>
                  <div><span><span className="wp-metric-dot wind">●</span> {t('wind')}</span><strong>8 km/h</strong></div>
                  <div><span><span className="wp-metric-dot rain">●</span> {t('rainfall')}</span><strong>0 mm</strong></div>
                  <div><span><span className="wp-metric-dot feels">●</span> {t('feelsLike')}</span><strong>31°</strong></div>
                </div>
              </div>

              <div className="wp-crop-status">
                <span className="wp-status-icon"><Icon name="sprout" size={22} /></span>
                <span className="wp-status-label">{t('cropConditions')}</span>
                <strong>{t('goodForCrops')}</strong>
                <p>{t('favourableWeather')}</p>
                <div className="wp-status-indicator"><span /> {t('conditionsGood')}</div>
              </div>
            </div>
          </section>

          <section className="wp-card wp-forecast-card">
            <div className="wp-card-heading">
              <span className="wp-card-icon forecast"><Icon name="history" size={19} /></span>
              <div>
                <h2>{t('forecastTitle')}</h2>
                <p>{t('planWeek')}</p>
              </div>
            </div>
            <div className="wp-forecast-grid">
              {forecast.map((day) => (
                <div className="wp-forecast-day" key={day.day}>
                  <strong>{t(day.day)}</strong>
                  <span className="wp-forecast-date">{t(day.date)}</span>
                  <span className={`wp-forecast-icon ${day.icon}`}><WeatherIcon type={day.icon} /></span>
                  <span className="wp-forecast-temp"><b>{day.high}</b><span>{day.low}</span></span>
                  <span className="wp-forecast-rain"><span>↓</span> {day.rain}</span>
                </div>
              ))}
            </div>
            <div className="wp-forecast-legend"><span>{t('dailyHigh')}</span><span>{t('dailyLow')}</span><span>{t('chanceRain')}</span></div>
          </section>
        </div>

        <div className="wp-bottom-row">
          <section className="wp-card wp-risk-card">
            <div className="wp-section-title">
              <span className="wp-card-icon risk"><Icon name="info" size={20} /></span>
              <div><h2>{t('riskPrediction')}</h2><p>{t('weatherAnalysis')}</p></div>
            </div>

            <div className="wp-risk-summary">
              <span className="wp-risk-alert-icon">!</span>
              <div className="wp-risk-name"><strong>{t('moderateRisk')}</strong><span>{t('moderateRiskFor')}</span></div>
              <div className="wp-severity"><span>{t('severity')}</span><strong>{t('medium')}</strong></div>
            </div>

            <div className="wp-risk-details">
              <div><span>{t('riskLevel')}</span><strong className="wp-moderate">{t('moderate')}</strong></div>
              <div><span>{t('expected')}</span><strong>{t('nextDays')}</strong></div>
              <div><span>{t('confidenceLabel')}</span><strong>78%</strong></div>
              <div><span>{t('affectedCrop')}</span><strong>{t('tomato')}</strong></div>
            </div>
            <Link to="/guidance" className="wp-secondary-link">{t('detailedAnalysis')} <Icon name="arrow" size={15} /></Link>
          </section>

          <section className="wp-card wp-impact-card">
            <div className="wp-section-title">
              <span className="wp-card-icon impact"><Icon name="leaf" size={20} /></span>
              <div><h2>{t('weatherImpact')}</h2><p>{t('understandRisk')}</p></div>
            </div>

            <div className="wp-impact-disease">
              <div className="wp-impact-disease-icon"><Icon name="leaf" size={19} /></div>
              <div className="wp-impact-copy">
                <strong>{t('leafBlightTomato')}</strong>
                <p>{t('humidDisease')}</p>
              </div>
              <span className="wp-medium-badge">{t('mediumRisk')}</span>
            </div>

            <div className="wp-why-risk">
              <h3>{t('whyRisk')}</h3>
              <ul>
                <li>{t('humidityRisk')}</li>
                <li>{t('rainForecast')}</li>
                <li>{t('temperatureRisk')}</li>
              </ul>
            </div>
          </section>

          <section className="wp-card wp-actions-card">
            <div className="wp-section-title">
              <span className="wp-card-icon actions"><Icon name="check" size={20} /></span>
              <div><h2>{t('recommendedSteps')}</h2><p>{t('simpleCropSteps')}</p></div>
            </div>

            <ul className="wp-action-list">
              <li><span className="wp-action-number">01</span><span><strong>{t('inspectPlants')}</strong><small>{t('inspectPlantsCopy')}</small></span><Icon name="arrow" size={15} /></li>
              <li><span className="wp-action-number">02</span><span><strong>{t('applyFungicideTitle')}</strong><small>{t('applyFungicideCopy')}</small></span><Icon name="arrow" size={15} /></li>
              <li><span className="wp-action-number">03</span><span><strong>{t('avoidIrrigation')}</strong><small>{t('avoidIrrigationCopy')}</small></span><Icon name="arrow" size={15} /></li>
              <li><span className="wp-action-number">04</span><span><strong>{t('ensureSpacing')}</strong><small>{t('ensureSpacingCopy')}</small></span><Icon name="arrow" size={15} /></li>
            </ul>
          </section>
        </div>

        <p className="wp-footer-note"><Icon name="info" size={15} /> {t('weatherDisclaimer')}</p>
      </main>
    </div>
  )
}
