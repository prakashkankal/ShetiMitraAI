import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { useTranslation, useLanguage } from '../i18n.jsx'

export default function AppLayout() {
  const t = useTranslation()
  const { language, setLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navItems = [
    { to: '/', label: t('navHome'), icon: 'home', end: true },
    { to: '/assistant', label: t('navAssistant'), icon: 'mic' },
    { to: '/scan', label: t('navScan'), icon: 'scan' },
    { to: '/guidance', label: t('navGuidance'), icon: 'leaf' },
    { to: '/weather', label: t('navWeather'), icon: 'weather' },
    { to: '/history', label: t('navHistory'), icon: 'history' },
    { to: '/settings', label: t('navSettings'), icon: 'settings' },
  ]

  // Primary thumb-friendly items for mobile bottom bar
  const mobileBottomItems = [
    { to: '/', label: t('navHome'), icon: 'home', end: true },
    {
      to: '/scan',
      label: language === 'mr' ? 'पीक तपासणी' : language === 'hi' ? 'फसल जांच' : 'Check Crop',
      icon: 'camera',
    },
    {
      to: '/assistant',
      label: language === 'mr' ? 'व्हॉइस AI' : language === 'hi' ? 'आवाज AI' : 'Voice AI',
      icon: 'mic',
    },
    {
      to: '/history',
      label: language === 'mr' ? 'इतिहास' : language === 'hi' ? 'इतिहास' : 'History',
      icon: 'history',
    },
    {
      to: '/settings',
      label: language === 'mr' ? 'सेटिंग्ज' : language === 'hi' ? 'सेटिंग्स' : 'Settings',
      icon: 'settings',
    },
  ]

  // Identify current page title for mobile topbar
  const currentItem = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )
  const currentTitle = currentItem ? currentItem.label : t('brand')

  return (
    <div className="unified-app">
      {/* Desktop & Tablet Sidebar */}
      <aside className="unified-sidebar" aria-label="Desktop primary navigation">
        <Link to="/" className="sidebar-brand">
          <span className="sidebar-brand-icon">
            <Icon name="leaf" size={24} />
          </span>
          <div className="sidebar-brand-text">
            <strong>{t('brand')}</strong>
            <small>{t('tagline')}</small>
          </div>
        </Link>

        {/* Advisory Scope Pill */}
        <div className="sidebar-badge">
          <span className="badge-dot" aria-hidden="true"></span>
          <span>{t('advisoryBadge')}</span>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer">
          <div className="sidebar-lang-picker">
            <Icon name="globe" size={17} />
            <select
              aria-label="Application Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
            >
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>

          <div className="sidebar-helpline">
            <div className="helpline-icon">
              <Icon name="phone" size={16} />
            </div>
            <div>
              <span className="helpline-label">{t('helplineTitle')}</span>
              <a href="tel:18001801551" className="helpline-num">
                {t('helplineNumber')}
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="unified-main-wrapper">
        {/* Mobile Top Header */}
        <header className="mobile-top-header">
          <Link to="/" className="mobile-brand">
            <span className="mobile-brand-icon">
              <Icon name="leaf" size={19} />
            </span>
            <div className="mobile-brand-titles">
              <strong>{t('brand')}</strong>
              {location.pathname !== '/' && currentTitle !== t('brand') && (
                <span className="mobile-screen-tag">• {currentTitle}</span>
              )}
            </div>
          </Link>

          <div className="mobile-header-actions">
            <div className="mobile-lang-picker">
              <Icon name="globe" size={15} />
              <select
                aria-label="Language selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="mr">मराठी</option>
                <option value="hi">हिन्दी</option>
                <option value="en">EN</option>
              </select>
            </div>

            {location.pathname !== '/' && (
              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={19} />
              </button>
            )}
          </div>
        </header>

        {/* Mobile Slide-down Full Menu with Backdrop */}
        {mobileMenuOpen && (
          <>
            <div
              className="mobile-drawer-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="mobile-menu-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
              <div className="mobile-drawer-topbar">
                <span className="drawer-title">All Sections</span>
                <button
                  type="button"
                  className="drawer-close-icon"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              <div className="mobile-menu-list">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>

              <div className="mobile-drawer-helpline">
                <Icon name="phone" size={16} />
                <span>
                  {t('helplineTitle')}: <a href="tel:18001801551">1800-180-1551</a>
                </span>
              </div>
            </div>
          </>
        )}

        {/* The active page content */}
        <main className="unified-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar" aria-label="Quick mobile navigation">
        {mobileBottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}
          >
            <Icon name={item.icon} size={21} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
