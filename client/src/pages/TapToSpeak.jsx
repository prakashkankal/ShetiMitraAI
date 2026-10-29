import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { useTranslation } from '../i18n.jsx'
import './TapToSpeak.css'

const navigation = [
  { label: 'navHome', to: '/', icon: 'home', end: true },
  { label: 'navAssistant', to: '/assistant', icon: 'mic' },
  { label: 'navDetection', to: '/scan', icon: 'scan' },
  { label: 'navAdvisory', to: '/guidance', icon: 'leaf' },
  { label: 'navWeather', to: '/weather', icon: 'weather' },
  { label: 'navHistory', to: '/history', icon: 'history' },
  { label: 'navSettings', to: '/settings', icon: 'settings' },
]
function Waveform({ className = '' }) {
  const t = useTranslation()
  return (
    <span className={`tts-waveform ${className}`} aria-label={t('audioWaveform')}>
      {Array.from({ length: 11 }, (_, index) => <span key={index} style={{ '--bar': index }} />)}
    </span>
  )
}

function DiseasedLeafIllustration() {
  const t = useTranslation()
  return (
    <svg
      className="tts-leaf-illustration"
      viewBox="0 0 420 230"
      role="img"
      aria-label={t('riceIllustration')}
    >
      <defs>
        <linearGradient id="rice-leaf" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#285d32" />
          <stop offset="1" stopColor="#9cc86b" />
        </linearGradient>
        <linearGradient id="leaf-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#eff7e9" />
          <stop offset="1" stopColor="#dcebd1" />
        </linearGradient>
      </defs>
      <rect width="420" height="230" rx="18" fill="url(#leaf-bg)" />
      <path d="M37 213C95 148 111 78 90 18c55 44 69 108 27 195" fill="url(#rice-leaf)" />
      <path d="M89 220C127 146 179 82 269 29c-14 74-69 145-164 191" fill="url(#rice-leaf)" />
      <path d="M150 221c39-76 113-128 215-149-31 70-102 126-206 165" fill="url(#rice-leaf)" />
      <path d="M89 209C97 142 94 75 90 29M104 207C143 140 196 80 258 39M164 220c49-69 116-118 188-140" fill="none" stroke="#d7e9ad" strokeLinecap="round" strokeWidth="3" />
      <g fill="#8f4d2e" stroke="#d29a55" strokeWidth="2">
        <ellipse cx="111" cy="106" rx="8" ry="15" transform="rotate(-22 111 106)" />
        <ellipse cx="138" cy="151" rx="7" ry="13" transform="rotate(24 138 151)" />
        <ellipse cx="196" cy="112" rx="9" ry="17" transform="rotate(42 196 112)" />
        <ellipse cx="225" cy="147" rx="8" ry="14" transform="rotate(39 225 147)" />
        <ellipse cx="305" cy="111" rx="9" ry="16" transform="rotate(57 305 111)" />
        <ellipse cx="271" cy="163" rx="7" ry="13" transform="rotate(47 271 163)" />
      </g>
      <g fill="#e7c37a">
        <ellipse cx="111" cy="106" rx="3" ry="7" transform="rotate(-22 111 106)" />
        <ellipse cx="196" cy="112" rx="3" ry="8" transform="rotate(42 196 112)" />
        <ellipse cx="305" cy="111" rx="3" ry="7" transform="rotate(57 305 111)" />
      </g>
    </svg>
  )
}

function ChatVoiceMessage() {
  const t = useTranslation()
  return (
    <>
      <div className="tts-audio-player">
        <button type="button" className="tts-play-button" aria-label={t('playVoice')}>▶</button>
        <Waveform />
        <span className="tts-audio-time">0:45</span>
      </div>
      <p className="tts-advice-intro">{t('adviceIntro')}</p>
      <ol className="tts-advice-list">
        <li>{t('adviceOne')}</li>
        <li>{t('adviceTwo')}</li>
        <li>{t('adviceThree')}</li>
      </ol>
    </>
  )
}

