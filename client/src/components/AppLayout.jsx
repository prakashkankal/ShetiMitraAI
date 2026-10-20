import { Link, NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icons.jsx'

const labels = { mr: ['डॅशबोर्ड', 'पान स्कॅन', 'AI लॉग', 'सेटिंग्ज', 'तुमच्या शेतीचा साथी', 'मराठी'], hi: ['डैशबोर्ड', 'पत्ता स्कैन', 'AI लॉग', 'सेटिंग्स', 'आपकी खेती का साथी', 'हिन्दी'], en: ['Dashboard', 'Scan leaf', 'AI log', 'Settings', 'Your farm companion', 'English'] }
const items = [{ to: '/', icon: 'home', index: 0, end: true }, { to: '/scan', icon: 'camera', index: 1 }, { to: '/history', icon: 'history', index: 2 }, { to: '/settings', icon: 'settings', index: 3 }]

function NavItems({ language }) {
  const text = labels[language] || labels.mr
  return items.map(({ to, icon, index, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}><Icon name={icon} size={25}/><span>{text[index]}</span></NavLink>)
}

export default function AppLayout({ language, setLanguage }) {
  const text = labels[language] || labels.mr
  return <div className="app-shell"><header className="app-header"><Link to="/" className="brand-mark"><span className="brand-icon"><Icon name="leaf" size={25}/></span><span><strong>ShetiMitra <em>AI</em></strong><small>{text[4]}</small></span></Link><div className="header-tools"><label className="language-picker"><Icon name="globe" size={18}/><select aria-label="Language" value={language} onChange={e => setLanguage(e.target.value)}><option value="mr">मराठी</option><option value="hi">हिन्दी</option><option value="en">English</option></select><span>⌄</span></label><Link to="/settings" className="settings-link" aria-label={text[3]}><Icon name="settings" size={25}/></Link></div></header><main className="app-main"><Outlet/></main><nav className="bottom-nav" aria-label="Main navigation"><NavItems language={language}/></nav></div>
}
