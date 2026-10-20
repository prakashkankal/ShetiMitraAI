import { useState } from 'react'
import { Icon } from '../components/Icons.jsx'

const copy = { mr: { title: 'AI शी बोला', sub: 'तुमच्या शेतीसंबंधी प्रश्न विचारा', button: 'बोलण्यासाठी स्पर्श करा', unavailable: 'या ब्राउझरमध्ये आवाज ओळख उपलब्ध नाही.' }, hi: { title: 'AI से बात करें', sub: 'खेती से जुड़े सवाल पूछें', button: 'बोलने के लिए स्पर्श करें', unavailable: 'इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है।' }, en: { title: 'Talk to AI', sub: 'Ask a question about your farm', button: 'Tap to speak', unavailable: 'Speech recognition is not available in this browser.' } }
export default function AssistantPage({ language }) {
  const [speech, setSpeech] = useState('')
  const [error, setError] = useState('')
  const c = copy[language] || copy.mr
  function listen() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setError(c.unavailable); return }
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.onresult = event => setSpeech(event.results[0][0].transcript)
    recognition.onerror = () => setError(c.unavailable)
    recognition.start()
  }
  return <section className="assistant-screen"><span className="assistant-orb"><Icon name="mic" size={42}/></span><h1>{c.title}</h1><p>{c.sub}</p><button className="listen-button" onClick={listen}><Icon name="mic" size={22}/>{c.button}</button>{speech && <p className="recognized-speech">“{speech}”</p>}{error && <p className="speech-error" role="status">{error}</p>}</section>
}