export default function TapToSpeak() {
  const t = useTranslation()
  const [step, setStep] = useState(2)
  const [recording, setRecording] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (step !== 3 || !recording) return undefined

    const recordingTimer = window.setTimeout(() => {
      setStep(4)
      setTimer(12)
      setRecording(false)
    }, 3000)

    return () => window.clearTimeout(recordingTimer)
  }, [step, recording])

  function startRecording() {
    setTimer(0)
    setRecording(true)
    setStep(3)
  }

  function cancelRecording() {
    setRecording(false)
    setTimer(0)
    setStep(2)
  }

  function sendRecording() {
    setRecording(false)
    setStep(5)
  }

  return (
    <div className="tap-to-speak">
      <aside className="tts-sidebar">
        <Link to="/" className="tts-brand">
          <span className="tts-brand-icon"><Icon name="leaf" size={24} /></span>
          <span><strong>ShetiMitra AI</strong><small>{t('dashboardTagline')}</small></span>
        </Link>
        <nav className="tts-navigation" aria-label={t('menu')}>
          {navigation.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `tts-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={icon} size={20} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="tts-sidebar-note">{t('sidebarQuote')}</div>
      </aside>

      <main className="tts-main">
        <header className="tts-page-header">
          <div>
            <span className="tts-overline">{t('voiceEyebrow')}</span>
            <h1>{t('voiceTitle')}</h1>
          </div>
          <LanguageSwitcher className="tts-language-pill" />
        </header>

        {step < 5 ? (
          <section className="tts-voice-card" aria-live="polite">
            {step === 2 && (
              <div className="tts-idle-content">
                <span className="tts-mic-halo">
                  <button type="button" className="tts-mic-button" onClick={startRecording} aria-label={t('tapToSpeak')}>
                    <Icon name="mic" size={37} />
                  </button>
                </span>
                <h2>{t('tapToSpeak')}</h2>
                <p>{t('speakQuestion')}</p>
              </div>
            )}

            {(step === 3 || step === 4) && (
              <div className="tts-recording-content">
                <div className="tts-recording-row">
                  <Waveform className="left" />
                  <span className="tts-mic-halo recording">
                    <span className="tts-mic-button"><Icon name="mic" size={37} /></span>
                  </span>
                  <Waveform className="right" />
                </div>
                <h2>{step === 3 ? t('recordingNow') : t('recordingComplete')}</h2>
                <p className="tts-recording-timer">00:{String(timer).padStart(2, '0')}</p>
                <div className="tts-recording-actions">
                  {step === 4 && <button type="button" className="tts-send-button" onClick={sendRecording}>{t('send')}</button>}
                  <button type="button" className="tts-cancel-button" onClick={cancelRecording}>{t('cancel')}</button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="tts-chat" aria-label={t('voiceConversation')}>
            <div className="tts-chat-date">{t('todayUpper')}</div>
            <div className="tts-chat-user">
              <p>{t('sampleQuestion')}</p>
              <time>10:24 AM</time>
            </div>

            <div className="tts-chat-assistant">
              <div className="tts-assistant-label"><span className="tts-assistant-avatar"><Icon name="sprout" size={17} /></span> ShetiMitra AI</div>
              <ChatVoiceMessage />
              <time>10:24 AM</time>
            </div>

            {step === 6 && (
              <div className="tts-chat-user tts-image-message">
                <div className="tts-image-card">
                  <DiseasedLeafIllustration />
                  <div className="tts-image-caption">
                    <span className="tts-image-tag"><Icon name="camera" size={14} /> {t('imageTag')}</span>
                    <p>{t('sampleImageCaption')}</p>
                  </div>
                </div>
                <time>10:25 AM</time>
              </div>
            )}

            <div className="tts-message-composer">
              <input
                type="text"
                placeholder={t('typeMessage')}
                aria-label={t('typeMessage')}
                onClick={() => setStep(6)}
                onFocus={() => setStep(6)}
              />
              <button type="button" aria-label={t('sendMessage')} onClick={() => setStep(6)}>
                <Icon name="arrow" size={19} />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}