import { useEffect, useRef, useState } from 'react'
import { checkHealth, sendChat, sendVoice } from './services/api.js'

const languages = [
  { code: 'mr', label: 'मराठी', short: 'MR' },
  { code: 'hi', label: 'हिन्दी', short: 'HI' },
  { code: 'en', label: 'English', short: 'EN' },
]

const copy = {
  mr: { title: 'तुमचा शेतीसहकारी', intro: 'पिकांच्या बाबतीत प्रश्न विचारा किंवा आवाजाने सल्ला मिळवा.', placeholder: 'तुमचा प्रश्न इथे लिहा...', send: 'पाठवा', record: 'बोलण्यासाठी टॅप करा', stop: 'रेकॉर्डिंग थांबवा' },
  hi: { title: 'आपका खेती साथी', intro: 'फसल से जुड़े सवाल पूछें या आवाज़ में सलाह लें।', placeholder: 'अपना सवाल यहाँ लिखें...', send: 'भेजें', record: 'बोलने के लिए टैप करें', stop: 'रिकॉर्डिंग रोकें' },
  en: { title: 'Your farming companion', intro: 'Ask crop questions or get spoken guidance from ShetiMitra AI.', placeholder: 'Type your crop question...', send: 'Send', record: 'Tap to speak', stop: 'Stop recording' },
}

function StatusPill({ health }) {
  const online = health?.status === 'ok'
  return <div className={`status-pill ${online ? 'online' : 'offline'}`}><span /> {online ? 'Backend connected' : 'Backend unavailable'}</div>
}

