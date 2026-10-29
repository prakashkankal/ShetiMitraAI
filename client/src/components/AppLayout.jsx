import { Link, NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { useTranslation } from '../i18n.jsx'

const items = [
  { to: '/', icon: 'home', label: 'navHome', end: true },
  { to: '/scan', icon: 'camera', label: 'navDetection' },
  { to: '/history', icon: 'history', label: 'navHistory' },
  { to: '/settings', icon: 'settings', label: 'navSettings' },
]

function NavItems() {
  const t = useTranslation()
  return items.map(({ to, icon, label, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}><Icon name={icon} size={25}/><span>{t(label)}</span></NavLink>)
}

export default function AppLayout({ language, setLanguage }) {
  const t = useTranslation()
  return <div className="app-shell"><header className="app-header"><Link to="/" className="brand-mark"><span className="brand-icon"><Icon name="leaf" size={25}/></span><span><strong>ShetiMitra <em>AI</em></strong><small>{t('tagline')}</small></span></Link><div className="header-tools"><label className="language-picker"><Icon name="globe" size={18}/><select aria-label={t('language')} value={language} onChange={e => setLanguage(e.target.value)}><option value="mr">{t('marathi')}</option><option value="hi">{t('hindi')}</option><option value="en">{t('english')}</option></select><span>⌄</span></label><Link to="/settings" className="settings-link" aria-label={t('navSettings')}><Icon name="settings" size={25}/></Link></div></header><main className="app-main"><Outlet/></main><nav className="bottom-nav" aria-label={t('menu')}><NavItems/></nav></div>
}
