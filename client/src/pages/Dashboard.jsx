import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'

const copy = {
  mr: { hello: 'नमस्कार! 👋', prompt: 'आज तुमच्या पिकांसाठी काय मदत करू?', hint: 'पानाचा फोटो घ्या किंवा AI ला तुमचा प्रश्न विचारा.', scan: 'पान स्कॅन करा', scanSub: 'पानाचा फोटो घेऊन रोग तपासा', talk: 'AI शी बोला', talkSub: 'तुमच्या शेतीसंबंधी प्रश्न विचारा', recent: 'अलीकडील कृती', all: 'सर्व पहा', empty: 'तुमच्या कृती येथे दिसतील', emptySub: 'तुम्ही केलेले पान स्कॅन आणि AI संभाषणे येथे जतन होतील.' },
  hi: { hello: 'नमस्ते! 👋', prompt: 'आज आपकी फसल के लिए क्या मदद करूँ?', hint: 'पत्ते की तस्वीर लें या AI से सवाल पूछें।', scan: 'पत्ता स्कैन करें', scanSub: 'पत्ते की तस्वीर से रोग पहचानें', talk: 'AI से बात करें', talkSub: 'खेती से जुड़े सवाल पूछें', recent: 'हाल की गतिविधि', all: 'सभी देखें', empty: 'आपकी गतिविधियाँ यहाँ दिखेंगी', emptySub: 'आपके पत्ता स्कैन और AI बातचीत यहाँ सहेजे जाएँगे।' },
  en: { hello: 'Hello! 👋', prompt: 'How can I help your crops today?', hint: 'Take a leaf photo or ask the AI a question.', scan: 'Scan a leaf', scanSub: 'Check for disease with a leaf photo', talk: 'Talk to AI', talkSub: 'Ask a question about your farm', recent: 'Recent activity', all: 'See all', empty: 'Your activity will appear here', emptySub: 'Your leaf scans and AI conversations will be saved here.' },
}

function Landscape() {
  return <svg className="welcome-art" viewBox="0 0 420 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#f9e6bf"/><stop offset="1" stopColor="#dce8c9"/></linearGradient><linearGradient id="field" x2="0" y2="1"><stop stopColor="#9fbd61"/><stop offset="1" stopColor="#2c6840"/></linearGradient></defs><rect width="420" height="190" fill="url(#sky)"/><circle cx="342" cy="52" r="25" fill="#f5c76c" opacity=".72"/><path d="M0 105 68 70l46 22 62-43 72 50 53-39 119 49v81H0Z" fill="#a6b789"/><path d="m0 119 77-34 59 29 68-46 78 46 54-31 84 36v71H0Z" fill="#758d58"/><g fill="#54764b"><circle cx="285" cy="91" r="18"/><circle cx="302" cy="84" r="22"/><circle cx="319" cy="91" r="16"/><rect x="299" y="96" width="6" height="20"/><circle cx="374" cy="105" r="21"/><rect x="371" y="104" width="6" height="20"/></g><path d="M0 132q210-30 420 0v58H0Z" fill="url(#field)"/><g fill="none" stroke="#d4e18a" strokeWidth="3" opacity=".8"><path d="M210 190 282 130M260 190 305 130M310 190 330 130M360 190 354 130M410 190 380 130"/><path d="M0 150q210-24 420 0M0 170q210-24 420 0"/></g></svg>
}

function ActionCard({ kind, to, icon, title, sub }) {
  return <Link to={to} className={`action-card ${kind}`}><span className="action-icon"><Icon name={icon} size={31}/></span><span className="action-copy"><strong>{title}</strong><small>{sub}</small></span><span className="action-arrow"><Icon name="arrow" size={18}/></span>{kind === 'voice' && <span className="sound-wave" aria-hidden="true">▏▃▅▂▆▃▇▅▂▆▃▏</span>}{kind === 'scan' && <Icon name="leaf" size={57} className="card-leaf"/>}</Link>
}

export default function Dashboard() {
  let language = 'mr'
  try { language = localStorage.getItem('shetimitra-language') || 'mr' } catch { /* Use Marathi when storage is unavailable. */ }
  const c = copy[language] || copy.mr
  return <div className="farmer-dashboard">
    <section className="welcome-banner"><Landscape/><div className="welcome-copy"><h1>{c.hello}</h1><h2>{c.prompt}</h2><p>{c.hint}</p></div></section>
    <section className="action-grid" aria-label={c.prompt}><ActionCard kind="scan" to="/scan" icon="camera" title={c.scan} sub={c.scanSub}/><ActionCard kind="voice" to="/assistant" icon="mic" title={c.talk} sub={c.talkSub}/></section>
    <section className="activity-section"><header className="activity-heading"><h2>{c.recent}</h2><Link to="/history">{c.all} <span>→</span></Link></header><div className="activity-empty"><span className="empty-leaf"><Icon name="leaf" size={23}/></span><div><strong>{c.empty}</strong><p>{c.emptySub}</p></div></div></section>
  </div>
}
