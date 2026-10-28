import "./WeatherPage.css";
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import backImg from '../../../img/backimg.png'

const navigation = [
  { label: 'Home', to: '/', icon: 'home', end: true },
  { label: 'Voice Assistant', to: '/assistant', icon: 'mic' },
  { label: 'Image Detection', to: '/scan', icon: 'scan' },
  { label: 'Disease Advisory', to: '/guidance', icon: 'leaf' },
  { label: 'Weather & Risk', to: '/weather', icon: 'weather' },
  { label: 'History', to: '/history', icon: 'history' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
]

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

export default function WeatherPage() {
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
          <span><strong>ShetiMitra AI</strong><small>Smart AI for Healthy Crops</small></span>
        </Link>

        <nav className="wp-navigation" aria-label="Main navigation">
          {navigation.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `wp-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={icon} size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="wp-sidebar-image">
          <img src={backImg} alt="Green farm field at sunset" />
          <p>Better information today, healthier crops tomorrow</p>
        </div>
      </aside>

      <main className="wp-main">
        <section
          className="wp-banner"
          style={{ backgroundImage: `url(${backImg})` }}
        >
          <div className="wp-banner-copy">
            <span className="wp-eyebrow">WEATHER &amp; RISK</span>
            <h1>Weather Forecast &amp; Crop Risk Analysis</h1>
            <p>Get weather updates and crop risk insights to protect your crops and plan better.</p>
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
                <strong>{location}</strong>
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
          </div>
        </section>

        <div className="wp-top-row">
          <section className="wp-card wp-current-card">
            <div className="wp-card-heading">
              <span className="wp-card-icon weather"><Icon name="weather" size={20} /></span>
              <div>
                <h2>Current Weather</h2>
                <p>{location} <span>·</span> Updated 10:24 AM</p>
              </div>
            </div>

            <div className="wp-current-grid">
              <div className="wp-current-data">
                <div className="wp-current-temp">
                  <WeatherIcon type="weather" size={36} />
                  <strong>28°</strong>
                </div>
                <p className="wp-current-condition">Partly Cloudy</p>
                <div className="wp-weather-details">
                  <div><span><span className="wp-metric-dot humidity">●</span> Humidity</span><strong>78%</strong></div>
                  <div><span><span className="wp-metric-dot wind">●</span> Wind</span><strong>8 km/h</strong></div>
                  <div><span><span className="wp-metric-dot rain">●</span> Rainfall</span><strong>0 mm</strong></div>
                  <div><span><span className="wp-metric-dot feels">●</span> Feels Like</span><strong>31°</strong></div>
                </div>
              </div>

              <div className="wp-crop-status">
                <span className="wp-status-icon"><Icon name="sprout" size={22} /></span>
                <span className="wp-status-label">CROP CONDITIONS</span>
                <strong>Good for crops</strong>
                <p>Current weather is generally favourable for most crops.</p>
                <div className="wp-status-indicator"><span /> Conditions look good</div>
              </div>
            </div>
          </section>

          <section className="wp-card wp-forecast-card">
            <div className="wp-card-heading">
              <span className="wp-card-icon forecast"><Icon name="history" size={19} /></span>
              <div>
                <h2>7-Day Forecast</h2>
                <p>Plan ahead for the week</p>
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
            <div className="wp-forecast-legend"><span>Daily high</span><span>Daily low</span><span>Chance of rain</span></div>
          </section>
        </div>

        <div className="wp-bottom-row">
          <section className="wp-card wp-risk-card">
            <div className="wp-section-title">
              <span className="wp-card-icon risk"><Icon name="info" size={20} /></span>
              <div><h2>Risk Prediction</h2><p>AI analysis based on local weather conditions</p></div>
            </div>

            <div className="wp-risk-summary">
              <span className="wp-risk-alert-icon">!</span>
              <div className="wp-risk-name"><strong>Moderate Risk</strong><span>for Leaf Blight (Tomato)</span></div>
              <div className="wp-severity"><span>Severity</span><strong>Medium</strong></div>
            </div>

            <div className="wp-risk-details">
              <div><span>Risk Level</span><strong className="wp-moderate">Moderate</strong></div>
              <div><span>Expected</span><strong>Next 2–3 days</strong></div>
              <div><span>Confidence</span><strong>78%</strong></div>
              <div><span>Affected Crop</span><strong>Tomato</strong></div>
            </div>
            <Link to="/guidance" className="wp-secondary-link">View detailed analysis <Icon name="arrow" size={15} /></Link>
          </section>

          <section className="wp-card wp-impact-card">
            <div className="wp-section-title">
              <span className="wp-card-icon impact"><Icon name="leaf" size={20} /></span>
              <div><h2>Weather Impact &amp; Risk Details</h2><p>Understanding your local crop risk</p></div>
            </div>

            <div className="wp-impact-disease">
              <div className="wp-impact-disease-icon"><Icon name="leaf" size={19} /></div>
              <div className="wp-impact-copy">
                <strong>Leaf Blight <span>(Tomato)</span></strong>
                <p>Warm, humid weather can increase fungal disease pressure in tomato plants.</p>
              </div>
              <span className="wp-medium-badge">Medium Risk</span>
            </div>

            <div className="wp-why-risk">
              <h3>Why this risk?</h3>
              <ul>
                <li>Humidity is high at 78%, supporting fungal growth.</li>
                <li>Rain is forecast later this week.</li>
                <li>Temperatures of 26–30°C may favour leaf blight.</li>
              </ul>
            </div>
          </section>

          <section className="wp-card wp-actions-card">
            <div className="wp-section-title">
              <span className="wp-card-icon actions"><Icon name="check" size={20} /></span>
              <div><h2>Recommended Actions</h2><p>Simple steps to protect your crops</p></div>
            </div>

            <ul className="wp-action-list">
              <li><span className="wp-action-number">01</span><span><strong>Inspect plants</strong><small>Look for early leaf spots or yellowing.</small></span><Icon name="arrow" size={15} /></li>
              <li><span className="wp-action-number">02</span><span><strong>Apply fungicide</strong><small>Follow the product label and local expert advice.</small></span><Icon name="arrow" size={15} /></li>
              <li><span className="wp-action-number">03</span><span><strong>Avoid irrigation</strong><small>Reduce extra moisture on leaves.</small></span><Icon name="arrow" size={15} /></li>
              <li><span className="wp-action-number">04</span><span><strong>Ensure spacing</strong><small>Allow air to circulate between plants.</small></span><Icon name="arrow" size={15} /></li>
            </ul>
          </section>
        </div>

        <p className="wp-footer-note"><Icon name="info" size={15} /> Forecast and risk information is for guidance. Local conditions may change.</p>
      </main>
    </div>
  )
}