export default function App() {
  const [language, setLanguage] = useState('mr')
  const [mode, setMode] = useState('voice')
  const [health, setHealth] = useState(null)
  const [typedText, setTypedText] = useState('')
  const [textAnswer, setTextAnswer] = useState('')
  const [textBusy, setTextBusy] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [voiceStatus, setVoiceStatus] = useState('Ready')
  const [canRetryPlayback, setCanRetryPlayback] = useState(false)
  const [error, setError] = useState('')
  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const streamRef = useRef(null)
  const audioPlayer = useRef(null)
  const speechRecognition = useRef(null)

  const text = copy[language]
  const recording = voiceStatus === 'Listening'
  const modeLocked = recording || voiceStatus === 'Processing' || voiceStatus === 'Speaking' || textBusy

  useEffect(() => {
    checkHealth().then(setHealth).catch(() => setHealth(null))
  }, [])

  function reset() {
    setTypedText('')
    setTextAnswer('')
    setLiveTranscript('')
    setCanRetryPlayback(false)
    setError('')

    if (audioPlayer.current) {
      audioPlayer.current.pause()
      audioPlayer.current.currentTime = 0
      audioPlayer.current.removeAttribute('src')
      audioPlayer.current.load()
    }

    if (speechRecognition.current) {
      speechRecognition.current.stop()
      speechRecognition.current = null
    }

    if (voiceStatus === 'Speaking') {
      setVoiceStatus('Ready')
    }
  }

  async function handleChat(event) {
    event.preventDefault()
    if (!typedText.trim()) return

    setTextBusy(true)
    setTextAnswer('')
    setError('')

    try {
      const result = await sendChat(typedText, language)
      setTextAnswer(result.assistant_reply)
    } catch (err) {
      setError(err.message)
    } finally {
      setTextBusy(false)
    }
  }

  async function playVoiceResponse(result) {
    if (!result.audio_url || !audioPlayer.current) {
      throw new Error('The voice response did not include playable audio.')
    }

    const player = audioPlayer.current
    player.src = result.audio_url
    player.load()

    try {
      await player.play()
      setCanRetryPlayback(false)
      setVoiceStatus('Speaking')
      setError('')
    } catch {
      setVoiceStatus('Ready')
      setCanRetryPlayback(true)
      setError('Could not autoplay the response. Tap “Play response” to try again.')
    }
  }

  async function retryPlayback() {
    if (!audioPlayer.current) return

    try {
      audioPlayer.current.currentTime = 0
      await audioPlayer.current.play()
      setCanRetryPlayback(false)
      setVoiceStatus('Speaking')
      setError('')
    } catch {
      setVoiceStatus('Ready')
      setError('Could not play the response audio. Check your audio output and try again.')
    }
  }

  async function startRecording() {
    setError('')
    setCanRetryPlayback(false)
    setLiveTranscript('')

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Voice recording is not supported in this browser. Use Chrome or Edge on localhost/HTTPS.')
      return
    }

    const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4']
    const mimeType = preferred.find(type => (
      typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(type)
    ))

    if (!mimeType) {
      setError('This browser does not support a compatible audio recording format.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunks.current = []

      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (Recognition) {
        const recognition = new Recognition()
        const recognitionLanguages = { mr: 'mr-IN', hi: 'hi-IN', en: 'en-IN' }
        recognition.lang = recognitionLanguages[language]
        recognition.continuous = true
        recognition.interimResults = true
        recognition.onresult = event => {
          let transcript = ''
          for (let index = 0; index < event.results.length; index += 1) {
            transcript += event.results[index][0].transcript
          }
          setLiveTranscript(transcript.trim())
        }
        recognition.onerror = event => {
          if (event.error !== 'aborted' && event.error !== 'no-speech') {
            setError(`Live transcript: ${event.error}.`)
          }
        }
        speechRecognition.current = recognition
        recognition.start()
      }

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorder.current = recorder
      recorder.ondataavailable = event => {
        if (event.data.size) chunks.current.push(event.data)
      }

      recorder.onstop = async () => {
        if (speechRecognition.current) {
          speechRecognition.current.stop()
          speechRecognition.current = null
        }

        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null

        const blob = new Blob(chunks.current, { type: recorder.mimeType || mimeType })
        if (blob.size < 100) {
          setLiveTranscript('')
          setVoiceStatus('Ready')
          setError('The recording is empty. Please try speaking again.')
          return
        }

        setVoiceStatus('Processing')
        setLiveTranscript('')

        try {
          const result = await sendVoice(blob, language)
          await playVoiceResponse(result)
        } catch (err) {
          setVoiceStatus('Ready')
          setError(err.message)
        }
      }

      recorder.start()
      setVoiceStatus('Listening')
    } catch (err) {
      if (speechRecognition.current) {
        speechRecognition.current.stop()
        speechRecognition.current = null
      }
      streamRef.current?.getTracks().forEach(track => track.stop())
      streamRef.current = null

      const denied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
      setVoiceStatus('Ready')
      setError(denied ? 'Microphone permission was denied. Allow microphone access in browser settings and try again.' : `Could not start microphone: ${err.message}`)
    }
  }

  function stopRecording() {
    if (speechRecognition.current) {
      speechRecognition.current.stop()
      speechRecognition.current = null
    }

    setLiveTranscript('')

    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop()
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark">शेती</div><div><strong>ShetiMitra AI</strong><small>Voice advisory module</small></div></div>
        <div className="top-actions"><StatusPill health={health} /><button className="reset-button" onClick={reset} aria-label="Reset conversation">↻ Reset</button></div>
      </header>

      <main>
        <section className="hero">
          <div><p className="eyebrow">Sustainable farming companion</p><h1>{text.title}</h1><p>{text.intro}</p></div>
          <div className="language-card"><span>भाषा / Language</span><div className="language-options" role="radiogroup" aria-label="Assistant language">
            {languages.map(item => <button key={item.code} role="radio" aria-checked={language === item.code} className={language === item.code ? 'active' : ''} onClick={() => setLanguage(item.code)}><small>{item.short}</small>{item.label}</button>)}
          </div></div>
        </section>

        <div className="mode-options" role="tablist" aria-label="Assistant mode">
          <button type="button" role="tab" aria-selected={mode === 'voice'} className={mode === 'voice' ? 'active' : ''} disabled={modeLocked} onClick={() => { setMode('voice'); setTextAnswer(''); setError('') }}>Voice Assistant</button>
          <button type="button" role="tab" aria-selected={mode === 'text'} className={mode === 'text' ? 'active' : ''} disabled={modeLocked} onClick={() => { setMode('text'); setError('') }}>Text Assistant</button>
        </div>

        {error && <div className="alert" role="alert"><strong>! </strong>{error}</div>}

        {mode === 'voice' ? (
          <section className="card voice-card mode-card">
            <div className="card-heading"><div className="icon-box mic-icon">⌁</div><div><p>Voice assistant</p><h2>Ask with your voice</h2></div></div>
            <button className={`mic-button ${recording ? 'recording' : ''}`} onClick={recording ? stopRecording : startRecording} disabled={voiceStatus === 'Processing' || voiceStatus === 'Speaking'} aria-label={recording ? text.stop : text.record}>
              <span className="mic-symbol">◉</span><span>{recording ? text.stop : text.record}</span>
            </button>

            <div className="record-status" aria-live="polite"><i className={voiceStatus === 'Listening' ? 'live' : voiceStatus === 'Processing' || voiceStatus === 'Speaking' ? 'pulse' : ''} />{voiceStatus}</div>

            {liveTranscript && (
              <div className="live-transcript" aria-live="polite">
                <small>Live speech text</small>
                <p>{liveTranscript}</p>
              </div>
            )}

            {canRetryPlayback && <button className="secondary-button retry-audio" type="button" onClick={retryPlayback}>Play response</button>}
            <audio ref={audioPlayer} hidden onEnded={() => { setVoiceStatus('Ready'); setCanRetryPlayback(false) }} onError={() => { setVoiceStatus('Ready'); setCanRetryPlayback(false); setError('The response audio could not be loaded or played.') }} />
          </section>
        ) : (
          <section className="card chat-card mode-card">
            <div className="card-heading"><div className="icon-box chat-icon">Aa</div><div><p>Text assistant</p><h2>Type a question</h2></div></div>
            <form onSubmit={handleChat}>
              <textarea value={typedText} onChange={event => setTypedText(event.target.value)} placeholder={text.placeholder} rows="4" maxLength="3000" />
              <button className="primary-button" type="submit" disabled={!typedText.trim() || textBusy}>{textBusy ? 'Working…' : `➤ ${text.send}`}</button>
            </form>
            {textAnswer && <div className="assistant-answer text-answer"><small>Assistant reply</small><p>{textAnswer}</p></div>}
          </section>
        )}
      </main>
      <footer>ShetiMitra AI • Temporary frontend for backend testing</footer>
    </div>
  )
}
