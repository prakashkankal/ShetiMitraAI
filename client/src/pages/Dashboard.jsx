import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import backImg from '../../../img/backimg.png'
import './Dashboard.css'

const navigation = [
  { label: 'Home', to: '/', icon: 'home', end: true },
  { label: 'Voice Assistant', to: '/assistant', icon: 'mic' },
  { label: 'Image Detection', to: '/scan', icon: 'scan' },
  { label: 'Disease Advisory', to: '/guidance', icon: 'leaf' },
  { label: 'Weather & Risk', to: '/weather', icon: 'weather' },
  { label: 'History', to: '/history', icon: 'history' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
]

const translations = {
  en: {
    welcome: 'Welcome to ShetiMitra AI',
    subtitle: 'Your AI-Powered Crop Health Companion',
    tags: 'Detect • Diagnose • Get Expert Advice • In Your Language',
  },
  hi: {
    welcome: 'शेतीमित्र AI में आपका स्वागत है',
    subtitle: 'फसल स्वास्थ्य के लिए आपका AI साथी',
    tags: 'पहचानें • निदान करें • विशेषज्ञ सलाह • अपनी भाषा में',
  },
  mr: {
    welcome: 'शेतीमित्र AI मध्ये तुमचे स्वागत आहे',
    subtitle: 'पीक आरोग्यासाठी तुमचा AI साथी',
    tags: 'ओळखा • निदान करा • तज्ञांचा सल्ला • तुमच्या भाषेत',
  },
}

const features = [
  {
    title: 'Detect Disease',
    description: 'Upload a leaf image and let AI identify the disease.',
    action: 'Upload Image',
    icon: 'leaf',
    tone: 'green',
    to: '/scan',
  },
  {
    title: 'Voice Assistant',
    description: 'Ask questions or get advice in your language.',
    action: 'Start Speaking',
    icon: 'mic',
    tone: 'purple',
    to: '/assistant',
  },
  {
    title: 'Weather & Risk',
    description: 'Check weather and disease risk alerts.',
    action: 'View Forecast',
    icon: 'weather',
    tone: 'orange',
    to: '/weather',
  },
  {
    title: 'Advisory',
    description: 'Get expert guidance and safe recommendations.',
    action: 'View Advice',
    icon: 'sprout',
    tone: 'teal',
    to: '/guidance',
  },
]

const quickActions = [
  { label: 'Capture Leaf Photo', icon: 'camera', to: '/scan' },
  { label: 'Speak a Question', icon: 'mic', to: '/assistant' },
  { label: 'Check Weather Risk', icon: 'weather', to: '/weather' },
  { label: 'View My History', icon: 'history', to: '/history' },
]

const tips = [
  {
    title: 'Early Blight in Tomato',
    detail: 'Spot early signs and protect your crop.',
    image: 'photo-1592841200221-a6898f307baa',
  },
  {
    title: 'High Humidity Alert',
    detail: 'Check leaves regularly after rainfall.',
    image: 'photo-1518837695005-2083093ee35b',
  },
  {
    title: 'Cotton Leaf Curl Virus',
    detail: 'Know what to look for in your field.',
    image: 'photo-1595872018818-97555653a011',
  },
]

export default function Dashboard() {
  const [language, setLanguage] = useState('en')
  const copy = translations[language]

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon"><Icon name="leaf" size={25} /></span>
          <span>
            <strong>ShetiMitra AI</strong>
            <small>Smart AI for Healthy Crops</small>
          </span>
        </Link>

        <nav className="dashboard-navigation" aria-label="Main navigation">
          {navigation.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `dashboard-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={icon} size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-farmer">
          <img
            src={backImg}
            alt="Farmer looking over a green field"
          />
          <p>“Better information today, healthier crops tomorrow”</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <label className="dashboard-language">
            <Icon name="globe" size={18} />
            <select
              aria-label="Choose language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
          <Link to="/settings" className="farmer-pill">
            <span className="farmer-avatar"><Icon name="sprout" size={17} /></span>
            Farmer
          </Link>
        </div>

        <section
          className="dashboard-hero"
          style={{
            backgroundImage: `url(${backImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="dashboard-hero-copy">
            <span className="hero-eyebrow">YOUR FARM, HEALTHIER</span>
            <h1>{copy.welcome}</h1>
            <h2>{copy.subtitle}</h2>
            <p>{copy.tags}</p>
          </div>
        </section>

        <div className="dashboard-content-grid">
          <div className="dashboard-left-column">
            <section className="feature-panel" aria-label="Farmer tools">
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">GET STARTED</span>
                  <h2>How can we help your farm?</h2>
                </div>
                <span className="heading-leaf"><Icon name="leaf" size={23} /></span>
              </div>
              <div className="feature-grid">
                {features.map((feature) => (
                  <article className={`feature-card ${feature.tone}`} key={feature.title}>
                    <span className="feature-icon"><Icon name={feature.icon} size={25} /></span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <Link className="feature-action" to={feature.to}>
                      {feature.action}<Icon name="arrow" size={16} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="quick-actions-panel">
              <div className="section-heading compact">
                <div>
                  <span className="section-eyebrow">ONE-TAP TOOLS</span>
                  <h2>Quick Actions</h2>
                </div>
                <span className="quick-hint">Pick up where you need</span>
              </div>
              <div className="quick-actions-grid">
                {quickActions.map((action) => (
                  <Link className="quick-action" to={action.to} key={action.label}>
                    <span className="quick-action-icon"><Icon name={action.icon} size={21} /></span>
                    <span>{action.label}</span>
                    <span className="quick-action-arrow"><Icon name="arrow" size={15} /></span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="dashboard-right-column">
            <section className="weather-panel">
              <div className="weather-heading">
                <div>
                  <span className="section-eyebrow">LOCAL CONDITIONS</span>
                  <h2><span className="location-pin">⌖</span> Pune, Maharashtra</h2>
                </div>
                <span className="weather-symbol"><Icon name="weather" size={29} /></span>
              </div>
              <div className="temperature-row">
                <strong>28°</strong>
                <span>Partly Cloudy</span>
              </div>
              <div className="weather-metrics">
                <div><span>Humidity</span><strong>78%</strong></div>
                <div><span>Rainfall</span><strong>12 mm</strong></div>
                <div><span>Wind</span><strong>8 km/h</strong></div>
              </div>
              <div className="risk-alert">
                <span className="risk-icon"><Icon name="info" size={17} /></span>
                <span><strong>Moderate risk</strong><small>Early Blight · Tomato</small></span>
                <Icon name="arrow" size={16} />
              </div>
            </section>

            <section className="tips-panel">
              <div className="section-heading compact">
                <div>
                  <span className="section-eyebrow">FROM OUR EXPERTS</span>
                  <h2>Latest Tips</h2>
                </div>
                <Link to="/guidance" className="tips-see-all">See all</Link>
              </div>
              <div className="tips-list">
                {tips.map((tip) => (
                  <Link className="tip-item" to="/guidance" key={tip.title}>
                    <img
                      src={`https://images.unsplash.com/${tip.image}?w=160&h=120&fit=crop`}
                      alt=""
                    />
                    <span className="tip-copy">
                      <strong>{tip.title}</strong>
                      <small>{tip.detail}</small>
                    </span>
                    <Icon name="arrow" size={16} />
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
