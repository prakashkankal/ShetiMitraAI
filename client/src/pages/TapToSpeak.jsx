import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import './TapToSpeak.css'

const navigation = [
  { label: 'Home', to: '/', icon: 'home', end: true },
  { label: 'Voice Assistant', to: '/assistant', icon: 'mic' },
  { label: 'Image Detection', to: '/scan', icon: 'scan' },
  { label: 'Disease Advisory', to: '/guidance', icon: 'leaf' },
  { label: 'Weather & Risk', to: '/weather', icon: 'weather' },
  { label: 'History', to: '/history', icon: 'history' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
]

function Waveform({ className = '' }) {
  return (
    <span className={`tts-waveform ${className}`} aria-label="Audio waveform">
      {Array.from({ length: 11 }, (_, index) => <span key={index} style={{ '--bar': index }} />)}
    </span>
  )
}

function DiseasedLeafIllustration() {
  return (
    <svg
      className="tts-leaf-illustration"
      viewBox="0 0 420 230"
      role="img"
      aria-label="Illustration of rice leaves with blast disease spots"
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
  return (
    <>
      <div className="tts-audio-player">
        <button type="button" className="tts-play-button" aria-label="Play voice response">▶</button>
        <Waveform />
        <span className="tts-audio-time">0:45</span>
      </div>
      <p className="tts-advice-intro">तुमच्या तांदळाच्या पिकावरील पिवळ्या डागांसाठी:</p>
      <ol className="tts-advice-list">
        <li>पानांवरील डाग ब्लास्ट रोगाची सुरुवातीची लक्षणे असू शकतात.</li>
        <li>शेतात पाण्याचा निचरा ठेवा आणि पिकाची नियमित पाहणी करा.</li>
        <li>जवळच्या कृषी अधिकाऱ्यांचा सल्ला घेऊन योग्य उपाय करा.</li>
      </ol>
    </>
  )
}

export default function TapToSpeak() {
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
          <span><strong>ShetiMitra AI</strong><small>Smart AI for Healthy Crops</small></span>
        </Link>
        <nav className="tts-navigation" aria-label="Main navigation">
          {navigation.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `tts-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={icon} size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="tts-sidebar-note">Your farm, healthier every day.</div>
      </aside>

      <main className="tts-main">
        <header className="tts-page-header">
          <div>
            <span className="tts-overline">YOUR FARM COMPANION</span>
            <h1>Voice Assistant</h1>
          </div>
          <span className="tts-language-pill"><Icon name="globe" size={17} /> मराठी</span>
        </header>

        {step < 5 ? (
          <section className="tts-voice-card" aria-live="polite">
            {step === 2 && (
              <div className="tts-idle-content">
                <span className="tts-mic-halo">
                  <button type="button" className="tts-mic-button" onClick={startRecording} aria-label="Tap to speak">
                    <Icon name="mic" size={37} />
                  </button>
                </span>
                <h2>Tap to speak</h2>
                <p>Press the microphone button and speak your question.</p>
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
                <h2>{step === 3 ? 'Recording started... Speak now' : 'Recording complete'}</h2>
                <p className="tts-recording-timer">00:{String(timer).padStart(2, '0')}</p>
                <div className="tts-recording-actions">
                  {step === 4 && <button type="button" className="tts-send-button" onClick={sendRecording}>Send</button>}
                  <button type="button" className="tts-cancel-button" onClick={cancelRecording}>Cancel</button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="tts-chat" aria-label="Voice assistant conversation">
            <div className="tts-chat-date">TODAY</div>
            <div className="tts-chat-user">
              <p>माझ्या तांदळाच्या पिकावर पिवळे डाग दिसत आहेत, काय करावे?</p>
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
                    <span className="tts-image-tag"><Icon name="camera" size={14} /> Image</span>
                    <p>तांदळाच्या पिकातील ब्लास्ट रोगाचे लक्षण</p>
                  </div>
                </div>
                <time>10:25 AM</time>
              </div>
            )}

            <div className="tts-message-composer">
              <input
                type="text"
                placeholder="Type a message..."
                aria-label="Type a message"
                onClick={() => setStep(6)}
                onFocus={() => setStep(6)}
              />
              <button type="button" aria-label="Send message" onClick={() => setStep(6)}>
                <Icon name="arrow" size={19} />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}