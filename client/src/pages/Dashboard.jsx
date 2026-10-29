import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { useTranslation } from '../i18n.jsx'
import backImg from '../../../img/backimg.png'
import './Dashboard.css'

const navigation = [
  { label: 'navHome', to: '/', icon: 'home', end: true },
  { label: 'navAssistant', to: '/assistant', icon: 'mic' },
  { label: 'navDetection', to: '/scan', icon: 'scan' },
  { label: 'navAdvisory', to: '/guidance', icon: 'leaf' },
  { label: 'navWeather', to: '/weather', icon: 'weather' },
  { label: 'navHistory', to: '/history', icon: 'history' },
  { label: 'navSettings', to: '/settings', icon: 'settings' },
]

const features = [
  {
    title: 'featureDisease',
    description: 'featureDiseaseCopy',
    action: 'featureDiseaseAction',
    icon: 'leaf',
    tone: 'green',
    to: '/scan',
  },
  {
    title: 'featureAssistant',
    description: 'featureAssistantCopy',
    action: 'featureAssistantAction',
    icon: 'mic',
    tone: 'purple',
    to: '/assistant',
  },
  {
    title: 'featureWeather',
    description: 'featureWeatherCopy',
    action: 'featureWeatherAction',
    icon: 'weather',
    tone: 'orange',
    to: '/weather',
  },
  {
    title: 'featureGuidance',
    description: 'featureGuidanceCopy',
    action: 'featureGuidanceAction',
    icon: 'sprout',
    tone: 'teal',
    to: '/guidance',
  },
]

const quickActions = [
  { label: 'quickCapture', icon: 'camera', to: '/scan' },
  { label: 'quickAsk', icon: 'mic', to: '/assistant' },
  { label: 'quickWeather', icon: 'weather', to: '/weather' },
  { label: 'quickHistory', icon: 'history', to: '/history' },
]

const tips = [
  {
    title: 'tipBlight',
    detail: 'tipBlightCopy',
    image: 'photo-1592841200221-a6898f307baa',
  },
  {
    title: 'tipHumidity',
    detail: 'tipHumidityCopy',
    image: 'photo-1518837695005-2083093ee35b',
  },
  {
    title: 'tipCotton',
    detail: 'tipCottonCopy',
    image: 'photo-1595872018818-97555653a011',
  },
]

export default function Dashboard() {
  const t = useTranslation()

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon"><Icon name="leaf" size={25} /></span>
          <span>
            <strong>ShetiMitra AI</strong>
            <small>{t('dashboardTagline')}</small>
          </span>
        </Link>

        <nav className="dashboard-navigation" aria-label={t('menu')}>
          {navigation.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `dashboard-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={icon} size={20} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-farmer">
          <img
            src={backImg}
            alt={t('farmerFieldAlt')}
          />
          <p>“{t('sidebarQuote')}”</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <LanguageSwitcher className="dashboard-language" />
          <Link to="/settings" className="farmer-pill">
            <span className="farmer-avatar"><Icon name="sprout" size={17} /></span>
            {t('farmer')}
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
            <span className="hero-eyebrow">{t('heroEyebrow')}</span>
            <h1>{t('welcome')}</h1>
            <h2>{t('subtitle')}</h2>
            <p>{t('heroTags')}</p>
          </div>
        </section>

        <div className="dashboard-content-grid">
          <div className="dashboard-left-column">
            <section className="feature-panel" aria-label="Farmer tools">
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">{t('getStarted')}</span>
                  <h2>{t('farmQuestion')}</h2>
                </div>
                <span className="heading-leaf"><Icon name="leaf" size={23} /></span>
              </div>
              <div className="feature-grid">
                {features.map((feature) => (
                  <article className={`feature-card ${feature.tone}`} key={feature.title}>
                    <span className="feature-icon"><Icon name={feature.icon} size={25} /></span>
                    <h3>{t(feature.title)}</h3>
                    <p>{t(feature.description)}</p>
                    <Link className="feature-action" to={feature.to}>
                      {t(feature.action)}<Icon name="arrow" size={16} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="quick-actions-panel">
              <div className="section-heading compact">
                <div>
                  <span className="section-eyebrow">{t('oneTapTools')}</span>
                  <h2>{t('quickActions')}</h2>
                </div>
                <span className="quick-hint">{t('quickHint')}</span>
              </div>
              <div className="quick-actions-grid">
                {quickActions.map((action) => (
                  <Link className="quick-action" to={action.to} key={action.label}>
                    <span className="quick-action-icon"><Icon name={action.icon} size={21} /></span>
                    <span>{t(action.label)}</span>
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
                  <span className="section-eyebrow">{t('localConditions')}</span>
                  <h2><span className="location-pin">⌖</span> {t('pune')}</h2>
                </div>
                <span className="weather-symbol"><Icon name="weather" size={29} /></span>
              </div>
              <div className="temperature-row">
                <strong>28°</strong>
                <span>{t('partlyCloudy')}</span>
              </div>
              <div className="weather-metrics">
                <div><span>{t('humidity')}</span><strong>78%</strong></div>
                <div><span>{t('rainfall')}</span><strong>12 mm</strong></div>
                <div><span>{t('wind')}</span><strong>8 km/h</strong></div>
              </div>
              <div className="risk-alert">
                <span className="risk-icon"><Icon name="info" size={17} /></span>
                <span><strong>{t('moderateRisk')}</strong><small>{t('earlyBlightTomato')}</small></span>
                <Icon name="arrow" size={16} />
              </div>
            </section>

            <section className="tips-panel">
              <div className="section-heading compact">
                <div>
                  <span className="section-eyebrow">{t('fromExperts')}</span>
                  <h2>{t('latestTips')}</h2>
                </div>
                <Link to="/guidance" className="tips-see-all">{t('seeAll')}</Link>
              </div>
              <div className="tips-list">
                {tips.map((tip) => (
                  <Link className="tip-item" to="/guidance" key={tip.title}>
                    <img
                      src={`https://images.unsplash.com/${tip.image}?w=160&h=120&fit=crop`}
                      alt=""
                    />
                    <span className="tip-copy">
                      <strong>{t(tip.title)}</strong>
                      <small>{t(tip.detail)}</small>
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
